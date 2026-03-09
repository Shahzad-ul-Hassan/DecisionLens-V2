document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  const premiumPages = ["intelligence", "liquidity", "review", "reports", "alerts"];
  if (premiumPages.includes(page)) { const user = DecisionLensAuth.requirePaid(); if (!user) return; }
});
