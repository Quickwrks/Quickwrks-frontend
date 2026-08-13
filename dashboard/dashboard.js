/**
 * dashboard/dashboard.js
 * Phase 2 — fully integrated customer dashboard.
 * Depends on: ../shared/api.js, ../shared/portal-utils.js
 */
(async function () {
  'use strict';

  var P = window.qwPortal;

  // ── Init theme + sidebar (synchronous, instant) ─────────────────────────────
  P.initTheme();
  P.initSidebar();
  P.initLogout('../login.html');

  // ── Auth guard ──────────────────────────────────────────────────────────────
  var me = await P.requireAuth('../login.html');
  if (!me) return;

  // ── Show loading skeleton in dynamic sections ───────────────────────────────
  function setLoading(id) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = P.loadingState('Loading…');
  }
  setLoading('dueInvoicesList');
  setLoading('recentTxnBody');
  setLoading('productsList');

  // ── Parallel data fetch ─────────────────────────────────────────────────────
  var results = await Promise.allSettled([
    window.qwApi.get('/api/customer/profile'),
    window.qwApi.get('/api/customer/dashboard'),
    window.qwApi.get('/api/customer/invoices'),
    window.qwApi.get('/api/customer/transactions'),
    window.qwApi.get('/api/customer/products'),
    window.qwApi.get('/api/customer/support/tickets')
  ]);

  // ── 1. Profile — topbar & welcome ──────────────────────────────────────────
  if (results[0].status === 'fulfilled' && results[0].value && results[0].value.ok) {
    var profile = await results[0].value.json();
    P.hydrateTopbar(profile);

    var welcomeEl = document.getElementById('welcomeName');
    if (welcomeEl) welcomeEl.textContent = profile.business_name || profile.client_id || 'there';
  }

  // ── 2. Dashboard summary cards (already wired in Phase 1, reinforce) ────────
  if (results[1].status === 'fulfilled' && results[1].value && results[1].value.ok) {
    var summary = await results[1].value.json();
    var el;
    el = document.getElementById('statTotalDue');
    if (el) el.textContent = P.formatMoney(summary.total_due);
    el = document.getElementById('statPaidThisYear');
    if (el) el.textContent = P.formatMoney(summary.paid_this_year);
  }

  // ── 3. Due invoices panel ───────────────────────────────────────────────────
  var invoiceContainer = document.getElementById('dueInvoicesList');
  if (invoiceContainer) {
    if (results[2].status === 'fulfilled' && results[2].value && results[2].value.ok) {
      var allInvoices = await results[2].value.json();
      var dueInvoices = allInvoices.filter(function (inv) {
        return inv.status === 'unpaid' || inv.status === 'overdue';
      });
      var paidInvoices = allInvoices.filter(function (inv) { return inv.status === 'paid'; });

      var dueCountEl = document.getElementById('statDueCount');
      if (dueCountEl) dueCountEl.textContent = dueInvoices.length + ' Invoices';

      var paidCountEl = document.getElementById('statPaidCount');
      if (paidCountEl) paidCountEl.textContent = paidInvoices.length + ' Invoices';

      if (dueInvoices.length === 0) {
        invoiceContainer.innerHTML = P.emptyState('No outstanding invoices.');
      } else {
        invoiceContainer.innerHTML = dueInvoices.slice(0, 3).map(function (inv) {
          return '<div class="invoice-item">' +
            '<div class="invoice-body">' +
              '<div class="invoice-id">' + P.escapeHTML(inv.invoice_number) + '</div>' +
              '<div class="invoice-name">' + P.escapeHTML(inv.description || '—') + '</div>' +
            '</div>' +
            '<div>' +
              '<div class="invoice-due">' + (inv.due_date ? 'Due on ' + P.formatDate(inv.due_date) : 'No due date') + '</div>' +
              '<div class="invoice-amt">' + P.formatMoney(inv.amount) + '</div>' +
            '</div>' +
            '<button class="btn-pay" type="button" disabled title="Online payment coming soon">Pay Now</button>' +
          '</div>';
        }).join('');
      }
    } else {
      invoiceContainer.innerHTML = P.errorState('Could not load invoices.');
    }
  }

  // ── 4. Recent transactions ──────────────────────────────────────────────────
  var txnBody = document.getElementById('recentTxnBody');
  if (txnBody) {
    if (results[3].status === 'fulfilled' && results[3].value && results[3].value.ok) {
      var txns = await results[3].value.json();
      if (txns.length === 0) {
        txnBody.innerHTML = '<tr><td colspan="4">' + P.emptyState('No transactions found.') + '</td></tr>';
      } else {
        txnBody.innerHTML = txns.slice(0, 5).map(function (t) {
          return '<tr>' +
            '<td>' + P.formatDate(t.created_at) + '</td>' +
            '<td>' + P.escapeHTML(t.description || t.type || '—') + '</td>' +
            '<td>' + P.formatMoney(t.amount) + '</td>' +
            '<td><span class="status-paid">' + P.escapeHTML(t.type || '—') + '</span></td>' +
          '</tr>';
        }).join('');
      }
    } else {
      txnBody.innerHTML = '<tr><td colspan="4">' + P.errorState('Could not load transactions.') + '</td></tr>';
    }
  }

  // ── 5. My products panel ────────────────────────────────────────────────────
  var productsList = document.getElementById('productsList');
  if (productsList) {
    if (results[4].status === 'fulfilled' && results[4].value && results[4].value.ok) {
      var products = await results[4].value.json();
      var activeCount = products.filter(function(p) { return p.status === 'active'; }).length;
      var activeEl = document.getElementById('statActiveProducts');
      if (activeEl) activeEl.textContent = products.length > 0 ? activeCount : '—';

      if (products.length === 0) {
        productsList.innerHTML = P.emptyState('No active products.');
      } else {
        productsList.innerHTML = products.slice(0, 4).map(function (p) {
          return '<div class="product-item">' +
            '<div class="product-icon blue">📦</div>' +
            '<div class="product-info">' +
              '<div class="product-name">' + P.escapeHTML(p.name || '—') + '</div>' +
              '<div class="product-plan">Expires: ' + P.formatDate(p.expires_at) + '</div>' +
            '</div>' +
            P.productStatusBadge(p.status) +
          '</div>';
        }).join('');
      }
    } else {
      productsList.innerHTML = P.errorState('Could not load products.');
    }
  }

  // ── 6. Tickets summary ──────────────────────────────────────────────────────
  if (results[5].status === 'fulfilled' && results[5].value && results[5].value.ok) {
    var tickets = await results[5].value.json();
    var openCount = 0, resolvedCount = 0;
    tickets.forEach(function(t) {
      if (t.status === 'open' || t.status === 'in_progress') openCount++;
      if (t.status === 'resolved' || t.status === 'closed') resolvedCount++;
    });
    var statSupportTickets = document.getElementById('statSupportTickets');
    if (statSupportTickets) statSupportTickets.textContent = tickets.length > 0 ? tickets.length : '—';

    var statTicketDetails = document.getElementById('statTicketDetails');
    if (statTicketDetails) {
      if (tickets.length > 0) {
        statTicketDetails.innerHTML = '<span style="color:var(--danger)">' + openCount + ' Open</span> · ' + resolvedCount + ' Resolved';
      } else {
        statTicketDetails.textContent = '—';
      }
    }
  }

})();
