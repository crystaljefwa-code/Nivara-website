const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (toggle) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "×" : "☰";
  });
}

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
    if (toggle) toggle.textContent = "☰";
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("newsletter-form");
const message = document.getElementById("form-message");

form.addEventListener("submit", event => {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  if (!email) return;
  message.textContent = "Thank you — welcome to the Nivara world.";
  form.reset();
});
