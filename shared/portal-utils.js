/**
 * portal-utils.js — Shared utilities for QuickWrks customer portal pages.
 * Provides: theme, sidebar, logout wiring, auth guard, profile hydration, formatters.
 * Load AFTER api.js. All pages in dashboard/ should load both scripts.
 */
(function (global) {
  'use strict';

  // ── Formatters ──────────────────────────────────────────────────────────────

  function escapeHTML(str) {
    if (str == null) return '';
    return String(str).replace(/[&<>'"]/g, function(tag) {
      var charsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      };
      return charsToReplace[tag] || tag;
    });
  }

  function formatMoney(amount) {
    var num = parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', minimumFractionDigits: 2
    }).format(num);
  }

  function formatDate(isoStr) {
    if (!isoStr) return '—';
    var d = new Date(isoStr);
    if (isNaN(d)) return '—';
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function avatarInitials(name) {
    if (!name) return '?';
    var parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  // ── Invoice status label ────────────────────────────────────────────────────

  function invoiceStatusBadge(status) {
    var map = {
      paid: '<span class="badge-status badge-paid">Paid</span>',
      unpaid: '<span class="badge-status badge-due">Due</span>',
      overdue: '<span class="badge-status badge-overdue">Overdue</span>',
    };
    return map[status] || ('<span class="badge-status">' + status + '</span>');
  }

  // ── Ticket status badge ─────────────────────────────────────────────────────

  function ticketStatusBadge(status) {
    var map = {
      open: '<span class="badge-status badge-due">Open</span>',
      in_progress: '<span class="badge-status badge-info">In Progress</span>',
      on_hold: '<span class="badge-status badge-overdue">On Hold</span>',
      resolved: '<span class="badge-status badge-paid">Resolved</span>',
      closed: '<span class="badge-status">Closed</span>',
    };
    return map[status] || ('<span class="badge-status">' + status + '</span>');
  }

  // ── Product status badge ────────────────────────────────────────────────────

  function productStatusBadge(status) {
    var map = {
      active: '<span class="badge-active">Active</span>',
      expired: '<span class="badge-status badge-overdue">Expired</span>',
      cancelled: '<span class="badge-status">Cancelled</span>',
    };
    return map[status] || ('<span class="badge-status">' + status + '</span>');
  }

  // ── Empty / Error state helpers ─────────────────────────────────────────────

  function emptyState(msg) {
    return '<div class="empty-state" style="padding:2rem;text-align:center;color:var(--text-muted,#888);font-size:0.95rem;">' + msg + '</div>';
  }

  function errorState(msg) {
    return '<div class="empty-state" style="padding:2rem;text-align:center;color:var(--danger,#e53e3e);font-size:0.95rem;">⚠ ' + msg + '</div>';
  }

  function loadingState(msg) {
    return '<div class="empty-state" style="padding:2rem;text-align:center;color:var(--text-muted,#888);font-size:0.95rem;">⏳ ' + (msg || 'Loading…') + '</div>';
  }

  // ── Theme ───────────────────────────────────────────────────────────────────

  function initTheme() {
    var root = document.documentElement;
    var toggle = document.getElementById('themeToggle');
    var label = document.getElementById('themeLabel');
    function apply(t) {
      root.setAttribute('data-theme', t);
      try { localStorage.setItem('qw_theme', t); } catch (e) {}
      if (label) label.textContent = t === 'light' ? '🌙 Dark mode' : '☀ Light mode';
    }
    var saved = null;
    try { saved = localStorage.getItem('qw_theme'); } catch (e) {}
    apply(saved === 'dark' ? 'dark' : 'light');
    if (toggle) toggle.addEventListener('click', function () {
      apply(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    });
  }

  // ── Sidebar ─────────────────────────────────────────────────────────────────

  function initSidebar() {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebarOverlay');
    var menuToggle = document.getElementById('menuToggle');
    if (!sidebar) return;

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
      e.preventDefault(); e.stopPropagation();
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
  }

  // ── Logout wiring ───────────────────────────────────────────────────────────

  function initLogout(loginPath) {
    var btn = document.getElementById('btnLogout');
    if (!btn) return;
    btn.addEventListener('click', async function () {
      if (!window.confirm('Log out of QuickWrks?')) return;
      try { await window.qwApi.post('/api/auth/logout', {}); } catch (e) { /* ignore */ }
      window.location.href = loginPath || '../login.html';
    });
  }

  // ── Topbar profile hydration ─────────────────────────────────────────────────

  function hydrateTopbar(profile) {
    var avatarEl = document.querySelector('.company-avatar');
    var nameEl = document.querySelector('.company-meta strong');
    var idEl = document.querySelector('.company-meta span');

    var biz = profile.business_name || profile.client_id || '';
    var cid = profile.client_id || '';

    if (avatarEl) avatarEl.textContent = avatarInitials(biz);
    if (nameEl) nameEl.textContent = biz;
    if (idEl) idEl.textContent = 'Customer ID: ' + cid;

    // Remove fake notification badge number — no backend support yet
    var badge = document.querySelector('.btn-icon .badge');
    if (badge) badge.style.display = 'none';
  }

  // ── Auth guard ──────────────────────────────────────────────────────────────

  async function requireAuth(loginPath) {
    if (!window.qwApi) { window.location.href = loginPath || '../login.html'; return null; }
    var res = await window.qwApi.get('/api/auth/me');
    if (!res || !res.ok) return null; // api.js already redirects on 401
    return await res.json();
  }

  // ── Error message helper ────────────────────────────────────────────────────

  function apiErrorMessage(status) {
    if (status === 401) return 'Your session has expired. Please log in again.';
    if (status === 403) return 'Access denied. Please refresh and try again.';
    if (status === 422) return 'Invalid input. Please check your details.';
    if (status === 429) return 'Too many requests. Please try again later.';
    if (status >= 500) return 'Service unavailable. Please try again later.';
    return 'Something went wrong. Please try again.';
  }

  // ── Expose ──────────────────────────────────────────────────────────────────

  global.qwPortal = {
    escapeHTML: escapeHTML,
    formatMoney: formatMoney,
    formatDate: formatDate,
    avatarInitials: avatarInitials,
    invoiceStatusBadge: invoiceStatusBadge,
    ticketStatusBadge: ticketStatusBadge,
    productStatusBadge: productStatusBadge,
    emptyState: emptyState,
    errorState: errorState,
    loadingState: loadingState,
    initTheme: initTheme,
    initSidebar: initSidebar,
    initLogout: initLogout,
    hydrateTopbar: hydrateTopbar,
    requireAuth: requireAuth,
    apiErrorMessage: apiErrorMessage,
  };

})(window);
