---
title: SciFlow：从基础向量检索演进到可评测的高级 RAG
created: 2026-08-03
description: SciFlow 如何从基础向量检索演进到可评测的高级 RAG，并进一步成为支持跨文档问答、本地部署与在线体验的科研工作台。
tags:
  - 技术
  - AI
  - RAG
---

[SciFlow](https://github.com/CHENG-LIANG1/SciFlow) 是一个本地优先的科研文档工作台。它用 React/Vite 提供研究界面，以 FastAPI、PostgreSQL/pgvector、PyMuPDF 和 Sentence Transformers 完成文档处理与检索，并支持 OpenAI-compatible 与 Anthropic 两类模型接口。

> [在线体验 SciFlow Demo →](https://sciflow-demo.vercel.app)
>
> 公共 Demo 使用内置的模拟论文、检索过程与回答，适合查看交互，不会上传文件，也不会执行真实 RAG。要处理自己的文档，需要运行本地版。

项目最初只有一条基础链路：上传 PDF、切片、生成向量、检索 Top-K，再让大模型回答。此后它逐步加入句子感知切片、Parent–Child Retrieval、多查询改写、RRF、LLM Reranker 和自动化评测；最新一轮则把这些能力接入正式 API，并封装为可一键启动的本地应用。

这条演进路线并不是预先设计好的。每一层都来自一个具体失败：

```text
关键句检索不到
→ 修改切片

具体事实仍被大块稀释
→ 引入 Parent–Child

中文问题找不到英文证据
→ Query Rewrite

多路结果难以合并
→ RRF

标题比答案排得高
→ Reranker

证据根本进不了候选池
→ 多样化候选池

答案正确但评测失败
→ Facts + Aliases
```

核心方法只有一句话：**先用评测定位失败层级，再对该层做最小改动。**

## 起点：能回答，但无法稳定复现

第一版是标准的向量检索：

```text
PDF
→ 每 1000 字符切一个 Chunk，重叠 200 字符
→ 生成 Embedding
→ pgvector 余弦距离 Top-K
→ 拼接上下文
→ LLM 生成答案
```

数据库保存四类数据：

```text
documents                 文档元数据
document_pages            PDF 逐页原文
document_chunks           Parent Chunk
document_chunk_children   Child Chunk
```

最开始只有前三层。系统可以回答部分问题，但同一篇论文中，有些答案能稳定命中，有些答案明明存在，却在 Top-30 中都找不到。

这说明“RAG 能跑”不是一个有效的验收标准。真正需要回答的是：原文有没有被正确解析、证据被切到了哪里、向量检索排第几，以及最后进入 Prompt 的究竟是什么。

## 第一次演进：从固定字符切片到句子感知切片

最先失败的是一个研究工程能力问题。论文原文明确列出了 agents 完成的工作，包括大规模文献综述、调试 GPU 环境、运行数百次实验与稳健性检查、获取外部评审，以及编译 camera-ready LaTeX 文档。

但这段证据没有进入 Top-30。进一步检查发现：

```text
目标句单独生成向量：相关性高
目标句放在完整大块中：相关性明显下降
```

固定字符切片会把段尾、核心结论、下一段开头、页眉页脚和 PDF 换行碎片混在一起。向量最终表达的是整块的平均语义，关键句反而被稀释。

SciFlow 因此先重写了进入 Embedding 之前的文本处理：

1. 统一换行符；
2. 修复 PDF 跨行连字符，例如 `inter-\nvention`；
3. 合并普通换行与多余空格；
4. 尽量按中英文句末标点切分；
5. Parent 最多 700 字符，保留约 120 字符的完整句子重叠；
6. 单句过长时，再使用字符滑窗兜底。

在这次代表性测试中，目标证据从 Top-30 未命中升到 Top-1。

第一条结论由此确定：**检索失败时，不要先换模型。文本清洗和切片通常更便宜，也更可能是根因。**

## 先建立评测，再继续优化

单个成功案例无法证明方案有效。切片调整后，SciFlow 开始建设固定评测集，把开发流程从“手工问几次”改成可重复回归：

```text
修改代码
→ 运行同一组用例
→ 检查失败问题
→ 判断是召回、排序、生成还是评测错误
→ 只修改对应环节
```

当前 `evals/rag_cases.json` 包含 9 个用例，覆盖：

- 中文问题检索英文论文；
- 英文提问、中文回答；
- 多事实列表；
- 数字、预算与计算资源；
- 原因解释；
- 论文展示和格式问题；
- 资料中不存在答案时的拒答。

检索侧使用两个指标：

- Hit@K：正确证据是否进入前 K；
- MRR：第一个正确结果出现得有多早。

两者对应不同问题：

```text
Hit@K 低
→ 证据没有进入候选集
→ 检查解析、切片、Embedding、查询表达和召回深度

Hit@K 高但 MRR 低
→ 证据已经找到，但排序靠后
→ 检查融合与重排序
```

这一步改变了后续优化方式。系统不再因为答案错误就直接改 Prompt，而是沿检索链路逐层检查。

## 第二次演进：Parent–Child Retrieval

句子感知 Parent 改善了整体效果，但一个资源问题仍然不稳定：

> 研究者为 AI agents 提供了哪些时间、资金和计算资源？

正确证据包含六天、3000 美元 API 额度、GPU 额度、虚拟机和开放网络。测试中，完整 Parent 的余弦距离约为 `0.4124`，目标句单独计算约为 `0.3250`。距离越小越相关，说明 Parent 对具体事实来说仍然太大。

继续缩小所有 Chunk 会带来另一个问题：检索更准了，但交给大模型的上下文不完整。SciFlow 因此把“用于检索的粒度”和“用于回答的粒度”拆开：

```text
Parent Chunk：保留完整上下文
Child Chunk：只保留精确语义单元

问题 → 检索 Child → 找到 parent_chunk_id → 回溯 Parent → 生成答案
```

Child 默认最多 350 字符；超长句按 60 字符重叠切分。Parent 和 Child 都使用 `paraphrase-multilingual-MiniLM-L12-v2` 生成归一化的 384 维向量，并存入 pgvector。

在该论文的实验数据中，275 个 Parent 被拆成 674 个 Child。资源问题的目标句在英文查询下直接升到 Child Rank 1。

Parent–Child 的价值不是简单增加一种 Chunk，而是解除一个结构性矛盾：

> **用小块找准，用大块回答。**

## 第三次演进：用 Query Rewrite 跨越语言和措辞差异

Child 检索解决了粒度问题，但中文问题与英文论文之间仍有表达差异。

例如，用户问“为什么任务没有受到训练数据污染”，论文可能写的是 `unpublished submissions`、`memorize correct answers from training data` 和 `find them on the web`。多语言 Embedding 可以跨语言匹配，但无法保证不同表达都进入有限的 Top-K。

SciFlow 加入 Query Rewrite，为每个问题生成三条作用不同的英文查询，并保留原问题：

```text
0. 原始问题
1. 忠实英文翻译
2. 学术术语查询
3. 证据导向查询
```

证据导向查询不只翻译内容，还根据答案形态调整表达：

- 列表问题强调 `complete list`、`enumerate`、`recurring patterns`；
- 数字问题强调具体预算、时长和资源名称；
- 原因问题强调 `evidence`、`reason`、`because`。

它的目标不是让 LLM 提前回答，而是生成更接近论文原文的检索入口。Prompt 也明确禁止引入原问题中不存在的数字、结论和专有名词。

## 第四次演进：用 RRF 融合多路召回

四条查询会产生四个独立排名。不同查询的余弦距离不一定适合直接比较，因此 SciFlow 使用 RRF（Reciprocal Rank Fusion）按名次融合：

```text
score = Σ 1 / (60 + rank)
```

同一个 Child 被多条查询命中时，RRF 分数会累加。这样既能扩大召回面，也能降低单次向量距离波动的影响。

但 RRF 很快暴露出新问题。资源问题中，论文标题 `Can AI agents conduct open-ended AI research?` 被多条查询共同命中。它与问题主题高度相关，因此 RRF 排名很高，却不包含任何时间、预算或计算资源。

真正的证据已经进入候选集，但只排在第 6。

这说明 RRF 判断的是“多路检索是否形成共识”，不是“文本能否回答问题”。多个查询也可能共同偏向一个宽泛主题。

## 第五次演进：用 LLM Reranker 判断回答价值

为了解决主题相关但无法回答的问题，SciFlow 增加了 Listwise Reranker。

它一次接收原问题和一组 Child 候选，根据以下标准重新排序：

- 是否直接包含答案证据；
- 是否包含具体事实、数字、条件和资源名称；
- 是否只是讨论相同主题；
- 是否因为标题含有相似关键词而虚高。

模型只返回候选编号，例如：

```json
[6, 7, 2, 3, 1]
```

程序解析编号、去除无效项和重复项，并把模型遗漏的候选按原顺序补到末尾，保证排序结果完整且可预测。

资源问题的目标证据由 RRF 第 6 升到 Reranker 第 1。至此各层职责变得清晰：

```text
Retriever：找到可能相关的证据
RRF：融合多条查询的排名
Reranker：判断谁真正能回答问题
LLM：根据最终 Parent 上下文组织答案
```

## 第六次演进：Reranker 前也需要多样化候选池

随后，一个“五种失败模式”的中文问题始终无法完整回答。最初看起来像 Reranker 排错，但逐层检查后发现：完整证据从未进入它看到的候选池。

两个目标 Child 在四条查询中的原始排名分别是：

```text
中文原问题：Rank 210
忠实英文翻译：Rank 97
学术术语查询：Rank 208
证据导向查询：Rank 20
```

Query Rewrite 已经把证据从 200 名左右提高到第 20，但 RRF 会优先奖励被多条查询共同命中的内容。这份完整列表只被证据查询强命中，因此仍被全局 RRF Top-N 淘汰。

SciFlow 随后把候选池拆成两部分：

```text
RRF 全局 Top-10
+ 证据导向查询 Top-20
→ 按 Child 文本去重
→ 按 Parent 去重
→ 最多 30 个候选交给 Reranker
```

这样既保留多查询共同认可的结果，也为单条专业查询保留“少数派席位”。目标证据先进入候选池第 16，再被 Reranker 提升到最终 Top-5。

这里得到一条比“加 Reranker”更重要的经验：

> **Reranker 只能重新排列已有候选，不能找回在上游被截断的证据。**

## 第七次演进：修正会误导优化方向的评测

检索链路稳定后，新的问题出现在评测本身：答案语义正确，却因为字符串不同被判失败。

常见误判包括：

```text
未发表      ↔ 尚未公开
3000        ↔ 3,000
开放网络    ↔ 开放互联网
不到一半    ↔ 不足一半
```

SciFlow 对评测做了两层修正。

第一层是文本归一化：统一全半角和大小写，删除 Markdown、标点与空白，并消除数字千分位。

第二层是把关键词升级为 Expected Facts：

```json
{
  "id": "less_than_half_budget",
  "description": "API 预算使用不到一半",
  "aliases": ["不到一半", "不足一半", "不到 50%", "less than half"]
}
```

同一事实的 `aliases` 按 OR 匹配，不同事实再由 `fact_match_mode` 决定全部命中还是任意命中。评测同时检查拒答、回答语言和页码引用。

不过当前实现还没有完全解决证据评测。`rag_cases.json` 已保存 `expected_evidence_snippets`，但 `evaluate_retrieval()` 仍按 `expected_source_pages` 计算 Hit@K 和 MRR。同一页的无关 Chunk 也可能被判为正确召回。

因此，下一步不应继续增加别名，而应把评测拆成三层：

```text
Retrieval Evaluation
→ 是否召回包含目标原文的 Chunk

Answer Evaluation
→ 是否覆盖预期事实

Grounding Evaluation
→ 引用证据是否真的支持答案
```

## 最终形成的高级链路

经过这些迭代，advanced pipeline 的实际流程是：

```text
PDF
→ PyMuPDF 逐页解析
→ 文本清洗
→ Parent Chunk（700 / overlap 120）
→ Child Chunk（350 / long sentence overlap 60）
→ 384 维多语言 Embedding
→ PostgreSQL + pgvector

用户问题
→ 原问题 + 3 条英文改写
→ 每条查询召回 Child Top-30
→ RRF 融合
→ RRF Top-10 + Evidence Query Top-20
→ Child 文本去重 + Parent 去重
→ LLM Listwise Reranker
→ 最终 Top-5 Parent
→ 带页码的 RAG Context
→ 所选模型生成答案
→ Facts + Aliases 自动评测
```

对应的主要模块是：

| 模块                         | 职责                         |
| ---------------------------- | ---------------------------- |
| `pdf_parser.py`              | 提取全文和逐页文本           |
| `text_chunker.py`            | 清洗文本并生成 Parent        |
| `child_chunk_service.py`     | 将 Parent 拆为 Child         |
| `embedding_service.py`       | 生成 384 维多语言向量        |
| `query_rewrite_service.py`   | 生成三类英文检索查询         |
| `child_retrieval_service.py` | Child 检索、RRF 和候选池构建 |
| `reranker_service.py`        | LLM Listwise 重排序          |
| `rag_pipeline.py`            | 编排基础与高级流水线         |
| `run_rag_eval.py`            | 执行回归评测并保存报告       |

## 第八次演进：从高级管线到本地科研工作台

前七次演进解决的是“检索能否稳定找到证据”。最新一轮开始解决另一个问题：研究者能否直接使用这条链路，而不需要手动调用 API 和维护索引。

首先，上传流程被改成后台处理。接口接收文件后返回 `202`，随后完成格式标准化、逐页解析、Parent 切片、Embedding、Child 索引、摘要与首页预览。Child 索引不再依赖单独的重建命令；前端可以持续显示处理进度和失败状态。

其次，高级检索正式进入问答接口。单文档问答直接调用 advanced pipeline；多文档模式最多选择 10 篇文档，对每个查询执行 Child 召回、RRF 和 Rerank，再用文档标题、页码和 Parent 原文组成统一上下文。流式接口返回的是检索、重排、生成等阶段进度，不只是最终答案。

在这条管线外，项目增加了完整的研究界面：

- 管理和预览 PDF、图片、文本、Markdown、CSV 与 JSON 文档；
- 保存会话、答案、引用和收藏，并按文档范围继续提问；
- 使用深度阅读、证据审计、主张—证据映射、引文整理、研究空白等研究技能；
- 切换严谨研究者、文献综述者、方法论审阅者等 Persona；
- 通过 Crossref 检索论文元数据，并在关系视图中生成 Mermaid 图；
- 在浏览器中配置模型服务、语言和主题。

部署方式也发生了变化。React 前端会在 Docker 构建阶段编译，并由 FastAPI 同源提供，因此本地只暴露 `127.0.0.1:8000` 一个入口。PostgreSQL 数据、上传文件和 Embedding 模型缓存分别保存在 Docker Volume 中；项目没有账户系统，会话、收藏、界面设置和 API Key 则保存在浏览器本地。

## 运行项目

如果只是查看交互，可以直接打开[在线 Demo](https://sciflow-demo.vercel.app)。它使用模拟数据，不代表真实检索结果。

本地版只要求安装并启动 Docker Desktop。克隆仓库后，可以双击对应系统的启动脚本：

- macOS：`start-local-zh.command`；
- Windows：`start-local-zh.bat`；
- Linux：`start-local-zh.sh`。

也可以直接执行：

```bash
git clone https://github.com/CHENG-LIANG1/SciFlow.git
cd SciFlow
docker compose up -d --build --wait
```

启动后访问 `http://127.0.0.1:8000`，在设置中填写模型服务地址、模型名和 API Key。上传文件默认上限为 100 MB；首次执行真实检索时需要下载 Embedding 模型，因此会比后续运行慢。

如果使用云端模型，问题和召回片段会发送给相应服务商；要让推理也留在本机，可以配置兼容 OpenAI API 的本地模型服务。

开发者仍然可以运行高级评测：

```bash
python evals/run_rag_eval.py \
  --document-id "$DOCUMENT_ID" \
  --pipeline advanced \
  --limit 5
```

报告会写入 `evals/reports/`；存在失败用例时进程返回非零退出码，便于后续接入 CI。

## 当前边界与下一步演进

SciFlow 已经从检索实验进入可用的本地应用，但边界仍然清晰：

- 公共 Demo 是静态模拟，不上传文档，也不调用真实检索与生成服务；
- 文档处理由 FastAPI 进程内的后台任务执行，服务重启会把未完成任务标记为失败，还没有持久化队列、自动重试和断点恢复；
- 会话、收藏、模型配置和 API Key 保存在浏览器 `localStorage`，没有账户、云同步或多端迁移；
- Crossref 搜索只返回论文元数据，不会自动获取全文并加入本地文档库；
- Hit@K 和 MRR 仍以页码为相关性标准，而不是目标证据片段；
- 评测依赖规则和别名匹配，不能完整判断语义正确性与引用忠实度。

因此，下一阶段的重点不应是继续叠加检索算法，而是提高工程可靠性和评测精度：

```text
持久化文档任务，并支持重试与恢复
→ 记录检索、Rerank、生成阶段的耗时、Token 与错误
→ 用目标证据片段计算 Hit@K / MRR
→ 增加 Answer 与 Grounding 评测
→ 在版权与访问许可允许时打通论文发现与全文导入
→ 将固定回归集接入 CI
```

只有同时看质量、任务可靠性、延迟和成本，这套科研工作台才能从“本地可用”继续走向长期稳定。

## 总结

SciFlow 的演进过程说明，RAG 优化不是一次更换模型，而是一条可以逐层诊断的链路：

```text
解析是否完整
→ 切片是否保留语义
→ 查询是否接近原文表达
→ 正确证据是否进入候选池
→ 融合是否压制少数派证据
→ Reranker 是否把答案排到前面
→ Parent 是否进入最终 Prompt
→ 回答是否被证据支持
→ 评测是否测到了正确的东西
```

切片决定证据能否被表示，召回决定 Reranker 有没有机会，排序决定有限上下文里放什么，评测则决定下一次优化会不会走错方向。

最终得到的不再只是一套高级 RAG 工程骨架，而是一个可直接运行的本地科研工作台：**前端可用、后端真实执行、检索可以回归评测，下一步演进也有明确边界。**
