async function fetchJson(path) {
  const response = await fetch(path);
  return response.json();
}

document.addEventListener("DOMContentLoaded", async () => {
  if (document.body.dataset.page !== "analytics") return;
  const data = await fetchJson("assets/data/analytics.json");
  const cards = document.getElementById("analytics-cards");
  const rules = document.getElementById("analytics-guardrails");

  if (cards) {
    cards.innerHTML = data.cards.map(item => `
      <article class="card-soft">
        <div class="layout-spread">
          <strong>${item.title}</strong>
          <span class="status-pill">${item.status}</span>
        </div>
        <p style="margin-top:10px;">${item.detail}</p>
      </article>
    `).join("");
  }

  if (rules) {
    rules.innerHTML = data.guardrails.map(item => `<li>${item}</li>`).join("");
  }
});
