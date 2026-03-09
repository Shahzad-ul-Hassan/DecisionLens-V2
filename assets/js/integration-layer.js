async function fetchJson(path) {
  const response = await fetch(path);
  return response.json();
}

function renderSystemSummary(data) {
  const head = document.getElementById("integration-summary-headline");
  const body = document.getElementById("integration-summary-body");
  if (head) head.textContent = data.productSummary.headline;
  if (body) body.textContent = data.productSummary.body;
}

function renderLayerStatus(items) {
  const mount = document.getElementById("layer-status-list");
  if (!mount) return;
  mount.innerHTML = items.map(item => `
    <article class="card-soft">
      <div class="layout-spread">
        <strong>${item.name}</strong>
        <span class="status-pill">${item.status}</span>
      </div>
      <p style="margin-top:10px;">${item.detail}</p>
    </article>
  `).join("");
}

function renderGovernanceNotes(items) {
  const mount = document.getElementById("governance-notes");
  if (!mount) return;
  mount.innerHTML = items.map(item => `<li>${item}</li>`).join("");
}

function renderProfileAnalytics(data) {
  const placement = document.getElementById("profile-analytics-placement");
  const progress = document.getElementById("profile-progress-placement");
  const leaderboard = document.getElementById("profile-leaderboard-policy");
  const state = document.getElementById("profile-analytics-state");

  if (placement) placement.textContent = data.behaviorStabilityPlacement;
  if (progress) progress.textContent = data.progressAnalyticsPlacement;
  if (leaderboard) leaderboard.textContent = data.leaderboardPolicy;
  if (state) state.textContent = data.currentMVPState;
}

document.addEventListener("DOMContentLoaded", async () => {
  if (document.body.dataset.page !== "profile") return;
  const user = DecisionLensAuth.requireAuth();
  if (!user) return;

  const data = await fetchJson("assets/data/integration-layer.json");
  renderSystemSummary(data);
  renderLayerStatus(data.layerStatus);
  renderProfileAnalytics(data.profileAnalytics);
  renderGovernanceNotes(data.governanceNotes);
});
