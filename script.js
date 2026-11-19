// script.js — small features, each one works without the others:
//   1. Sections fade in as you scroll
//   2. The hero test run "types" line by line
//   3. Progress bar: "Running portfolio · 3/6"
//   4. Certificate viewer
//   5. Copy email

// Tells the CSS that JavaScript runs, so it may hide things until they animate in.
// Without JavaScript, everything simply stays visible.
document.documentElement.classList.add("js");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- 1. Reveal on scroll ----------
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // animate once
        }
      }
    },
    { threshold: 0.12 }
  );
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// ---------- 2. Terminal typing ----------
const lines = document.querySelectorAll(".t-line");
lines.forEach((line, i) => {
  const delay = reducedMotion ? 0 : 400 + i * 380;
  setTimeout(() => line.classList.add("is-typed"), delay);
});

// ---------- 3. Test-run progress ----------
const bar = document.querySelector("#progress-bar");
const label = document.querySelector("#progress-label");
const steps = [...document.querySelectorAll("[data-step]")];

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 1;
  bar.style.transform = `scaleX(${ratio})`;

  // A step counts as "passed" once its top has scrolled above the middle of the screen
  const passed = steps.filter((s) => s.getBoundingClientRect().top < window.innerHeight * 0.6).length;
  label.textContent = passed >= steps.length
    ? `✓ ${steps.length}/${steps.length} passed`
    : `Running portfolio · ${passed}/${steps.length}`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

// ---------- 4. Certificate viewer ----------
const viewer = document.querySelector("#viewer");
const viewerImg = document.querySelector("#viewer-img");
const viewerTitle = document.querySelector("#viewer-title");

document.querySelectorAll(".cert-open").forEach((button) => {
  button.addEventListener("click", () => {
    viewerImg.src = button.dataset.full;
    viewerImg.alt = button.dataset.title;
    viewerTitle.textContent = button.dataset.title;
    viewer.showModal(); // native modal: traps focus, Esc closes it
  });
});

document.querySelector("#viewer-close").addEventListener("click", () => viewer.close());

// Clicking the dark area outside the certificate closes it too
viewer.addEventListener("click", (event) => {
  if (event.target === viewer) viewer.close();
});

// ---------- 5. Copy email ----------
const copyButton = document.querySelector("#copy-email");
const copyStatus = document.querySelector("#copy-status");

copyButton.addEventListener("click", async () => {
  const email = copyButton.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
    copyStatus.textContent = "Email copied: " + email;
  } catch {
    copyStatus.textContent = "Copy this address: " + email;
  }
  setTimeout(() => (copyStatus.textContent = ""), 4000);
});
