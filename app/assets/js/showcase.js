/* ============================================================
   ATG Page Transition Concepts — showcase logic
   Concept selection, preview/replay controls, and the simulated
   website pages inside the preview window.
   ============================================================ */

(function () {
  'use strict';

  var CONCEPT_INFO = {
    'precision-line': {
      name: 'Precision Line',
      desc: 'A minimal architectural transition inspired by precision metal fabrication and technical drawing. Thin gold lines draw a refined geometric frame on a deep-dark surface, the ATG mark appears, and a subtle cream progress line completes the transition before the overlay lifts away.'
    },
    'golden-frame': {
      name: 'Golden Frame',
      desc: 'A premium frame-based transition inspired by luxury architectural entrances. A refined gold frame appears at the centre and expands until its black surface covers the screen; the ATG wordmark shows briefly, then the frame opens like a beautifully designed doorway to reveal the page.'
    },
    'material-reveal': {
      name: 'Material Reveal',
      desc: 'A material-inspired transition representing ATG’s metalwork and interior craftsmanship. A soft gold highlight sweeps across a dark surface, revealing a fine crafted pattern and a short brand label, before the surface slides away. Pure CSS — lightweight and smooth.'
    },
    'crafted-motion': {
      name: 'Crafted Motion',
      desc: 'A modern, dynamic transition inspired by assembling precise architectural components. Three clean panels enter from different directions and align into one composition; a gold accent line travels across, the ATG mark appears, and the panels separate to reveal the page.'
    }
  };

  var MOCK_PAGES = {
    services: {
      kicker: 'What we do',
      title: 'Services',
      text: 'Bespoke metal fabrication, architectural metalwork and interior fit-out — engineered, crafted and installed by one team.',
      tiles: ['Fabrication', 'Architectural', 'Interiors']
    },
    gallery: {
      kicker: 'Selected work',
      title: 'Gallery',
      text: 'A curated view of staircases, balustrades, feature walls and custom pieces delivered for residential and commercial spaces.',
      tiles: ['Staircases', 'Feature walls', 'Custom pieces']
    },
    company: {
      kicker: 'Who we are',
      title: 'Company',
      text: 'ATG Metal Works & Interiors combines a fabrication workshop with a design studio — precision at every scale.',
      tiles: ['Workshop', 'Studio', 'Team']
    },
    insights: {
      kicker: 'Notes & ideas',
      title: 'Insights',
      text: 'Thinking on materials, detailing and the craft of modern metalwork in architecture and interior design.',
      tiles: ['Materials', 'Detailing', 'Process']
    },
    contact: {
      kicker: 'Start a conversation',
      title: 'Contact',
      text: 'Tell us about your project — from a single statement piece to a full interior package.',
      tiles: ['Enquire', 'Visit', 'Call']
    }
  };

  var selectedConcept = 'material-reveal';
  var currentPage = 'services';
  var hasPlayed = false;

  var stageViewport = document.getElementById('stage-viewport');
  var stageUrl = document.getElementById('stage-url');
  var mockPage = document.getElementById('mock-page');
  var detailName = document.getElementById('detail-name');
  var detailDesc = document.getElementById('detail-desc');
  var btnPreview = document.getElementById('btn-preview');
  var btnReplay = document.getElementById('btn-replay');
  var conceptCards = Array.prototype.slice.call(document.querySelectorAll('.concept-card'));
  var mockLinks = Array.prototype.slice.call(document.querySelectorAll('.mock-link'));

  function renderMockPage(key) {
    var p = MOCK_PAGES[key];
    mockPage.innerHTML =
      '<p class="mock-page__kicker">' + p.kicker + '</p>' +
      '<h3 class="mock-page__title">' + p.title + '</h3>' +
      '<p class="mock-page__text">' + p.text + '</p>' +
      '<div class="mock-page__grid">' +
        p.tiles.map(function (t) { return '<div class="mock-tile"><span>' + t + '</span></div>'; }).join('') +
      '</div>';
    stageUrl.textContent = 'atgmetalworks.com/' + key;
    mockLinks.forEach(function (link) {
      if (link.getAttribute('data-page') === key) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function setDetail(concept) {
    detailName.textContent = CONCEPT_INFO[concept].name;
    detailDesc.textContent = CONCEPT_INFO[concept].desc;
  }

  function selectConcept(concept, autoplay) {
    selectedConcept = concept;
    window.ATGTransitions.config.concept = concept; // the single configuration value
    conceptCards.forEach(function (card) {
      card.setAttribute('aria-pressed', String(card.getAttribute('data-concept') === concept));
    });
    setDetail(concept);
    if (autoplay) playPreview();
  }

  function playPreview() {
    window.ATGTransitions.play(stageViewport, selectedConcept).then(function (played) {
      if (played) {
        hasPlayed = true;
        btnReplay.disabled = false;
        btnPreview.textContent = 'Preview Again';
      }
    });
  }

  /* Simulated internal navigation: the mock page swaps while the
     overlay covers the preview window — exactly how the real
     integration swaps destination content underneath. */
  function navigateMock(page) {
    if (page === currentPage || window.ATGTransitions.isPlaying()) return;
    window.ATGTransitions.play(stageViewport, selectedConcept, {
      onCovered: function () {
        currentPage = page;
        renderMockPage(page);
      }
    }).then(function (played) {
      if (played) { hasPlayed = true; btnReplay.disabled = false; btnPreview.textContent = 'Preview Again'; }
    });
  }

  conceptCards.forEach(function (card) {
    card.addEventListener('click', function () {
      selectConcept(card.getAttribute('data-concept'), true);
    });
  });

  mockLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navigateMock(link.getAttribute('data-page'));
    });
  });

  btnPreview.addEventListener('click', playPreview);
  btnReplay.addEventListener('click', playPreview);

  /* initial state */
  renderMockPage(currentPage);
  setDetail(selectedConcept);
})();
