// ========================================
// MOBILE MENU
// ========================================

const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

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

  // Close menu when clicking a link
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu using X button
  if (mobileClose) {
    mobileClose.addEventListener('click', closeMenu);
  }
}


// ========================================
// CONTACT FORM
// ========================================

const contactForm = document.getElementById('contactForm');
const privacyCheck = document.getElementById('privacyCheck');

if (contactForm && privacyCheck) {

  contactForm.addEventListener('submit', function (event) {

    // Check privacy consent
    if (!privacyCheck.checked) {

      event.preventDefault();

      const privacyGroup = privacyCheck.closest('.privacy-group');

      if (privacyGroup) {
        privacyGroup.classList.add('error');
      }

      privacyCheck.focus();

      return;
    }

    // Remove error state
    const privacyGroup = privacyCheck.closest('.privacy-group');

    if (privacyGroup) {
      privacyGroup.classList.remove('error');
    }

    // IMPORTANT:
    // Do NOT use event.preventDefault() here.
    // The form will submit normally to Formspree.
  });


  // Remove error message when checkbox is checked
  privacyCheck.addEventListener('change', function () {

    const privacyGroup = this.closest('.privacy-group');

    if (privacyGroup && this.checked) {
      privacyGroup.classList.remove('error');
    }

  });
}