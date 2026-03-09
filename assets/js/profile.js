document.addEventListener("DOMContentLoaded", async () => {
  if (document.body.dataset.page !== "profile") return;
  const user = DecisionLensAuth.requireAuth();
  if (!user) return;

  const set = (id, value) => {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  };

  set("profile-name", user.name);
  set("profile-email", user.email);
  set("profile-role", user.role.replace("_", " "));
  set("profile-plan", user.plan);
  set("profile-status", user.status);
});
