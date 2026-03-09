document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  if (loginForm) loginForm.addEventListener("submit", event => {
    event.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();
    const result = DecisionLensAuth.login(email, password);
    const feedback = document.getElementById("form-feedback");
    if (!result.ok) { feedback.textContent = result.message; return; }
    window.location.href = "dashboard.html";
  });
  const signupForm = document.getElementById("signup-form");
  if (signupForm) signupForm.addEventListener("submit", event => {
    event.preventDefault();
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const result = DecisionLensAuth.signup({ name, email });
    const feedback = document.getElementById("form-feedback");
    if (!result.ok) { feedback.textContent = "Unable to create demo account."; return; }
    feedback.textContent = "Demo account created. You now have free pending access.";
    setTimeout(() => window.location.href = "dashboard.html", 600);
  });
});
