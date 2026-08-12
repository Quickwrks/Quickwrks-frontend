(function () {
  'use strict';
  var root = document.documentElement;
  var themeToggle = document.getElementById('themeToggle');
  var themeLabel = document.getElementById('themeLabel');
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebarOverlay');
  var menuToggle = document.getElementById('menuToggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('qw_theme', theme); } catch (e) {}
    if (themeLabel) themeLabel.textContent = theme === 'light' ? 'Dark mode' : 'Light mode';
  }
  var saved = null;
  try { saved = localStorage.getItem('qw_theme'); } catch (e) {}
  applyTheme(saved === 'dark' ? 'dark' : 'light');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    });
  }

  function openMenu() {
    sidebar.classList.add('open');
    sidebar.style.setProperty('left', '0px', 'important');
    if (overlay) { overlay.classList.add('show'); overlay.style.display = 'block'; }
    document.body.classList.add('menu-open');
    if (menuToggle) { menuToggle.textContent = '\u2715'; menuToggle.setAttribute('aria-expanded', 'true'); }
  }
  function closeMenu() {
    sidebar.classList.remove('open');
    if (window.innerWidth <= 1024) sidebar.style.setProperty('left', '-280px', 'important');
    else sidebar.style.setProperty('left', '0px', 'important');
    if (overlay) { overlay.classList.remove('show'); overlay.style.display = 'none'; }
    document.body.classList.remove('menu-open');
    if (menuToggle) { menuToggle.textContent = '\u2630'; menuToggle.setAttribute('aria-expanded', 'false'); }
  }
  if (menuToggle) menuToggle.addEventListener('click', function (e) {
    e.preventDefault();
    if (sidebar.classList.contains('open')) closeMenu(); else openMenu();
  });
  if (overlay) overlay.addEventListener('click', closeMenu);
  document.querySelectorAll('.sidebar-nav a').forEach(function (a) {
    a.addEventListener('click', function () { if (window.innerWidth <= 1024) closeMenu(); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024) {
      sidebar.classList.remove('open');
      sidebar.style.setProperty('left', '0px', 'important');
      if (overlay) { overlay.classList.remove('show'); overlay.style.display = 'none'; }
      document.body.classList.remove('menu-open');
    } else if (!sidebar.classList.contains('open')) {
      sidebar.style.setProperty('left', '-280px', 'important');
    }
  });
  if (window.innerWidth <= 1024) sidebar.style.setProperty('left', '-280px', 'important');

  document.querySelectorAll('.settings-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.settings-tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
    });
  });

  var profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // Backend hook: POST/PUT the form data to /api/profile here.
    });
  }

  var btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', function () {
      if (window.confirm('Log out of QuickWrks?')) window.location.href = 'login.html';
    });
  }
})();