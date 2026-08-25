// ================================
// Mobile Menu
// ================================

const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (menuToggle && mobileMenu) {
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

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  const mobileClose = document.getElementById('mobileClose');

  if (mobileClose) {
    mobileClose.addEventListener('click', closeMenu);
  }
}


// ================================
// Hybrid Slider
// ================================

function createHybridSlider(trackId, prevId, nextId, dotsId) {
  const track = document.getElementById(trackId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  const dotsContainer = document.getElementById(dotsId);

  if (!track) return;

  const cards = Array.from(track.children);

  if (!cards.length) return;

  // Clone cards for loop
  cards.forEach(card => {
    const clone = card.cloneNode(true);
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

    track.scrollTo({
      left: visual * getCardWidth(),
      behavior: smooth ? 'smooth' : 'auto'
    });

    updateDots(visual);
  }

  function next() {
    current++;

    if (current >= cards.length) {
      current = 0;

      track.scrollTo({
        left: 0,
        behavior: 'auto'
      });

      setTimeout(() => {
        goTo(1);
      }, 30);

    } else {
      goTo(current);
    }
  }

  function prev() {
    current--;

    if (current < 0) {
      current = cards.length - 1;

      track.scrollTo({
        left: current * getCardWidth(),
        behavior: 'auto'
      });

    } else {
      goTo(current);
    }
  }

  // Dots
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

  function updateDots(index) {
    if (!dotsContainer) return;

    dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  function startAuto() {
    stopAuto();

    autoTimer = setInterval(() => {
      if (!isPaused) {
        next();
      }
    }, 5000);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function pause() {
    isPaused = true;
  }

  function resume() {
    isPaused = false;
    startAuto();
  }

  track.addEventListener('mouseenter', pause);
  track.addEventListener('mouseleave', resume);

  track.addEventListener('touchstart', pause, {
    passive: true
  });

  track.addEventListener('touchend', () => {
    setTimeout(resume, 3000);
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      pause();
      prev();

      setTimeout(resume, 5000);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      pause();
      next();

      setTimeout(resume, 5000);
    });
  }

  // Drag support
  let isDragging = false;
  let startX = 0;
  let scrollLeftStart = 0;

  track.addEventListener('mousedown', e => {
    isDragging = true;

    pause();

    startX = e.pageX - track.offsetLeft;
    scrollLeftStart = track.scrollLeft;

    track.style.cursor = 'grabbing';
  });

  track.addEventListener('mousemove', e => {
    if (!isDragging) return;

    e.preventDefault();

    const x = e.pageX - track.offsetLeft;

    track.scrollLeft =
      scrollLeftStart - (x - startX) * 1.2;
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;

    isDragging = false;

    track.style.cursor = '';

    current =
      Math.round(track.scrollLeft / getCardWidth()) %
      cards.length;

    goTo(current);

    setTimeout(resume, 3000);
  });

  startAuto();
}


// ================================
// Billing Toggle
// ================================

document.querySelectorAll('.toggle-btn').forEach(btn => {

  btn.addEventListener('click', () => {

    document.querySelectorAll('.toggle-btn').forEach(b => {
      b.classList.remove('active');
    });

    btn.classList.add('active');

    const isYearly =
      btn.dataset.billing === 'yearly';

    document.querySelectorAll('.price-monthly').forEach(el => {
      el.style.display = isYearly ? 'none' : 'inline';
    });

    document.querySelectorAll('.price-yearly').forEach(el => {
      el.style.display = isYearly ? 'inline' : 'none';
    });

  });

});


// ================================
// FAQ Accordion
// ================================

document.querySelectorAll('.faq-question').forEach(btn => {

  btn.addEventListener('click', () => {

    const item = btn.parentElement;

    const isOpen =
      item.classList.contains('open');

    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
    });

    if (!isOpen) {
      item.classList.add('open');
    }

  });

});


// ==================================================
// CONTACT FORM - WEB3FORMS
// ==================================================

const contactForm =
  document.getElementById('contactForm');

if (contactForm) {

  contactForm.addEventListener('submit', async function (e) {

    e.preventDefault();

    const submitButton =
      contactForm.querySelector('.btn-send');

    const privacy =
      document.getElementById('privacyCheck');

    const privacyGroup =
      privacy ? privacy.closest('.privacy-group') : null;


    // ------------------------------------------
    // Privacy checkbox validation
    // ------------------------------------------

    if (privacy && !privacy.checked) {

      if (privacyGroup) {
        privacyGroup.classList.add('error');
      }

      privacy.focus();

      return;
    }

    if (privacyGroup) {
      privacyGroup.classList.remove('error');
    }


    // ------------------------------------------
    // Disable button
    // ------------------------------------------

    submitButton.disabled = true;

    submitButton.textContent = 'Sending...';


    try {

      // Create FormData
      const formData =
        new FormData(contactForm);


      // Send to Web3Forms
      const response = await fetch(
        'https://api.web3forms.com/submit',
        {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        }
      );


      // Get Web3Forms response
      const data = await response.json();


      console.log('Web3Forms response:', data);


      // ------------------------------------------
      // SUCCESS
      // ------------------------------------------

      if (response.ok && data.success) {

        alert(
          'Thank you! Your message has been sent successfully. Our team will contact you shortly.'
        );

        contactForm.reset();

      }


      // ------------------------------------------
      // ERROR FROM WEB3FORMS
      // ------------------------------------------

      else {

        console.error(
          'Web3Forms error:',
          data
        );

        alert(
          data.message ||
          'Unable to send your message. Please try again.'
        );

      }

    }


    // ------------------------------------------
    // NETWORK ERROR
    // ------------------------------------------

    catch (error) {

      console.error(
        'Contact form error:',
        error
      );

      alert(
        'Something went wrong while sending your message. Please check your internet connection and try again.'
      );

    }


    // ------------------------------------------
    // Enable button again
    // ------------------------------------------

    submitButton.disabled = false;

    submitButton.textContent = 'Send Message';

  });


  // Remove privacy error
  const privacyCheck =
    document.getElementById('privacyCheck');

  if (privacyCheck) {

    privacyCheck.addEventListener('change', function () {

      const privacyGroup =
        this.closest('.privacy-group');

      if (privacyGroup) {
        privacyGroup.classList.remove('error');
      }

    });

  }

}