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
    const clientId = document.getElementById('client_id');
    const password = document.getElementById('password');
    const remember = document.getElementById('remember');
    const errorIdentifier = document.getElementById('error-identifier');
    const loginBtn = document.getElementById('loginBtn');

    function clearErrors() {
      document.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
      errorIdentifier.textContent = "Please enter a valid Customer Code.";
    }

    function showError(groupId, message = null) {
      document.getElementById(groupId).classList.add('has-error');
      if (message && groupId === 'group-identifier') {
          errorIdentifier.textContent = message;
      }
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors();
      let valid = true;

      const clientIdVal = clientId.value.trim();
      if (!clientIdVal) {
        showError('group-identifier');
        valid = false;
      }
      if (!password.value || password.value.length < 8) {
        showError('group-password');
        valid = false;
      }

      if (!valid) return;

      loginBtn.disabled = true;
      loginBtn.textContent = 'Logging in…';

      try {
          const response = await window.qwApi.post('/api/auth/login', {
              client_id: clientIdVal,
              password: password.value,
              remember: remember.checked
          }, { ignore401: true }); // We handle 401 locally here for login

          if (response.ok) {
              const data = await response.json();
              if (data.redirect) {
                  // Translate backend redirect to frontend path
                  window.location.href = data.redirect.replace('/dashboard', 'dashboard/dashboard.html');
              } else {
                  window.location.href = 'dashboard/dashboard.html';
              }
          } else if (response.status === 401) {
              showError('group-identifier', 'Invalid Customer Code or Password.');
          } else if (response.status === 429) {
              showError('group-identifier', 'Too many login attempts. Please try again later.');
          } else if (response.status === 422) {
              showError('group-identifier', 'Please check your input formats.');
          } else {
              showError('group-identifier', 'Unable to complete login. Please try again later.');
          }
      } catch (err) {
          showError('group-identifier', 'Network error. Please try again later.');
      } finally {
          loginBtn.disabled = false;
          loginBtn.textContent = 'Login →';
      }
    });
