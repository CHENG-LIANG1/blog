---
title: Roam Focus
description: 把专注时间变成地图上的真实旅程。
tags:
  - Projects
aliases:
  - RoamFocus
  - Tikkuu Focus
---

<style>
  body[data-slug="Projects/Roam-Focus"] .page {
    max-width: none;
  }

  body[data-slug="Projects/Roam-Focus"] .page > #quartz-body {
    display: block;
    padding: 0;
  }

  body[data-slug="Projects/Roam-Focus"] .left.sidebar,
  body[data-slug="Projects/Roam-Focus"] .right.sidebar,
  body[data-slug="Projects/Roam-Focus"] .page-header,
  body[data-slug="Projects/Roam-Focus"] .page-footer,
  body[data-slug="Projects/Roam-Focus"] .center > hr,
  body[data-slug="Projects/Roam-Focus"] footer {
    display: none;
  }

  body[data-slug="Projects/Roam-Focus"] .center,
  body[data-slug="Projects/Roam-Focus"] .center > article {
    max-width: none;
    min-width: 0;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  .roam-page {
    --bg: #080b12;
    --panel: #151a29;
    --panel-2: #1d2235;
    --panel-3: #242938;
    --text: #f7f8ff;
    --muted: #a2a7b8;
    --line: rgba(255, 255, 255, 0.1);
    --blue: #3385ff;
    --purple: #8167f2;
    --green: #53d477;
    --orange: #d0805e;
    --yellow: #ffc64d;
    --shadow: 0 28px 70px rgba(0, 0, 0, 0.34);
    color: var(--text);
    margin: 0;
    padding: 0 max(24px, calc((100vw - 1180px) / 2));
    background:
      radial-gradient(circle at 78% 8%, rgba(51, 133, 255, 0.24), transparent 34%),
      radial-gradient(circle at 18% 28%, rgba(129, 103, 242, 0.2), transparent 36%),
      linear-gradient(180deg, #080b12 0%, #0d111d 48%, #080b12 100%);
  }

  .roam-page * {
    box-sizing: border-box;
    letter-spacing: 0;
  }

  .roam-page a {
    color: inherit;
    text-decoration: none;
  }

  .roam-hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(290px, 430px);
    gap: clamp(28px, 6vw, 72px);
    align-items: center;
    min-height: min(860px, calc(100vh - 20px));
    padding: clamp(36px, 7vw, 88px) 0;
  }

  .roam-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin: 0 0 20px;
    color: #dce7ff;
    font-weight: 850;
  }

  .roam-eyebrow::before {
    content: "";
    width: 12px;
    height: 12px;
    border-radius: 999px;
    background: var(--green);
    box-shadow: 0 0 0 8px rgba(83, 212, 119, 0.14);
  }

  .roam-title {
    max-width: 780px;
    margin: 0;
    color: var(--text);
    font-size: clamp(3rem, 7vw, 6.4rem);
    line-height: 0.94;
    font-weight: 950;
  }

  .roam-lead {
    max-width: 720px;
    margin: 26px 0 0;
    color: var(--muted);
    font-size: clamp(1.08rem, 1.8vw, 1.32rem);
    line-height: 1.78;
  }

  .roam-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 32px;
  }

  .roam-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 52px;
    padding: 0 22px;
    border: 1px solid var(--line);
    border-radius: 12px;
    font-weight: 900;
  }

  .roam-button-primary {
    border-color: transparent;
    background: linear-gradient(135deg, #9fb8ff, #3182ff 58%, #7568ed);
    color: #fff;
    box-shadow: 0 18px 36px rgba(51, 133, 255, 0.26);
  }

  .roam-button-secondary {
    background: rgba(255, 255, 255, 0.06);
    color: var(--text);
  }

  .roam-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-top: 36px;
    max-width: 720px;
  }

  .roam-stat {
    min-height: 112px;
    padding: 18px;
    border: 1px solid var(--line);
    border-radius: 18px;
    background: rgba(21, 26, 41, 0.76);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  }

  .roam-stat strong {
    display: block;
    color: var(--text);
    font-size: clamp(1.55rem, 2.8vw, 2.2rem);
    line-height: 1;
  }

  .roam-stat span {
    display: block;
    margin-top: 10px;
    color: var(--muted);
    font-size: 0.94rem;
  }

  .roam-phone-stage {
    position: relative;
    display: grid;
    place-items: center;
    min-height: 680px;
  }

  .roam-phone-stage::before {
    content: "";
    position: absolute;
    inset: 9% -6% 4%;
    border-radius: 44px;
    background: linear-gradient(145deg, rgba(51, 133, 255, 0.3), rgba(129, 103, 242, 0.18));
    transform: rotate(-5deg);
  }

  .roam-phone {
    position: relative;
    width: min(390px, 86vw);
    border-radius: 36px;
    overflow: hidden;
    background: #070a10;
    box-shadow: var(--shadow);
  }

  .roam-phone img,
  .roam-shot img,
  .roam-wide-shot img {
    display: block;
    width: 100%;
    height: auto;
  }

  .roam-section {
    padding: clamp(48px, 8vw, 96px) 0;
    border-top: 1px solid var(--line);
  }

  .roam-section-head {
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: clamp(20px, 5vw, 56px);
    align-items: end;
    margin-bottom: clamp(24px, 5vw, 44px);
  }

  .roam-section h2 {
    margin: 0;
    color: var(--text);
    font-size: clamp(2rem, 4.6vw, 4rem);
    line-height: 1.04;
    font-weight: 940;
  }

  .roam-section p {
    margin: 0;
    color: var(--muted);
    line-height: 1.78;
  }

  .roam-feature-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  .roam-feature {
    min-height: 210px;
    padding: 24px;
    border: 1px solid var(--line);
    border-radius: 22px;
    background: rgba(21, 26, 41, 0.78);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  }

  .roam-icon {
    display: inline-grid;
    place-items: center;
    width: 44px;
    height: 44px;
    margin-bottom: 18px;
    border-radius: 14px;
    color: #fff;
    background: var(--blue);
    font-size: 1.3rem;
    font-weight: 900;
  }

  .roam-feature:nth-child(2) .roam-icon,
  .roam-feature:nth-child(5) .roam-icon {
    background: var(--purple);
  }

  .roam-feature:nth-child(3) .roam-icon,
  .roam-feature:nth-child(6) .roam-icon {
    background: var(--orange);
  }

  .roam-feature h3 {
    margin: 0 0 10px;
    color: var(--text);
    font-size: 1.22rem;
  }

  .roam-feature p {
    font-size: 0.98rem;
  }

  .roam-showcase {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(16px, 3vw, 28px);
    align-items: start;
  }

  .roam-shot {
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: 30px;
    background: var(--panel);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.24);
  }

  .roam-shot-caption {
    padding: 18px 20px 22px;
    background: rgba(10, 14, 24, 0.92);
  }

  .roam-shot-caption h3 {
    margin: 0 0 8px;
    color: var(--text);
    font-size: 1.08rem;
  }

  .roam-shot-caption p {
    font-size: 0.92rem;
    line-height: 1.65;
  }

  .roam-split {
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: clamp(24px, 5vw, 64px);
    align-items: center;
  }

  .roam-wide-shot {
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: 34px;
    background: var(--panel);
    box-shadow: var(--shadow);
  }

  .roam-list {
    display: grid;
    gap: 14px;
    margin: 28px 0 0;
    padding: 0;
    list-style: none;
  }

  .roam-list li {
    padding: 18px 20px;
    border: 1px solid var(--line);
    border-radius: 18px;
    background: rgba(21, 26, 41, 0.78);
    color: var(--muted);
    line-height: 1.65;
  }

  .roam-list strong {
    display: block;
    margin-bottom: 4px;
    color: var(--text);
  }

  .roam-flow {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    counter-reset: roam-step;
  }

  .roam-step {
    min-height: 174px;
    padding: 22px;
    border: 1px solid var(--line);
    border-radius: 20px;
    background: rgba(21, 26, 41, 0.78);
    counter-increment: roam-step;
  }

  .roam-step::before {
    content: counter(roam-step);
    display: inline-grid;
    place-items: center;
    width: 34px;
    height: 34px;
    margin-bottom: 18px;
    border-radius: 999px;
    background: var(--blue);
    color: #fff;
    font-weight: 900;
  }

  .roam-step h3 {
    margin: 0 0 8px;
    color: var(--text);
    font-size: 1.08rem;
  }

  .roam-step p {
    font-size: 0.94rem;
  }

  .roam-quote {
    margin: 0;
    padding: clamp(28px, 5vw, 54px);
    border: 1px solid var(--line);
    border-radius: 28px;
    background:
      linear-gradient(135deg, rgba(51, 133, 255, 0.18), rgba(129, 103, 242, 0.14)),
      rgba(21, 26, 41, 0.88);
    color: var(--text);
    font-size: clamp(1.35rem, 3vw, 2.4rem);
    line-height: 1.45;
    font-weight: 900;
  }

  .roam-bottom {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 20px;
    align-items: center;
    padding: clamp(28px, 5vw, 52px);
    border: 1px solid var(--line);
    border-radius: 28px;
    background:
      linear-gradient(135deg, rgba(51, 133, 255, 0.22), rgba(129, 103, 242, 0.18)),
      rgba(21, 26, 41, 0.88);
  }

  .roam-bottom h2 {
    margin: 0 0 10px;
  }

  @media (max-width: 980px) {
    .roam-hero,
    .roam-section-head,
    .roam-split,
    .roam-bottom {
      grid-template-columns: 1fr;
    }

    .roam-phone-stage {
      min-height: auto;
    }

    .roam-feature-grid,
    .roam-showcase,
    .roam-flow {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 640px) {
    .roam-page {
      padding: 0 18px;
    }

    .roam-stats,
    .roam-feature-grid,
    .roam-showcase,
    .roam-flow {
      grid-template-columns: 1fr;
    }

    .roam-actions {
      display: grid;
    }

    .roam-button {
      width: 100%;
    }

    .roam-phone {
      width: min(360px, 94vw);
    }
  }
</style>

<main class="roam-page">
  <section class="roam-hero">
    <div>
      <p class="roam-eyebrow">Roam Focus for iOS</p>
      <h1 class="roam-title">把一段专注时间，变成地图上的真实旅行。</h1>
      <p class="roam-lead">
        Roam Focus 是一款把番茄钟、地图路线、天气、地点探索和历史记录结合起来的专注 App。你选择出发地点、交通方式和时长，它会生成一段路线，让每一次专注都像一次从现实出发的漫游。
      </p>
      <div class="roam-actions">
        <a class="roam-button roam-button-primary" href="https://apps.apple.com/cn/app/roam-focus/id6759795571" target="_blank" rel="noopener">在 App Store 下载</a>
        <a class="roam-button roam-button-secondary" href="#screens">查看界面</a>
      </div>
      <div class="roam-stats" aria-label="Roam Focus 当前数据">
        <div class="roam-stat">
          <strong>1000+</strong>
          <span>活跃用户</span>
        </div>
        <div class="roam-stat">
          <strong>iOS</strong>
          <span>App Store 已上架</span>
        </div>
        <div class="roam-stat">
          <strong>持续</strong>
          <span>稳定维护与迭代</span>
        </div>
      </div>
    </div>
    <div class="roam-phone-stage">
      <div class="roam-phone">
        <img src="/Projects/roam-focus/home.jpg" alt="Roam Focus 主界面，包含天气、出发地点、交通方式和时长选择" loading="eager" />
      </div>
    </div>
  </section>

  <section class="roam-section">
    <div class="roam-section-head">
      <h2>不是只盯着数字变小。</h2>
      <p>
        大多数专注工具只给你一个倒计时。Roam Focus 让这段时间拥有起点、路线、速度、天气和结束后的记录。你不是被一个计时器催着坐住，而是在地图上慢慢走完一段路。
      </p>
    </div>
    <div class="roam-flow">
      <div class="roam-step">
        <h3>选择出发地点</h3>
        <p>用当前位置开始，也可以从东京、首尔、南京、纽约等预设地点出发。</p>
      </div>
      <div class="roam-step">
        <h3>选择交通方式</h3>
        <p>步行、骑行、驾驶、滑板，对应不同速度，也对应不同任务节奏。</p>
      </div>
      <div class="roam-step">
        <h3>设定专注时长</h3>
        <p>从常用时长快速开始，也可以按自己的状态调整这一轮旅程。</p>
      </div>
      <div class="roam-step">
        <h3>开始漫游</h3>
        <p>地图跟随路线推进，结束后留下时间、距离、天气和地点记录。</p>
      </div>
    </div>
  </section>

  <section id="screens" class="roam-section">
    <div class="roam-section-head">
      <h2>主要界面围绕一次专注旅程展开。</h2>
      <p>
        从开始前的设置，到漫游中的地图，再到结束后的总结，Roam Focus 的每个界面都尽量保留清晰的行动感：选好、开始、坚持、回看。
      </p>
    </div>
    <div class="roam-showcase">
      <article class="roam-shot">
        <img src="/Projects/roam-focus/location.jpg" alt="Roam Focus 选择出发地点界面" loading="lazy" />
        <div class="roam-shot-caption">
          <h3>选择出发地点</h3>
          <p>支持当前位置、地图选点和预设城市。专注可以从眼前开始，也可以从远方开始。</p>
        </div>
      </article>
      <article class="roam-shot">
        <img src="/Projects/roam-focus/weather.jpg" alt="Roam Focus 天气详情界面" loading="lazy" />
        <div class="roam-shot-caption">
          <h3>天气详情</h3>
          <p>温度、湿度、风速、能见度和逐小时预报，让这段虚拟旅程更有现场感。</p>
        </div>
      </article>
      <article class="roam-shot">
        <img src="/Projects/roam-focus/history.jpg" alt="Roam Focus 漫游历史界面" loading="lazy" />
        <div class="roam-shot-caption">
          <h3>漫游历史</h3>
          <p>总时长、距离、常去地点和交通方式会沉淀下来，更像旅行相册而不是成绩单。</p>
        </div>
      </article>
    </div>
  </section>

  <section class="roam-section">
    <div class="roam-split">
      <div>
        <h2>专注进行中，地图就是你的进度条。</h2>
        <p>
          开始漫游后，Roam Focus 会在真实地图上展示当前位置、路线、剩余时间、已行驶距离和当前速度。倒计时仍然存在，但它不再是唯一主角。
        </p>
        <ul class="roam-list">
          <li>
            <strong>路线推进</strong>
            虚拟头像沿着地图前进，让“我又坚持了几分钟”变成“我又走过了一段路”。
          </li>
          <li>
            <strong>低干扰反馈</strong>
            核心控制只有停止和暂停，信息集中在底部面板里，不把专注过程做成复杂仪表盘。
          </li>
          <li>
            <strong>地点发现</strong>
            地图上的景点和地点会成为旅程的一部分，让每一次专注都有一点探索感。
          </li>
        </ul>
      </div>
      <div class="roam-wide-shot">
        <img src="/Projects/roam-focus/session.jpg" alt="Roam Focus 漫游进行中地图界面" loading="lazy" />
      </div>
    </div>
  </section>

  <section class="roam-section">
    <div class="roam-split">
      <div class="roam-wide-shot">
        <img src="/Projects/roam-focus/summary.jpg" alt="Roam Focus 查看总结界面" loading="lazy" />
      </div>
      <div>
        <h2>结束以后，留下的是一段行程。</h2>
        <p>
          一次专注完成后，Roam Focus 会整理时间段、专注时长、天气、距离、交通方式、平均时速和地图位置。即使只有几分钟，也能被认真记录下来。
        </p>
        <ul class="roam-list">
          <li>
            <strong>不是二元成败</strong>
            中途停止并不代表这段时间没有意义，走过的路依然是走过的路。
          </li>
          <li>
            <strong>可保存与分享</strong>
            总结页适合保存成自己的专注记录，也可以分享给朋友。
          </li>
          <li>
            <strong>长期使用有回声</strong>
            历史、统计和奖杯系统会把一次次短专注连接成长期积累。
          </li>
        </ul>
      </div>
    </div>
  </section>

  <section class="roam-section">
    <div class="roam-section-head">
      <h2>功能为专注服务，而不是反过来占用你。</h2>
      <p>
        Roam Focus 保留番茄钟最直接的开始方式，同时加入地图、天气、历史和成就，让开始这件事更容易，也让完成以后更有记忆点。
      </p>
    </div>
    <div class="roam-feature-grid">
      <article class="roam-feature">
        <span class="roam-icon">路</span>
        <h3>真实地图路线</h3>
        <p>把一段抽象时间映射成地图上的距离，给专注一个可见的方向。</p>
      </article>
      <article class="roam-feature">
        <span class="roam-icon">速</span>
        <h3>多种交通方式</h3>
        <p>步行、骑行、驾驶、滑板带来不同节奏，适配不同任务状态。</p>
      </article>
      <article class="roam-feature">
        <span class="roam-icon">天</span>
        <h3>天气氛围</h3>
        <p>结合 Apple Weather 数据，让当前位置或预设城市拥有真实天气背景。</p>
      </article>
      <article class="roam-feature">
        <span class="roam-icon">点</span>
        <h3>地点探索</h3>
        <p>旅程会路过地标和兴趣点，给一轮专注留下一点发现感。</p>
      </article>
      <article class="roam-feature">
        <span class="roam-icon">史</span>
        <h3>历史统计</h3>
        <p>总时长、距离、常去地点和交通方式会持续沉淀，方便回看。</p>
      </article>
      <article class="roam-feature">
        <span class="roam-icon">奖</span>
        <h3>奖杯系统</h3>
        <p>里程、次数、地点、天气和连续天数等成就，给长期坚持一点反馈。</p>
      </article>
    </div>
  </section>

  <section class="roam-section">
    <blockquote class="roam-quote">
      专注不一定要很苦。它也可以像出门一样，有方向、有天气、有路过的地方，也有结束后的回忆。
    </blockquote>
  </section>

  <section class="roam-section">
    <div class="roam-split">
      <div>
        <h2>隐私和边界</h2>
        <p>
          Roam Focus 不需要账号。定位主要用于生成旅程起点、计算路线、展示天气和发现附近地点。它不是导航 App，路线服务的是专注体验，不替代现实出行指引。
        </p>
      </div>
      <ul class="roam-list">
        <li>
          <strong>无需账号即可使用</strong>
          专注本来已经很难，不需要再顺便经营一个社交身份。
        </li>
        <li>
          <strong>记录服务于回看</strong>
          历史数据用于统计、奖杯和总结，不把专注变成公开排名。
        </li>
        <li>
          <strong>路线不是导航建议</strong>
          地图是让时间变得有形，不用于现实中的路线指引。
        </li>
      </ul>
    </div>
  </section>

  <section class="roam-section">
    <div class="roam-bottom">
      <div>
        <h2>现在开始第一段专注旅程。</h2>
        <p>Roam Focus 已在 App Store 上架，Android 与 HarmonyOS 版本正在规划中。</p>
      </div>
      <a class="roam-button roam-button-primary" href="https://apps.apple.com/cn/app/roam-focus/id6759795571" target="_blank" rel="noopener">下载 Roam Focus</a>
    </div>
  </section>
</main>
