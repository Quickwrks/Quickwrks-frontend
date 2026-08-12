// Mobile sidebar
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const menuToggle = document.getElementById('menuToggle');

    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });

    // Copy customer ID
    document.getElementById('copyId').addEventListener('click', () => {
      const id = document.getElementById('topCustomerId').textContent;
      navigator.clipboard.writeText(id).then(() => {
        const btn = document.getElementById('copyId');
        btn.textContent = '✓';
        setTimeout(() => { btn.textContent = '📋'; }, 1500);
      });
    });

    /*
      Optional: load live data from Python backend
      Example:
      async function loadDashboard() {
        const res = await fetch('/api/dashboard/summary', { credentials: 'include' });
        const data = await res.json();
        document.getElementById('welcomeName').textContent = data.user.name;
        document.getElementById('statTotalDue').textContent = data.stats.total_due;
        // ... map other fields
      }
      // loadDashboard();
    */