async function fetchJson(path) { const response = await fetch(path); return response.json(); }
document.addEventListener("DOMContentLoaded", async () => {
  if (document.body.dataset.page !== "admin") return;
  const user = DecisionLensAuth.requireAdmin(); if (!user) return;
  const stats = await fetchJson("assets/data/admin.json");
  document.getElementById("admin-users").textContent = stats.totalUsers;
  document.getElementById("admin-active").textContent = stats.activeUsers;
  document.getElementById("admin-pending").textContent = stats.pendingApprovals;
  document.getElementById("admin-revenue").textContent = stats.revenueCounter;
  document.getElementById("approval-queue").innerHTML = stats.pending.map(item => `<div class="data-row"><div><strong>${item.email}</strong><p style="margin:6px 0 0;">Plan: ${item.plan} · TXID: ${item.txid}</p></div><small>${item.status}</small></div>`).join("");
});
