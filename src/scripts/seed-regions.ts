import mongoose from 'mongoose';
import { RegionSchema } from '../modules/region/models/region.model';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/ozmap';

const RegionModel = mongoose.model('Region', RegionSchema);

const regions = [
  {
    name: 'Vila Mariana',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-46.634437, -23.589548],
          [-46.629837, -23.589548],
          [-46.629837, -23.584548],
          [-46.634437, -23.584548],
          [-46.634437, -23.589548],
        ],
      ],
    },
  },
  {
    name: 'Pinheiros',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-46.701, -23.561],
          [-46.691, -23.561],
          [-46.691, -23.551],
          [-46.701, -23.551],
          [-46.701, -23.561],
        ],
      ],
    },
  },
  {
    name: 'Moema',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-46.658, -23.609],
          [-46.648, -23.609],
          [-46.648, -23.599],
          [-46.658, -23.599],
          [-46.658, -23.609],
        ],
      ],
    },
  },
  {
    name: 'Butantã',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-46.736, -23.573],
          [-46.726, -23.573],
          [-46.726, -23.563],
          [-46.736, -23.563],
          [-46.736, -23.573],
        ],
      ],
    },
  },
  {
    name: 'Tatuapé',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-46.57, -23.54],
          [-46.56, -23.54],
          [-46.56, -23.53],
          [-46.57, -23.53],
          [-46.57, -23.54],
        ],
      ],
    },
  },
  {
    name: 'Santana',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-46.635, -23.49],
          [-46.625, -23.49],
          [-46.625, -23.48],
          [-46.635, -23.48],
          [-46.635, -23.49],
        ],
      ],
    },
  },
  {
    name: 'Ipiranga',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-46.61, -23.6],
          [-46.6, -23.6],
          [-46.6, -23.59],
          [-46.61, -23.59],
          [-46.61, -23.6],
        ],
      ],
    },
  },
  {
    name: 'Liberdade',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-46.64, -23.56],
          [-46.63, -23.56],
          [-46.63, -23.55],
          [-46.64, -23.55],
          [-46.64, -23.56],
        ],
      ],
    },
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    await RegionModel.deleteMany({});
    await RegionModel.insertMany(regions);
    console.log('Regions seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding regions:', err);
    process.exit(1);
  }
}

seed();
