async function fetchJson(path) {
  const response = await fetch(path);
  return response.json();
}
function setWindowButtons(activeWindow) {
  document.querySelectorAll('.window-btn').forEach(btn => btn.classList.toggle('is-active', btn.dataset.window === activeWindow));
}
function updateModelMeta(model) {
  const scoreNode = document.getElementById('temperature-score');
  const alignNode = document.getElementById('alignment-score');
  const windowNode = document.getElementById('active-window-label');
  const statusNode = document.getElementById('window-status-note');
  if (scoreNode) scoreNode.textContent = model.T.toFixed(2);
  if (alignNode) alignNode.textContent = `${Math.round(model.align * 100)}%`;
  if (windowNode) windowNode.textContent = model.windowKey;
  if (statusNode) statusNode.textContent = model.windowKey === '1W' ? 'Short enough to stay relevant, long enough to reduce noise.' : model.windowKey === '1M' ? 'Broader context for medium-term structure.' : 'Longer regime perspective for structural context.';
}
function renderOverviewModel(model) {
  document.getElementById('temperature-label').textContent = model.temperature;
  document.getElementById('volatility-label').textContent = model.volatility;
  document.getElementById('confidence-label').textContent = model.confidence;
  document.getElementById('pressure-label').textContent = model.pressure;
  document.getElementById('insight-line').textContent = model.insight;
  updateModelMeta(model); setWindowButtons(model.windowKey); localStorage.setItem('decisionlens_window', model.windowKey);
}
function renderSessions(items) {
  const mount = document.getElementById('sessions-strip'); if (!mount) return;
  mount.innerHTML = items.map(item => `<article class="session-card"><div class="layout-spread"><strong>${item.name}</strong><span class="status-pill">${item.status}</span></div><p style="margin-top:10px;">${item.time}</p><small>${item.note}</small></article>`).join('');
}
function renderNews(items) {
  const mount = document.getElementById('news-list'); if (!mount) return;
  mount.innerHTML = items.map(item => `<div class="data-row"><div><strong>${item.title}</strong><p style="margin:6px 0 0;">${item.summary}</p></div><small>${item.relevance}</small></div>`).join('');
}
function renderWatchlist(items) {
  const mount = document.getElementById('watchlist-list'); if (!mount) return;
  mount.innerHTML = items.map(item => `<div class="data-row"><div><strong>${item.symbol}</strong><p style="margin:6px 0 0;">${item.note}</p></div><small>${item.state}</small></div>`).join('');
}
document.addEventListener('DOMContentLoaded', async () => {
  if (document.body.dataset.page !== 'dashboard') return;
  DecisionLensAuth.requireAuth();
  const [engine, sessions, news, watchlist] = await Promise.all([
    fetchJson('assets/data/temperature-engine.json'), fetchJson('assets/data/sessions.json'), fetchJson('assets/data/news.json'), fetchJson('assets/data/watchlist.json')
  ]);
  const savedWindow = localStorage.getItem('decisionlens_window') || engine.meta.defaultWindow || '1W';
  renderOverviewModel(computeTemperatureModel(engine, savedWindow));
  renderSessions(sessions.sessions); renderNews(news.items); renderWatchlist(watchlist.items);
  document.querySelectorAll('.window-btn').forEach(btn => btn.addEventListener('click', () => renderOverviewModel(computeTemperatureModel(engine, btn.dataset.window))));
  const user = DecisionLensAuth.getUser();
  const accessNote = document.getElementById('access-note');
  if (accessNote && user) accessNote.textContent = DecisionLensAuth.isPaid(user) ? 'Premium access active. Advanced pages are available in this MVP shell.' : 'Free access active. Premium pages remain visible in navigation but are gated.';
});
