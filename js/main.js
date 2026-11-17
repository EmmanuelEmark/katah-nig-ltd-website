
document.addEventListener("DOMContentLoaded", () => {
  // Company contact details.
  const WHATSAPP_NUMBER = "2348037093759";
  const COMPANY_NAME = "EMMIMEH NIG. LTD.";

  // Automatically update the copyright year.
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // Mobile navigation menu.
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");

  if (menuButton && nav) {
    menuButton.setAttribute("aria-expanded", "false");

    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    // Close the mobile menu when a navigation link is selected.
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });

    // Close the mobile menu when clicking outside it.
    document.addEventListener("click", (event) => {
      if (
        !nav.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        nav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Services dropdown.
  document.querySelectorAll(".nav-drop-button").forEach((button) => {
    const dropdown = button.closest(".nav-dropdown");

    if (!dropdown) return;

    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", (event) => {
      event.stopPropagation();

      const isOpen = dropdown.classList.toggle("open");
      button.setAttribute("aria-expanded", String(isOpen));
    });

    // Close the dropdown when a link inside it is selected.
    dropdown.querySelectorAll(".dropdown-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        dropdown.classList.remove("open");
        button.setAttribute("aria-expanded", "false");
      });
    });

    // Support closing the dropdown with Escape.
    button.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        dropdown.classList.remove("open");
        button.setAttribute("aria-expanded", "false");
        button.focus();
      }
    });
  });

  // Homepage hero image slider.
  const heroSlides = Array.from(
    document.querySelectorAll(".hero-photo.hero-slide")
  );
  const previousButton = document.querySelector(".hero-prev");
  const nextButton = document.querySelector(".hero-next");
  const indicators = Array.from(
    document.querySelectorAll(".hero-indicator")
  );

  if (heroSlides.length > 0) {
    let currentSlide = heroSlides.findIndex((slide) =>
      slide.classList.contains("is-active")
    );

    if (currentSlide < 0) currentSlide = 0;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    let sliderTimer = null;

    function showSlide(index) {
      currentSlide = (index + heroSlides.length) % heroSlides.length;

      heroSlides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === currentSlide;

        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
      });

      indicators.forEach((indicator, indicatorIndex) => {
        const isActive = indicatorIndex === currentSlide;

        indicator.classList.toggle("is-active", isActive);
        indicator.setAttribute("aria-pressed", String(isActive));
      });
    }

    function stopSlider() {
      if (sliderTimer !== null) {
        window.clearInterval(sliderTimer);
        sliderTimer = null;
      }
    }

    function startSlider() {
      stopSlider();

      // Respect visitors who prefer reduced motion.
      if (reducedMotion.matches || heroSlides.length < 2) return;

      sliderTimer = window.setInterval(() => {
        showSlide(currentSlide + 1);
      }, 6000);
    }

    function goToSlide(index) {
      showSlide(index);
      startSlider();
    }

    if (previousButton) {
      previousButton.addEventListener("click", () => {
        goToSlide(currentSlide - 1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        goToSlide(currentSlide + 1);
      });
    }

    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        goToSlide(index);
      });
    });

    // Restart automatic sliding if the visitor changes motion preference.
    if (typeof reducedMotion.addEventListener === "function") {
      reducedMotion.addEventListener("change", startSlider);
    }

    // Pause automatic sliding while the visitor is away from the tab.
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopSlider();
      } else {
        startSlider();
      }
    });

    showSlide(currentSlide);
    startSlider();
  }

  // Reveal content when it enters the visitor's screen.
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Automatically select a service on the quotation page
  // when a visitor arrives from a service page.
  const serviceSelect = document.querySelector("#service-select");

  if (serviceSelect) {
    const requested = new URLSearchParams(
      window.location.search
    ).get("service");

    const serviceMap = {
      electrical: "Electrical installations",
      mechanical: "Mechanical installations",
      plumbing: "Plumbing installations",
      drawings: "M&E services drawings / AutoCAD",
      supply: "Engineering materials supply"
    };

    if (requested && serviceMap[requested]) {
      serviceSelect.value = serviceMap[requested];
    }
  }

  // Prepare quotation form enquiries for WhatsApp.
  // Visitors must manually attach drawings or BOQs in WhatsApp.
  const form = document.querySelector("#quote-form");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      const data = new FormData(form);

      const lines = [
        `Hello ${COMPANY_NAME}, I would like to request a quotation.`,
        "",
        `Name / Company: ${data.get("name")}`,
        `Phone: ${data.get("phone")}`,
        `Email: ${data.get("email") || "Not provided"}`,
        `Service: ${data.get("service")}`,
        `Project location: ${data.get("location") || "Not provided"}`,
        `Project details: ${data.get("details")}`,
        "",
        "Please let me know the next steps."
      ];

      const feedback = document.querySelector("#form-feedback");

      if (feedback) {
        feedback.textContent =
          "WhatsApp will open with your enquiry. Review the message and press Send. Attach any drawing or BOQ manually in the chat.";
      }

      const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
          lines.join("\n")
        )}`;

      window.open(whatsappURL, "_blank", "noopener,noreferrer");
    });
  }
});
