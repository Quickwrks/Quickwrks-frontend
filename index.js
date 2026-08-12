// Mobile Menu
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
    });

    function closeMenu() {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.classList.remove('menu-open');
    }

    mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.getElementById('mobileClose').addEventListener('click', closeMenu);

    // Auto-slide every 5 seconds + Manual control
    function createHybridSlider(trackId, prevId, nextId, dotsId) {
      const track = document.getElementById(trackId);
      const prevBtn = document.getElementById(prevId);
      const nextBtn = document.getElementById(nextId);
      const dotsContainer = document.getElementById(dotsId);
      if (!track) return;

      const cards = Array.from(track.children);
      if (!cards.length) return;

      // Clone for seamless loop
      cards.forEach(c => {
        const clone = c.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });

      let current = 0;
      let isPaused = false;
      let autoTimer = null;

      function getCardWidth() {
        return cards[0].offsetWidth + 20;
      }

      function goTo(index, smooth = true) {
        current = index;
        const max = cards.length;
        const visual = ((current % max) + max) % max;
        track.scrollTo({ left: visual * getCardWidth(), behavior: smooth ? 'smooth' : 'auto' });
        updateDots(visual);
      }

      function next() {
        current++;
        if (current >= cards.length) {
          current = 0;
          track.scrollTo({ left: 0, behavior: 'auto' });
          setTimeout(() => goTo(1), 30);
        } else {
          goTo(current);
        }
      }

      function prev() {
        current--;
        if (current < 0) {
          current = cards.length - 1;
          track.scrollTo({ left: current * getCardWidth(), behavior: 'auto' });
        } else {
          goTo(current);
        }
      }

      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        cards.forEach((_, i) => {
          const dot = document.createElement('div');
          dot.className = 'dot' + (i === 0 ? ' active' : '');
          dot.addEventListener('click', () => {
            pause();
            current = i;
            goTo(i);
            resume();
          });
          dotsContainer.appendChild(dot);
        });
      }

      function updateDots(idx) {
        if (!dotsContainer) return;
        dotsContainer.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === idx));
      }

      function startAuto() {
        stopAuto();
        autoTimer = setInterval(() => { if (!isPaused) next(); }, 5000);
      }
      function stopAuto() { if (autoTimer) clearInterval(autoTimer); }
      function pause() { isPaused = true; }
      function resume() { isPaused = false; startAuto(); }

      track.addEventListener('mouseenter', pause);
      track.addEventListener('mouseleave', resume);
      track.addEventListener('touchstart', pause, { passive: true });
      track.addEventListener('touchend', () => setTimeout(resume, 3000));

      if (prevBtn) prevBtn.addEventListener('click', () => { pause(); prev(); setTimeout(resume, 5000); });
      if (nextBtn) nextBtn.addEventListener('click', () => { pause(); next(); setTimeout(resume, 5000); });

      // Drag support
      let isDragging = false, startX = 0, scrollLeftStart = 0;
      track.addEventListener('mousedown', e => {
        isDragging = true; pause();
        startX = e.pageX - track.offsetLeft;
        scrollLeftStart = track.scrollLeft;
        track.style.cursor = 'grabbing';
      });
      track.addEventListener('mousemove', e => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        track.scrollLeft = scrollLeftStart - (x - startX) * 1.2;
      });
      window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        track.style.cursor = '';
        current = Math.round(track.scrollLeft / getCardWidth()) % cards.length;
        goTo(current);
        setTimeout(resume, 3000);
      });

      startAuto();
    }

    createHybridSlider('productsTrack', 'prodPrev', 'prodNext', 'prodDots');
    createHybridSlider('industriesTrack', 'indPrev', 'indNext', 'indDots');

    // HERO V3: PRODUCTION-LEVEL CINEMATIC MOTION & KINEMATICS ENGINE (Vanilla JS & requestAnimationFrame)
    (function initHeroEngineV3() {
      // 1. Initialize 5-Tier Cinematic Atmospheric Particle Ecosystem in hero wrapper
      const dustContainer = document.getElementById('heroDust');
      if (dustContainer && window.innerWidth >= 768) {
        const totalParticles = 36;
        const layers = ['p-dust', 'p-cloud', 'p-star', 'p-haze', 'p-spark'];
        const weights = [0.35, 0.20, 0.20, 0.15, 0.10]; // Proportion distribution across 5 tiers

        for (let i = 0; i < totalParticles; i++) {
          const dot = document.createElement('div');
          let rand = Math.random(), acc = 0, layerClass = 'p-dust';
          for (let l = 0; l < layers.length; l++) {
            acc += weights[l];
            if (rand <= acc) { layerClass = layers[l]; break; }
          }

          dot.className = `dust-dot ${layerClass}`;
          dot.style.left = (Math.random() * 100) + '%';
          dot.style.top = (Math.random() * 100) + '%';
          
          // Tailor physics per particle tier for natural enterprise atmosphere
          const durBase = layerClass === 'p-dust' ? 22 : layerClass === 'p-cloud' ? 18 : layerClass === 'p-star' ? 4 : layerClass === 'p-haze' ? 26 : 14;
          const durVar = layerClass === 'p-star' ? 3 : 8;
          dot.style.setProperty('--duration', (durBase + Math.random() * durVar) + 's');
          dot.style.setProperty('--delay', (Math.random() * -20) + 's');
          dot.style.setProperty('--max-alpha', (0.65 + Math.random() * 0.35).toFixed(2));
          dot.style.setProperty('--dx', (Math.random() * 80 - 40) + 'px');
          dot.style.setProperty('--dy', (Math.random() * 80 - 40) + 'px');
          dot.style.setProperty('--dx2', (Math.random() * 80 - 40) + 'px');
          dot.style.setProperty('--dy2', (Math.random() * 80 - 40) + 'px');
          dustContainer.appendChild(dot);
        }
      }

      // 2. Initialize Background Digital Neural Network in SVG
      const neuralSvg = document.getElementById('neuralSvg');
      const dotsCount = window.innerWidth <= 700 ? 25 : 42;
      const dots = [];
      const linesPool = [];
      const width = 480, height = 460;

      if (neuralSvg) {
        for (let i = 0; i < dotsCount * 2; i++) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('class', 'neural-line');
          line.setAttribute('stroke-opacity', '0');
          neuralSvg.appendChild(line);
          linesPool.push(line);
        }

        for (let i = 0; i < dotsCount; i++) {
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('class', 'neural-node');
          const r = 1.2 + Math.random() * 1.6;
          circle.setAttribute('r', r);
          
          const dot = {
            x: 20 + Math.random() * (width - 40),
            y: 20 + Math.random() * (height - 40),
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            element: circle,
            baseAlpha: 0.45 + Math.random() * 0.5
          };
          circle.setAttribute('opacity', dot.baseAlpha);
          neuralSvg.appendChild(circle);
          dots.push(dot);
        }
      }

      // 3. Setup Floor Reflection Mirroring & Dynamic Data Routing Layer
      const liveStage = document.getElementById('liveNetworkStage');
      const mirrorStage = document.getElementById('mirrorStage');
      let clonedNodes = [];

      if (liveStage && mirrorStage) {
        const clone = liveStage.cloneNode(true);
        clone.removeAttribute('id');
        const cloneSvg = clone.querySelector('#neuralSvg');
        if (cloneSvg) cloneSvg.removeAttribute('id');
        const clonePackets = clone.querySelector('#dataFlowPackets');
        if (clonePackets) clonePackets.removeAttribute('id');
        mirrorStage.appendChild(clone);
        clonedNodes = Array.from(clone.querySelectorAll('.product-node'));
      }

      const liveNodes = Array.from(document.querySelectorAll('#liveNetworkStage .product-node'));
      const liveConnections = Array.from(document.querySelectorAll('#liveNetworkStage .connections-layer line.connection-base, #liveNetworkStage .connections-layer line.connection-pulse'));
      const clonedConnections = mirrorStage ? Array.from(mirrorStage.querySelectorAll('.connections-layer line.connection-base, .connections-layer line.connection-pulse')) : [];
      const defaultLineTargets = liveConnections.map(l => ({ x1: l.getAttribute('x1'), y1: l.getAttribute('y1'), x2: l.getAttribute('x2'), y2: l.getAttribute('y2') }));

      // 4. Standalone Data-Driven Radial Layout & Extended Collision Engine (≤768px only; Desktop Untouched)
      function runRadialLayoutEngine() {
        if (!liveNodes.length || !liveStage) return;
        if (window.innerWidth > 768) {
          liveNodes.forEach((node, i) => {
            node.style.left = ''; node.style.top = ''; node.style.right = ''; node.style.bottom = '';
            node.style.removeProperty('--computed-card-scale');
            if (clonedNodes[i]) {
              clonedNodes[i].style.left = ''; clonedNodes[i].style.top = ''; clonedNodes[i].style.right = ''; clonedNodes[i].style.bottom = '';
              clonedNodes[i].style.removeProperty('--computed-card-scale');
            }
          });
          defaultLineTargets.forEach((t, idx) => {
            if (liveConnections[idx]) { liveConnections[idx].setAttribute('x2', t.x2); liveConnections[idx].setAttribute('y2', t.y2); }
            if (clonedConnections[idx]) { clonedConnections[idx].setAttribute('x2', t.x2); clonedConnections[idx].setAttribute('y2', t.y2); }
          });
          return;
        }

        const containerW = liveStage.clientWidth || 360;
        const containerH = liveStage.clientHeight || 460;
        const cx = containerW / 2;
        const cy = containerH / 2;

        const h1Elem = document.querySelector('.hero h1');
        const descElem = document.querySelector('.hero-desc');
        const heroElem = document.querySelector('.hero');
        if (h1Elem && descElem && heroElem) {
          const heroTop = heroElem.getBoundingClientRect().top;
          const h1Bottom = h1Elem.getBoundingClientRect().bottom;
          const descTop = descElem.getBoundingClientRect().top;
          const targetCenterY = ((h1Bottom - heroTop) + (descTop - heroTop)) / 2;
          const calculatedTop = Math.max(20, targetCenterY - cy);
          liveStage.style.setProperty('--network-bg-top', `${calculatedTop.toFixed(1)}px`);
        }

        const N = liveNodes.length;
        let rx = containerW * 0.40;
        let ry = containerH * 0.39;
        let cardScale = 0.80;

        const defaultAngles = [270, 330, 30, 90, 150, 210];
        let currentAngles = defaultAngles.map((a, i) => a ?? ((270 + i * (360 / N)) % 360));

        let computedCoords = [];
        let hasCollision = false;

        for (let iteration = 0; iteration < 15; iteration++) {
          computedCoords = [];
          hasCollision = false;

          for (let i = 0; i < N; i++) {
            const angleRad = (currentAngles[i] * Math.PI) / 180;
            const x = cx + rx * Math.cos(angleRad);
            const y = cy + ry * Math.sin(angleRad);
            computedCoords.push({ x, y, angle: currentAngles[i] });
          }

          const cardW = 150 * cardScale;
          const cardH = 52 * cardScale;
          const halfW = cardW / 2;
          const halfH = cardH / 2;
          const hubRadius = 52;

          for (let i = 0; i < N; i++) {
            const pos = computedCoords[i];
            if (pos.x - halfW < 6) { rx -= 2; hasCollision = true; break; }
            if (pos.x + halfW > containerW - 6) { rx -= 2; hasCollision = true; break; }
            if (pos.y - halfH < 8) { ry -= 2; hasCollision = true; break; }
            if (pos.y + halfH > containerH - 12) { ry -= 3; cardScale = Math.max(0.68, cardScale - 0.02); hasCollision = true; break; }

            const distToCenter = Math.hypot(pos.x - cx, pos.y - cy);
            if (distToCenter < (hubRadius + halfH + 8)) {
              rx += 3; ry += 4; hasCollision = true; break;
            }

            for (let j = i + 1; j < N; j++) {
              const other = computedCoords[j];
              const dx = Math.abs(pos.x - other.x);
              const dy = Math.abs(pos.y - other.y);
              if (dx < (cardW + 10) && dy < (cardH + 12)) {
                hasCollision = true;
                ry += 3; rx += 2;
                cardScale = Math.max(0.70, cardScale - 0.015);
                if (currentAngles[j] === 30 || currentAngles[j] === 330 || currentAngles[j] === 150 || currentAngles[j] === 210) {
                  if (currentAngles[j] < 90) currentAngles[j] += 1;
                  if (currentAngles[j] > 270) currentAngles[j] -= 1;
                  if (currentAngles[j] > 90 && currentAngles[j] < 180) currentAngles[j] -= 1;
                  if (currentAngles[j] > 180 && currentAngles[j] < 270) currentAngles[j] += 1;
                }
                break;
              }
            }
            if (hasCollision) break;
          }
          if (!hasCollision) break;
        }

        const svgScaleX = 480 / (containerW || 480);
        const svgScaleY = 460 / (containerH || 460);

        liveNodes.forEach((node, idx) => {
          const c = computedCoords[idx];
          if (!c) return;
          node.style.left = `${c.x.toFixed(1)}px`;
          node.style.top = `${c.y.toFixed(1)}px`;
          node.style.right = 'auto';
          node.style.bottom = 'auto';
          node.style.setProperty('--computed-card-scale', cardScale.toFixed(2));
          
          if (clonedNodes[idx]) {
            clonedNodes[idx].style.left = `${c.x.toFixed(1)}px`;
            clonedNodes[idx].style.top = `${c.y.toFixed(1)}px`;
            clonedNodes[idx].style.right = 'auto';
            clonedNodes[idx].style.bottom = 'auto';
            clonedNodes[idx].style.setProperty('--computed-card-scale', cardScale.toFixed(2));
          }

          const svgX = (c.x * svgScaleX).toFixed(1);
          const svgY = (c.y * svgScaleY).toFixed(1);

          if (liveConnections[idx]) { liveConnections[idx].setAttribute('x2', svgX); liveConnections[idx].setAttribute('y2', svgY); }
          if (liveConnections[idx + N]) { liveConnections[idx + N].setAttribute('x2', svgX); liveConnections[idx + N].setAttribute('y2', svgY); }
          if (clonedConnections[idx]) { clonedConnections[idx].setAttribute('x2', svgX); clonedConnections[idx].setAttribute('y2', svgY); }
          if (clonedConnections[idx + N]) { clonedConnections[idx + N].setAttribute('x2', svgX); clonedConnections[idx + N].setAttribute('y2', svgY); }
        });
      }

      window.addEventListener('resize', runRadialLayoutEngine, { passive: true });
      window.addEventListener('orientationchange', runRadialLayoutEngine, { passive: true });
      if (window.ResizeObserver && liveStage) {
        const ro = new ResizeObserver(() => runRadialLayoutEngine());
        ro.observe(liveStage);
      }
      runRadialLayoutEngine();
      function layoutMobileRadialNetwork() { runRadialLayoutEngine(); }

      // 5. Initialize V3 Live Dynamic Data Flow Packet Transmission Pool
      const packetsContainer = document.getElementById('dataFlowPackets');
      const clonedPacketsContainer = mirrorStage ? mirrorStage.querySelector('.connections-svg g:last-child') : null;
      const dataPackets = [];
      const totalPackets = 8;
      const hubCoord = { x: 240, y: 230 };
      // Node SVG coordinates on desktop (or base fallback)
      const nodeTargetCoords = [
        { x: 240, y: 45 },  // POS
        { x: 395, y: 105 }, // CRM
        { x: 395, y: 355 }, // HR
        { x: 240, y: 415 }, // ANA
        { x: 85,  y: 355 }, // INV
        { x: 85,  y: 105 }  // ERP
      ];
      const packetColors = ['#38bdf8', '#34d399', '#a78bfa', '#22d3ee', '#fb923c', '#f472b6'];

      if (packetsContainer) {
        for (let i = 0; i < totalPackets; i++) {
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('class', 'data-packet');
          circle.setAttribute('r', '3.8');
          circle.setAttribute('opacity', '0');
          packetsContainer.appendChild(circle);

          let cloneCircle = null;
          if (clonedPacketsContainer) {
            cloneCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            cloneCircle.setAttribute('class', 'data-packet');
            cloneCircle.setAttribute('r', '3.8');
            cloneCircle.setAttribute('opacity', '0');
            clonedPacketsContainer.appendChild(cloneCircle);
          }

          dataPackets.push({
            el: circle,
            cloneEl: cloneCircle,
            active: false,
            progress: 0,
            speed: 0.006 + Math.random() * 0.005,
            start: { x: 240, y: 230 },
            end: { x: 240, y: 45 },
            delay: i * 800 + Math.random() * 1000,
            color: packetColors[i % packetColors.length]
          });
        }
      }

      function launchRandomPacket(p, now) {
        // Grab current dynamic endpoint from live connections if modified by radial mobile layout
        const targetIdx = Math.floor(Math.random() * nodeTargetCoords.length);
        let nodeCoord = { x: nodeTargetCoords[targetIdx].x, y: nodeTargetCoords[targetIdx].y };
        if (liveConnections[targetIdx]) {
          nodeCoord.x = parseFloat(liveConnections[targetIdx].getAttribute('x2')) || nodeCoord.x;
          nodeCoord.y = parseFloat(liveConnections[targetIdx].getAttribute('y2')) || nodeCoord.y;
        }

        const isOutward = Math.random() > 0.4;
        p.start = isOutward ? hubCoord : nodeCoord;
        p.end = isOutward ? nodeCoord : hubCoord;
        p.progress = 0;
        p.active = true;
        p.speed = 0.007 + Math.random() * 0.006;
        p.color = packetColors[Math.floor(Math.random() * packetColors.length)];
        p.el.setAttribute('fill', p.color);
        p.el.setAttribute('filter', `drop-shadow(0 0 8px ${p.color})`);
        if (p.cloneEl) {
          p.cloneEl.setAttribute('fill', p.color);
          p.cloneEl.setAttribute('filter', `drop-shadow(0 0 8px ${p.color})`);
        }
      }

      // 6. Custom Per-Card Kinematic Formulas (Silky Organic Motions & Tilt)
      const cardKinematics = [
        { type: 'buoyant-rise', speed: 0.0006, ampY: 9, ampX: 2.5, tiltAmp: 1.5, offset: 0 },
        { type: 'orbital-loop', speed: 0.0007, ampY: 7, ampX: 8, tiltAmp: 1.2, offset: 1.2 },
        { type: 'cushioned-drop', speed: 0.00055, ampY: 8.5, ampX: 3, tiltAmp: -1.4, offset: 2.4 },
        { type: 'rotational-tip', speed: 0.00065, ampY: 7.5, ampX: 4, tiltAmp: 2.0, offset: 3.6 },
        { type: 'micro-float', speed: 0.0008, ampY: 6, ampX: 6, tiltAmp: -1.2, offset: 4.8 },
        { type: 'elliptical-drift', speed: 0.0005, ampY: 8, ampX: 7.5, tiltAmp: 1.6, offset: 5.8 }
      ];

      let animationFrameId = null;
      let isRunning = true;
      let lastTime = performance.now();

      // 6.5 Preferred reduced motion check & throttle utilities
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let frameCount = 0;
      
      function setAttr(el, attr, val) {
        const key = '_' + attr;
        if (el[key] !== val) {
          el[key] = val;
          el.setAttribute(attr, val);
        }
      }

      // Base transforms for liveNodes (from CSS defaults on desktop)
      const baseNodeTransforms = [
        "translateX(-50%) ", // node-pos
        "",                  // node-crm
        "",                  // node-hr
        "translateX(-50%) ", // node-ana
        "",                  // node-inv
        ""                   // node-erp
      ];

      // 7. High-Performance 60 FPS requestAnimationFrame Master Engine
      function animate(time) {
        if (!isRunning) return;
        const dt = Math.min(60, time - lastTime);
        lastTime = time;
        frameCount++;

        if (prefersReducedMotion && frameCount > 1) {
           return;
        }

        const isMobile = window.innerWidth <= 768;
        const stageMobileTf = isMobile ? "translateX(-50%) " : "";
        const nodeMobileTf = isMobile ? "translate(-50%, -50%) " : "";

        // A. Master System Respiration & Virtual Camera Drift
        const sysPulse = (Math.sin(time * 0.000785) * 0.5) + 0.5; 
        const camX = Math.sin(time * 0.00035) * 6.5 + Math.cos(time * 0.00022) * 2.0;
        const camY = Math.cos(time * 0.00042) * 6.5 + Math.sin(time * 0.00018) * 2.0;
        const camRot = Math.sin(time * 0.00031) * 0.75;

        // ONLY update style.transform to avoid expensive CSS var invalidations
        if (liveStage) {
          if (frameCount % 4 === 0) liveStage.style.setProperty('--sys-pulse', sysPulse.toFixed(3));
          liveStage.style.setProperty('transform', `translate3d(px, px, 0px) rotate(deg)`, 'important');
        }
        
        const isMirrorFrame = (frameCount % 3 === 0);
        if (mirrorStage && isMirrorFrame) {
          mirrorStage.style.setProperty('transform', `scaleY(-1) translateY(10px) translate3d(px, px, 0px) rotate(deg)`, 'important');
        }

        // B. Apply Unique Kinematics & Rotational Tipping per Product Card
        liveNodes.forEach((node, idx) => {
          const k = cardKinematics[idx] || cardKinematics[0];
          const t = (time * k.speed) + k.offset;
          const tx = Math.sin(t) * k.ampX + Math.cos(t * 0.6) * (k.ampX * 0.3);
          const ty = Math.cos(t) * k.ampY + Math.sin(t * 0.7) * (k.ampY * 0.3);
          const trot = Math.sin(t * 1.2) * k.tiltAmp;
          const base = isMobile ? nodeMobileTf : baseNodeTransforms[idx];

          const tfString = `translate3d(px, px, 0px) rotate(deg)`;
          node.style.setProperty('transform', tfString, 'important');
          
          if (isMirrorFrame && clonedNodes[idx]) {
            clonedNodes[idx].style.setProperty('transform', tfString, 'important');
          }
        });

        // C. Update Dynamic Randomized Data Packets
        dataPackets.forEach(p => {
          if (!p.active) {
            if (p.delay <= 0) {
              launchRandomPacket(p, time);
            } else {
              p.delay -= dt;
            }
          } else {
            p.progress += p.speed;
            if (p.progress >= 1) {
              p.active = false;
              p.delay = 1200 + Math.random() * 2500;
              setAttr(p.el, 'opacity', '0');
              if (isMirrorFrame && p.cloneEl) setAttr(p.cloneEl, 'opacity', '0');
            } else {
              const ease = p.progress < 0.5 ? 2 * p.progress * p.progress : 1 - Math.pow(-2 * p.progress + 2, 2) / 2;
              const curX = p.start.x + (p.end.x - p.start.x) * ease;
              const curY = p.start.y + (p.end.y - p.start.y) * ease;
              
              let alpha = 0;
              if (p.progress < 0.2) alpha = p.progress / 0.2;
              else if (p.progress > 0.85) alpha = (1 - p.progress) / 0.15;
              else alpha = 1;

              setAttr(p.el, 'cx', curX.toFixed(1));
              setAttr(p.el, 'cy', curY.toFixed(1));
              setAttr(p.el, 'opacity', (alpha * 0.95).toFixed(2));

              if (isMirrorFrame && p.cloneEl) {
                setAttr(p.cloneEl, 'cx', curX.toFixed(1));
                setAttr(p.cloneEl, 'cy', curY.toFixed(1));
                setAttr(p.cloneEl, 'opacity', (alpha * 0.45).toFixed(2));
              }
            }
          }
        });

        // D. Animate Background Neural Network Starfield Dots
        const isNeuralFrame = (frameCount % 2 === 0);
        if (dots.length > 0 && isNeuralFrame) {
          let lineIdx = 0;
          const maxDist = 85;
          const maxDistSq = maxDist * maxDist;

          for (let i = 0; i < dots.length; i++) {
            const d = dots[i];
            d.x += d.vx * 2; 
            d.y += d.vy * 2;

            if (d.x < 10 || d.x > width - 10) d.vx *= -1;
            if (d.y < 10 || d.y > height - 10) d.vy *= -1;

            setAttr(d.element, 'cx', d.x.toFixed(1));
            setAttr(d.element, 'cy', d.y.toFixed(1));

            for (let j = i + 1; j < dots.length; j++) {
              if (lineIdx >= linesPool.length) break;
              const d2 = dots[j];
              const dx = d.x - d2.x;
              const dy = d.y - d2.y;
              const distSq = dx * dx + dy * dy;

              if (distSq < maxDistSq) {
                const alpha = (1 - Math.sqrt(distSq) / maxDist) * (0.35 + (sysPulse * 0.2));
                const line = linesPool[lineIdx];
                setAttr(line, 'x1', d.x.toFixed(1));
                setAttr(line, 'y1', d.y.toFixed(1));
                setAttr(line, 'x2', d2.x.toFixed(1));
                setAttr(line, 'y2', d2.y.toFixed(1));
                setAttr(line, 'stroke-opacity', alpha.toFixed(2));
                lineIdx++;
              }
            }
          }

          while (lineIdx < linesPool.length) {
            setAttr(linesPool[lineIdx], 'stroke-opacity', '0');
            lineIdx++;
          }
        }

        animationFrameId = requestAnimationFrame(animate);
      }

      // 8. Start V3 Cinematic Animation with Visibility Performance Guard
      const heroElem = document.querySelector('.hero') || document.body;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !document.hidden) {
            if (!isRunning) {
              isRunning = true;
              lastTime = performance.now();
              animationFrameId = requestAnimationFrame(animate);
            }
          } else {
            isRunning = false;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
          }
        });
      }, { rootMargin: '100px' });
      
      observer.observe(heroElem);

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          isRunning = false;
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
        } else {
          // IntersectionObserver will handle resuming if still in view
          // but we can force a check or just let it be. For safety:
          if (heroElem.getBoundingClientRect().top < window.innerHeight && heroElem.getBoundingClientRect().bottom > 0) {
             isRunning = true;
             lastTime = performance.now();
             animationFrameId = requestAnimationFrame(animate);
          }
        }
      });
    })();
