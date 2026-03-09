document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "profile") return;
  const user = DecisionLensAuth.requireAuth(); if (!user) return;
  document.getElementById("profile-name").textContent = user.name;
  document.getElementById("profile-email").textContent = user.email;
  document.getElementById("profile-role").textContent = user.role.replace("_", " ");
  document.getElementById("profile-plan").textContent = user.plan;
  document.getElementById("profile-status").textContent = user.status;
  const note = document.getElementById("profile-note");
  note.textContent = DecisionLensAuth.isPaid(user) ? "This profile is ready for future progress analytics, review history, and education tracking." : "This profile is ready for future upgrades. In the current MVP, it stores your demo access state.";
});
