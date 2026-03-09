function renderHeader(active = "") {
  const user = DecisionLensAuth.getUser();
  const isAdmin = DecisionLensAuth.isAdmin(user);
  const authBlock = user
    ? `<span class="badge">${user.name} · ${user.role.replace("_", " ")}</span><a class="btn btn-secondary" href="profile.html">Profile</a><button class="btn btn-ghost" id="logout-btn" type="button">Sign out</button>`
    : `<a class="btn btn-ghost" href="login.html">Sign in</a><a class="btn btn-primary" href="signup.html">Get started</a>`;
  const header = `
    <header class="site-header">
      <div class="container nav-shell">
        <a class="brand" href="index.html"><span class="brand-mark">DL</span><span>DecisionLens</span></a>
        <nav class="nav-links" aria-label="Primary navigation">
          <a href="dashboard.html" class="${active === "dashboard" ? "is-active" : ""}">Overview</a>
          <a href="intelligence.html" class="${active === "intelligence" ? "is-active" : ""}">Intelligence</a>
          <a href="liquidity.html" class="${active === "liquidity" ? "is-active" : ""}">Liquidity</a>
          <a href="review.html" class="${active === "review" ? "is-active" : ""}">Review</a>
          <a href="academy.html" class="${active === "academy" ? "is-active" : ""}">Academy</a>
          <a href="macro.html" class="${active === "macro" ? "is-active" : ""}">Macro</a>
          <a href="reports.html" class="${active === "reports" ? "is-active" : ""}">Reports</a>
          <a href="alerts.html" class="${active === "alerts" ? "is-active" : ""}">Alerts</a>
          <a href="profile.html" class="${active === "profile" ? "is-active" : ""}">Profile</a>
          ${isAdmin ? `<a href="admin.html" class="${active === "admin" ? "is-active" : ""}">Admin</a>` : ""}
        </nav>
        <div class="nav-actions">${authBlock}</div>
      </div>
    </header>`;
  const mount = document.getElementById("site-header"); if (mount) mount.innerHTML = header;
  const logoutBtn = document.getElementById("logout-btn"); if (logoutBtn) logoutBtn.addEventListener("click", () => DecisionLensAuth.logout());
}
function renderFooter() {
  const footer = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div><div class="brand" style="margin-bottom:12px;"><span class="brand-mark">DL</span><span>DecisionLens</span></div><p>Decision intelligence for calmer market observation — without signals, predictions, or urgency framing.</p></div>
        <div><h4>Access</h4><div class="layout-stack-sm"><a href="dashboard.html">Overview</a><a href="academy.html">Academy</a><a href="login.html">Sign in</a></div></div>
        <div><h4>Policy</h4><div class="layout-stack-sm"><span class="muted">No buy/sell calls</span><span class="muted">No targets</span><span class="muted">No urgency</span></div></div>
      </div>
    </footer>`;
  const mount = document.getElementById("site-footer"); if (mount) mount.innerHTML = footer;
}
