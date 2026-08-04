<<<<<<< HEAD
// ---------------------------------------------------------------
// Mobile nav toggle: shows/hides the stacked link list on small
// screens, swaps the hamburger icon for a close (X) icon, and
// keeps aria-expanded in sync for screen readers.
// ---------------------------------------------------------------
(function () {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (!toggle || !links) return;

  const iconOpen = toggle.querySelector('.icon-open');
  const iconClose = toggle.querySelector('.icon-close');

  function setMenu(isOpen) {
    links.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    iconOpen.style.display = isOpen ? 'none' : '';
    iconClose.style.display = isOpen ? '' : 'none';
  }

  toggle.addEventListener('click', () => {
    setMenu(!links.classList.contains('open'));
  });

  // Close the menu after tapping a link (so it doesn't stay open
  // after the page scrolls to the target section).
  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  // Close the menu if the viewport is resized back to desktop width.
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) setMenu(false);
  });
})();

// ---------------------------------------------------------------
// Active link highlighting: adds an "active" class to whichever
// nav link corresponds to the section currently in view.
// ---------------------------------------------------------------
(function () {
  const sections = ['about', 'menu', 'reviews', 'gallery', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' } // triggers when a section crosses the middle of the viewport
  );

  sections.forEach((section) => observer.observe(section));
})();

// ---------------------------------------------------------------
// Scrolled-header shadow: adds a subtle shadow to the sticky
// header once the page has scrolled past the hero, so it reads
// as "lifted" above the content instead of blending in.
// ---------------------------------------------------------------
(function () {
  const header = document.querySelector('header');
  if (!header) return;

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // set initial state on load
=======
// ---------------------------------------------------------------
// Mobile nav toggle: shows/hides the stacked link list on small
// screens, swaps the hamburger icon for a close (X) icon, and
// keeps aria-expanded in sync for screen readers.
// ---------------------------------------------------------------
(function () {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (!toggle || !links) return;

  const iconOpen = toggle.querySelector('.icon-open');
  const iconClose = toggle.querySelector('.icon-close');

  function setMenu(isOpen) {
    links.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    iconOpen.style.display = isOpen ? 'none' : '';
    iconClose.style.display = isOpen ? '' : 'none';
  }

  toggle.addEventListener('click', () => {
    setMenu(!links.classList.contains('open'));
  });

  // Close the menu after tapping a link (so it doesn't stay open
  // after the page scrolls to the target section).
  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  // Close the menu if the viewport is resized back to desktop width.
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) setMenu(false);
  });
})();

// ---------------------------------------------------------------
// Active link highlighting: adds an "active" class to whichever
// nav link corresponds to the section currently in view.
// ---------------------------------------------------------------
(function () {
  const sections = ['about', 'menu', 'reviews', 'gallery', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' } // triggers when a section crosses the middle of the viewport
  );

  sections.forEach((section) => observer.observe(section));
})();

// ---------------------------------------------------------------
// Scrolled-header shadow: adds a subtle shadow to the sticky
// header once the page has scrolled past the hero, so it reads
// as "lifted" above the content instead of blending in.
// ---------------------------------------------------------------
(function () {
  const header = document.querySelector('header');
  if (!header) return;

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // set initial state on load
>>>>>>> 55509614596dbafe063a890beb255f20e13763ea
})();