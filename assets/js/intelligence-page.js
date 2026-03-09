async function fetchJson(path) {
  const response = await fetch(path);
  return response.json();
}

function renderInstitutionalContext(items) {
  const mount = document.getElementById("institutional-context-list");
  if (!mount) return;
  mount.innerHTML = items.map(item => `
    <article class="card-soft">
      <div class="layout-spread">
        <strong>${item.title}</strong>
        <span class="status-pill">${item.label}</span>
      </div>
      <p style="margin-top:10px;">${item.summary}</p>
      <small>${item.note}</small>
    </article>
  `).join("");
}

function renderNarratives(items) {
  const mount = document.getElementById("narrative-list");
  if (!mount) return;
  mount.innerHTML = items.map(item => `
    <article class="card-soft">
      <div class="layout-spread">
        <div>
          <strong>${item.name}</strong>
          <p style="margin:6px 0 0;">${item.summary}</p>
        </div>
        <span class="status-pill">${item.score}</span>
      </div>
      <div class="layout-inline" style="margin-top:12px;">
        <span class="badge">${item.strength}</span>
        <span class="badge">${item.activity}</span>
      </div>
      <p style="margin-top:12px;"><small>Associated assets: ${item.tokens.join(", ")}</small></p>
    </article>
  `).join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  if (document.body.dataset.page !== "intelligence") return;
  const user = DecisionLensAuth.requirePaid();
  if (!user) return;

  const data = await fetchJson("assets/data/intelligence.json");
  renderInstitutionalContext(data.institutionalContext);
  renderNarratives(data.narratives);

  const head = document.getElementById("context-summary-headline");
  const body = document.getElementById("context-summary-body");
  if (head) head.textContent = data.summary.headline;
  if (body) body.textContent = data.summary.body;
});
