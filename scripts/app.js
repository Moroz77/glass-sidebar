// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => nav.classList.toggle('open'));
}

// Smooth scroll for same-page anchors
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href');
  const el = document.querySelector(id);
  if (el) {
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    nav?.classList.remove('open');
  }
});

// Footer year
document.getElementById('year')?.append(new Date().getFullYear());

// Widget helpers (placeholder)
// If a widget needs transparent background, ensure its iframe allows it.
// We will adjust per specific widget code you provide.

