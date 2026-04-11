// @ts-ignore
import lockScript from "./scripts/lock.inline"
import styles from "./styles/lock.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const Lock: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "lock-container")}>
      <button class="lock-button" aria-label="解锁生活板块">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lock-icon"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </button>
      
      <div class="lock-modal hidden">
        <div class="lock-modal-content">
          <button class="lock-close">×</button>
          <h3>🔒 输入暗号解锁</h3>
          <input 
            type="password" 
            class="lock-input" 
            placeholder="请输入暗号..."
          />
          <button class="lock-submit">解锁</button>
          <p class="lock-hint">提示：她的名字</p>
          <p class="lock-error hidden">暗号错误，请重试</p>
        </div>
      </div>
    </div>
  )
}

Lock.beforeDOMLoaded = lockScript
Lock.css = styles

export default (() => Lock) satisfies QuartzComponentConstructor
