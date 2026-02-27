/* ═══════════════════════════════════════════════════════════
   BULLION BOURSE — Interactive Script
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Initialize Lucide Icons ──
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ── Preloader ──
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 2000);
  });

  // Fallback: hide preloader after 3.5s
  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 3500);

  // ── Navbar scroll effect ──
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // ── Mobile navigation toggle ──
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile nav on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
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
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ── Hero Canvas — Particle Mesh Network ──
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let mouse = { x: -1000, y: -1000 };

    function resizeCanvas() {
      const hero = document.querySelector('.hero');
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Mouse interaction
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          this.vx += (dx / dist) * force * 0.04;
          this.vy += (dy / dist) * force * 0.04;
        }

        // Damping
        this.vx *= 0.99;
        this.vy *= 0.99;

        // Pulse
        this.pulsePhase += this.pulseSpeed;

        // Boundaries
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        this.x = Math.max(0, Math.min(canvas.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height, this.y));
      }

      draw() {
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 180, 216, ${this.opacity * pulse})`;
        ctx.fill();
      }
    }

    function createParticles() {
      particles = [];
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 160;
          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 180, 216, ${opacity})`;
            ctx.lineWidth = 0.6;
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

    // Mouse tracking
    const hero = document.querySelector('.hero');
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    hero.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    // Init
    resizeCanvas();
    createParticles();
    animate();

    // Resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
        createParticles();
      }, 250);
    });

    // Cleanup when hero is out of view for performance
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
  const stats = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        // Only animate if it's a pure number
        if (/^\d+$/.test(text)) {
          const target = parseInt(text);
          let current = 0;
          const increment = target / 40;
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

  stats.forEach(stat => counterObserver.observe(stat));

  // ── Active Nav Link Highlighting ──
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 200;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinksAll.forEach(link => {
      link.style.color = '';
      const href = link.getAttribute('href');
      if (href === `#${current}`) {
        link.style.color = '#00B4D8';
      }
    });
  }, { passive: true });

  // ── Service card hover tilt effect ──
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── Typed text effect for hero subtitle (optional) ──
  // Subtle fade-in for hero elements
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    setTimeout(() => {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 200);

    // Apply initial hidden state
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    heroContent.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
  }

  // ── Contact Form Handling ──
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Show sending state
      submitBtn.disabled = true;
      const originalBtnContent = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin" style="width:18px;height:18px;"></i> Sending Message...';
      if (typeof lucide !== 'undefined') lucide.createIcons();

      const formData = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.getAttribute('action'), {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Success
          formStatus.className = 'form-status success';
          formStatus.textContent = 'Thank you! Your message has been sent successfully. We will get back to you shortly.';
          contactForm.reset();
        } else {
          // Error response
          throw new Error('Form submission failed');
        }
      } catch (error) {
        // Network or logic error
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Oops! Something went wrong. Please try again or email us directly at info@bulliongroupe.com.';
      } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
        if (typeof lucide !== 'undefined') lucide.createIcons();

        // Clear status after 8 seconds
        setTimeout(() => {
          formStatus.className = 'form-status';
          formStatus.textContent = '';
        }, 8000);
      }
    });
  }

});
