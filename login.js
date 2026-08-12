// Password show / hide
    const passInput = document.getElementById('password');
    const togglePass = document.getElementById('togglePass');
    togglePass.addEventListener('click', () => {
      const isPass = passInput.type === 'password';
      passInput.type = isPass ? 'text' : 'password';
      togglePass.textContent = isPass ? '🙈' : '👁️';
      togglePass.setAttribute('aria-label', isPass ? 'Hide password' : 'Show password');
    });

    // Simple client-side validation (backend must still validate)
    const form = document.getElementById('loginForm');
    const identifier = document.getElementById('identifier');
    const password = document.getElementById('password');

    function clearErrors() {
      document.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
    }

    function showError(groupId) {
      document.getElementById(groupId).classList.add('has-error');
    }

    function isValidIdentifier(val) {
      const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const mobile = /^[6-9]\d{9}$/; // basic Indian mobile
      const cleaned = val.replace(/\s+/g, '');
      return email.test(val) || mobile.test(cleaned) || cleaned.length >= 5;
    }

    form.addEventListener('submit', (e) => {
      // Let the browser POST to action="/api/auth/login" when valid.
      // For static preview without a backend, we prevent and show a message.
      clearErrors();
      let valid = true;

      if (!identifier.value.trim() || !isValidIdentifier(identifier.value.trim())) {
        showError('group-identifier');
        valid = false;
      }
      if (!password.value || password.value.length < 6) {
        showError('group-password');
        valid = false;
      }

      if (!valid) {
        e.preventDefault();
        return;
      }

      // If you are testing without a live backend, uncomment the next 2 lines:
      // e.preventDefault();
      // alert('Form is valid. Ready to POST to /api/auth/login');

      // Optional: disable button while submitting
      const btn = document.getElementById('loginBtn');
      btn.disabled = true;
      btn.textContent = 'Logging in…';
    });

    // Social buttons – point these to your OAuth endpoints
    document.getElementById('btnGoogle').addEventListener('click', () => {
      // window.location.href = '/api/auth/google';
      alert('Connect this button to your Google OAuth start URL, e.g. /api/auth/google');
    });

    document.getElementById('btnMicrosoft').addEventListener('click', () => {
      // window.location.href = '/api/auth/microsoft';
      alert('Connect this button to your Microsoft OAuth start URL, e.g. /api/auth/microsoft');
    });