/**
 * dashboard/transactions.js
 * Phase 2 — live transaction data integration.
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

  var tblBody = document.getElementById('txnTbody');
  if (tblBody) tblBody.innerHTML = '<tr><td colspan="5">' + P.loadingState('Loading transactions…') + '</td></tr>';

  var results = await Promise.allSettled([
    window.qwApi.get('/api/customer/profile'),
    window.qwApi.get('/api/customer/transactions'),
  ]);

  if (results[0].status === 'fulfilled' && results[0].value && results[0].value.ok) {
    P.hydrateTopbar(await results[0].value.json());
  }

  if (results[1].status === 'fulfilled' && results[1].value && results[1].value.ok) {
    var txns = await results[1].value.json();

    // Client-side stats from the returned array
    var totalCount = txns.length;
    var totalAmt = txns.reduce(function (acc, t) {
      var amt = parseFloat(t.amount || 0);
      if ((t.type || '').toLowerCase() === 'refund') {
        amt = -Math.abs(amt);
      }
      return acc + amt;
    }, 0);

    var elCount = document.getElementById('txnStatCount');
    var elTotal = document.getElementById('txnStatTotal');
    if (elCount) elCount.textContent = totalCount;
    if (elTotal) elTotal.textContent = P.formatMoney(totalAmt);

    // Summary stats not derivable from current API — show unavailable
    var elTotalAmt = document.getElementById('txnStatTotalAmt');
    var elRefunds = document.getElementById('txnStatRefunds');
    if (elTotalAmt) elTotalAmt.textContent = '—';
    if (elRefunds) elRefunds.textContent = '—';

    if (!tblBody) return;

    if (txns.length === 0) {
      tblBody.innerHTML = '<tr><td colspan="5">' + P.emptyState('No transactions found.') + '</td></tr>';
      return;
    }

    var allTxns = txns;
    function renderRows(data) {
      return data.map(function (t) {
        var isRefund = (t.type || '').toLowerCase() === 'refund';
        var displayAmt = parseFloat(t.amount || 0);
        if (isRefund) displayAmt = -Math.abs(displayAmt);

        return '<tr>' +
          '<td data-label="ID"><strong>' + (t.id ? P.escapeHTML(t.id).slice(0, 12) + '…' : '—') + '</strong></td>' +
          '<td data-label="Date">' + P.formatDate(t.created_at) + '</td>' +
          '<td data-label="Type"><span class="badge-status badge-paid">• ' + P.escapeHTML(t.type || '—') + '</span></td>' +
          '<td data-label="Amount"><strong>' + P.formatMoney(displayAmt) + '</strong></td>' +
          '<td data-label="Description">' + P.escapeHTML(t.description || '—') + '</td>' +
        '</tr>';
      }).join('');
    }

    tblBody.innerHTML = renderRows(allTxns);

    // Client-side tab filtering
    var tabs = document.querySelectorAll('.tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var filter = tab.getAttribute('data-tab');
        var filtered = allTxns;
        if (filter !== 'all') filtered = allTxns.filter(function (t) { return t.type === filter; });
        tblBody.innerHTML = filtered.length === 0
          ? '<tr><td colspan="5">' + P.emptyState('No transactions in this category.') + '</td></tr>'
          : renderRows(filtered);
      });
    });

  } else {
    if (tblBody) tblBody.innerHTML = '<tr><td colspan="5">' + P.errorState('Could not load transactions.') + '</td></tr>';
  }

})();
