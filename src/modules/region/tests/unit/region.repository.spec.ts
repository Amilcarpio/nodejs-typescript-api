import '../test-setup';
import { expect } from 'chai';
import { RegionModel } from '../../models/region.model';
import { RegionRepository } from '../../repositories/region.repository';
import { Types } from 'mongoose';

describe('RegionRepository', () => {
  let repository: RegionRepository;
  let regionId: string;

  before(async () => {
    repository = new RegionRepository();
    await RegionModel.deleteMany({});
  });

  after(async () => {
    await RegionModel.deleteMany({});
  });

  it('should create and find a region', async () => {
    const region = await repository.create({
      name: 'RepoTest',
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
    regionId = (region._id as Types.ObjectId).toHexString();
    const found = await repository.findById(regionId);
    expect(found).to.exist;
    expect(found?.name).to.equal('RepoTest');
  });

  it('should update a region', async () => {
    const updated = await repository.update(regionId, { name: 'RepoUpdated' });
    expect(updated).to.exist;
    expect(updated?.name).to.equal('RepoUpdated');
  });

  it('should not update a non-existent region', async () => {
    const fakeId = new Types.ObjectId().toHexString();
    const updated = await repository.update(fakeId, { name: 'NotFound' });
    expect(updated).to.be.null;
  });

  it('should get all regions', async () => {
    const all = await repository.getAll();
    expect(all).to.be.an('array');
    expect(all.length).to.be.greaterThan(0);
  });

  it('should find region by point', async () => {
    const found = await repository.findByPoint({
      longitude: 0.5,
      latitude: 0.5,
    });
    expect(found).to.be.an('array');
    expect(found.length).to.be.greaterThan(0);
    expect(found[0].name).to.equal('RepoUpdated');
  });

  it('should find region by distance', async () => {
    const found = await repository.findByDistance({
      longitude: 0.5,
      latitude: 0.5,
      distance: 100000,
    });
    expect(found).to.be.an('array');
    expect(found.length).to.be.greaterThan(0);
  });

  it('should delete a region', async () => {
    const deleted = await repository.delete(regionId);
    expect(deleted).to.be.true;
    const found = await repository.findById(regionId);
    expect(found).to.be.null;
  });

  it('should not delete a non-existent region', async () => {
    const fakeId = new Types.ObjectId().toHexString();
    const deleted = await repository.delete(fakeId);
    expect(deleted).to.be.false;
  });
});
