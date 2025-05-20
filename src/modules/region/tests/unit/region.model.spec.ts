import '../test-setup';
import { expect } from 'chai';
import { RegionModel } from '../../models/region.model';

describe('RegionModel', () => {
  it('should create a region document with correct fields', async () => {
    const region = await RegionModel.create({
      name: 'Test City',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 0],
          ],
        ],
      },
    });
    expect(region).to.have.property('name', 'Test City');
    expect(region.geometry.type).to.equal('Polygon');
    expect(region.geometry.coordinates[0].length).to.be.greaterThan(2);
    await RegionModel.findByIdAndDelete(region._id);
  });

  it('should require name and geometry', async () => {
    try {
      await RegionModel.create({});
    } catch (err: unknown) {
      expect(err).to.exist;
      const error = err as { errors?: { name?: unknown; geometry?: unknown } };
      expect(error.errors?.name).to.exist;
      expect(error.errors?.geometry).to.exist;
    }
  });
});
