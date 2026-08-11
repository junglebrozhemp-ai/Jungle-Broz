document.addEventListener('DOMContentLoaded', function () {

  /* AGE GATE */
  var ageGate = document.getElementById('ageGate');
  var ageYes = document.getElementById('ageYes');
  var ageNo = document.getElementById('ageNo');

  if (ageGate) {
    var verified = sessionStorage.getItem('jb_age_verified');
    if (verified === 'true') {
      ageGate.hidden = true;
    } else {
      document.body.style.overflow = 'hidden';
    }
    ageYes.addEventListener('click', function () {
      sessionStorage.setItem('jb_age_verified', 'true');
      ageGate.hidden = true;
      document.body.style.overflow = '';
    });
    ageNo.addEventListener('click', function () {
      window.location.href = 'https://www.google.com';
    });
  }

  /* STICKY HEADER */
  var header = document.getElementById('siteHeader');
  function updateHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* MOBILE NAV */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');
  navToggle.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* SCROLL REVEAL */
  var revealEls = document.querySelectorAll('.reveal');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* PRODUCT FILTER */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var productCards = document.querySelectorAll('.product-card');
  var emptyState = document.getElementById('emptyState');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var filter = btn.getAttribute('data-filter');
      var visibleCount = 0;
      productCards.forEach(function (card) {
        var match = filter === 'all' || card.getAttribute('data-type') === filter;
        card.hidden = !match;
        if (match) visibleCount++;
      });
      emptyState.hidden = visibleCount !== 0;
    });
  });

  /* TESTIMONIAL CAROUSEL */
  var slides = document.querySelectorAll('.testimonial__slide');
  var dotsWrap = document.getElementById('testimonialDots');
  var prevBtn = document.getElementById('prevReview');
  var nextBtn = document.getElementById('nextReview');
  var current = 0;
  var autoplayTimer;

  slides.forEach(function (_, i) {
    var dot = document.createElement('button');
    dot.setAttribute('aria-label', 'Show review ' + (i + 1));
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', function () { goToSlide(i); });
    dotsWrap.appendChild(dot);
  });
  var dots = dotsWrap.querySelectorAll('button');

  function goToSlide(index) {
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');
    restartAutoplay();
  }
  function restartAutoplay() {
    clearInterval(autoplayTimer);
    if (!prefersReducedMotion) {
      autoplayTimer = setInterval(function () { goToSlide(current + 1); }, 6000);
    }
  }
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', function () { goToSlide(current - 1); });
    nextBtn.addEventListener('click', function () { goToSlide(current + 1); });
  }
  restartAutoplay();

  /* NEWSLETTER FORM */
  var newsletterForm = document.getElementById('newsletterForm');
  var newsletterMsg = document.getElementById('newsletterMsg');
  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('newsletterEmail').value.trim();
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(email)) {
      newsletterMsg.textContent = "You're on the list \u2014 watch your inbox for the next drop.";
      newsletterForm.reset();
    } else {
      newsletterMsg.textContent = 'Please enter a valid email address.';
    }
  });

  /* CONTACT FORM */
  var contactForm = document.getElementById('contactForm');
  var contactMsg = document.getElementById('contactMsg');
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;
    var fields = [
      { el: document.getElementById('cName'), test: function (v) { return v.trim().length > 1; }, msg: 'Please enter your name.' },
      { el: document.getElementById('cEmail'), test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }, msg: 'Please enter a valid email.' },
      { el: document.getElementById('cMessage'), test: function (v) { return v.trim().length > 5; }, msg: 'Message is a little short.' },
      { el: document.getElementById('cAge'), test: function (v, el) { return el.checked; }, msg: 'You must confirm you are 21 or older.' }
    ];
    fields.forEach(function (f) {
      var wrapper = f.el.closest('.field');
      var errorEl = contactForm.querySelector('[data-error-for="' + f.el.id + '"]');
      var ok = f.test(f.el.value, f.el);
      wrapper.classList.toggle('has-error', !ok);
      errorEl.textContent = ok ? '' : f.msg;
      if (!ok) valid = false;
    });
    if (valid) {
      contactMsg.textContent = "Message sent \u2014 a Broz will get back to you shortly.";
      contactForm.reset();
    } else {
      contactMsg.textContent = '';
    }
  });

  /* BACK TO TOP */
  var backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', function () {
    backToTop.classList.toggle('is-visible', window.scrollY > 500);
  }, { passive: true });
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* FOOTER YEAR */
  document.getElementById('year').textContent = new Date().getFullYear();
});
