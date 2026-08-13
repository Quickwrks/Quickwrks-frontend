/**
 * dashboard/my-products.js
 * Phase 2 — live product data integration.
 * Depends on: ../shared/api.js, ../shared/portal-utils.js
 */
(async function () {
  'use strict';

  var P = window.qwPortal;
  P.initTheme();
  P.initSidebar();
  P.initLogout('../login.html');

  var me = await P.requireAuth('../login.html');
  if (!me) return;

  var container = document.getElementById('productsContainer');
  if (container) container.innerHTML = P.loadingState('Loading products…');

  var results = await Promise.allSettled([
    window.qwApi.get('/api/customer/profile'),
    window.qwApi.get('/api/customer/products'),
  ]);

  if (results[0].status === 'fulfilled' && results[0].value && results[0].value.ok) {
    P.hydrateTopbar(await results[0].value.json());
  }

  if (results[1].status === 'fulfilled' && results[1].value && results[1].value.ok) {
    var products = await results[1].value.json();

    // Client-side summary counts
    var active = products.filter(function (p) { return p.status === 'active'; }).length;
    var expired = products.filter(function (p) { return p.status === 'expired'; }).length;
    var cancelled = products.filter(function (p) { return p.status === 'cancelled'; }).length;
    var now = new Date();
    var thirtyDays = 30 * 24 * 60 * 60 * 1000;
    var renewingSoon = products.filter(function (p) {
      if (!p.expires_at || p.status !== 'active') return false;
      var exp = new Date(p.expires_at);
      return exp > now && (exp - now) <= thirtyDays;
    }).length;

    var el;
    el = document.getElementById('prodStatActive'); if (el) el.textContent = active;
    el = document.getElementById('prodStatRenewing'); if (el) el.textContent = renewingSoon;
    el = document.getElementById('prodStatExpired'); if (el) el.textContent = expired;
    el = document.getElementById('prodStatInactive'); if (el) el.textContent = cancelled;

    var elAll = document.getElementById('prodCountAll');
    if (elAll) elAll.textContent = products.length;
    var elActive = document.getElementById('prodCountActive');
    if (elActive) elActive.textContent = active;
    var elRenewing = document.getElementById('prodCountRenewing');
    if (elRenewing) elRenewing.textContent = renewingSoon;
    var elExpired = document.getElementById('prodCountExpired');
    if (elExpired) elExpired.textContent = expired;
    var elCancelled = document.getElementById('prodCountCancelled');
    if (elCancelled) elCancelled.textContent = cancelled;

    if (!container) return;

    function renderProducts(list) {
      if (list.length === 0) return P.emptyState('No products in this category.');
      return list.map(function (p) {
        return '<div class="product-row">' +
          '<div class="product-icon icon-pos">\ud83d\udce6</div>' +
          '<div>' +
            '<div class="product-name-row">' +
              '<span class="product-name">' + P.escapeHTML(p.name || '—') + '</span>' +
              P.productStatusBadge(P.escapeHTML(p.status)) +
            '</div>' +
            '<div class="product-desc">Started: ' + P.formatDate(p.started_at) + '</div>' +
          '</div>' +
          '<div class="renewal-col">' +
            '<div class="renewal-label">Expires</div>' +
            '<div class="renewal-date">' + P.formatDate(p.expires_at) + '</div>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    container.innerHTML = renderProducts(products);



    var tabs = document.querySelectorAll('.tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var filter = tab.getAttribute('data-tab');
        var filtered = products;
        if (filter === 'active') filtered = products.filter(function (p) { return p.status === 'active'; });
        else if (filter === 'renewing') filtered = products.filter(function (p) {
          if (!p.expires_at || p.status !== 'active') return false;
          var exp = new Date(p.expires_at);
          return exp > now && (exp - now) <= thirtyDays;
        });
        else if (filter === 'expired') filtered = products.filter(function (p) { return p.status === 'expired'; });
        else if (filter === 'cancelled') filtered = products.filter(function (p) { return p.status === 'cancelled'; });
        container.innerHTML = renderProducts(filtered);
      });
    });

  } else {
    if (container) container.innerHTML = P.errorState('Could not load products.');
  }

})();
