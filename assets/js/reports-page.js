async function fetchJson(path) {
  const response = await fetch(path);
  return response.json();
}

function renderReportCards(items) {
  const mount = document.getElementById("reports-summary-cards");
  if (!mount) return;
  mount.innerHTML = items.map(item => `
    <article class="card-soft">
      <div class="layout-spread">
        <strong>${item.title}</strong>
        <span class="status-pill">${item.label}</span>
      </div>
      <p style="margin-top:10px;">${item.body}</p>
    </article>
  `).join("");
}

function renderHistory(items) {
  const mount = document.getElementById("reports-history");
  if (!mount) return;
  mount.innerHTML = items.map(item => `
    <div class="data-row">
      <div>
        <strong>${item.title}</strong>
        <p style="margin:6px 0 0;">${item.type}</p>
      </div>
      <small>${item.date} · ${item.status}</small>
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  if (document.body.dataset.page !== "reports") return;
  const user = DecisionLensAuth.requirePaid();
  if (!user) return;

  const data = await fetchJson("assets/data/reports-center.json");
  renderReportCards(data.summaryCards);
  renderHistory(data.reportHistory);
});
