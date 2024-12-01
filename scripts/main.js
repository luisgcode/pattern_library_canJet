'use strict';
const mobileMenu = document.getElementById('mobile-menu');
const mobileNav = document.querySelector('.mobile-nav');

if (mobileMenu && mobileNav) {
  mobileMenu.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');

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
