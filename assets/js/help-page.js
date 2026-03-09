async function fetchJson(path) {
  const response = await fetch(path);
  return response.json();
}

document.addEventListener("DOMContentLoaded", async () => {
  if (document.body.dataset.page !== "help") return;
  const data = await fetchJson("assets/data/help-center.json");
  const mount = document.getElementById("help-sections");
  if (!mount) return;

  mount.innerHTML = data.sections.map(section => `
    <article class="card">
      <h2>${section.title}</h2>
      <ul>
        ${section.items.map(item => `<li>${item}</li>`).join("")}
      </ul>
    </article>
  `).join("");
});
