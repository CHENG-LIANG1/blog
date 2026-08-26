import { QuartzComponent, QuartzComponentConstructor } from "./types"

// 首页“找到我”区块：放在 afterBody，使其排在最近文章之后；按 data-language 切换中英
const HomeContact: QuartzComponent = () => (
  <div class="home-contact">
    <div class="home-separator" aria-hidden="true"></div>

    <div class="home-find" lang="en">
      <p class="home-find-label">Find me</p>
      <div class="home-social-links">
        <a href="https://github.com/CHENG-LIANG1" target="_blank" rel="noopener">
          GitHub
        </a>
      </div>
      <p class="home-email-line">
        Or email me at <a href="mailto:liangcheng2456@gmail.com">liangcheng2456@gmail.com</a>.
      </p>
    </div>

    <div class="home-find" lang="zh">
      <p class="home-find-label">找到我</p>
      <div class="home-social-links">
        <a href="https://github.com/CHENG-LIANG1" target="_blank" rel="noopener">
          GitHub
        </a>
      </div>
      <p class="home-email-line">
        也可以发邮件到 <a href="mailto:liangcheng2456@gmail.com">liangcheng2456@gmail.com</a>。
      </p>
    </div>
  </div>
)

export default (() => HomeContact) satisfies QuartzComponentConstructor
