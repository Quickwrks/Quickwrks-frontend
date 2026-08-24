// Mobile Menu
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
    });

    function closeMenu() {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.classList.remove('menu-open');
    }

    mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.getElementById('mobileClose').addEventListener('click', closeMenu);

    // Auto-slide every 5 seconds + Manual control
    function createHybridSlider(trackId, prevId, nextId, dotsId) {
      const track = document.getElementById(trackId);
      const prevBtn = document.getElementById(prevId);
      const nextBtn = document.getElementById(nextId);
      const dotsContainer = document.getElementById(dotsId);
      if (!track) return;

      const cards = Array.from(track.children);
      if (!cards.length) return;

      // Clone for seamless loop
      cards.forEach(c => {
        const clone = c.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });

      let current = 0;
      let isPaused = false;
      let autoTimer = null;

      function getCardWidth() {
        return cards[0].offsetWidth + 20;
      }

      function goTo(index, smooth = true) {
        current = index;
        const max = cards.length;
        const visual = ((current % max) + max) % max;
        track.scrollTo({ left: visual * getCardWidth(), behavior: smooth ? 'smooth' : 'auto' });
        updateDots(visual);
      }

      function next() {
        current++;
        if (current >= cards.length) {
          current = 0;
          track.scrollTo({ left: 0, behavior: 'auto' });
          setTimeout(() => goTo(1), 30);
        } else {
          goTo(current);
        }
      }

      function prev() {
        current--;
        if (current < 0) {
          current = cards.length - 1;
          track.scrollTo({ left: current * getCardWidth(), behavior: 'auto' });
        } else {
          goTo(current);
        }
      }

      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        cards.forEach((_, i) => {
          const dot = document.createElement('div');
          dot.className = 'dot' + (i === 0 ? ' active' : '');
          dot.addEventListener('click', () => {
            pause();
            current = i;
            goTo(i);
            resume();
          });
          dotsContainer.appendChild(dot);
        });
      }

      function updateDots(idx) {
        if (!dotsContainer) return;
        dotsContainer.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === idx));
      }

      function startAuto() {
        stopAuto();
        autoTimer = setInterval(() => { if (!isPaused) next(); }, 5000);
      }
      function stopAuto() { if (autoTimer) clearInterval(autoTimer); }
      function pause() { isPaused = true; }
      function resume() { isPaused = false; startAuto(); }

      track.addEventListener('mouseenter', pause);
      track.addEventListener('mouseleave', resume);
      track.addEventListener('touchstart', pause, { passive: true });
      track.addEventListener('touchend', () => setTimeout(resume, 3000));

      if (prevBtn) prevBtn.addEventListener('click', () => { pause(); prev(); setTimeout(resume, 5000); });
      if (nextBtn) nextBtn.addEventListener('click', () => { pause(); next(); setTimeout(resume, 5000); });

      // Drag support
      let isDragging = false, startX = 0, scrollLeftStart = 0;
      track.addEventListener('mousedown', e => {
        isDragging = true; pause();
        startX = e.pageX - track.offsetLeft;
        scrollLeftStart = track.scrollLeft;
        track.style.cursor = 'grabbing';
      });
      track.addEventListener('mousemove', e => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        track.scrollLeft = scrollLeftStart - (x - startX) * 1.2;
      });
      window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        track.style.cursor = '';
        current = Math.round(track.scrollLeft / getCardWidth()) % cards.length;
        goTo(current);
        setTimeout(resume, 3000);
      });

      startAuto();
    }

    
    



    // Billing toggle
    document.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const isYearly = btn.dataset.billing === 'yearly';
        document.querySelectorAll('.price-monthly').forEach(el => el.style.display = isYearly ? 'none' : 'inline');
        document.querySelectorAll('.price-yearly').forEach(el => el.style.display = isYearly ? 'inline' : 'none');
      });
    });


    // FAQ accordion
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });


    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const privacy = document.getElementById('privacyCheck');
        const privacyGroup = privacy.closest('.privacy-group');
        if (!privacy.checked) {
          privacyGroup.classList.add('error');
          privacy.focus();
          return;
        }
        privacyGroup.classList.remove('error');
        alert('Thank you! Your message has been sent. Our team will contact you shortly.');
        contactForm.reset();
      });

      document.getElementById('privacyCheck').addEventListener('change', function() {
        this.closest('.privacy-group').classList.remove('error');
      });
    }