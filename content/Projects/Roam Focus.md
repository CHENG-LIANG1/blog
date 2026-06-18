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
  html:has(body[data-slug="Projects/Roam-Focus"]),
  body[data-slug="Projects/Roam-Focus"] {
    background: #070913 !important;
  }
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
  .rf-shell {
    --page-gutter: clamp(18px, 4vw, 32px);
    --section-gap: clamp(48px, 8vw, 96px);
    --bg: #070913;
    --panel: rgba(18, 22, 37, 0.82);
    --panel-strong: rgba(24, 29, 48, 0.92);
    --text: rgba(248, 250, 255, 0.96);
    --muted: rgba(192, 199, 221, 0.72);
    --line: rgba(255, 255, 255, 0.12);
    --blue: #3385ff;
    --purple: #8167f2;
    --green: #53d477;
    --orange: #d0805e;
    --shadow: 0 28px 70px rgba(0, 0, 0, 0.38);
    position: relative;
    isolation: isolate;
    min-height: 100vh;
    color: var(--text);
    padding: 0 max(var(--page-gutter), calc((100vw - 1180px) / 2));
    background:
      radial-gradient(1000px 520px at 74% 14%, rgba(51, 133, 255, 0.24), transparent 55%),
      radial-gradient(980px 520px at 18% 26%, rgba(129, 103, 242, 0.22), transparent 52%),
      radial-gradient(760px 440px at 28% 84%, rgba(83, 212, 119, 0.14), transparent 60%),
      linear-gradient(180deg, #070913 0%, #0b0f1e 50%, #070913 100%);
  }
  .rf-shell::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background:
      radial-gradient(1000px 520px at 74% 14%, rgba(51, 133, 255, 0.24), transparent 55%),
      radial-gradient(980px 520px at 18% 26%, rgba(129, 103, 242, 0.22), transparent 52%),
      radial-gradient(760px 440px at 28% 84%, rgba(83, 212, 119, 0.14), transparent 60%),
      linear-gradient(180deg, #070913 0%, #0b0f1e 50%, #070913 100%);
  }
  .rf-shell * {
    box-sizing: border-box;
    letter-spacing: 0;
  }
  .rf-shell a {
    color: inherit;
    text-decoration: none;
  }
  .rf-shell :focus-visible {
    outline: 2px solid rgba(51, 133, 255, 0.8);
    outline-offset: 3px;
    border-radius: 10px;
  }
  .rf-input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
  .rf-top {
    position: sticky;
    top: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    width: 100%;
    margin: 0 auto;
    padding: 16px 0;
    background: linear-gradient(180deg, rgba(7, 9, 19, 0.88) 0%, rgba(7, 9, 19, 0.28) 100%);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  .rf-brand {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    min-height: 44px;
    font-weight: 950;
    letter-spacing: -0.02em;
  }
  .rf-mark {
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    flex: 0 0 auto;
    margin-top: 0;
  }
  .rf-mark-img {
    width: 100%;
    height: 100%;
    display: block;
    margin: 0 !important;
    object-fit: contain;
    border-radius: 0 !important;
    box-shadow: none !important;
    transform: none !important;
    transition: none !important;
    filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.38));
  }
  .rf-brand-meta {
    display: grid;
    gap: 1px;
  }
  .rf-brand-meta strong {
    display: block;
    font-size: 0.98rem;
    line-height: 1.05;
  }
  .rf-brand-meta span {
    display: block;
    font-size: 0.82rem;
    color: var(--muted);
    line-height: 1.05;
  }
  .rf-switch {
    display: inline-flex;
    padding: 4px;
    border-radius: 999px;
    border: 1px solid var(--line);
    background: rgba(255, 255, 255, 0.06);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
  .rf-switch label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    border-radius: 999px;
    font-weight: 900;
    font-size: 0.92rem;
    color: rgba(192, 199, 221, 0.78);
    cursor: pointer;
    user-select: none;
    transition: background 160ms ease, color 160ms ease, transform 160ms ease;
  }
  .rf-switch label:hover {
    color: rgba(248, 250, 255, 0.92);
  }
  .rf-view-zh {
    display: block;
  }
  .rf-view-en {
    display: none;
  }
  #rf-lang-en:checked ~ .rf-view-zh {
    display: none;
  }
  #rf-lang-en:checked ~ .rf-view-en {
    display: block;
  }
  #rf-lang-zh:checked ~ .rf-top .rf-switch label[for="rf-lang-zh"],
  #rf-lang-en:checked ~ .rf-top .rf-switch label[for="rf-lang-en"] {
    background: rgba(255, 255, 255, 0.14);
    color: rgba(248, 250, 255, 0.98);
    transform: translateY(-1px);
  }
  .roam-page {
    margin: 0;
    padding: 0;
  }
  .roam-hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(290px, 430px);
    gap: clamp(28px, 6vw, 72px);
    align-items: center;
    min-height: min(860px, calc(100vh - 20px));
    padding: clamp(32px, 7vw, 88px) 0 var(--section-gap);
  }
  .roam-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin: 0 0 20px;
    color: rgba(220, 231, 255, 0.92);
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
    font-size: clamp(2.6rem, 6.4vw, 5.8rem);
    line-height: 1.04;
    font-weight: 950;
    letter-spacing: -0.02em;
  }
  .roam-lead {
    max-width: 720px;
    margin: 26px 0 0;
    color: var(--muted);
    font-size: clamp(1.08rem, 1.8vw, 1.32rem);
    line-height: 1.85;
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
    transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease, border-color 160ms ease;
  }
  .roam-button-primary {
    border: none;
    background: linear-gradient(135deg, #9fb8ff, #3182ff 58%, #7568ed);
    color: #fff;
    box-shadow: 0 18px 36px rgba(51, 133, 255, 0.26);
  }
  .roam-button-secondary {
    background: rgba(255, 255, 255, 0.06);
    color: var(--text);
  }
  .roam-button:hover {
    transform: translateY(-1px);
  }
  .roam-button-primary:hover {
    box-shadow: 0 22px 46px rgba(51, 133, 255, 0.34);
  }
  .roam-button-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.18);
  }
  .roam-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-top: 36px;
    width: min(100%, 720px);
  }
  .roam-stat {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 112px;
    padding: 18px;
    border: 1px solid var(--line);
    border-radius: 18px;
    background: var(--panel);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
    transition: transform 180ms ease, background 180ms ease;
  }
  .roam-stat:hover {
    transform: translateY(-1px);
    background: rgba(24, 29, 48, 0.88);
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
    padding: var(--section-gap) 0;
    border-top: 1px solid var(--line);
    scroll-margin-top: 92px;
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
    line-height: 1.85;
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
    background: var(--panel);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
    transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
  }
  .roam-feature:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.18);
    background: rgba(24, 29, 48, 0.9);
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
    background: var(--panel-strong);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.24);
    transition: transform 180ms ease, border-color 180ms ease;
  }
  .roam-shot:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.18);
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
    background: var(--panel-strong);
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
    background: var(--panel);
    color: var(--muted);
    line-height: 1.65;
    transition: border-color 180ms ease, background 180ms ease;
  }
  .roam-list li:hover {
    border-color: rgba(255, 255, 255, 0.18);
    background: rgba(24, 29, 48, 0.9);
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
    background: var(--panel);
    counter-increment: roam-step;
    transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
  }
  .roam-step:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.18);
    background: rgba(24, 29, 48, 0.9);
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
      rgba(18, 22, 37, 0.88);
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
      rgba(18, 22, 37, 0.88);
  }
  .roam-bottom h2 {
    margin: 0 0 10px;
  }
  @media (max-width: 980px) {
    .rf-top {
      flex-wrap: wrap;
      align-items: flex-start;
    }
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
    .rf-shell {
      --page-gutter: 18px;
      --section-gap: 40px;
      padding: 0 var(--page-gutter);
    }
    .rf-top {
      gap: 14px;
      padding: 14px 0;
      backdrop-filter: blur(16px);
    }
    .rf-brand {
      min-height: 40px;
      gap: 10px;
    }
    .rf-brand-meta strong {
      font-size: 0.96rem;
    }
    .rf-brand-meta span {
      font-size: 0.8rem;
    }
    .rf-switch {
      margin-left: auto;
    }
    .roam-hero {
      min-height: auto;
      padding-top: 28px;
    }
    .roam-title {
      font-size: clamp(2.3rem, 13vw, 3.7rem);
      line-height: 1.02;
    }
    .roam-lead {
      margin-top: 22px;
      font-size: 1.02rem;
      line-height: 1.78;
    }
    .roam-stats,
    .roam-feature-grid,
    .roam-showcase,
    .roam-flow {
      grid-template-columns: 1fr;
      width: 100%;
    }
    .roam-actions {
      display: grid;
      width: 100%;
    }
    .roam-button {
      width: 100%;
    }
    .roam-stat,
    .roam-feature,
    .roam-step,
    .roam-list li,
    .roam-shot-caption {
      padding-inline: 20px;
    }
    .roam-quote,
    .roam-bottom {
      border-radius: 24px;
    }
    .roam-phone {
      width: min(100%, 360px);
      margin-inline: auto;
    }
  }
  @media (prefers-reduced-motion: no-preference) {
    .roam-hero > * {
      animation: rf-rise 620ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
    }
    .roam-hero > :nth-child(2) {
      animation-delay: 80ms;
    }
    @keyframes rf-rise {
      from {
        opacity: 0;
        transform: translateY(14px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
</style>
<div class="rf-shell">
  <input class="rf-input" type="radio" name="rf-lang" id="rf-lang-zh" checked />
  <input class="rf-input" type="radio" name="rf-lang" id="rf-lang-en" />
  <script src="/Projects/roam-focus/lang.js" defer></script>
  <header class="rf-top" aria-label="Roam Focus 页面导航">
    <a class="rf-brand" href="/" data-router-ignore>
      <span class="rf-mark" aria-hidden="true"><img class="rf-mark-img" src="/Projects/roam-focus/icon.webp" alt="" loading="eager" decoding="async" /></span>
      <span class="rf-brand-meta">
        <strong>Roam Focus</strong>
        <span>Focus as a journey</span>
      </span>
    </a>
    <div class="rf-switch" role="tablist" aria-label="语言切换">
      <label for="rf-lang-zh" role="tab" aria-controls="rf-view-zh" tabindex="0">中文</label>
      <label for="rf-lang-en" role="tab" aria-controls="rf-view-en" tabindex="0">EN</label>
    </div>
  </header>
  <div class="rf-view rf-view-zh" id="rf-view-zh">
    <main class="roam-page">
      <section class="roam-hero">
        <div>
          <p class="roam-eyebrow">Roam Focus for iOS</p>
          <h1 class="roam-title">把一段专注时间，变成地图上的真实旅行。</h1>
          <p class="roam-lead">
            Roam Focus 是一款把番茄钟、地图路线、天气、地点探索和历史记录结合起来的专注 App。你选择出发地点、交通方式和时长，它会生成一段路线，让每一次专注都像一次从现实出发的漫游。
          </p>
          <div class="roam-actions">
            <a class="roam-button roam-button-primary" href="https://apps.apple.com/us/app/roam-focus/id6759795571" target="_blank" rel="noopener noreferrer" data-router-ignore>在 App Store 下载</a>
            <a class="roam-button roam-button-secondary" href="#screens-zh">查看界面</a>
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
      <section id="screens-zh" class="roam-section">
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
          <a class="roam-button roam-button-primary" href="https://apps.apple.com/us/app/roam-focus/id6759795571" target="_blank" rel="noopener noreferrer" data-router-ignore>下载 Roam Focus</a>
        </div>
      </section>
    </main>
  </div>
  <div class="rf-view rf-view-en" id="rf-view-en" lang="en">
    <main class="roam-page">
      <section class="roam-hero">
        <div>
          <p class="roam-eyebrow">Roam Focus for iOS</p>
          <h1 class="roam-title">Turn focus time into a real journey on the map.</h1>
          <p class="roam-lead">
            Roam Focus blends a Pomodoro timer with routes, weather, place discovery, and a history log. Pick a starting point, a travel mode, and a duration—it generates a route so every session feels like a walk that begins in the real world.
          </p>
          <div class="roam-actions">
            <a class="roam-button roam-button-primary" href="https://apps.apple.com/us/app/roam-focus/id6759795571" target="_blank" rel="noopener noreferrer" data-router-ignore>Download on the App Store</a>
            <a class="roam-button roam-button-secondary" href="#screens-en">See screens</a>
          </div>
          <div class="roam-stats" aria-label="Roam Focus key stats">
            <div class="roam-stat">
              <strong>1,000+</strong>
              <span>active users</span>
            </div>
            <div class="roam-stat">
              <strong>iOS</strong>
              <span>live on the App Store</span>
            </div>
            <div class="roam-stat">
              <strong>Ongoing</strong>
              <span>steady updates</span>
            </div>
          </div>
        </div>
        <div class="roam-phone-stage">
          <div class="roam-phone">
            <img src="/Projects/roam-focus/home.jpg" alt="Roam Focus home screen with weather, starting point, travel mode, and duration" loading="eager" />
          </div>
        </div>
      </section>
      <section class="roam-section">
        <div class="roam-section-head">
          <h2>Not just watching numbers go down.</h2>
          <p>
            Most focus tools only give you a countdown. Roam Focus gives that time a start, a route, a speed, a weather mood, and a record when it ends. You’re not forced to sit still—you’re walking a small path on the map.
          </p>
        </div>
        <div class="roam-flow">
          <div class="roam-step">
            <h3>Pick a starting point</h3>
            <p>Start from your current location, or choose a preset city like Tokyo, Seoul, Nanjing, or New York.</p>
          </div>
          <div class="roam-step">
            <h3>Choose a travel mode</h3>
            <p>Walk, bike, drive, or skate—each with its own pace and rhythm for different tasks.</p>
          </div>
          <div class="roam-step">
            <h3>Set a duration</h3>
            <p>Quick-start with common presets, or tune the session length to match your current state.</p>
          </div>
          <div class="roam-step">
            <h3>Start roaming</h3>
            <p>Follow the route on the map, and keep a record of time, distance, weather, and places.</p>
          </div>
        </div>
      </section>
      <section id="screens-en" class="roam-section">
        <div class="roam-section-head">
          <h2>Every screen is built around one journey.</h2>
          <p>
            From setup, to the live map, to the post-session summary, Roam Focus keeps a clear sense of motion: choose, start, stay, review.
          </p>
        </div>
        <div class="roam-showcase">
          <article class="roam-shot">
            <img src="/Projects/roam-focus/location.jpg" alt="Starting point selection screen" loading="lazy" />
            <div class="roam-shot-caption">
              <h3>Starting point</h3>
              <p>Use your location, pick a point on the map, or start from a preset city. Roaming can begin here—or far away.</p>
            </div>
          </article>
          <article class="roam-shot">
            <img src="/Projects/roam-focus/weather.jpg" alt="Weather details screen" loading="lazy" />
            <div class="roam-shot-caption">
              <h3>Weather mood</h3>
              <p>Temperature, humidity, wind, visibility, and hourly forecast—giving the journey a sense of place.</p>
            </div>
          </article>
          <article class="roam-shot">
            <img src="/Projects/roam-focus/history.jpg" alt="Roaming history screen" loading="lazy" />
            <div class="roam-shot-caption">
              <h3>History</h3>
              <p>Time, distance, favorite places, and travel modes accumulate—more like a travel album than a scorecard.</p>
            </div>
          </article>
        </div>
      </section>
      <section class="roam-section">
        <div class="roam-split">
          <div>
            <h2>During a session, the map becomes your progress bar.</h2>
            <p>
              Once you start, Roam Focus shows your position, route, time remaining, distance traveled, and current speed on a real map. The timer is still there—but it’s no longer the only protagonist.
            </p>
            <ul class="roam-list">
              <li>
                <strong>Route progress</strong>
                A little avatar moves along the map, turning “minutes survived” into “distance traveled”.
              </li>
              <li>
                <strong>Low-distraction feedback</strong>
                Controls stay minimal—pause and stop—while details live in a calm bottom panel.
              </li>
              <li>
                <strong>Place discovery</strong>
                Landmarks and points of interest become part of the session, adding a subtle sense of exploration.
              </li>
            </ul>
          </div>
          <div class="roam-wide-shot">
            <img src="/Projects/roam-focus/session.jpg" alt="In-session map view" loading="lazy" />
          </div>
        </div>
      </section>
      <section class="roam-section">
        <div class="roam-split">
          <div class="roam-wide-shot">
            <img src="/Projects/roam-focus/summary.jpg" alt="Session summary view" loading="lazy" />
          </div>
          <div>
            <h2>When it ends, what remains is an itinerary.</h2>
            <p>
              After a session, Roam Focus organizes the time window, duration, weather, distance, travel mode, average speed, and map location. Even a few minutes deserves to be recorded.
            </p>
            <ul class="roam-list">
              <li>
                <strong>Not a binary win/lose</strong>
                Stopping early doesn’t erase the value—distance traveled is still distance traveled.
              </li>
              <li>
                <strong>Save and share</strong>
                The summary is designed to be kept as your own record, or shared with friends.
              </li>
              <li>
                <strong>Long-term resonance</strong>
                History, stats, and trophies connect small sessions into a longer arc of progress.
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section class="roam-section">
        <div class="roam-section-head">
          <h2>Features serve focus—not the other way around.</h2>
          <p>
            Roam Focus keeps the simplest Pomodoro start, then adds maps, weather, history, and achievements—making it easier to begin, and more memorable to finish.
          </p>
        </div>
        <div class="roam-feature-grid">
          <article class="roam-feature">
            <span class="roam-icon">Map</span>
            <h3>Real map routes</h3>
            <p>Transform abstract time into distance on the map, giving focus a visible direction.</p>
          </article>
          <article class="roam-feature">
            <span class="roam-icon">Mode</span>
            <h3>Travel modes</h3>
            <p>Walk, bike, drive, or skate—different paces for different kinds of work.</p>
          </article>
          <article class="roam-feature">
            <span class="roam-icon">Wx</span>
            <h3>Weather atmosphere</h3>
            <p>Powered by Apple Weather data, grounding the journey in a real-world mood.</p>
          </article>
          <article class="roam-feature">
            <span class="roam-icon">POI</span>
            <h3>Place discovery</h3>
            <p>Pass landmarks and points of interest, adding a light touch of exploration.</p>
          </article>
          <article class="roam-feature">
            <span class="roam-icon">Log</span>
            <h3>History & stats</h3>
            <p>Time, distance, places, and modes accumulate over time, ready for review.</p>
          </article>
          <article class="roam-feature">
            <span class="roam-icon">🏆</span>
            <h3>Trophies</h3>
            <p>Milestones for distance, streaks, places, weather, and more—gentle feedback for consistency.</p>
          </article>
        </div>
      </section>
      <section class="roam-section">
        <blockquote class="roam-quote">
          Focus doesn’t have to be painful. It can feel like stepping outside—direction, weather, places you pass, and a memory when it’s done.
        </blockquote>
      </section>
      <section class="roam-section">
        <div class="roam-split">
          <div>
            <h2>Privacy & boundaries</h2>
            <p>
              Roam Focus doesn’t require an account. Location is used to set the journey start, calculate routes, show weather, and discover nearby places. It’s not a navigation app—the route is for focus, not real-world guidance.
            </p>
          </div>
          <ul class="roam-list">
            <li>
              <strong>No account required</strong>
              Focus is already hard—no need to maintain a social identity on top of it.
            </li>
            <li>
              <strong>Logs are for review</strong>
              History supports stats, trophies, and summaries—never public rankings.
            </li>
            <li>
              <strong>Routes aren’t navigation advice</strong>
              The map makes time tangible, not a substitute for real travel directions.
            </li>
          </ul>
        </div>
      </section>
      <section class="roam-section">
        <div class="roam-bottom">
          <div>
            <h2>Start your first focus journey now.</h2>
            <p>Roam Focus is live on the App Store. Android and HarmonyOS versions are being explored.</p>
          </div>
          <a class="roam-button roam-button-primary" href="https://apps.apple.com/us/app/roam-focus/id6759795571" target="_blank" rel="noopener noreferrer" data-router-ignore>Get Roam Focus</a>
        </div>
      </section>
    </main>
  </div>
</div>
