const DecisionLensAuth = (() => {
  const USERS = [
    { email: "free@decisionlens.local", password: "demo123", role: "free", plan: "free", status: "active", name: "Free User" },
    { email: "paid@decisionlens.local", password: "demo123", role: "paid", plan: "monthly", status: "active", name: "Paid User" },
    { email: "admin@decisionlens.local", password: "demo123", role: "admin", plan: "admin", status: "active", name: "Admin User" },
    { email: "decisionlens2025@gmail.com", password: "demo123", role: "super_admin", plan: "root", status: "active", name: "Super Admin" }
  ];
  const STORAGE_KEY = "decisionlens_user";
  function getUser() { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; }
  function setUser(user) { localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); }
  function login(email, password) {
    const match = USERS.find(user => user.email.toLowerCase() === email.toLowerCase() && user.password === password);
    if (!match) return { ok: false, message: "Invalid demo credentials." };
    const user = { ...match, loggedInAt: new Date().toISOString() }; setUser(user); return { ok: true, user };
  }
  function signup(payload) {
    const user = { email: payload.email, role: "free", plan: "free", status: "pending", name: payload.name || "New User", loggedInAt: new Date().toISOString() };
    setUser(user); return { ok: true, user };
  }
  function logout() { localStorage.removeItem(STORAGE_KEY); window.location.href = "index.html"; }
  function isPaid(user = getUser()) { return !!user && (user.role === "paid" || user.role === "admin" || user.role === "super_admin"); }
  function isAdmin(user = getUser()) { return !!user && (user.role === "admin" || user.role === "super_admin"); }
  function requireAuth() { const user = getUser(); if (!user) { window.location.href = "login.html"; return null; } return user; }
  function requirePaid() { const user = requireAuth(); if (!user) return null; if (!isPaid(user)) { window.location.href = "dashboard.html?locked=premium"; return null; } return user; }
  function requireAdmin() { const user = requireAuth(); if (!user) return null; if (!isAdmin(user)) { window.location.href = "dashboard.html?locked=admin"; return null; } return user; }
  return { getUser, setUser, login, signup, logout, isPaid, isAdmin, requireAuth, requirePaid, requireAdmin };
})();
