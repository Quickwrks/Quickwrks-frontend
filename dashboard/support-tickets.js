/**
 * dashboard/support-tickets.js
 * Phase 2 — live support ticket data + create ticket form.
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

  var tblBody = document.getElementById('ticketTbody');
  if (tblBody) tblBody.innerHTML = '<tr><td colspan="5">' + P.loadingState('Loading tickets…') + '</td></tr>';

  // ── Create Ticket modal wiring ──────────────────────────────────────────────
  var createForm = document.getElementById('createTicketForm');
  var createBtn = document.getElementById('btnCreateTicket');
  var createMsg = document.getElementById('createTicketMsg');

  if (createBtn) {
    createBtn.addEventListener('click', function () {
      var modal = document.getElementById('createTicketModal');
      if (modal) modal.style.display = 'flex';
    });
  }
  var closeModal = document.getElementById('closeTicketModal');
  if (closeModal) {
    closeModal.addEventListener('click', function () {
      var modal = document.getElementById('createTicketModal');
      if (modal) modal.style.display = 'none';
    });
  }

  if (createForm) {
    createForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      var subject = (document.getElementById('ticketSubject') || {}).value || '';
      var body = (document.getElementById('ticketBody') || {}).value || '';
      if (createMsg) { createMsg.textContent = ''; createMsg.className = ''; }

      var submitBtn = createForm.querySelector('[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Submitting…'; }

      try {
        var res = await window.qwApi.post('/api/customer/support/tickets', { subject: subject, body: body });
        if (res && res.status === 201) {
          if (createMsg) { createMsg.className = 'form-success'; createMsg.textContent = 'Ticket created successfully!'; }
          createForm.reset();
          setTimeout(function () {
            var modal = document.getElementById('createTicketModal');
            if (modal) modal.style.display = 'none';
            loadTickets();
          }, 1200);
        } else {
          var msg = P.apiErrorMessage(res ? res.status : 0);
          if (createMsg) { createMsg.className = 'form-error'; createMsg.textContent = msg; }
        }
      } catch (err) {
        if (createMsg) { createMsg.className = 'form-error'; createMsg.textContent = 'Network error. Please try again.'; }
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit Ticket'; }
      }
    });
  }

  // ── Load tickets ────────────────────────────────────────────────────────────
  async function loadTickets() {
    var results = await Promise.allSettled([
      window.qwApi.get('/api/customer/profile'),
      window.qwApi.get('/api/customer/support/tickets'),
    ]);

    if (results[0].status === 'fulfilled' && results[0].value && results[0].value.ok) {
      P.hydrateTopbar(await results[0].value.json());
    }

    var tblBody = document.getElementById('ticketTbody');

    if (results[1].status === 'fulfilled' && results[1].value && results[1].value.ok) {
      var tickets = await results[1].value.json();

      // Summary stats from returned data
      var total = tickets.length;
      var open = tickets.filter(function (t) { return t.status === 'open'; }).length;
      var inProgress = tickets.filter(function (t) { return t.status === 'in_progress'; }).length;
      var resolved = tickets.filter(function (t) { return t.status === 'resolved'; }).length;
      var closed = tickets.filter(function (t) { return t.status === 'closed'; }).length;

      var onHold = tickets.filter(function (t) { return t.status === 'on_hold'; }).length;

      var el;
      el = document.getElementById('tkStatTotal'); if (el) el.textContent = total;
      el = document.getElementById('tkStatOpen'); if (el) el.textContent = open;
      el = document.getElementById('tkStatProgress'); if (el) el.textContent = inProgress;
      el = document.getElementById('tkStatResolved'); if (el) el.textContent = resolved;
      el = document.getElementById('tkStatClosed'); if (el) el.textContent = closed;

      // Tab labels via ID spans
      el = document.getElementById('tkCountAll'); if (el) el.textContent = total;
      el = document.getElementById('tkCountOpen'); if (el) el.textContent = open;
      el = document.getElementById('tkCountProgress'); if (el) el.textContent = inProgress;
      el = document.getElementById('tkCountHold'); if (el) el.textContent = onHold;
      el = document.getElementById('tkCountResolved'); if (el) el.textContent = resolved;
      el = document.getElementById('tkCountClosed'); if (el) el.textContent = closed;

      var tabs = document.querySelectorAll('.tab');

      if (!tblBody) return;
      if (tickets.length === 0) {
        tblBody.innerHTML = '<tr><td colspan="5">' + P.emptyState('No support tickets found.') + '</td></tr>';
        return;
      }

      var allTickets = tickets;
      function renderRows(list) {
        return list.map(function (t) {
          return '<tr>' +
            '<td data-label="Ticket ID"><div class="tkt-id">' + P.escapeHTML(t.id).slice(0, 8).toUpperCase() + '</div></td>' +
            '<td data-label="Subject">' + P.escapeHTML(t.subject) + '</td>' +
            '<td data-label="Status">' + P.ticketStatusBadge(P.escapeHTML(t.status)) + '</td>' +
            '<td data-label="Created">' + P.formatDate(t.created_at) + '</td>' +
            '<td data-label="Updated">' + P.formatDate(t.updated_at) + '</td>' +
          '</tr>';
        }).join('');
      }

      tblBody.innerHTML = renderRows(allTickets);

      // Client-side tab filtering
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          tabs.forEach(function (t) { t.classList.remove('active'); });
          tab.classList.add('active');
          var filter = tab.getAttribute('data-tab');
          var filtered = allTickets;
          if (filter === 'open') filtered = allTickets.filter(function (t) { return t.status === 'open'; });
          else if (filter === 'progress') filtered = allTickets.filter(function (t) { return t.status === 'in_progress'; });
          else if (filter === 'hold') filtered = allTickets.filter(function (t) { return t.status === 'on_hold'; });
          else if (filter === 'resolved') filtered = allTickets.filter(function (t) { return t.status === 'resolved'; });
          else if (filter === 'closed') filtered = allTickets.filter(function (t) { return t.status === 'closed'; });
          tblBody.innerHTML = filtered.length === 0
            ? '<tr><td colspan="5">' + P.emptyState('No tickets in this category.') + '</td></tr>'
            : renderRows(filtered);
        });
      });

    } else {
      if (tblBody) tblBody.innerHTML = '<tr><td colspan="5">' + P.errorState('Could not load support tickets.') + '</td></tr>';
    }
  }

  await loadTickets();

})();
