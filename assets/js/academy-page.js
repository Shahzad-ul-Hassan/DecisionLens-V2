const ACADEMY_PROGRESS_KEY = "decisionlens_academy_progress_v1";

async function fetchJson(path) {
  const response = await fetch(path);
  return response.json();
}

function getProgress() {
  const raw = localStorage.getItem(ACADEMY_PROGRESS_KEY);
  return raw ? JSON.parse(raw) : { completedModules: [], currentStage: "A", passRate: 0, avgAttempts: 0 };
}

function setProgress(progress) {
  localStorage.setItem(ACADEMY_PROGRESS_KEY, JSON.stringify(progress));
}

function computeStageCompletion(phases, completedModules) {
  const result = {};
  phases.forEach(phase => {
    const total = phase.modules.length;
    const done = phase.modules.filter(module => completedModules.includes(module)).length;
    result[phase.id] = { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  });
  return result;
}

function renderRoadmap(phases, progress) {
  const mount = document.getElementById("academy-roadmap");
  if (!mount) return;

  const stageStats = computeStageCompletion(phases, progress.completedModules);

  mount.innerHTML = phases.map(phase => {
    const stat = stageStats[phase.id];
    return `
      <article class="card-soft">
        <div class="layout-spread">
          <div>
            <strong>${phase.title}</strong>
            <p style="margin:6px 0 0;">${phase.purpose}</p>
          </div>
          <span class="status-pill">${phase.id}</span>
        </div>
        <p style="margin-top:12px;"><small>${stat.done}/${stat.total} completed · ${stat.pct}%</small></p>
        <ul style="margin-top:10px;">
          ${phase.modules.map(m => `<li>${m}</li>`).join("")}
        </ul>
      </article>
    `;
  }).join("");
}

function renderModuleCards(items, isPaid, progress) {
  const mount = document.getElementById("academy-modules");
  if (!mount) return;

  mount.innerHTML = items.map(item => {
    const locked = item.type === "paid" && !isPaid;
    const done = progress.completedModules.includes(item.title);
    return `
      <article class="card-soft">
        <div class="layout-spread">
          <div>
            <strong>${item.title}</strong>
            <p style="margin:6px 0 0;">${item.summary}</p>
          </div>
          <span class="status-pill">${done ? "Completed" : locked ? "Locked" : item.stage}</span>
        </div>
        <div class="layout-inline" style="margin-top:12px;">
          <span class="badge">Stage ${item.stage}</span>
          <span class="badge">${item.readingTime}</span>
          <span class="badge">${item.type === "preview" ? "Preview" : "Full Module"}</span>
        </div>
        <div style="margin-top:14px;">
          <button class="btn ${locked ? "btn-ghost" : "btn-secondary"} module-complete-btn" data-title="${item.title}" ${locked ? "disabled" : ""}>
            ${done ? "Marked Completed" : locked ? "Premium Required" : "Mark as Completed"}
          </button>
        </div>
      </article>
    `;
  }).join("");

  document.querySelectorAll(".module-complete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const title = btn.dataset.title;
      const next = getProgress();
      if (!next.completedModules.includes(title)) {
        next.completedModules.push(title);
      }
      next.passRate = Math.min(100, Math.round((next.completedModules.length / 24) * 100));
      next.avgAttempts = next.completedModules.length ? 1.3 : 0;
      setProgress(next);
      const user = DecisionLensAuth.getUser();
      renderAcademyState(window.__academyData, user, next);
    });
  });
}

function renderProgressPanels(progress, phases, isPaid) {
  const totalCompleted = progress.completedModules.length;
  const currentStageNode = document.getElementById("academy-current-stage");
  const completedNode = document.getElementById("academy-completed-count");
  const passNode = document.getElementById("academy-pass-rate");
  const attemptNode = document.getElementById("academy-attempt-rate");
  const accessNode = document.getElementById("academy-access-note");

  if (currentStageNode) currentStageNode.textContent = progress.currentStage || "A";
  if (completedNode) completedNode.textContent = `${totalCompleted}/24`;
  if (passNode) passNode.textContent = `${progress.passRate || 0}%`;
  if (attemptNode) attemptNode.textContent = progress.avgAttempts ? progress.avgAttempts.toFixed(1) : "0.0";
  if (accessNode) {
    accessNode.textContent = isPaid
      ? "Full academy layer active in MVP shell mode."
      : "You are viewing foundation previews. Full academy modules are reserved for paid access.";
  }
}

function renderTestShell(tests) {
  const ruleNode = document.getElementById("academy-test-rule");
  const noteNode = document.getElementById("academy-test-note");
  if (ruleNode) ruleNode.textContent = tests.rule;
  if (noteNode) noteNode.textContent = tests.currentMVP;
}

function renderCertificate(cert, progress, isPaid) {
  const titleNode = document.getElementById("academy-cert-title");
  const statusNode = document.getElementById("academy-cert-status");
  const noteNode = document.getElementById("academy-cert-note");
  const unlockNode = document.getElementById("academy-cert-unlock");

  if (titleNode) titleNode.textContent = cert.title;
  if (statusNode) statusNode.textContent = cert.status;
  if (noteNode) noteNode.textContent = cert.note;
  if (unlockNode) {
    unlockNode.textContent = isPaid && progress.completedModules.length >= 24
      ? "Ready for future certificate unlock logic."
      : "Locked until full academy completion in later phases.";
  }
}

function renderAcademyState(data, user, progress) {
  const isPaid = DecisionLensAuth.isPaid(user);
  renderRoadmap(data.phases, progress);
  renderModuleCards(data.moduleCards, isPaid, progress);
  renderProgressPanels(progress, data.phases, isPaid);
  renderTestShell(data.tests);
  renderCertificate(data.certification, progress, isPaid);
}

document.addEventListener("DOMContentLoaded", async () => {
  if (document.body.dataset.page !== "academy") return;

  const user = DecisionLensAuth.getUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const data = await fetchJson("assets/data/academy-system.json");
  window.__academyData = data;

  const progress = getProgress();
  renderAcademyState(data, user, progress);
});
