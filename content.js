(() => {
  "use strict";
  const BUTTON = "semifull-toggle";
  const ENTER_ICON = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="18" rx="1.5" stroke-width="1.8"/><path d="M2 7h20" stroke-width="1.8"/><path d="M8 13.5V10h3.5M8 10l2.5 2.5M16 14.5V18h-3.5M16 18l-2.5-2.5" stroke-width="1.3"/></g></svg>';
  const EXIT_ICON = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="18" rx="1.5" stroke-width="1.8"/><path d="M2 7h20" stroke-width="1.8"/><path d="M8 10l3.5 3.5M8 13.5h3.5V10M16 18l-2.5-2.5M16 14.5h-3.5V18" stroke-width="1.3"/></g></svg>';
  let activePlayer = null;
  let ancestors = [];
  let savedScroll = [0, 0];
  let pending = false;
  const isWatchPage = () => location.pathname === "/watch" || location.pathname.startsWith("/live/");

  function updateButton(button, active) {
    const label = active ? "Exit Semifull (G or Esc)" : "Semifull (G)";
    button.removeAttribute("title");
    button.setAttribute("aria-label", label);
    button.setAttribute("aria-pressed", String(active));
    button.innerHTML = active ? EXIT_ICON : ENTER_ICON;
    hideTooltip(button);
  }
  function hideTooltip(button) {
    button.removeAttribute("aria-describedby");
    button.closest("#movie_player")?.querySelector(".semifull-tooltip")?.remove();
  }
  function showTooltip(button) {
    const player = button.closest("#movie_player");
    if (!player) return;
    hideTooltip(button);
    const tooltip = document.createElement("div");
    tooltip.id = "semifull-tooltip";
    tooltip.className = "semifull-tooltip ytp-tooltip ytp-bottom";
    tooltip.setAttribute("role", "tooltip");
    const wrapper = document.createElement("div");
    wrapper.className = "ytp-tooltip-text-wrapper";
    const row = document.createElement("div");
    row.className = "ytp-tooltip-bottom-text";
    const text = document.createElement("span");
    text.className = "ytp-tooltip-text";
    text.textContent = activePlayer === player ? "Exit Semifull" : "Semifull";
    const key = document.createElement("div");
    key.className = "ytp-tooltip-keyboard-shortcut";
    key.textContent = "G";
    row.append(text, key);
    wrapper.append(row);
    tooltip.append(wrapper);
    player.append(tooltip);
    button.setAttribute("aria-describedby", tooltip.id);
    const bounds = player.getBoundingClientRect();
    const anchor = button.getBoundingClientRect();
    const width = tooltip.offsetWidth;
    tooltip.style.left = `${Math.max(8, Math.min(bounds.width - width - 8, anchor.left - bounds.left + (anchor.width - width) / 2))}px`;
    const controls = player.querySelector(".ytp-chrome-bottom")?.getBoundingClientRect();
    tooltip.style.top = `${Math.max(8, (controls?.top ?? anchor.top) - bounds.top - tooltip.offsetHeight - 10)}px`;
  }
  function notifyResize() {
    window.dispatchEvent(new Event("resize"));
  }
  function exit() {
    if (!activePlayer) return;
    const player = activePlayer;
    activePlayer = null;
    document.documentElement.classList.remove("semifull-active");
    player.classList.remove("semifull-player");
    ancestors.forEach(node => node.classList.remove("semifull-ancestor"));
    ancestors = [];
    const button = player.querySelector(`#${BUTTON}`);
    if (button) updateButton(button, false);
    window.scrollTo(...savedScroll);
    notifyResize();
  }
  function enter(player) {
    if (document.fullscreenElement || !isWatchPage()) return;
    savedScroll = [window.scrollX, window.scrollY];
    activePlayer = player;
    for (let node = player.parentElement; node; node = node.parentElement) {
      ancestors.push(node);
      node.classList.add("semifull-ancestor");
    }
    document.documentElement.classList.add("semifull-active");
    player.classList.add("semifull-player");
    updateButton(player.querySelector(`#${BUTTON}`), true);
    notifyResize();
  }
  function reconcile() {
    pending = false;
    const player = document.querySelector("#movie_player");
    if (activePlayer && (!isWatchPage() || activePlayer !== player || !activePlayer.isConnected)) exit();
    if (!isWatchPage() || !player) return;
    const fullscreen = player.querySelector(".ytp-fullscreen-button");
    if (!fullscreen) return;
    let button = player.querySelector(`#${BUTTON}`);
    if (!button) {
      button = document.createElement("button");
      button.id = BUTTON;
      button.className = "ytp-button semifull-button";
      button.type = "button";
      button.addEventListener("mouseenter", () => showTooltip(button));
      button.addEventListener("mouseleave", () => hideTooltip(button));
      button.addEventListener("focus", () => showTooltip(button));
      button.addEventListener("blur", () => hideTooltip(button));
      updateButton(button, activePlayer === player);
      button.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        if (activePlayer) exit(); else enter(player);
      });
    }
    if (button.nextElementSibling !== fullscreen) fullscreen.before(button);
  }
  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(reconcile);
  }
  // Restore the layout before YouTube enters native fullscreen or miniplayer.
  document.addEventListener("click", event => {
    if (activePlayer && event.target instanceof Element &&
        event.target.closest(".ytp-fullscreen-button, .ytp-miniplayer-button")) exit();
  }, true);
  document.addEventListener("keydown", event => {
    const target = event.target;
    const editing = target instanceof Element &&
      (target.isContentEditable || target.closest("input, textarea, select, [role='textbox']"));
    if (!editing && !event.isComposing && !event.repeat &&
        !event.ctrlKey && !event.altKey && !event.metaKey && event.key.toLowerCase() === "g") {
      if (activePlayer) {
        event.preventDefault();
        event.stopImmediatePropagation();
        exit();
        return;
      }
      reconcile();
      const player = document.querySelector("#movie_player");
      if (isWatchPage() && !document.fullscreenElement && player?.querySelector(`#${BUTTON}`)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        enter(player);
      }
      return;
    }
    if (!activePlayer) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopImmediatePropagation();
      exit();
    } else if (!editing && !event.ctrlKey && !event.altKey && !event.metaKey && event.key.toLowerCase() === "f") {
      exit(); // Let YouTube's F shortcut continue to native fullscreen.
    }
  }, true);
  document.addEventListener("fullscreenchange", () => { if (document.fullscreenElement) exit(); });
  document.addEventListener("yt-navigate-start", exit);
  document.addEventListener("yt-navigate-finish", schedule);
  window.addEventListener("popstate", schedule);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  reconcile();
})();
