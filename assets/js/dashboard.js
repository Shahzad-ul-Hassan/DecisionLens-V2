async function fetchJson(path) { const response = await fetch(path); return response.json(); }
function setWindowButtons(activeWindow) { document.querySelectorAll(".window-btn").forEach(btn => btn.classList.toggle("is-active", btn.dataset.window === activeWindow)); }
function renderOverview(data, activeWindow) {
  const block = data.windows[activeWindow] || data.windows["1W"];
  document.getElementById("temperature-label").textContent = block.temperature;
  document.getElementById("volatility-label").textContent = block.volatility;
  document.getElementById("confidence-label").textContent = block.confidence;
  document.getElementById("pressure-label").textContent = block.pressure;
  document.getElementById("insight-line").textContent = block.insight;
  setWindowButtons(activeWindow);
  localStorage.setItem("decisionlens_window", activeWindow);
}
function renderSessions(items) {
  const mount = document.getElementById("sessions-strip");
  if (!mount) return;
  mount.innerHTML = items.map(item => `<article class="session-card"><div class="layout-spread"><strong>${item.name}</strong><span class="status-pill">${item.status}</span></div><p style="margin-top:10px;">${item.time}</p><small>${item.note}</small></article>`).join("");
}
function renderNews(items) {
  const mount = document.getElementById("news-list");
  if (!mount) return;
  mount.innerHTML = items.map(item => `<div class="data-row"><div><strong>${item.title}</strong><p style="margin:6px 0 0;">${item.summary}</p></div><small>${item.relevance}</small></div>`).join("");
}
function renderWatchlist(items) {
  const mount = document.getElementById("watchlist-list");
  if (!mount) return;
  mount.innerHTML = items.map(item => `<div class="data-row"><div><strong>${item.symbol}</strong><p style="margin:6px 0 0;">${item.note}</p></div><small>${item.state}</small></div>`).join("");
}
document.addEventListener("DOMContentLoaded", async () => {
  if (document.body.dataset.page !== "dashboard") return;
  DecisionLensAuth.requireAuth();
  const [overview, sessions, news, watchlist] = await Promise.all([
    fetchJson("assets/data/overview.json"),
    fetchJson("assets/data/sessions.json"),
    fetchJson("assets/data/news.json"),
    fetchJson("assets/data/watchlist.json")
  ]);
  const savedWindow = localStorage.getItem("decisionlens_window") || "1W";
  renderOverview(overview, savedWindow); renderSessions(sessions.sessions); renderNews(news.items); renderWatchlist(watchlist.items);
  document.querySelectorAll(".window-btn").forEach(btn => btn.addEventListener("click", () => renderOverview(overview, btn.dataset.window)));
  const user = DecisionLensAuth.getUser(); const accessNote = document.getElementById("access-note");
  if (accessNote && user) accessNote.textContent = DecisionLensAuth.isPaid(user) ? "Premium access active. Advanced pages are available in this MVP shell." : "Free access active. Premium pages remain visible in navigation but are gated.";
});
