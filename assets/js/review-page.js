const REVIEW_STORAGE_KEY = "decisionlens_reviews_v1";

async function fetchJson(path) {
  const response = await fetch(path);
  return response.json();
}

function getStoredReviews() {
  const raw = localStorage.getItem(REVIEW_STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function setStoredReviews(items) {
  localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(items));
}

function ensureSeedReviews(seedItems) {
  const stored = getStoredReviews();
  if (!stored.length) {
    setStoredReviews(seedItems);
    return seedItems;
  }
  return stored;
}

function summarizeReviews(items, behaviorMap) {
  const behaviorCounts = {};
  const contextCounts = {};
  items.forEach(item => {
    (item.behaviorTags || []).forEach(tag => {
      behaviorCounts[tag] = (behaviorCounts[tag] || 0) + 1;
    });
    (item.contextTags || []).forEach(tag => {
      contextCounts[tag] = (contextCounts[tag] || 0) + 1;
    });
  });

  const topBehavior = Object.entries(behaviorCounts).sort((a, b) => b[1] - a[1])[0];
  const topContext = Object.entries(contextCounts).sort((a, b) => b[1] - a[1])[0];

  let suggestion = "No strong recurring behavior pattern detected yet.";
  if (topBehavior && topBehavior[1] >= 2) {
    const module = behaviorMap[topBehavior[0]] || "Relevant learning module";
    suggestion = `Pattern detected: Repeated ${topBehavior[0].replaceAll("_", " ")}. Suggested Reading: ${module}.`;
  }

  return {
    total: items.length,
    topBehavior,
    topContext,
    suggestion
  };
}

function renderSummary(summary, behaviorMap) {
  const totalNode = document.getElementById("review-total");
  const behaviorNode = document.getElementById("review-top-behavior");
  const contextNode = document.getElementById("review-top-context");
  const suggestionNode = document.getElementById("review-suggestion");

  if (totalNode) totalNode.textContent = summary.total;
  if (behaviorNode) {
    behaviorNode.textContent = summary.topBehavior
      ? `${summary.topBehavior[0].replaceAll("_", " ")} (${summary.topBehavior[1]})`
      : "No dominant pattern";
  }
  if (contextNode) {
    contextNode.textContent = summary.topContext
      ? `${summary.topContext[0].replaceAll("_", " ")} (${summary.topContext[1]})`
      : "No dominant context";
  }
  if (suggestionNode) suggestionNode.textContent = summary.suggestion;
}

function renderReviews(items) {
  const mount = document.getElementById("review-history-list");
  if (!mount) return;
  mount.innerHTML = items
    .slice()
    .reverse()
    .map(item => `
      <article class="card-soft">
        <div class="layout-spread">
          <div>
            <strong>${item.market}</strong>
            <p style="margin:6px 0 0;">${item.summary}</p>
          </div>
          <span class="status-pill">${item.date}</span>
        </div>

        <div class="layout-inline" style="margin-top:12px;">
          ${(item.behaviorTags || []).map(tag => `<span class="badge">${tag.replaceAll("_", " ")}</span>`).join("")}
        </div>

        <div class="layout-inline" style="margin-top:10px;">
          ${(item.contextTags || []).map(tag => `<span class="metric-chip">${tag.replaceAll("_", " ")}</span>`).join("")}
        </div>

        <p style="margin-top:12px;"><small>${item.lesson || ""}</small></p>
      </article>
    `).join("");
}

function collectMultiSelectValues(select) {
  return Array.from(select.selectedOptions).map(option => option.value).filter(Boolean);
}

function populateSelects(seed) {
  const behaviorSelect = document.getElementById("behavior-tags");
  const contextSelect = document.getElementById("context-tags");
  if (behaviorSelect) {
    behaviorSelect.innerHTML = Object.keys(seed.behaviorTagMap).map(tag =>
      `<option value="${tag}">${tag.replaceAll("_", " ")}</option>`
    ).join("");
  }
  if (contextSelect) {
    contextSelect.innerHTML = seed.contextualTags.map(tag =>
      `<option value="${tag}">${tag.replaceAll("_", " ")}</option>`
    ).join("");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  if (document.body.dataset.page !== "review") return;
  const user = DecisionLensAuth.requirePaid();
  if (!user) return;

  const seed = await fetchJson("assets/data/review.json");
  populateSelects(seed);

  let reviews = ensureSeedReviews(seed.sampleReviews);
  renderReviews(reviews);
  renderSummary(summarizeReviews(reviews, seed.behaviorTagMap), seed.behaviorTagMap);

  const form = document.getElementById("review-form");
  const feedback = document.getElementById("review-feedback");

  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();

      const market = document.getElementById("review-market").value.trim();
      const date = document.getElementById("review-date").value.trim();
      const summary = document.getElementById("review-summary").value.trim();
      const lesson = document.getElementById("review-lesson").value.trim();
      const behaviorTags = collectMultiSelectValues(document.getElementById("behavior-tags"));
      const contextTags = collectMultiSelectValues(document.getElementById("context-tags"));

      if (!market || !date || !summary) {
        if (feedback) feedback.textContent = "Please complete market, date, and summary fields.";
        return;
      }

      const entry = {
        id: `rvw-${Date.now()}`,
        market,
        date,
        summary,
        lesson,
        behaviorTags,
        contextTags
      };

      reviews.push(entry);
      setStoredReviews(reviews);
      renderReviews(reviews);
      renderSummary(summarizeReviews(reviews, seed.behaviorTagMap), seed.behaviorTagMap);

      form.reset();
      if (feedback) feedback.textContent = "Review entry saved locally in this MVP.";
    });
  }
});
