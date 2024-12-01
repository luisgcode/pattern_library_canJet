'use strict';

document.addEventListener('DOMContentLoaded', () => {});

document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNav = document.querySelector('.mobile-nav');
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const sidebar = document.getElementById('sidebar');
  const closeBtn = document.getElementById('close-btn');
  const mainContent = document.getElementById('main-content');

  if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      sidebar.classList.remove('active');
    });
  }

  if (mainContent) {
    mainContent.addEventListener('click', (event) => {
      if (
        sidebar.classList.contains('active') &&
        !sidebar.contains(event.target)
      ) {
        sidebar.classList.remove('active');
      }
    });
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  });

  if (mobileMenu && mobileNav) {
    mobileMenu.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
    });
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });
});
