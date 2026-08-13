/**
 * dashboard/profile-settings.js
 * Phase 2 — live profile load + PATCH update.
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

  // ── Load profile ────────────────────────────────────────────────────────────
  var profileRes = await window.qwApi.get('/api/customer/profile');
  var profile = null;
  if (profileRes && profileRes.ok) {
    profile = await profileRes.json();
    P.hydrateTopbar(profile);

    // Profile card header
    var avatarEl = document.getElementById('profileAvatar');
    var bizNameEl = document.getElementById('profileBizName');
    var clientIdEl = document.getElementById('profileClientId');
    var sinceEl = document.getElementById('profileSince');
    var statusEl = document.getElementById('profileStatusBadge');

    if (avatarEl) avatarEl.textContent = P.avatarInitials(profile.business_name || profile.client_id || '?');
    if (bizNameEl) bizNameEl.textContent = profile.business_name || '—';
    if (clientIdEl) clientIdEl.textContent = profile.client_id || '—';
    if (sinceEl) sinceEl.textContent = P.formatDate(profile.created_at);
    if (statusEl) statusEl.innerHTML = profile.status === 'active'
      ? '<span class="badge-active">\u2713 Active</span>'
      : '<span class="badge-status">' + (profile.status || '') + '</span>';

    // Populate editable form fields with real data
    var orgName = document.getElementById('orgName');
    var email = document.getElementById('email');
    var phone = document.getElementById('phone');
    if (orgName) orgName.value = profile.business_name || '';
    if (email) email.value = profile.email || '';
    if (phone) phone.value = profile.phone || '';
  }

  // ── Tab wiring ──────────────────────────────────────────────────────────────
  document.querySelectorAll('.settings-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.settings-tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
    });
  });

  // ── Profile form submit ─────────────────────────────────────────────────────
  var profileForm = document.getElementById('profileForm');
  var profileSaveMsg = document.getElementById('profileSaveMsg');
  var profileSaveBtn = document.getElementById('profileSaveBtn');

  if (profileForm) {
    profileForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (profileSaveMsg) { profileSaveMsg.textContent = ''; profileSaveMsg.className = ''; }
      if (profileSaveBtn) { profileSaveBtn.disabled = true; profileSaveBtn.textContent = 'Saving…'; }

      // Only send supported fields
      var body = {};
      var orgName = document.getElementById('orgName');
      var emailEl = document.getElementById('email');
      var phoneEl = document.getElementById('phone');
      if (orgName && orgName.value.trim()) body.business_name = orgName.value.trim();
      if (emailEl && emailEl.value.trim()) body.email = emailEl.value.trim();
      if (phoneEl && phoneEl.value.trim()) body.phone = phoneEl.value.trim();

      try {
        var res = await window.qwApi.patch('/api/customer/profile', body);
        if (res && (res.status === 200 || res.ok)) {
          if (profileSaveMsg) {
            profileSaveMsg.className = 'form-success';
            profileSaveMsg.textContent = 'Profile updated successfully!';
          }
          // Refresh topbar with new values
          var updated = await window.qwApi.get('/api/customer/profile');
          if (updated && updated.ok) P.hydrateTopbar(await updated.json());
        } else if (res && res.status === 409) {
          if (profileSaveMsg) { profileSaveMsg.className = 'form-error'; profileSaveMsg.textContent = 'This email address is already in use.'; }
        } else {
          if (profileSaveMsg) { profileSaveMsg.className = 'form-error'; profileSaveMsg.textContent = P.apiErrorMessage(res ? res.status : 0); }
        }
      } catch (err) {
        if (profileSaveMsg) { profileSaveMsg.className = 'form-error'; profileSaveMsg.textContent = 'Network error. Please try again.'; }
      } finally {
        if (profileSaveBtn) { profileSaveBtn.disabled = false; profileSaveBtn.textContent = 'Save Changes'; }
      }
    });
  }

})();
