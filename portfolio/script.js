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
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger siblings
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.querySelectorAll('[data-reveal]')]
          : [];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => revealObs.observe(el));

  /* ── Hero headline word-by-word reveal ───────────────────── */
  const heroWords = document.querySelectorAll('.hero-h .w');
  heroWords.forEach((w, i) => {
    setTimeout(() => w.classList.add('in'), 700 + i * 160);
  });

  /* ── Animated typing bot messages ───────────────────────── */
  (function botAnimation() {
    const conversations = [
      [
        { type: 'bot',  text: 'Hi! I qualify your leads 24/7. What\'s your budget?' },
        { type: 'user', text: 'Around $500–$2000/month' },
        { type: 'bot',  text: 'Perfect! You\'re a great fit. Let me connect you now.' },
      ],
      [
        { type: 'bot',  text: 'Do you need a WhatsApp bot or a website chatbot?' },
        { type: 'user', text: 'Both, actually' },
        { type: 'bot',  text: 'Great! I can set up both with full CRM integration.' },
      ],
      [
        { type: 'bot',  text: 'How many leads do you receive per month?' },
        { type: 'user', text: 'About 200–300' },
        { type: 'bot',  text: '100% automation is possible. Let\'s build your system!' },
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
            div.style.transform = 'translateY(6px)';
            div.style.transition = 'opacity .3s, transform .3s';
            botBody.appendChild(div);
            requestAnimationFrame(() => {
              div.style.opacity = '1';
              div.style.transform = 'translateY(0)';
            });
          }, delay);
        } else {
          delay += 600;
          setTimeout(() => {
            const div = document.createElement('div');
            div.className = `msg user-msg`;
            div.innerHTML = `<span>${msg.text}</span>`;
            div.style.opacity = '0';
            div.style.transform = 'translateY(6px)';
            div.style.transition = 'opacity .3s, transform .3s';
            botBody.appendChild(div);
            requestAnimationFrame(() => {
              div.style.opacity = '1';
              div.style.transform = 'translateY(0)';
            });
          }, delay);
        }

        if (isLast) {
          delay += 2400;
          setTimeout(() => {
            convIdx = (convIdx + 1) % conversations.length;
            renderConversation(conversations[convIdx]);
          }, delay);
        }
      });
    }

    // start after loader fades
    setTimeout(() => renderConversation(conversations[0]), 1400);
  })();

  /* ── Skill cards tilt on hover ───────────────────────────── */
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - .5;
      const y = (e.clientY - rect.top)  / rect.height - .5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── Project cards tilt ──────────────────────────────────── */
  document.querySelectorAll('.proj-card:not(.featured)').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - .5;
      const y = (e.clientY - rect.top)  / rect.height - .5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── Marquee: pause on hover ─────────────────────────────── */
  const mqt = document.querySelector('.mq-t');
  if (mqt) {
    mqt.addEventListener('mouseenter', () => mqt.style.animationPlayState = 'paused');
    mqt.addEventListener('mouseleave', () => mqt.style.animationPlayState = '');
  }

})();
