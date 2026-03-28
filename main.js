document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initRevealAnimations();
  initFaqAccordion();
});

function initMobileNav() {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (!navToggle || !navLinks) return;

  const closeMenu = () => {
    navToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("open");
    document.body.classList.remove("menu-open");
  };

  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    if (isExpanded) {
      closeMenu();
      return;
    }

    navToggle.setAttribute("aria-expanded", "true");
    navLinks.classList.add("open");
    document.body.classList.add("menu-open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

function initRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -24px 0px",
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const icon = item.querySelector(".faq-icon");

    if (!question || !answer) return;

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      faqItems.forEach((otherItem) => {
        const otherAnswer = otherItem.querySelector(".faq-answer");
        const otherQuestion = otherItem.querySelector(".faq-question");
        const otherIcon = otherItem.querySelector(".faq-icon");

        otherItem.classList.remove("open");
        if (otherAnswer) otherAnswer.style.maxHeight = null;
        if (otherQuestion) otherQuestion.setAttribute("aria-expanded", "false");
        if (otherIcon) otherIcon.textContent = "+";
      });

      if (isOpen) {
        return;
      }

      item.classList.add("open");
      answer.style.maxHeight = `${answer.scrollHeight}px`;
      question.setAttribute("aria-expanded", "true");
      if (icon) icon.textContent = "−";
    });
  });
}
