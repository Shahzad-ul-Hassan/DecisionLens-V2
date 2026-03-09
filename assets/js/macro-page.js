async function fetchJson(path) {
  const response = await fetch(path);
  return response.json();
}

function renderMacroSections(sections) {
  const mount = document.getElementById("macro-sections");
  if (!mount) return;
  mount.innerHTML = sections.map(section => `
    <article class="card">
      <h2>${section.title}</h2>
      <div class="layout-stack-md">
        ${section.items.map(item => `
          <div class="card-soft">
            <div class="layout-spread">
              <strong>${item.term}</strong>
              <span class="badge">Macro Library</span>
            </div>
            <p style="margin-top:10px;"><strong>Meaning:</strong> ${item.meaning}</p>
            <p><strong>Market Impact:</strong> ${item.impact}</p>
            <p><strong>Dashboard Connection:</strong> ${item.connection}</p>
          </div>
        `).join("")}
      </div>
    </article>
  `).join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  if (document.body.dataset.page !== "macro") return;
  const user = DecisionLensAuth.requireAuth();
  if (!user) return;

  const data = await fetchJson("assets/data/macro-library.json");
  renderMacroSections(data.sections);
});
