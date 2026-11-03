const fs = require('fs');

const categoriesMeta = [
  {
    name: 'Gates',
    department: 'Architectural Metalwork',
    headline: 'Gates & Automated Entrance Systems',
    desc: 'Monumental automated sliding, swing, and trackless cantilever estate gates fabricated with heavy structural steel and Italian motors.'
  },
  {
    name: 'Doors',
    department: 'Architectural Metalwork',
    headline: 'Architectural Pivot & French Glass Doors',
    desc: 'Thermally insulated steel pivot portals, Crittall-style French double doors, and fluted teak composite entry doors.'
  },
  {
    name: 'Staircases',
    department: 'Architectural Metalwork',
    headline: 'Master Architectural Staircases',
    desc: 'Engineered central spine floating stairs, wall-cantilevered treads, compact helical spirals, and monolithic steel curves.'
  },
  {
    name: 'Railings & Balustrades',
    department: 'Architectural Metalwork',
    headline: 'Railings & Architectural Balustrades',
    desc: 'Frameless structural glass shoe channels, laser-cut geometric panels, marine 316 tension cables, and fluted brass spindles.'
  },
  {
    name: 'Metal Fabrication',
    department: 'Architectural Metalwork',
    headline: 'Precision Metal Fabrication & Cladding',
    desc: 'Laser-cut architectural space dividers, brushed brass wall cladding, woven steel facades, and custom metalwork.'
  },
  {
    name: 'Structural Steel',
    department: 'Architectural Metalwork',
    headline: 'Structural Steel & Heavy Frameworks',
    desc: 'Certified external fire escapes, cantilevered balcony outriggers, steel-glass porticos, outdoor pergolas, and industrial racks.'
  },
  {
    name: 'Chairs',
    department: 'Furniture & Interiors',
    headline: 'Sculptural Seating & Accent Chairs',
    desc: 'Contemporary steel armchairs in bouclé, minimalist wire dining chairs, blackened steel counter stools, and leather lounge chairs.'
  },
  {
    name: 'Tables',
    department: 'Furniture & Interiors',
    headline: 'Executive Dining, Boardroom & Console Tables',
    desc: 'Nero Marquina black marble tables, solid live-edge African hardwoods, honed travertine consoles, and 10-seater boardroom tables.'
  },
  {
    name: 'Custom Furniture',
    department: 'Furniture & Interiors',
    headline: 'Bespoke Architectural Furniture',
    desc: 'Four-poster steel canopy beds, fluted timber media credenzas, full-length leaner mirrors, and mobile brass bar carts.'
  },
  {
    name: 'Shelves & Storage',
    department: 'Shelving & Storage',
    headline: 'Architectural Shelving & Storage Systems',
    desc: 'Concealed-bracket floating oak ledges, folded steel book shelves, ceiling-hung brass kitchen racks, and room divider units.'
  },
  {
    name: 'Boutique Garment Racks & Retail Displays',
    department: 'Shelving & Storage',
    headline: 'Boutique Garment Rails & Retail Vitrines',
    desc: 'Freestanding brushed brass apparel rails, tiered footwear towers, double-sided merchandising islands, and wall-mounted vitrines.'
  },
  {
    name: 'Kitchen Cabinets',
    department: 'Cabinetry & Joinery',
    headline: 'Contemporary Architectural Kitchen Cabinetry',
    desc: 'Bespoke handleless flush cabinetry suites, dark graphite waterfall islands, two-tone metal suites, and chef prep gantries.'
  },
  {
    name: 'Wardrobes',
    department: 'Cabinetry & Joinery',
    headline: 'Bespoke Dressing Rooms & Wardrobes',
    desc: 'Luxury walk-in dressing suites, fluted acoustic door wardrobes, sliding bronzed mirror suites, and sensor-illuminated organizers.'
  },
  {
    name: 'Aluminium & Glass',
    department: 'Architectural Metalwork',
    headline: 'Aluminium Systems & Architectural Glass',
    desc: 'Floor-to-ceiling thermal sliding patio walls, structural walkable glass floors, Crittall studio screens, and wine cellars.'
  },
  {
    name: 'Interior Solutions',
    department: 'Furniture & Interiors',
    headline: 'Luxury Architectural Interior Solutions',
    desc: 'Clean-burning steel bioethanol fireplaces, acoustic fluted timber media walls, reception concierge desks, and planter screens.'
  }
];

let buildScript = fs.readFileSync('scratch/build-catalogue.js', 'utf8');

// Update code generation in build-catalogue.js to include window.ATG_CATEGORIES
const targetCodeBlock = `const code = \`/**
 * ATG Metal Works & Interiors — Official Design Catalogue Data
 * High-Precision Master Catalogue
 * 15 Verified Architectural Categories × Exactly 9 Featured Designs = 135 Designs
 * Calibrated with Real Architectural Imagery, Exact Matching Specs & Realistic Nigerian Market Pricing
 */

(function () {
    'use strict';

    window.ATG_CATEGORIES = \${JSON.stringify(categoriesMeta, null, 4)};

    window.ATG_CATALOGUE_DATA = \${JSON.stringify(allDesigns, null, 4)};

    // Helper to fetch designs by category
    window.ATG_GET_DESIGNS_BY_CATEGORY = function(categoryName) {
        if (!categoryName || categoryName === 'all') return window.ATG_CATALOGUE_DATA;
        return window.ATG_CATALOGUE_DATA.filter(function(d) {
            return d.category.toLowerCase() === categoryName.toLowerCase();
        });
    };

    // Helper to get exactly 9 featured designs per category for Services Overview
    window.ATG_GET_FEATURED_BY_CATEGORY = function(categoryName) {
        var pool = window.ATG_GET_DESIGNS_BY_CATEGORY(categoryName);
        return pool.slice(0, 9);
    };
})();
\`;`;

// Replace in build-catalogue.js
buildScript = buildScript.replace(/const code = `[\s\S]*?`;/, targetCodeBlock);
buildScript = `const categoriesMeta = ${JSON.stringify(categoriesMeta, null, 2)};\n` + buildScript;

fs.writeFileSync('scratch/build-catalogue.js', buildScript, 'utf8');
console.log('Updated scratch/build-catalogue.js');

