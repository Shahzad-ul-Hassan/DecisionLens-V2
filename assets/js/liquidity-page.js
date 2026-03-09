async function fetchJson(path) {
  const response = await fetch(path);
  return response.json();
}

function renderLiquidityEvents(events) {
  const mount = document.getElementById("liquidity-events-list");
  if (!mount) return;
  mount.innerHTML = events.map(item => `
    <article class="card-soft">
      <div class="layout-spread">
        <div>
          <strong>${item.token} · ${item.exchange}</strong>
          <p style="margin:6px 0 0;">${item.listingType} · ${item.countdown} · ${item.narrativeTag}</p>
        </div>
        <span class="status-pill">${item.volatilityPhase}</span>
      </div>

      <div class="layout-grid-3" style="margin-top:14px;">
        <div class="kpi">
          <small>Funding Strength</small>
          <span class="kpi-value">${item.fundingStrength.score}</span>
          <small>${item.fundingStrength.label}</small>
        </div>
        <div class="kpi">
          <small>Liquidity Shock Index</small>
          <span class="kpi-value">${item.liquidityShockIndex.score}</span>
          <small>${item.liquidityShockIndex.label}</small>
        </div>
        <div class="kpi">
          <small>GitHub Activity</small>
          <span class="kpi-value">${item.githubActivity.score}</span>
          <small>${item.githubActivity.label}</small>
        </div>
      </div>

      <div class="layout-grid-3" style="margin-top:14px;">
        <div class="card-soft">
          <strong>Project Maturity</strong>
          <p style="margin-top:8px;">${item.maturityBand}</p>
        </div>
        <div class="card-soft">
          <strong>Official Exchange Link</strong>
          <p style="margin-top:8px;"><a href="${item.officialLink}" target="_blank" rel="noopener">Open source page</a></p>
        </div>
        <div class="card-soft">
          <strong>Guardrail Note</strong>
          <p style="margin-top:8px;">${item.note}</p>
        </div>
      </div>
    </article>
  `).join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  if (document.body.dataset.page !== "liquidity") return;
  const user = DecisionLensAuth.requirePaid();
  if (!user) return;

  const data = await fetchJson("assets/data/liquidity.json");
  const head = document.getElementById("liquidity-summary-headline");
  const body = document.getElementById("liquidity-summary-body");

  if (head) head.textContent = data.summary.headline;
  if (body) body.textContent = data.summary.body;

  renderLiquidityEvents(data.events);
});
