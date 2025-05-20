import chai, { expect } from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
import { RegionService } from '../../services/region.service';
import { RegionRepository } from '../../repositories/region.repository';
import { geocodingService } from '../../../../common/services/geocoding.service';
import { ApplicationError } from '../../../../common/errors/application-error';

const fakeRegion = {
  id: '1',
  name: 'Test Region',
  geometry: {
    type: 'Polygon' as const,
    coordinates: [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 0],
      ],
    ],
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('RegionService', () => {
  let repository: sinon.SinonStubbedInstance<RegionRepository>;
  let service: RegionService;

  beforeEach(() => {
    repository = sinon.createStubInstance(RegionRepository);
    service = new RegionService(repository as unknown as RegionRepository);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('- Test 1 - should get all regions', async () => {
    repository.getAll.resolves([fakeRegion]);
    const result = await service.getAll();
    expect(result).to.deep.equal([fakeRegion]);
  });

  it('- Test 2 - should get region by id', async () => {
    repository.findById.resolves(fakeRegion);
    const result = await service.getById('1');
    expect(result).to.deep.equal(fakeRegion);
  });

  it('- Test 3 - should throw if region not found by id', async () => {
    repository.findById.resolves(null);
    await expect(service.getById('notfound')).to.be.rejectedWith(
      ApplicationError
    );
  });

  it('- Test 4 - should create a region with valid polygon', async () => {
    repository.create.resolves(fakeRegion);
    const result = await service.create({
      name: 'Test',
      geometry: fakeRegion.geometry,
    });
    expect(result).to.deep.equal(fakeRegion);
  });

  it('- Test 5 - should throw if polygon is not closed', async () => {
    const invalid = {
      name: 'Test',
      geometry: {
        type: 'Polygon' as const,
        coordinates: [
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [2, 2],
          ],
        ],
      },
    };
    await expect(service.create(invalid)).to.be.rejectedWith(ApplicationError);
  });

  it('- Test 6 - should update a region', async () => {
    repository.update.resolves(fakeRegion);
    const result = await service.update('1', { name: 'Updated' });
    expect(result).to.deep.equal(fakeRegion);
  });

  it('- Test 7 - should throw if update not found', async () => {
    repository.update.resolves(null);
    await expect(service.update('notfound', { name: 'x' })).to.be.rejectedWith(
      ApplicationError
    );
  });

  it('- Test 8 - should delete a region', async () => {
    repository.delete.resolves(true);
    await expect(service.delete('1')).to.be.fulfilled;
  });

  it('- Test 9 - should throw if delete not found', async () => {
    repository.delete.resolves(false);
    await expect(service.delete('notfound')).to.be.rejectedWith(
      ApplicationError
    );
  });

  it('- Test 10 - should find regions by point', async () => {
    repository.findByPoint.resolves([fakeRegion]);
    const result = await service.findRegionsByPoint({
      longitude: 0,
      latitude: 0,
    });
    expect(result).to.deep.equal([fakeRegion]);
  });

  it('- Test 11 - should find regions by distance', async () => {
    repository.findByDistance.resolves([fakeRegion]);
    const result = await service.findRegionsByDistance({
      longitude: 0,
      latitude: 0,
      distance: 100,
    });
    expect(result).to.deep.equal([fakeRegion]);
  });

  it('- Test 12 - should find addresses using geocoding', async () => {
    const fakeGeocode = [
      {
        latitude: 0,
        longitude: 0,
        formattedAddress: 'Test',
      },
    ];
    const geoStub = sinon
      .stub(geocodingService, 'geocodeAddressMultiple')
      .resolves(fakeGeocode);
    const result = await service.findRegionsByAddress({ address: 'Rua X' });
    expect(result).to.deep.equal(fakeGeocode);
    geoStub.restore();
  });

  it('- Test 13 - should return empty if geocoding fails', async () => {
    const geoStub = sinon
      .stub(geocodingService, 'geocodeAddress')
      .resolves(null);
    const result = await service.findRegionsByAddress({ address: 'Rua X' });
    expect(result).to.deep.equal([]);
    geoStub.restore();
  });
});
