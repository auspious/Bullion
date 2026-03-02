/* ═══════════════════════════════════════════════════════════
   BULLION BOURSE — Interactive Script
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Initialize Lucide Icons ──
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ── Global Selectors ──
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  const navbar = document.getElementById('navbar');

  // ── Initialize GSAP Plugins ──
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Core Pillar "Assemble" Animation
    const pillars = document.querySelectorAll('.service-card');
    if (pillars.length > 0) {
      gsap.fromTo(pillars,
        {
          opacity: 0,
          y: 150,
          rotationX: 25,
          rotationY: -15,
          z: -200
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          rotationY: 0,
          z: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".services-section",
            start: "top 75%",
            end: "bottom 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    const visionCards = document.querySelectorAll('.vision-card');
    if (visionCards.length > 0) {
      gsap.fromTo(visionCards,
        { opacity: 0, scale: 0.85, y: 50 },
        {
          opacity: 1, scale: 1, y: 0,
          duration: 1, stagger: 0.2, ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".about-section",
            start: "top 60%"
          }
        }
      );
    }

    const modelPillars = document.querySelectorAll('.model-pillar');
    if (modelPillars.length > 0) {
      gsap.fromTo(modelPillars,
        { opacity: 0, scale: 0.5, y: 100 },
        {
          opacity: 1, scale: 1, y: 0,
          duration: 1.2, stagger: 0.2, ease: "elastic.out(1, 0.7)",
          scrollTrigger: {
            trigger: ".model-section",
            start: "top 60%"
          }
        }
      );
    }
  }

  // ── Preloader ──
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('hidden'), 1000);
    });
    // Fallback
    setTimeout(() => preloader.classList.add('hidden'), 3000);
  }

  // ── Combined & Throttled Scroll Handler ──
  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        handleScroll();
        isScrolling = false;
      });
      isScrolling = true;
    }
  }, { passive: true });

  function handleScroll() {
    const currentScroll = window.scrollY;

    // Navbar effect
    if (navbar) {
      if (currentScroll > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Nav Link Highlighting
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 200;
      if (currentScroll >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinksAll.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentSection}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // ── Mobile navigation toggle ──
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Scroll Reveal Animation ──
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ── Hero Canvas — Optimized Particle Mesh ──
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let mouse = { x: -1000, y: -1000 };

    function resizeCanvas() {
      const hero = document.querySelector('.hero');
      if (!hero) return;
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() < 0.2 ? 0 : Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() * 0.8) + 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.radius = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.pulseSpeed = Math.random() * 0.05 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x > canvas.width) {
          this.x = 0;
          this.y = Math.random() * canvas.height;
        }
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 150 * 150) {
          const dist = Math.sqrt(distSq);
          const force = (150 - dist) / 150;
          this.vx += (dx / dist) * force * 0.1;
          this.vy += (dy / dist) * force * 0.1;
        }
        this.pulsePhase += this.pulseSpeed;
      }
      draw() {
        const pulse = Math.sin(this.pulsePhase) * 0.4 + 0.6;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(252, 212, 98, ${this.opacity * pulse})`;
        ctx.fill();
        // Removed expensive shadowBlur
      }
    }

    function createParticles() {
      particles = [];
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 100);
      for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function drawConnections() {
      const maxDist = 140;
      const particleCount = particles.length;
      for (let i = 0; i < particleCount; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < maxDist * maxDist) {
            const dist = Math.sqrt(distSq);
            const opacity = (1 - dist / maxDist) * 0.08;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(252, 212, 98, ${opacity})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      drawConnections();
      animationFrameId = requestAnimationFrame(animate);
    }

    const hero = document.querySelector('.hero');
    let mouseActive = false;
    if (hero) {
      hero.addEventListener('mousemove', (e) => {
        if (!mouseActive) {
          requestAnimationFrame(() => {
            const rect = hero.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            mouseActive = false;
          });
          mouseActive = true;
        }
      }, { passive: true });

      hero.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
      }, { passive: true });
    }

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.to(".hero-content", {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
      gsap.to(".about-image-wrapper", {
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-section",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }

    resizeCanvas();
    createParticles();
    animate();

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
        createParticles();
      }, 250);
    });

    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animationFrameId) animate();
        } else {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      });
    });
    heroObserver.observe(hero);
  }

  // ── Counter Animation for Stats ──
  const statsNum = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        if (/^\d+$/.test(text)) {
          const target = parseInt(text);
          let current = 0;
          const increment = target / 30;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              el.textContent = target;
              clearInterval(timer);
            } else {
              el.textContent = Math.floor(current);
            }
          }, 30);
        }
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statsNum.forEach(stat => counterObserver.observe(stat));





  // ── Contact Form ──
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const formStatus = document.getElementById('form-status');
      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending...';

      try {
        const response = await fetch(contactForm.getAttribute('action'), {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          formStatus.className = 'form-status success';
          formStatus.textContent = 'Message sent successfully!';
          contactForm.reset();
        } else {
          throw new Error();
        }
      } catch (err) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Error sending message.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        setTimeout(() => {
          formStatus.textContent = '';
          formStatus.className = 'form-status';
        }, 5000);
      }
    });
  }

});
