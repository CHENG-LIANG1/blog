const PASSWORD = "liuwanzhu"
const STORAGE_KEY = "blog-unlocked"

// Check if already unlocked
const isUnlocked = localStorage.getItem(STORAGE_KEY) === "true"

// Apply unlocked state
const applyUnlockState = () => {
  document.body?.classList.add("life-unlocked")
  const lockIcon = document.querySelector(".lock-icon")
  if (lockIcon) {
    // Change to unlocked icon (open lock)
    lockIcon.innerHTML = `
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
    `
  }
}

// Apply locked state
const applyLockState = () => {
  document.body?.classList.remove("life-unlocked")
  const lockIcon = document.querySelector(".lock-icon")
  if (lockIcon) {
    // Change to locked icon
    lockIcon.innerHTML = `
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    `
  }
}

// Initialize on load
if (isUnlocked) {
  applyUnlockState()
} else {
  applyLockState()
}

// Setup event handlers
const setupLock = () => {
  const lockButton = document.querySelector(".lock-button")
  if (!lockButton) return

  const modal = document.querySelector(".lock-modal")
  const closeBtn = document.querySelector(".lock-close")
  const submitBtn = document.querySelector(".lock-submit")
  const input = document.querySelector(".lock-input") as HTMLInputElement | null
  const error = document.querySelector(".lock-error")

  // Open modal or toggle lock
  lockButton.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const currentlyUnlocked = localStorage.getItem(STORAGE_KEY) === "true"
    
    if (currentlyUnlocked) {
      // If unlocked, clicking will lock it again
      localStorage.removeItem(STORAGE_KEY)
      applyLockState()
      window.location.reload()
    } else {
      // If locked, show unlock modal
      modal?.classList.remove("hidden")
      input?.focus()
    }
  })

  // Close modal
  closeBtn?.addEventListener("click", () => {
    modal?.classList.add("hidden")
    error?.classList.add("hidden")
    if (input) input.value = ""
  })

  // Close on outside click
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden")
      error?.classList.add("hidden")
      if (input) input.value = ""
    }
  })

  // Submit
  const checkPassword = () => {
    if (!input) return
    const value = input.value.toLowerCase().trim()
    if (value === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "true")
      modal?.classList.add("hidden")
      applyUnlockState()
      window.location.reload()
    } else {
      error?.classList.remove("hidden")
      input.value = ""
      input.focus()
    }
  }

  submitBtn?.addEventListener("click", checkPassword)
  input?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkPassword()
  })
}

// Setup on initial load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupLock)
} else {
  setupLock()
}

// Setup on navigation (SPA)
document.addEventListener("nav", setupLock)
