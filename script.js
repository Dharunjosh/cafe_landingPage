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
  const sections = ['about', 'order', 'reviews', 'gallery', 'contact']
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
})();

// ---------------------------------------------------------------
// Order cart: clicking a menu item adds it to an in-memory cart.
// The cart list, running total, and Place/Clear Order buttons all
// stay in sync with this single `cart` object as the source of
// truth. Nothing here touches a server — it's a fully working
// client-side ordering flow, ready to be wired to a real backend
// later (see the comment above `placeOrder`).
// ---------------------------------------------------------------
(function () {
  const addButtons = document.querySelectorAll('.r-add');
  const cartList = document.getElementById('cart-list');
  const cartEmptyNote = document.getElementById('cart-empty');
  const totalRow = document.getElementById('cart-total-row');
  const totalEl = document.getElementById('cart-total');
  const placeBtn = document.getElementById('place-order-btn');
  const clearBtn = document.getElementById('clear-order-btn');
  const confirmEl = document.getElementById('order-confirm');

  if (!addButtons.length || !cartList || !placeBtn) return;

  // cart is keyed by item name, e.g. { "Filter Kaapi": { price: 60, qty: 2 } }
  const cart = {};

  function render() {
    const names = Object.keys(cart);
    cartList.innerHTML = '';
    confirmEl.style.display = 'none';

    if (!names.length) {
      cartEmptyNote.style.display = '';
      totalRow.style.display = 'none';
      placeBtn.disabled = true;
      clearBtn.style.display = 'none';
      return;
    }

    cartEmptyNote.style.display = 'none';
    totalRow.style.display = '';
    placeBtn.disabled = false;
    clearBtn.style.display = '';

    let total = 0;
    names.forEach((name) => {
      const item = cart[name];
      total += item.price * item.qty;

      const row = document.createElement('div');
      row.className = 'cart-row';
      row.innerHTML = `
        <span class="cart-row-name">${name} <span style="color:#6a6156;">₹${item.price}</span></span>
        <span class="cart-qty">
          <button type="button" data-action="dec" aria-label="Remove one ${name}">−</button>
          <span>${item.qty}</span>
          <button type="button" data-action="inc" aria-label="Add one more ${name}">+</button>
          <button type="button" class="cart-row-remove" data-action="remove">remove</button>
        </span>
      `;
      row.querySelector('[data-action="inc"]').addEventListener('click', () => {
        cart[name].qty += 1;
        render();
      });
      row.querySelector('[data-action="dec"]').addEventListener('click', () => {
        cart[name].qty -= 1;
        if (cart[name].qty <= 0) delete cart[name];
        render();
      });
      row.querySelector('[data-action="remove"]').addEventListener('click', () => {
        delete cart[name];
        render();
      });
      cartList.appendChild(row);
    });

    totalEl.textContent = `₹${total}`;
  }

  addButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      const price = Number(btn.getAttribute('data-price'));
      if (!cart[name]) cart[name] = { price, qty: 0 };
      cart[name].qty += 1;
      render();

      // Small nudge so it's obvious the tap registered.
      btn.style.background = 'rgba(63,93,69,0.18)';
      setTimeout(() => { btn.style.background = ''; }, 200);
    });
  });

  clearBtn.addEventListener('click', () => {
    Object.keys(cart).forEach((name) => delete cart[name]);
    render();
  });

  // NOTE: this simulates placing an order entirely in the browser.
  // To send real orders somewhere, replace the body of this function
  // with a fetch() POST to your ordering backend/API (or a service
  // like Formspree), and only show the confirmation after that
  // request succeeds.
  function placeOrder() {
    const names = Object.keys(cart);
    if (!names.length) return;

    const total = names.reduce((sum, n) => sum + cart[n].price * cart[n].qty, 0);
    const orderNumber = Math.floor(1000 + Math.random() * 9000);

    Object.keys(cart).forEach((name) => delete cart[name]);
    render(); // clears the cart display and hides the confirmation element

    confirmEl.textContent = `Order #${orderNumber} placed — ₹${total} · we'll have it ready shortly.`;
    confirmEl.style.display = ''; // show it again, now that render() has finished resetting the UI
  }

  placeBtn.addEventListener('click', placeOrder);

  render(); // set initial empty state
})();

// ---------------------------------------------------------------
// Form handling: validates required fields, shows an inline
// success/error message instead of a browser alert(), and briefly
// disables the submit button so it can't be double-submitted.
//
// NOTE: like the cart above, this simulates a successful submission
// entirely client-side. To actually deliver these submissions,
// point the fetch() calls below at a real endpoint (e.g. a
// Formspree form URL) and only show the success message once that
// request resolves.
// ---------------------------------------------------------------
function wireForm(formId, statusId, successMessage) {
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);
  if (!form || !status) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const requiredFields = form.querySelectorAll('[required]');
    let firstInvalid = null;

    requiredFields.forEach((field) => {
      const isEmpty = !field.value || !field.value.trim();
      field.classList.toggle('field-error', isEmpty);
      if (isEmpty && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      status.textContent = 'Please fill in all fields before submitting.';
      status.className = 'form-status error';
      firstInvalid.focus();
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    status.textContent = successMessage;
    status.className = 'form-status success';

    setTimeout(() => {
      form.reset();
      requiredFields.forEach((field) => field.classList.remove('field-error'));
      submitBtn.disabled = false;
    }, 1200);
  });

  // Clear the error highlight as soon as the person starts fixing a field.
  form.querySelectorAll('[required]').forEach((field) => {
    field.addEventListener('input', () => field.classList.remove('field-error'));
  });
}

wireForm('reservation-form', 'reservation-status', "Thanks — your table request has been sent, we'll confirm by text shortly.");
wireForm('contact-form', 'contact-status', "Thanks — we'll get back to you shortly.");