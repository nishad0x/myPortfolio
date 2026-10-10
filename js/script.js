// Toggle mobile menu smoothly
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  if (!menu || !icon) return;
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  const hamburgerMenu = document.querySelector(".hamburger-menu");
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  if (
    menu &&
    menu.classList.contains("open") &&
    hamburgerMenu &&
    !hamburgerMenu.contains(e.target)
  ) {
    menu.classList.remove("open");
    if (icon) icon.classList.remove("open");
  }
});

// Close mobile menu or lightbox modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    if (menu && menu.classList.contains("open")) {
      menu.classList.remove("open");
      if (icon) icon.classList.remove("open");
    }
    closeLightbox();
  }
});

// Lightbox Modal Functions
function openLightbox(src, title, category, desc) {
  const modal = document.getElementById("creative-lightbox");
  const img = document.getElementById("lightbox-img");
  const titleEl = document.getElementById("lightbox-title");
  const catEl = document.getElementById("lightbox-category");
  const descEl = document.getElementById("lightbox-desc");

  if (!modal || !img) return;

  img.src = src;
  img.alt = title || "Photography capture";
  if (titleEl) titleEl.textContent = title;
  if (catEl) catEl.textContent = category;
  if (descEl) descEl.textContent = desc;

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const modal = document.getElementById("creative-lightbox");
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;

// Smoothly scroll to a section by ID, taking dynamic sticky header height into account
function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;

  const desktopNav = document.getElementById("desktop-nav");
  const hamburgerNav = document.getElementById("hamburger-nav");
  let headerHeight = 80;

  if (desktopNav && window.getComputedStyle(desktopNav).display !== "none") {
    headerHeight = desktopNav.offsetHeight;
  } else if (hamburgerNav) {
    headerHeight = hamburgerNav.offsetHeight;
  }

  const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - headerHeight;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth"
  });

  if (window.history && window.history.pushState) {
    window.history.pushState(null, null, "#" + id);
  }
}

// Make functions globally available
window.scrollToSection = scrollToSection;
window.toggleMenu = toggleMenu;

