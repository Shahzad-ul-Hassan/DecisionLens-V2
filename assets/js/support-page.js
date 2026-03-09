async function fetchJson(path) {
  const response = await fetch(path);
  return response.json();
}

document.addEventListener("DOMContentLoaded", async () => {
  if (document.body.dataset.page !== "support") return;
  const data = await fetchJson("assets/data/support.json");

  const channels = document.getElementById("support-channels");
  const policy = document.getElementById("support-policy");

  if (channels) {
    channels.innerHTML = data.channels.map(item => `
      <article class="card-soft">
        <strong>${item.name}</strong>
        <p style="margin-top:10px;">${item.detail}</p>
      </article>
    `).join("");
  }

  if (policy) {
    policy.innerHTML = data.policy.map(item => `<li>${item}</li>`).join("");
  }
});
