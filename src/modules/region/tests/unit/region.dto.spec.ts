import { expect } from 'chai';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateRegionDTO, UpdateRegionDTO } from '../../dtos/region.dto';

describe('RegionDTO', () => {
  it('should validate a valid CreateRegionDTO', async () => {
    const dto = plainToInstance(CreateRegionDTO, {
      name: 'Valid Name',
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
    const errors = await validate(dto);
    expect(errors.length).to.equal(0);
  });

  it('should fail if name is too short', async () => {
    const dto = plainToInstance(CreateRegionDTO, {
      name: 'A',
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
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'name')).to.be.true;
  });

  it('should fail if geometry is missing', async () => {
    const dto = plainToInstance(CreateRegionDTO, {
      name: 'Valid Name',
    });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'geometry')).to.be.true;
  });

  it('should validate a valid UpdateRegionDTO (partial)', async () => {
    const dto = plainToInstance(UpdateRegionDTO, {
      name: 'Update',
    });
    const errors = await validate(dto);
    expect(errors.length).to.equal(0);
  });

  it('should fail UpdateRegionDTO with invalid geometry', async () => {
    const dto = plainToInstance(UpdateRegionDTO, {
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [1, 0],
            [1, 1],
          ],
        ],
      },
    });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'geometry')).to.be.true;
  });
});
