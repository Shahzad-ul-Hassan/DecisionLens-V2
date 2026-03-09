async function fetchJson(path) {
  const response = await fetch(path);
  return response.json();
}

function renderCategories(items) {
  const mount = document.getElementById("alerts-categories");
  if (!mount) return;
  mount.innerHTML = items.map(item => `
    <article class="card-soft">
      <strong>${item.name}</strong>
      <p style="margin-top:10px;">${item.description}</p>
    </article>
  `).join("");
}

function renderFeed(items) {
  const mount = document.getElementById("alerts-feed");
  if (!mount) return;
  mount.innerHTML = items.map(item => `
    <article class="card-soft">
      <div class="layout-spread">
        <strong>${item.title}</strong>
        <span class="status-pill">${item.impact}</span>
      </div>
      <p style="margin-top:10px;">${item.reason}</p>
    </article>
  `).join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  if (document.body.dataset.page !== "alerts") return;
  const user = DecisionLensAuth.requirePaid();
  if (!user) return;

  const data = await fetchJson("assets/data/alerts-center.json");
  renderCategories(data.categories);
  renderFeed(data.sampleFeed);

  const channelsNode = document.getElementById("alerts-channels");
  const quietNode = document.getElementById("alerts-quiet-hours");
  const capsNode = document.getElementById("alerts-daily-caps");
  const modesNode = document.getElementById("alerts-frequency-modes");

  if (channelsNode) channelsNode.textContent = data.settings.channels.join(", ");
  if (quietNode) quietNode.textContent = data.settings.quietHoursDefault;
  if (capsNode) capsNode.textContent = `Free: ${data.settings.dailyCaps.free} · Paid: ${data.settings.dailyCaps.paid}`;
  if (modesNode) modesNode.textContent = data.settings.frequencyModes.join(", ");
});
