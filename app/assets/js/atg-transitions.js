/* ============================================================
   ATG Metal Works & Interiors — Page Transition Controller
   ------------------------------------------------------------
   One reusable controller, one shared overlay, four concept
   styles, one configuration value.

   Usage (preview):
     ATGTransitions.play(containerEl, 'precision-line')
     ATGTransitions.play(containerEl, 'golden-frame', { onCovered, onDone })

   Usage (live website integration — once a concept is chosen):
     ATGTransitions.config.concept = 'material-reveal';  // the one config value
     ATGTransitions.interceptLinks();                    // handles internal nav

   The animation styles (CSS) are fully separated from the
   navigation logic below — either can change independently.
   ============================================================ */

(function () {
  'use strict';

  var CONCEPTS = ['material-reveal', 'precision-line', 'golden-frame', 'crafted-motion'];

  /* One configuration value identifies the selected concept. */
  var config = {
    concept: 'material-reveal',  // Production selected concept: Material Reveal
    failsafeMs: 5000             // overlay can never stay longer than this
  };

  /* Normal timeline (ms). Exit starts as soon as the minimum visual
     sequence has played; the full sequence stays well under 4s. */
  var T = { covered: 900, navAt: 2100, exitAt: 2400, done: 3550 };
  /* Reduced-motion timeline: quick fade only. */
  var TR = { covered: 180, navAt: 200, exitAt: 650, done: 1000 };

  var playing = false;
  var timers = [];
  var activeRoot = null;
  var linksBound = false;

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function later(fn, ms) {
    var id = window.setTimeout(fn, ms);
    timers.push(id);
    return id;
  }

  function clearTimers() {
    timers.forEach(function (id) { window.clearTimeout(id); });
    timers = [];
  }

  /* ---------- overlay templates (one per concept) ---------- */

  function template(concept) {
    switch (concept) {
      case 'precision-line':
        return '' +
          '<div class="atg-tx atg-tx--precision-line">' +
            '<div class="tx1-bg"></div>' +
            '<svg class="tx1-svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false">' +
              '<path class="tx1-l1" pathLength="100" d="M18 14 H82 V86 H18 Z"/>' +
              '<path class="tx1-l2" pathLength="100" d="M23 19 H77 V81 H23 Z"/>' +
              '<path class="tx1-l3" pathLength="100" d="M18 8 V14 M12 14 H18 M82 8 V14 M88 14 H82 M18 92 V86 M12 86 H18 M82 92 V86 M88 86 H82"/>' +
              '<path class="tx1-l4" pathLength="100" d="M23 81 L77 19"/>' +
              '<path class="tx1-l5" pathLength="100" d="M48.4 50 h3.2 M50 48.4 v3.2"/>' +
            '</svg>' +
            '<div class="tx1-wordmark atg-tx__wordmark">ATG</div>' +
            '<div class="tx1-progress"><span></span></div>' +
          '</div>';

      case 'golden-frame':
        return '' +
          '<div class="atg-tx atg-tx--golden-frame">' +
            '<div class="tx2-panel">' +
              '<div class="tx2-half tx2-half--l"></div>' +
              '<div class="tx2-half tx2-half--r"></div>' +
              '<div class="tx2-frame"></div>' +
              '<div class="tx2-center">' +
                '<div class="tx2-wordmark atg-tx__wordmark">ATG</div>' +
                '<div class="atg-tx__caption">Metal Works &amp; Interiors</div>' +
              '</div>' +
            '</div>' +
          '</div>';

      case 'material-reveal':
        return '' +
          '<div class="atg-tx atg-tx--material-reveal">' +
            '<div class="tx3-bg"></div>' +
            '<div class="tx3-pattern"></div>' +
            '<div class="tx3-sheen"></div>' +
            '<div class="tx3-center">' +
              '<div class="tx3-rule tx3-rule--t"></div>' +
              '<div class="tx3-wordmark atg-tx__wordmark">ATG</div>' +
              '<div class="tx3-caption atg-tx__caption">Architectural Metalwork</div>' +
              '<div class="tx3-rule tx3-rule--b"></div>' +
            '</div>' +
          '</div>';

      case 'crafted-motion':
        return '' +
          '<div class="atg-tx atg-tx--crafted-motion">' +
            '<div class="tx4-panel tx4-a"></div>' +
            '<div class="tx4-panel tx4-b"></div>' +
            '<div class="tx4-panel tx4-c"></div>' +
            '<div class="tx4-accent"></div>' +
            '<div class="tx4-center">' +
              '<div class="tx4-wordmark atg-tx__wordmark">ATG</div>' +
              '<div class="atg-tx__caption">Metal Works &amp; Interiors</div>' +
            '</div>' +
          '</div>';

      default: /* reduced-motion / fallback fade */
        return '' +
          '<div class="atg-tx atg-tx--fade">' +
            '<div class="atg-tx__wordmark">ATG</div>' +
          '</div>';
    }
  }

  /* ---------- core play routine ---------- */

  /**
   * Play a transition overlay inside `container`.
   * @param {HTMLElement} container  Positioned ancestor (or document.body for fullscreen).
   * @param {string} concept         One of CONCEPTS.
   * @param {object} [opts]          { onCovered, onNav, onDone }
   * @returns {Promise<boolean>}     false if a transition was already running.
   */
  function play(container, concept, opts) {
    opts = opts || {};
    if (playing) return Promise.resolve(false);       // prevent duplicate triggers
    if (CONCEPTS.indexOf(concept) === -1) concept = config.concept;

    var reduced = prefersReducedMotion();
    var t = reduced ? TR : T;
    var used = reduced ? 'fade' : concept;

    playing = true;
    clearTimers();

    var targetContainer = container || document.body || document.documentElement;
    var root = document.createElement('div');
    root.className = 'atg-tx-root' + (targetContainer === document.body || targetContainer === document.documentElement ? ' atg-tx-root--fixed' : '');
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML =
      template(used) +
      '<span role="status" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;">Loading page</span>';

    /* Ensure the container can anchor the overlay. */
    var prevPosition = '';
    if (targetContainer !== document.body && targetContainer !== document.documentElement) {
      prevPosition = targetContainer.style.position;
      if (window.getComputedStyle(targetContainer).position === 'static') {
        targetContainer.style.position = 'relative';
      }
    }
    targetContainer.appendChild(root);
    activeRoot = root;

    /* Force a style flush, then start the enter phase. */
    void root.offsetWidth;
    root.classList.add('is-enter');

    return new Promise(function (resolve) {
      function finish() {
        clearTimers();
        if (root.parentNode) root.parentNode.removeChild(root);
        if (targetContainer !== document.body && targetContainer !== document.documentElement) {
          targetContainer.style.position = prevPosition;
        }
        activeRoot = null;
        playing = false;
        if (typeof opts.onDone === 'function') opts.onDone();
        resolve(true);
      }

      later(function () { if (typeof opts.onCovered === 'function') opts.onCovered(); }, t.covered);
      later(function () { if (typeof opts.onNav === 'function') opts.onNav(); }, t.navAt);
      later(function () { root.classList.add('is-exit'); }, t.exitAt);
      later(finish, t.done);
      later(finish, config.failsafeMs); // hard failsafe — overlay can never get stuck
    });
  }

  /** Immediately remove any active overlay (navigation failure, bfcache restore). */
  function cancel() {
    clearTimers();
    if (activeRoot && activeRoot.parentNode) activeRoot.parentNode.removeChild(activeRoot);
    activeRoot = null;
    playing = false;
  }

  function isIndexUrl(url) {
    if (!url) return false;
    var path = (url.pathname || '').toLowerCase().replace(/\\/g, '/');
    var file = path.split('/').pop();
    return file === '' || file === 'index.html' || file === 'index';
  }

  function isCurrentIndexPage() {
    var path = (window.location.pathname || '').toLowerCase().replace(/\\/g, '/');
    var file = path.split('/').pop();
    if (file === '' || file === 'index.html' || file === 'index') return true;
    var p = document.getElementById('preloader');
    if (p && p.classList.contains('v3')) return true;
    return false;
  }

  function revealIncoming() {
    try {
      var isNavActive = window.sessionStorage && window.sessionStorage.getItem('atg_nav_active') === '1';
      if (!isNavActive) return;

      window.sessionStorage.removeItem('atg_nav_active');
      window.sessionStorage.removeItem('atg_nav_time');

      if (isCurrentIndexPage()) return;

      var reduced = prefersReducedMotion();
      var used = reduced ? 'fade' : config.concept;
      var targetContainer = document.body || document.documentElement;

      var root = document.createElement('div');
      root.className = 'atg-tx-root atg-tx-root--fixed is-covered is-exit';
      root.setAttribute('aria-hidden', 'true');
      root.innerHTML =
        template(used) +
        '<span role="status" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;">Page loaded</span>';

      targetContainer.appendChild(root);
      void root.offsetWidth;

      var cleanupMs = reduced ? 350 : 1100;
      window.setTimeout(function () {
        if (root.parentNode) root.parentNode.removeChild(root);
      }, cleanupMs);

      window.setTimeout(function () {
        if (root.parentNode) root.parentNode.removeChild(root);
      }, config.failsafeMs);
    } catch (e) {}
  }

  /* ---------- live-site link interception ---------- */

  function isModifiedClick(event) {
    return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  }

  function findNavigableAnchor(el) {
    while (el && el !== document.body) {
      if (el.tagName === 'A' && el.getAttribute('href')) return el;
      el = el.parentNode;
    }
    return null;
  }

  function shouldIntercept(anchor) {
    if (anchor.target && anchor.target !== '_self') return false;
    if (anchor.hasAttribute('download')) return false;
    if (anchor.hasAttribute('data-no-transition')) return false;

    var rawHref = anchor.getAttribute('href') || '';
    if (!rawHref || rawHref === '#' || rawHref.indexOf('#') === 0) return false;
    if (rawHref.indexOf('javascript:') === 0 || rawHref.indexOf('mailto:') === 0 || rawHref.indexOf('tel:') === 0) return false;

    var url;
    try { url = new URL(anchor.href, window.location.href); }
    catch (e) { return false; }

    if (url.protocol !== 'http:' && url.protocol !== 'https:' && url.protocol !== 'file:') return false;
    if (url.origin !== window.location.origin && window.location.origin !== 'null') return false;

    var samePath = url.pathname === window.location.pathname && url.search === window.location.search;
    if (samePath && url.hash) return false;
    return true;
  }

  function closeMobileMenuIfOpen() {
    var mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu && (mobileMenu.classList.contains('active') || mobileMenu.classList.contains('is-open'))) {
      mobileMenu.classList.remove('active', 'is-open');
      document.body.classList.remove('menu-open', 'no-scroll');
    }
  }

  function interceptLinks() {
    if (linksBound) return;
    linksBound = true;

    document.addEventListener('click', function (event) {
      if (isModifiedClick(event)) return;
      var anchor = findNavigableAnchor(event.target);
      if (!anchor || !shouldIntercept(anchor) || playing) return;

      var href = anchor.href;
      var url;
      try { url = new URL(href, window.location.href); }
      catch (e) { return; }

      event.preventDefault();
      closeMobileMenuIfOpen();

      var isTargetIndex = isIndexUrl(url);
      try {
        if (isTargetIndex) {
          if (window.sessionStorage) window.sessionStorage.removeItem('atg_nav_active');
        } else {
          if (window.sessionStorage) {
            window.sessionStorage.setItem('atg_nav_active', '1');
            window.sessionStorage.setItem('atg_nav_time', String(Date.now()));
          }
        }
      } catch (e) {}

      play(document.body, config.concept, {
        onNav: function () { window.location.href = href; }
      });
    });

    window.addEventListener('pageshow', function (event) {
      if (event.persisted) cancel();
      else cancel();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      revealIncoming();
      interceptLinks();
    });
  } else {
    revealIncoming();
    interceptLinks();
  }

  window.ATGTransitions = {
    config: config,
    CONCEPTS: CONCEPTS,
    play: play,
    cancel: cancel,
    interceptLinks: interceptLinks,
    revealIncoming: revealIncoming,
    isPlaying: function () { return playing; }
  };
})();
