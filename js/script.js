'use strict';

/* =================================================================
   SOCIAL MEDIA & WHATSAPP SETTINGS — EDIT HERE ONLY
   Replace the placeholder strings below with the academy's real
   links/number. Every button and link on the page pulls from here.
   ================================================================= */
const SITE_CONFIG = {
  // WhatsApp number in international format, digits only, no "+", no spaces.
  // Example: "201001234567"
  WHATSAPP_NUMBER: '201039880177',

  // Pre-filled message opened alongside the WhatsApp chat.
  WHATSAPP_MESSAGE: 'مرحبًا، أنا مهتم/ة بكورس Python Development وحابب أعرف تفاصيل الحجز.',

  EMAIL: 'codexaacademy3@gmail.com',

  SOCIAL_LINKS: {
    facebook: 'https://www.facebook.com/profile.php?id=61590469304265',
    instagram: 'INSTAGRAM_URL',
    youtube: 'YOUTUBE_URL',
    linkedin: 'LINKEDIN_URL',
    website: 'WEBSITE_URL'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initSocialLinks();
  initHeaderScroll();
  initMobileNav();
  initSmoothScroll();
  initActiveNav();
  initAccordions();
  initScrollReveal();
  initFooterYear();
});

/* ---------------------------------------------------------------
   Wire up WhatsApp CTAs and social links from SITE_CONFIG
   --------------------------------------------------------------- */
function buildWhatsAppUrl() {
  const number = encodeURIComponent(SITE_CONFIG.WHATSAPP_NUMBER);
  const text = encodeURIComponent(SITE_CONFIG.WHATSAPP_MESSAGE);
  return `https://wa.me/${number}?text=${text}`;
}

function initSocialLinks() {
  const waUrl = buildWhatsAppUrl();

  document.querySelectorAll('[data-whatsapp-cta]').forEach((el) => {
    el.setAttribute('href', waUrl);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });

  document.querySelectorAll('[data-social]').forEach((el) => {
    const key = el.getAttribute('data-social');
    if (key === 'whatsapp') {
      el.setAttribute('href', waUrl);
      return;
    }
    if (key === 'email') {
      el.setAttribute('href', `mailto:${SITE_CONFIG.EMAIL}`);
      return;
    }
    const url = SITE_CONFIG.SOCIAL_LINKS[key];
    if (url) el.setAttribute('href', url);
  });
}

/* ---------------------------------------------------------------
   Sticky header shadow on scroll
   --------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const toggle = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

/* ---------------------------------------------------------------
   Mobile hamburger navigation
   --------------------------------------------------------------- */
function initMobileNav() {
  const btn = document.getElementById('hamburger-btn');
  const menu = document.getElementById('mobile-nav');
  if (!btn || !menu) return;

  const closeMenu = () => {
    btn.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
  };

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isOpen));
    menu.classList.toggle('is-open', !isOpen);
  });

  menu.querySelectorAll('[data-close-mobile]').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ---------------------------------------------------------------
   Smooth scrolling for in-page nav links, offset for sticky header
   --------------------------------------------------------------- */
function initSmoothScroll() {
  const header = document.getElementById('site-header');

  document.querySelectorAll('[data-nav]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const headerH = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerH + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ---------------------------------------------------------------
   Highlight the active nav link based on scroll position
   --------------------------------------------------------------- */
function initActiveNav() {
  const navLinks = Array.from(document.querySelectorAll('.nav-link[data-nav]'));
  if (!navLinks.length) return;

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!('IntersectionObserver' in window) || !sections.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------------------------------------------------------------
   Generic accordion behavior — powers both Course Levels and FAQ
   --------------------------------------------------------------- */
function initAccordions() {
  document.querySelectorAll('[data-accordion-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      const group = trigger.closest('.levels, .faq-list');

      if (group) {
        group.querySelectorAll('[data-accordion-trigger]').forEach((other) => {
          if (other !== trigger) other.setAttribute('aria-expanded', 'false');
        });
      }

      trigger.setAttribute('aria-expanded', String(!expanded));
    });
  });
}

/* ---------------------------------------------------------------
   Scroll-reveal animations
   --------------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------------
   Dynamic copyright year
   --------------------------------------------------------------- */
function initFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
