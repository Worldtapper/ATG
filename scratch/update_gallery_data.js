const fs = require('fs');
const path = require('path');

const filePath = path.resolve('JS/gallery-data.js');
let code = fs.readFileSync(filePath, 'utf8');

const mapping = {
  'atg-proj-01': { division: 'Metal Fabrication', category: 'Gates & Portals' },
  'atg-proj-02': { division: 'Interiors', category: 'Architectural Partitions' },
  'atg-proj-03': { division: 'Metal Fabrication', category: 'Staircases' },
  'atg-proj-04': { division: 'Interiors', category: 'Wardrobes & Dressing' },
  'atg-proj-05': { division: 'Interiors', category: 'Boutique Displays' },
  'atg-proj-06': { division: 'Metal Fabrication', category: 'Pergolas & Canopies' },
  'atg-proj-07': { division: 'Interiors', category: 'Interior Solutions' },
  'atg-proj-08': { division: 'Interiors', category: 'Tables & Desks' },
  'atg-proj-09': { division: 'Metal Fabrication', category: 'Balustrades & Railings' },
  'atg-proj-10': { division: 'Metal Fabrication', category: 'Structural Steel' },
  'atg-proj-11': { division: 'Interiors', category: 'Kitchen Cabinetry' },
  'atg-proj-12': { division: 'Interiors', category: 'Boutique Displays' },
  'atg-proj-13': { division: 'Metal Fabrication', category: 'Laser Screens & Cladding' },
  'atg-proj-14': { division: 'Metal Fabrication', category: 'Gates & Portals' },
  'atg-proj-15': { division: 'Interiors', category: 'Custom Furniture' },
  'atg-proj-16': { division: 'Metal Fabrication', category: 'Structural Steel' },
  'atg-proj-17': { division: 'Interiors', category: 'Shelves & Storage' },
  'atg-proj-18': { division: 'Interiors', category: 'Boutique Displays' }
};

for (const [id, info] of Object.entries(mapping)) {
  const target = '"id": "' + id + '",';
  // Check if division already present
  if (code.includes('"id": "' + id + '",\n        "division":')) {
    console.log(id, 'already has division');
    continue;
  }
  const replacement = '"id": "' + id + '",\n        "division": "' + info.division + '",\n        "category": "' + info.category + '",\n        "status": "Completed",';
  if (code.includes(target)) {
    code = code.replace(target, replacement);
    console.log('Updated', id);
  } else {
    console.warn('Target not found for id:', id);
  }
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully updated JS/gallery-data.js with division, category, and status.');

