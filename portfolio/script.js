/* ─────────────────────────────────────────────────────────────
   script.js — Portfolio interactions
   ───────────────────────────────────────────────────────────── */

(() => {
  'use strict';

  /* ── Loader ─────────────────────────────────────────────── */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('gone'), 600);
  });

  /* ── Header: scroll shadow + active nav ─────────────────── */
  const header = document.getElementById('top');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a');

  function onScroll() {
    // shadow
    header.classList.toggle('scrolled', window.scrollY > 40);

    // active nav link
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });

    // progress bar
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const pf = document.getElementById('pf');
    if (pf) pf.style.strokeDashoffset = 1 - pct;
    const prog = document.getElementById('prog');
    if (prog) prog.classList.toggle('show', window.scrollY > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Progress / back-to-top ──────────────────────────────── */
  const prog = document.getElementById('prog');
  if (prog) {
    prog.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Burger menu ─────────────────────────────────────────── */
  const burger = document.getElementById('burger');
  const nav    = document.getElementById('main-nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', !open);
      nav.classList.toggle('open', !open);
      document.body.style.overflow = !open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.setAttribute('aria-expanded', 'false');
        nav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Reveal on scroll (IntersectionObserver) ─────────────── */
  const reveals = document.querySelectorAll('[data-reveal]');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.querySelectorAll('[data-reveal]')]
          : [];
        const idx = siblings.indexOf(entry.target);
        const delay = Math.min(idx * 80, 400);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  reveals.forEach(el => revealObs.observe(el));

  /* ── Hero headline word-by-word reveal ───────────────────── */
  const heroWords = document.querySelectorAll('.hero-h .w');
  heroWords.forEach((w, i) => {
    setTimeout(() => w.classList.add('in'), 500 + i * 150);
  });

  /* ── Animated typing bot messages ───────────────────────── */
  (function botAnimation() {
    const conversations = [
      [
        { type: 'bot',  text: 'Hi! I\'m an AI System. What do you need automated?' },
        { type: 'user', text: 'Lead qualification & follow-ups' },
        { type: 'bot',  text: 'On it! I\'ll build an agent pipeline for that. 🚀' },
      ],
      [
        { type: 'bot',  text: 'Do you need a WhatsApp agent or a web AI system?' },
        { type: 'user', text: 'Both, with CRM sync' },
        { type: 'bot',  text: 'Perfect — multi-agent setup with full CRM integration!' },
      ],
      [
        { type: 'bot',  text: 'How many leads do you receive per month?' },
        { type: 'user', text: 'About 200–300' },
        { type: 'bot',  text: 'I can automate 100% of that. Let\'s build your AI System!' },
      ],
      [
        { type: 'bot',  text: 'Want an AI agent that searches, reasons & acts?' },
        { type: 'user', text: 'Yes — fully autonomous!' },
        { type: 'bot',  text: 'Let\'s deploy a LangChain agent with tool-calling. ⚡' },
      ],
    ];

    const botBody = document.querySelector('.bot-body');
    if (!botBody) return;

    let convIdx = 0;

    function renderConversation(conv) {
      botBody.innerHTML = '';
      let delay = 0;

      conv.forEach((msg, i) => {
        const isLast = i === conv.length - 1;

        // show typing indicator before bot messages
        if (msg.type === 'bot') {
          delay += 300;
          setTimeout(() => {
            const typing = document.createElement('div');
            typing.className = 'msg bot-msg typing';
            typing.innerHTML = '<span><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>';
            botBody.appendChild(typing);
          }, delay);
          delay += 900;
          setTimeout(() => {
            const typing = botBody.querySelector('.typing');
            if (typing) typing.remove();
            const div = document.createElement('div');
            div.className = `msg bot-msg`;
            div.innerHTML = `<span>${msg.text}</span>`;
            div.style.opacity = '0';
            div.style.transform = 'translateY(8px) scale(0.96)';
            div.style.transition = 'opacity .35s cubic-bezier(.16,1,.3,1), transform .35s cubic-bezier(.16,1,.3,1)';
            botBody.appendChild(div);
            requestAnimationFrame(() => {
              div.style.opacity = '1';
              div.style.transform = 'translateY(0) scale(1)';
            });
          }, delay);
        } else {
          delay += 600;
          setTimeout(() => {
            const div = document.createElement('div');
            div.className = `msg user-msg`;
            div.innerHTML = `<span>${msg.text}</span>`;
            div.style.opacity = '0';
            div.style.transform = 'translateY(8px) scale(0.96)';
            div.style.transition = 'opacity .35s cubic-bezier(.16,1,.3,1), transform .35s cubic-bezier(.16,1,.3,1)';
            botBody.appendChild(div);
            requestAnimationFrame(() => {
              div.style.opacity = '1';
              div.style.transform = 'translateY(0) scale(1)';
            });
          }, delay);
        }

        if (isLast) {
          delay += 2600;
          setTimeout(() => {
            convIdx = (convIdx + 1) % conversations.length;
            renderConversation(conversations[convIdx]);
          }, delay);
        }
      });
    }

    // start after loader fades
    setTimeout(() => renderConversation(conversations[0]), 1200);
  })();

  /* ── Tilt with smooth interpolation ──────────────────────── */
  function applyTilt(card, maxRotate) {
    let ticking = false;
    card.addEventListener('mousemove', (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width  - .5;
          const y = (e.clientY - rect.top)  / rect.height - .5;
          card.style.transition = 'transform .15s ease-out, box-shadow .35s cubic-bezier(.16,1,.3,1)';
          card.style.transform = `translateY(-8px) rotateX(${-y * maxRotate}deg) rotateY(${x * maxRotate}deg)`;
          ticking = false;
        });
        ticking = true;
      }
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform .45s cubic-bezier(.16,1,.3,1), box-shadow .45s cubic-bezier(.16,1,.3,1)';
      card.style.transform = '';
    });
  }

  document.querySelectorAll('.skill-card').forEach(card => applyTilt(card, 6));
  document.querySelectorAll('.proj-card:not(.featured)').forEach(card => applyTilt(card, 5));

  /* ── Marquee: pause on hover ─────────────────────────────── */
  const mqt = document.querySelector('.mq-t');
  if (mqt) {
    mqt.addEventListener('mouseenter', () => mqt.style.animationPlayState = 'paused');
    mqt.addEventListener('mouseleave', () => mqt.style.animationPlayState = '');
  }

  /* ── Contact Form (AJAX submission) ──────────────────────── */
  const contactForm = document.getElementById('contact-form');
  const formStatus  = document.getElementById('form-status');
  const submitBtn   = document.getElementById('form-submit-btn');

  if (contactForm && formStatus && submitBtn) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending Inquiry...</span><i>⏳</i>';
      formStatus.className = 'form-status';
      formStatus.style.display = 'none';

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          formStatus.className = 'form-status success';
          formStatus.textContent = 'Thank you! Your project inquiry has been sent to Saeed Ahmad. I will review your requirements and respond shortly.';
          contactForm.reset();
        } else {
          throw new Error('Network response not ok');
        }
      } catch (err) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Could not send right now. Please try again or refresh the page.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    });
  }

  /* ── Interactive Spotlight (cursor glow tracking) ────────── */
  let mouseFrame;
  window.addEventListener('mousemove', (e) => {
    if (mouseFrame) cancelAnimationFrame(mouseFrame);
    mouseFrame = requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    });
  }, { passive: true });

  /* ── 3D Card Tilt on Hover ───────────────────────────────── */
  const tiltCards = document.querySelectorAll('.proj-card, .contact-fast-card');
  tiltCards.forEach(card => {
    let cardBounds;

    card.addEventListener('mouseenter', () => {
      cardBounds = card.getBoundingClientRect();
    });

    card.addEventListener('mousemove', (e) => {
      if (!cardBounds) cardBounds = card.getBoundingClientRect();
      const x = e.clientX - cardBounds.left;
      const y = e.clientY - cardBounds.top;
      const centerX = cardBounds.width / 2;
      const centerY = cardBounds.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      cardBounds = null;
    });
  });

  /* ── Smooth Number Counter on Scroll ─────────────────────── */
  const counterElements = document.querySelectorAll('[data-counter]');
  if ('IntersectionObserver' in window && counterElements.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        observer.unobserve(el);

        const target = parseFloat(el.getAttribute('data-counter')) || 0;
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1400; // ms
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic: 1 - pow(1 - progress, 3)
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = (target * easeProgress).toFixed(decimals);

          el.textContent = `${prefix}${currentVal}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
          }
        }

        requestAnimationFrame(updateCounter);
      });
    }, { threshold: 0.3 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

})();
