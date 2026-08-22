(function () {
  var menuToggle = document.getElementById('menuToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  var mobileClose = document.getElementById('mobileClose');

  function openMenu() {
    mobileMenu.classList.add('open');
    menuToggle.classList.add('active');
    document.body.classList.add('menu-open');
  }
  function closeMenu() {
    mobileMenu.classList.remove('open');
    menuToggle.classList.remove('active');
    document.body.classList.remove('menu-open');
  }
  if (menuToggle) menuToggle.addEventListener('click', function () {
    if (mobileMenu.classList.contains('open')) closeMenu(); else openMenu();
  });
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  var cards = document.querySelectorAll('.review-card');
  var search = document.getElementById('reviewSearch');
  var sort = document.getElementById('sortReviews');
  var filter = 'all';

  function applyFilters() {
    var q = (search && search.value || '').toLowerCase().trim();
    cards.forEach(function (card) {
      var rating = parseInt(card.getAttribute('data-rating'), 10);
      var text = card.textContent.toLowerCase();
      var show = true;
      if (filter === '5') show = rating === 5;
      else if (filter === '4') show = rating === 4;
      else if (filter === 'low') show = rating <= 3;
      if (q && text.indexOf(q) === -1) show = false;
      card.style.display = show ? '' : 'none';
    });
  }

  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      filter = tab.getAttribute('data-filter');
      applyFilters();
    });
  });
  if (search) search.addEventListener('input', applyFilters);

  if (sort) {
    sort.addEventListener('change', function () {
      var list = document.getElementById('reviewsList');
      var arr = Array.prototype.slice.call(list.querySelectorAll('.review-card'));
      var mode = sort.value;
      arr.sort(function (a, b) {
        var ra = parseInt(a.getAttribute('data-rating'), 10);
        var rb = parseInt(b.getAttribute('data-rating'), 10);
        var da = a.getAttribute('data-date') || '';
        var db = b.getAttribute('data-date') || '';
        if (mode === 'highest') return rb - ra;
        if (mode === 'lowest') return ra - rb;
        return db.localeCompare(da);
      });
      arr.forEach(function (c) { list.appendChild(c); });
    });
  }
})();