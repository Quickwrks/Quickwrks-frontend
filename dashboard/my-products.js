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
    if (themeLabel) {
      themeLabel.textContent = theme === 'light' ? 'Dark mode' : 'Light mode';
    }
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
    if (!sidebar) return;
    sidebar.classList.add('open');
    sidebar.style.setProperty('left', '0px', 'important');
    if (overlay) { overlay.classList.add('show'); overlay.style.display = 'block'; }
    document.body.classList.add('menu-open');
    if (menuToggle) {
      menuToggle.textContent = '\u2715';
      menuToggle.setAttribute('aria-expanded', 'true');
    }
  }
  function closeMenu() {
    if (!sidebar) return;
    sidebar.classList.remove('open');
    if (window.innerWidth <= 1024) {
      sidebar.style.setProperty('left', '-280px', 'important');
    } else {
      sidebar.style.setProperty('left', '0px', 'important');
    }
    if (overlay) { overlay.classList.remove('show'); overlay.style.display = 'none'; }
    document.body.classList.remove('menu-open');
    if (menuToggle) {
      menuToggle.textContent = '\u2630';
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  }
  function toggleMenu(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (sidebar && sidebar.classList.contains('open')) closeMenu();
    else openMenu();
  }
  if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);
  document.querySelectorAll('.sidebar-nav a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 1024) closeMenu();
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
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
  if (window.innerWidth <= 1024) {
    sidebar.style.setProperty('left', '-280px', 'important');
  }

  // Tabs filter
  var tabs = document.querySelectorAll('.tab');
  var cards = document.querySelectorAll('.update-card');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      var filter = tab.getAttribute('data-filter');
      cards.forEach(function (card) {
        var type = card.getAttribute('data-type');
        if (filter === 'all') {
          card.style.display = '';
        } else if (filter === 'system') {
          card.style.display = (type === 'system' || type === 'security') ? '' : 'none';
        } else {
          card.style.display = type === filter ? '' : 'none';
        }
      });
    });
  });

  // Search
  var searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var q = searchInput.value.toLowerCase().trim();
      cards.forEach(function (card) {
        var title = (card.getAttribute('data-title') || '').toLowerCase();
        var text = card.textContent.toLowerCase();
        card.style.display = (!q || title.indexOf(q) !== -1 || text.indexOf(q) !== -1) ? '' : 'none';
      });
    });
  }

  var btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', function () {
      if (window.confirm('Log out of QuickWrks?')) {
        window.location.href = 'login.html';
      }
    });
  }
})();