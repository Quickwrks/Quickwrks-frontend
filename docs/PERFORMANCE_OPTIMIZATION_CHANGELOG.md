# Performance Optimization Changelog

- **Added**: Frame budget architecture to the `requestAnimationFrame` loop in `index.js`.
- **Added**: SVG attribute dirty-checking (`setAttr` function) in `index.js` to avoid redundant DOM writes.
- **Added**: `prefers-reduced-motion: reduce` OS-level accessibility check to pause heavy animations.
- **Removed**: 30-40+ per-frame CSS variable updates (`--tx`, `--ty`, `--trot`, `--cam-x`, etc.) in `index.js`.
- **Added**: High-performance inline `style.transform` string construction in `index.js` to bypass CSS variable recalculations.
- **Modified**: Reduced complex double `drop-shadow` filters on `.data-packet` (in `index.js`) to a single optimized `drop-shadow`.
- **Modified**: Reduced complex double `drop-shadow` filters on `.node-hex-icon svg.hex-bg` (in `index.css`) to a single optimized `drop-shadow`.
- **Removed**: `backdrop-filter: blur(20px)` from the `.mobile-menu` overlay in `index.css`, saving a full viewport GPU pass on mobile devices.
- **Modified**: Decoupled the `mirrorStage` updates in `index.js` to occur every 3 frames (~20 FPS) instead of 60 FPS, leveraging the heavy blur to mask the latency.
- **Modified**: Decoupled the SVG neural network distance calculations in `index.js` to occur every 2 frames (~30 FPS) to halve CPU overhead.
