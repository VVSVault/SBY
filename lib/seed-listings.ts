import type { Listing } from './listing-provider';

// Phoenix-area neighborhoods
const phoenixNeighborhoods = [
  { city: 'Phoenix', zip: '85001' },
  { city: 'Phoenix', zip: '85004' },
  { city: 'Phoenix', zip: '85006' },
  { city: 'Phoenix', zip: '85008' },
  { city: 'Phoenix', zip: '85012' },
  { city: 'Phoenix', zip: '85016' },
  { city: 'Phoenix', zip: '85018' },
  { city: 'Phoenix', zip: '85020' },
  { city: 'Phoenix', zip: '85022' },
  { city: 'Phoenix', zip: '85028' },
  { city: 'Scottsdale', zip: '85250' },
  { city: 'Scottsdale', zip: '85251' },
  { city: 'Scottsdale', zip: '85254' },
  { city: 'Scottsdale', zip: '85255' },
  { city: 'Tempe', zip: '85281' },
  { city: 'Tempe', zip: '85282' },
  { city: 'Tempe', zip: '85283' },
  { city: 'Mesa', zip: '85201' },
  { city: 'Mesa', zip: '85202' },
  { city: 'Mesa', zip: '85203' },
  { city: 'Chandler', zip: '85224' },
  { city: 'Chandler', zip: '85225' },
  { city: 'Gilbert', zip: '85233' },
  { city: 'Gilbert', zip: '85234' },
  { city: 'Glendale', zip: '85301' },
  { city: 'Glendale', zip: '85302' },
  { city: 'Peoria', zip: '85345' },
  { city: 'Peoria', zip: '85383' },
  { city: 'Surprise', zip: '85374' },
  { city: 'Surprise', zip: '85378' },
];

const streetNames = [
  'Oak Street',
  'Maple Avenue',
  'Pine Lane',
  'Cedar Drive',
  'Elm Court',
  'Birch Way',
  'Willow Road',
  'Ash Boulevard',
  'Sycamore Circle',
  'Juniper Place',
  'Desert View',
  'Mountain Ridge',
  'Canyon Trail',
  'Sunset Drive',
  'Cactus Road',
  'Saguaro Way',
  'Palm Springs',
  'Vista Grande',
  'Mesa View',
  'Valley Lane',
];

const features = [
  'Updated kitchen with granite countertops',
  'Hardwood floors throughout',
  'Large master suite with walk-in closet',
  'Fenced backyard with patio',
  'Two-car garage',
  'Energy-efficient windows',
  'Stainless steel appliances',
  'Open floor plan',
  'Vaulted ceilings',
  'Fireplace in living room',
  'Custom cabinetry',
  'Smart home technology',
  'Solar panels',
  'Pool and spa',
  'Mountain views',
  'Desert landscaping',
  'RV parking',
  'Guest casita',
  'Covered patio',
  'Updated bathrooms',
];

const descriptions = [
  'Beautiful home in a quiet neighborhood with updated kitchen, hardwood floors, and spacious backyard. Close to schools, parks, and shopping.',
  'Stunning property featuring modern finishes, open floor plan, and desert landscaping. Perfect for families looking for space and comfort.',
  'Charming residence with mountain views, updated fixtures, and energy-efficient features. Move-in ready with fresh paint throughout.',
  'Spacious home with pool, large lot, and plenty of room for entertaining. Great location near dining and entertainment.',
  'Well-maintained property with recent updates including new flooring, appliances, and landscaping. Quiet cul-de-sac location.',
  'Contemporary home with smart technology, solar panels, and modern design. Low maintenance yard with desert landscaping.',
  'Family-friendly home near top-rated schools with large backyard and covered patio. Perfect for Arizona living.',
  'Updated property featuring granite counters, stainless appliances, and custom cabinetry. Great curb appeal.',
  'Cozy home with fireplace, vaulted ceilings, and plenty of natural light. Well-kept neighborhood with community amenities.',
  'Excellent opportunity in desirable area. Recent updates include new HVAC, roof, and flooring. Ready for immediate move-in.',
];

export const seedListings: Listing[] = Array.from({ length: 30 }, (_, i) => {
  const neighborhood = phoenixNeighborhoods[i % phoenixNeighborhoods.length];
  const beds = [2, 3, 3, 4, 4, 4, 5][i % 7];
  const baths = beds === 2 ? 2 : beds === 3 ? 2 : beds === 4 ? 2.5 : 3;
  const sqft = beds * 600 + Math.floor(Math.random() * 400);
  const price = sqft * (Math.random() * 100 + 200);
  const yearBuilt = 1990 + Math.floor(Math.random() * 34);
  const daysOnMarket = Math.floor(Math.random() * 45);

  return {
    id: `listing-${i + 1}`,
    mlsId: `AZ${100000 + i}`,
    address: `${1000 + i * 100} ${streetNames[i % streetNames.length]}`,
    city: neighborhood.city,
    state: 'AZ',
    zip: neighborhood.zip,
    price: Math.round(price / 1000) * 1000,
    beds,
    baths,
    sqft,
    lotSizeSqft: sqft * 2 + Math.floor(Math.random() * 2000),
    yearBuilt,
    photos: [
      '/stockimagehome.jpg',
      '/stockimagehome.jpg',
      '/stockimagehome.jpg',
      '/stockimagehome.jpg',
    ],
    description: descriptions[i % descriptions.length],
    latitude: 33.4484 + (Math.random() - 0.5) * 0.5,
    longitude: -112.074 + (Math.random() - 0.5) * 0.5,
    status: 'active',
    features: [
      features[i % features.length],
      features[(i + 5) % features.length],
      features[(i + 10) % features.length],
      features[(i + 15) % features.length],
    ],
    propertyType: 'Single Family',
    daysOnMarket,
  };
});