// Initialize smooth interactions on DOM load
document.addEventListener("DOMContentLoaded", () => {
  // Intercept all internal anchor clicks for smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#" || href === "") return;
      const targetId = href.replace(/^#/, "");
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();
        scrollToSection(targetId);

        // Smoothly close mobile menu if it is open
        const menu = document.querySelector(".menu-links");
        const icon = document.querySelector(".hamburger-icon");
        if (menu && menu.classList.contains("open")) {
          menu.classList.remove("open");
          if (icon) icon.classList.remove("open");
        }
      }
    });
  });

  // Sticky Navbar shadow, scroll progress bar & back-to-top button
  const desktopNav = document.getElementById("desktop-nav");
  const hamburgerNav = document.getElementById("hamburger-nav");
  const scrollProgress = document.getElementById("scroll-progress");
  const backToTopBtn = document.getElementById("back-to-top");

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  let ticking = false;
  function onScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    // Sticky nav elevation on scroll
    if (scrollTop > 20) {
      desktopNav?.classList.add("scrolled");
      hamburgerNav?.classList.add("scrolled");
    } else {
      desktopNav?.classList.remove("scrolled");
      hamburgerNav?.classList.remove("scrolled");
    }

    // Scroll Progress Bar
    if (scrollProgress && docHeight > 0) {
      const progress = Math.min((scrollTop / docHeight) * 100, 100);
      scrollProgress.style.width = `${progress}%`;
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollTop > 350) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }

    // Active Navbar link indicator (Scrollspy)
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
    const scrollPos = scrollTop + 140;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial call to set active nav link and scrollbar state
  onScroll();

  // Creative Gallery Filter Logic
  const filterBtns = document.querySelectorAll(".creative-filter-bar .filter-btn");
  const galleryItems = document.querySelectorAll(".creative-gallery-item");
  const ctaTitle = document.getElementById("unsplash-cta-title");
  const ctaSub = document.getElementById("unsplash-cta-sub");
  const ctaBtnText = document.getElementById("unsplash-cta-btn-text");

  function applyCategoryFilter(filter) {
    filterBtns.forEach((b) => {
      if (b.getAttribute("data-filter") === filter) {
        b.classList.add("active");
      } else {
        b.classList.remove("active");
      }
    });

    galleryItems.forEach((item) => {
      const itemCat = item.getAttribute("data-category");
      if (filter === "all" || itemCat === filter) {
        item.style.display = "block";
        setTimeout(() => {
          item.style.opacity = "1";
          item.style.transform = "scale(1)";
        }, 15);
      } else {
        item.style.opacity = "0";
        item.style.transform = "scale(0.96)";
        setTimeout(() => {
          item.style.display = "none";
        }, 220);
      }
    });

    // Update dynamic Unsplash CTA banner content
    if (filter === "travel-nature") {
      if (ctaTitle) ctaTitle.innerHTML = 'Looking for more <span class="highlight-text">Travel & Nature</span> captures?';
      if (ctaSub) ctaSub.textContent = "Explore high-resolution Himalayan landscapes, wilderness series, and mountain light stories directly on my Unsplash profile.";
      if (ctaBtnText) ctaBtnText.textContent = "Explore Travel & Nature on Unsplash";
    } else if (filter === "lifestyle-living") {
      if (ctaTitle) ctaTitle.innerHTML = 'Looking for more <span class="highlight-text">Lifestyle & Living</span> captures?';
      if (ctaSub) ctaSub.textContent = "Discover minimalist everyday frames, coffee aesthetics, and quiet urban rhythms on my Unsplash profile.";
      if (ctaBtnText) ctaBtnText.textContent = "Explore Lifestyle & Living on Unsplash";
    } else {
      if (ctaTitle) ctaTitle.innerHTML = 'Explore the Full Photography Collection';
      if (ctaSub) ctaSub.textContent = "Browse high-resolution captures, visual journals, and editorial features directly on my Unsplash profile.";
      if (ctaBtnText) ctaBtnText.textContent = "Visit @nishad0x on Unsplash";
    }
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");
      applyCategoryFilter(filter);
    });
  });

  // Enable interactive stat items in the Unsplash profile card to switch categories
  document.querySelectorAll(".interactive-stat[data-target-filter]").forEach((stat) => {
    stat.addEventListener("click", () => {
      const targetFilter = stat.getAttribute("data-target-filter");
      applyCategoryFilter(targetFilter);
      const filterBar = document.querySelector(".creative-filter-bar");
      if (filterBar) {
        filterBar.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  });

  // Scroll Reveal Animations with IntersectionObserver
  if ("IntersectionObserver" in window) {
    const revealTargets = document.querySelectorAll(
      "section:not(#profile) .section__text__p1, " +
      "section:not(#profile) .title, " +
      "section:not(#profile) .section__pic-container, " +
      "section:not(#profile) .details-container, " +
      "section:not(#profile) .text-container, " +
      "section:not(#profile) .contact-info-upper-container, " +
      "section:not(#profile) .creative-filter-bar, " +
      "section:not(#profile) .creative-gallery-item, " +
      "section:not(#profile) .creative-unsplash-cta-box"
    );

    revealTargets.forEach((el) => {
      el.classList.add("reveal");
    });

    // Stagger cards in containers
    document.querySelectorAll(".about-containers").forEach((container) => {
      const cards = container.querySelectorAll(".details-container");
      cards.forEach((card, index) => {
        card.classList.add(`delay-${(index % 3) + 1}`);
      });
    });

    // Stagger gallery items
    document.querySelectorAll(".creative-gallery-grid").forEach((grid) => {
      const items = grid.querySelectorAll(".creative-gallery-item");
      items.forEach((item, index) => {
        item.classList.add(`delay-${(index % 2) + 1}`);
      });
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.1
      }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  }
});