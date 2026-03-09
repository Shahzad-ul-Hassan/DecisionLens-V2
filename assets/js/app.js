document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page || "";
  renderHeader(page);
  renderFooter();
  const lockedReason = new URLSearchParams(window.location.search).get("locked");
  const lockedBanner = document.getElementById("locked-banner");
  if (lockedBanner && lockedReason) {
    lockedBanner.hidden = false;
    lockedBanner.textContent = lockedReason === "admin" ? "This section is available only to authorized admin roles." : "This section is part of the premium layer in the current MVP.";
  }
});
