async function fetchJson(path) {
  const response = await fetch(path);
  return response.json();
}

document.addEventListener("DOMContentLoaded", async () => {
  if (document.body.dataset.page !== "faq") return;
  const data = await fetchJson("assets/data/faq.json");
  const mount = document.getElementById("faq-list");
  if (!mount) return;

  mount.innerHTML = data.items.map(item => `
    <article class="card-soft">
      <strong>${item.q}</strong>
      <p style="margin-top:10px;">${item.a}</p>
    </article>
  `).join("");
});
