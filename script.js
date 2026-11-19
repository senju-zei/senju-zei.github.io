// script.js — shared by all 4 pages. Each feature checks that its elements exist,
// so one script works on every page:
//   1. Sections fade in as you scroll
//   2. The test run "types" line by line (Home page)
//   3. Progress: a scroll bar + "Running portfolio · page 2/4"
//   4. Certificate viewer (Awards page)
//   5. "Email me" copies the address (Contact page)

// Tells the CSS that JavaScript runs, so it may hide things until they animate in.
// Without JavaScript, everything simply stays visible.
document.documentElement.classList.add("js");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const TOTAL_PAGES = 4;

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
document.querySelectorAll(".t-line").forEach((line, i) => {
  const delay = reducedMotion ? 0 : 500 + i * 380;
  setTimeout(() => line.classList.add("is-typed"), delay);
});

// ---------- 3. Progress ----------
const bar = document.querySelector("#progress-bar");
const label = document.querySelector("#progress-label");
const page = Number(document.body.dataset.page) || 1;

if (label) {
  label.textContent = page === TOTAL_PAGES
    ? `✓ ${TOTAL_PAGES}/${TOTAL_PAGES} passed`
    : `Running portfolio · page ${page}/${TOTAL_PAGES}`;
}

function updateBar() {
  if (!bar) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 1;
  bar.style.transform = `scaleX(${ratio})`;
}

window.addEventListener("scroll", updateBar, { passive: true });
window.addEventListener("resize", updateBar);
updateBar();

// ---------- 4. Certificate viewer ----------
const viewer = document.querySelector("#viewer");

if (viewer) {
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
}

// ---------- 5. "Email me" copies the address ----------
const emailButton = document.querySelector("#email-button");

if (emailButton) {
  const status = document.querySelector("#copy-status");
  const originalText = emailButton.textContent;

  emailButton.addEventListener("click", async () => {
    const email = emailButton.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      emailButton.textContent = "✓ Email copied";
      status.textContent = `Copied ${email}. Paste it into your email app.`;
    } catch {
      // Clipboard can be blocked; show the address so it can still be copied by hand
      status.textContent = `My email: ${email}`;
    }
    setTimeout(() => {
      emailButton.textContent = originalText;
      status.textContent = "";
    }, 5000);
  });
}
