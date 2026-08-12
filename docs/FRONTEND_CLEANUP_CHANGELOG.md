# QuickWrks Frontend Cleanup Changelog

- **Removed**: `QW/` directory (redundant historical export, 9 HTML files)
- **Removed**: `index (1)/` directory (redundant historical export, 5 HTML files)
- **Removed**: `doc/` directory (unreferenced PDFs, 6 files)
- **Removed**: `frontend/frontend/products/` (unused dummy `restaurant` template)
- **Moved**: Re-structured files from `frontend/frontend/` to the canonical root `frontend/`.
- **Organized**: Created `assets/` and moved `logo.png`, `thumnail.png`, and `How to use.mp4` into it.
- **Organized**: Created `legal/` and moved `Quickwrks Main Website Privacy Policy.pdf`, `quickwrks terms of use.pdf`, `customer dashboard privacy policy.pdf`, and `dashboard terms and conditions.pdf` into it.
- **Renamed**: Renamed `frontend/backend/` to `frontend/dashboard/` to resolve the misleading folder name (as it contains customer portal HTML, not backend Python code).
- **Consolidated**: Deduplicated `documents.js`, `invoices.js`, `my-updates.js`, `support-tickets.js`, and `transactions.js` into a single `shared/dashboard-shared.js`.
- **Refactored**: Updated all HTML file references to correctly point to the new `assets/`, `legal/`, and `shared/` directories.
- **Refactored**: Replaced absolute paths in the dashboard HTML (e.g., `<a href="/frontend/legal/...">`) with relative paths to prevent deployment breakages.
- **Optimized**: Added `preload="none"` to the `<video>` element in `Index.html` to defer loading the 19MB `.mp4` file until requested by the user.
- **Optimized**: Added `loading="lazy"` attributes to `<img>` tags universally.
- **Optimized**: Modified the animation loop in `index.js` by wrapping it in an `IntersectionObserver`. CPU-heavy particles and SVG node animations now pause entirely when the user scrolls past the `.hero` section or switches tabs, significantly reducing energy and CPU load while retaining visual flair.
