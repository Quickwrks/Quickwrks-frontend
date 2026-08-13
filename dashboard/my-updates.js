/**
 * dashboard/my-updates.js
 * Phase 2 — My Updates page wrapper (API not yet supported).
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

  var profileRes = await window.qwApi.get('/api/customer/profile');
  if (profileRes && profileRes.ok) {
    P.hydrateTopbar(await profileRes.json());
  }

  // NOTE: Updates API is currently deferred/unsupported.
  // The UI remains visually intact but static.
})();
