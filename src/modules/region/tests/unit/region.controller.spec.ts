import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import express from 'express';
import { registerControllers } from '../../../../common/decorators/route.decorators';
import { RegionController } from '../../controllers/region.controller';
import { regionService } from '../../services/region.service';

const app = express();
app.use(express.json());
registerControllers(app, [RegionController]);

describe('RegionController', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('GET /api/regions/ - Test 1 - Should return a list and status 200', async () => {
    sandbox.stub(regionService, 'getAll').resolves([
      {
        name: 'Teste',
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
      },
    ]);
    const res = await request(app).get('/api/regions/');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('GET /api/regions/:id - Test 3 - Should return a single region and status 200', async () => {
    sandbox.stub(regionService, 'getById').resolves({
      id: '507f1f77bcf86cd799439011',
      name: 'Teste',
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
    const res = await request(app).get('/api/regions/507f1f77bcf86cd799439011');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('id', '507f1f77bcf86cd799439011');
  });

  it('POST /api/regions/ - Test 4 - Should create a region and return status 201', async () => {
    sandbox.stub(regionService, 'create').resolves({
      id: '1',
      name: 'Teste',
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
    const res = await request(app)
      .post('/api/regions/')
      .send({
        name: 'Teste',
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
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
  });

  it('PUT /api/regions/:id - Test 5 - Should update a region and return status 200', async () => {
    sandbox.stub(regionService, 'update').resolves({
      id: '507f1f77bcf86cd799439011',
      name: 'Atualizado',
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
    const res = await request(app)
      .put('/api/regions/507f1f77bcf86cd799439011')
      .send({ name: 'Atualizado' });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('name', 'Atualizado');
  });

  it('DELETE /api/regions/:id - Test 6 - Should delete a region and return status 204', async () => {
    sandbox.stub(regionService, 'delete').resolves();
    const res = await request(app).delete(
      '/api/regions/507f1f77bcf86cd799439011'
    );
    expect(res.status).to.equal(204);
  });

  it('GET /api/regions/query/point - Test 7 - Should find a region by a point and return status 200', async () => {
    sandbox.stub(regionService, 'findRegionsByPoint').resolves([
      {
        id: '1',
        name: 'Teste',
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
      },
    ]);
    const res = await request(app).get(
      '/api/regions/query/point?longitude=0&latitude=0'
    );
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('GET /api/regions/query/distance - Test 8 - Should find a region by distance and return 200', async () => {
    sandbox.stub(regionService, 'findRegionsByDistance').resolves([
      {
        id: '1',
        name: 'Teste',
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
      },
    ]);
    const res = await request(app).get(
      '/api/regions/query/distance?longitude=0&latitude=0&distance=100'
    );
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });
});
