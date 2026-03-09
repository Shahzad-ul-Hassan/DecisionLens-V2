async function fetchJson(path) {
  const response = await fetch(path);
  return response.json();
}

document.addEventListener("DOMContentLoaded", async () => {
  if (document.body.dataset.page !== "monitoring") return;
  const data = await fetchJson("assets/data/monitoring.json");
  const mount = document.getElementById("monitoring-cards");
  if (!mount) return;

  mount.innerHTML = data.cards.map(item => `
    <article class="card-soft">
      <div class="layout-spread">
        <strong>${item.title}</strong>
        <span class="status-pill">${item.status}</span>
      </div>
      <p style="margin-top:10px;">${item.detail}</p>
    </article>
  `).join("");
});
