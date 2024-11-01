"use strict";
const mobileMenu = document.getElementById("mobile-menu");
const mobileNav = document.querySelector(".mobile-nav");

mobileMenu.addEventListener("click", () => {
  mobileNav.classList.toggle("active");
});
