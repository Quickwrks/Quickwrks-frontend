/**
 * dashboard/invoices.js
 * Phase 2 — live invoice data integration.
 * Depends on: ../shared/api.js, ../shared/portal-utils.js
 */
(async function () {
  'use strict';

  var P = window.qwPortal;
  P.initTheme();
  P.initSidebar();
  P.initLogout('../login.html');

  // Auth guard
  var me = await P.requireAuth('../login.html');
  if (!me) return;

  // Loading state
  var tblBody = document.getElementById('invoiceTbody');
  if (tblBody) tblBody.innerHTML = '<tr><td colspan="7">' + P.loadingState('Loading invoices…') + '</td></tr>';

  // Stat cards
  var statTotalDue = document.getElementById('invStatTotalDue');
  var statPaidYear = document.getElementById('invStatPaidYear');
  var statOverdue = document.getElementById('invStatOverdue');
  var statTotalPaid = document.getElementById('invStatTotalPaid');

  // Parallel fetch: dashboard summary + invoices
  var results = await Promise.allSettled([
    window.qwApi.get('/api/customer/profile'),
    window.qwApi.get('/api/customer/dashboard'),
    window.qwApi.get('/api/customer/invoices'),
  ]);

  // Hydrate topbar
  if (results[0].status === 'fulfilled' && results[0].value && results[0].value.ok) {
    P.hydrateTopbar(await results[0].value.json());
  }

  // Dashboard summary stats
  if (results[1].status === 'fulfilled' && results[1].value && results[1].value.ok) {
    var summary = await results[1].value.json();
    if (statTotalDue) statTotalDue.textContent = P.formatMoney(summary.total_due);
    if (statPaidYear) statPaidYear.textContent = P.formatMoney(summary.paid_this_year);
  }

  // Invoices table
  if (results[2].status === 'fulfilled' && results[2].value && results[2].value.ok) {
    var invoices = await results[2].value.json();

    // Derive overdue count client-side from status
    var overdueInvoices = invoices.filter(function (i) { return i.status === 'overdue'; });
    var overdueTotal = overdueInvoices.reduce(function (acc, i) { return acc + parseFloat(i.amount || 0); }, 0);
    if (statOverdue) statOverdue.textContent = P.formatMoney(overdueTotal);

    // Total paid — not available without payment data; show unavailable
    if (statTotalPaid) statTotalPaid.textContent = '—';

    if (!tblBody) return;

    if (invoices.length === 0) {
      tblBody.innerHTML = '<tr><td colspan="7">' + P.emptyState('No invoices found.') + '</td></tr>';
      return;
    }

    tblBody.innerHTML = invoices.map(function (inv) {
      return '<tr>' +
        '<td data-label="Invoice #"><div><div class="inv-id">' + P.escapeHTML(inv.invoice_number) + '</div>' +
          '<div class="inv-sub">' + P.escapeHTML(inv.description || '—') + '</div></div></td>' +
        '<td data-label="Date">' + P.formatDate(inv.created_at) + '</td>' +
        '<td data-label="Due Date">' + (inv.due_date ? P.formatDate(inv.due_date) : '—') + '</td>' +
        '<td data-label="Amount"><strong>' + P.formatMoney(inv.amount) + '</strong></td>' +
        '<td data-label="Status">' + P.invoiceStatusBadge(P.escapeHTML(inv.status)) + '</td>' +
        '<td data-label="Actions"><div class="actions-cell">' +
          '<button type="button" class="btn-sm" disabled title="Coming soon">↓ Download</button>' +
          (inv.status !== 'paid' ? '<button type="button" class="btn-sm pay" disabled title="Online payment coming soon">Pay Now</button>' : '') +
        '</div></td>' +
      '</tr>';
    }).join('');

    // Tab counts
    var outstanding = invoices.filter(function (i) { return i.status === 'unpaid' || i.status === 'overdue'; });
    var paid = invoices.filter(function (i) { return i.status === 'paid'; });

    var spanOutstanding = document.getElementById('tabCountOutstanding');
    if (spanOutstanding) spanOutstanding.textContent = outstanding.length;

    var spanPaid = document.getElementById('tabCountPaid');
    if (spanPaid) spanPaid.textContent = paid.length;

    var spanAll = document.getElementById('tabCountAll');
    if (spanAll) spanAll.textContent = invoices.length;

    // Client-side tab filtering
    var tabs = document.querySelectorAll('.tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var filter = tab.getAttribute('data-tab');
        var filtered = invoices;
        if (filter === 'outstanding') filtered = outstanding;
        else if (filter === 'paid') filtered = paid;
        tblBody.innerHTML = filtered.length === 0
          ? '<tr><td colspan="7">' + P.emptyState('No invoices in this category.') + '</td></tr>'
          : filtered.map(function (inv) {
            return '<tr>' +
              '<td data-label="Invoice #"><div><div class="inv-id">' + P.escapeHTML(inv.invoice_number) + '</div>' +
                '<div class="inv-sub">' + P.escapeHTML(inv.description || '—') + '</div></div></td>' +
              '<td data-label="Date">' + P.formatDate(inv.created_at) + '</td>' +
              '<td data-label="Due Date">' + (inv.due_date ? P.formatDate(inv.due_date) : '—') + '</td>' +
              '<td data-label="Amount"><strong>' + P.formatMoney(inv.amount) + '</strong></td>' +
              '<td data-label="Status">' + P.invoiceStatusBadge(P.escapeHTML(inv.status)) + '</td>' +
              '<td data-label="Actions"><div class="actions-cell">' +
                '<button type="button" class="btn-sm" disabled title="Coming soon">↓ Download</button>' +
                (inv.status !== 'paid' ? '<button type="button" class="btn-sm pay" disabled title="Online payment coming soon">Pay Now</button>' : '') +
              '</div></td>' +
            '</tr>';
          }).join('');
      });
    });

  } else {
    if (tblBody) tblBody.innerHTML = '<tr><td colspan="7">' + P.errorState('Could not load invoices. Please try again.') + '</td></tr>';
  }

})();
