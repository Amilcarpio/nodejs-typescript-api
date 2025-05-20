import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { application } from '../../../../server';
import { RegionModel } from '../../models/region.model';
import { geocodingService } from '../../../../common/services/geocoding.service';

describe('Region API Integration', () => {
  let saoPauloRegion: string;
  const ids: Record<string, string> = {};

  before(async () => {
    await RegionModel.deleteMany({});
  });

  after(async () => {
    await RegionModel.deleteMany({});
    sinon.restore();
  });

  it('POST - /api/regions/ - 01 - Should create São Paulo region', async () => {
    const res = await request(application)
      .post('/api/regions/')
      .send({
        name: 'São Paulo',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-46.693419, -23.568704],
              [-46.641146, -23.568704],
              [-46.641146, -23.525024],
              [-46.693419, -23.525024],
              [-46.693419, -23.568704],
            ],
          ],
        },
      });
    expect(res.status).to.equal(201);
    expect(res.body.name).to.equal('São Paulo');
    saoPauloRegion = res.body._id;
  });

  it('GET - /api/regions/:id - 02 - Should return São Paulo region', async () => {
    const res = await request(application).get(
      `/api/regions/${saoPauloRegion}`
    );
    expect(res.status).to.equal(200);
    expect(res.body.name).to.equal('São Paulo');
    expect(res.body.geometry.type).to.equal('Polygon');
    expect(res.body.geometry.coordinates).to.be.an('array');
    expect(res.body.geometry.coordinates[0][0]).to.deep.equal([
      -46.693419, -23.568704,
    ]);
    expect(res.body.geometry.coordinates[0][1]).to.deep.equal([
      -46.641146, -23.568704,
    ]);
    expect(res.body.geometry.coordinates[0][2]).to.deep.equal([
      -46.641146, -23.525024,
    ]);
    expect(res.body.geometry.coordinates[0][3]).to.deep.equal([
      -46.693419, -23.525024,
    ]);
  });

  it('GET - /api/regions/query/distance - 03 - Should return São Paulo region by coordinates', async () => {
    const res = await request(application).get(
      '/api/regions/query/distance?longitude=-46.633308&latitude=-23.55052&distance=10000'
    );
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect((res.body as { name: string }[]).some((r) => r.name === 'São Paulo'))
      .to.be.true;
  });

  it('GET - /api/regions/query/address - 04 - Should get the address using the geocoding service', async () => {
    sinon.stub(geocodingService, 'geocodeAddressMultiple').resolves([
      {
        latitude: -22.906847,
        longitude: -43.172896,
        formattedAddress: 'Rio de Janeiro, RJ, Brasil',
      },
    ]);
    const res = await request(application).get(
      '/api/regions/query/address?address=Rio+de+Janeiro'
    );
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0].formattedAddress).to.include('Rio de Janeiro');
  });

  it('GET - /api/regions/query/point - 05 - Should return São Paulo region by coordinates', async () => {
    const res = await request(application).get(
      '/api/regions/query/point?longitude=-46.66&latitude=-23.55'
    );
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect((res.body as { name: string }[]).some((r) => r.name === 'São Paulo'))
      .to.be.true;
  });

  it('PUT - /api/regions/:id - 06 - Should update São Paulo region', async () => {
    const res = await request(application)
      .put(`/api/regions/${saoPauloRegion}`)
      .send({ name: 'São Paulo Updated' });
    expect(res.status).to.equal(200);
    expect(res.body.name).to.equal('São Paulo Updated');
  });

  it('DELETE - /api/regions/:id - 07 - Should delete São Paulo region', async () => {
    const res = await request(application).delete(
      `/api/regions/${saoPauloRegion}`
    );
    expect(res.status).to.equal(204);
    const getRes = await request(application).get(
      `/api/regions/${saoPauloRegion}`
    );
    expect(getRes.status).to.equal(404);
  });

  it('GET - /api/regions/:id - 08 - Should return 404 for non-existent region', async () => {
    const res = await request(application).get(
      '/api/regions/000000000000000000000000'
    );
    expect(res.status).to.equal(404);
  });

  it('PUT - /api/regions/:id - 09 - Should return 404 for non-existent region', async () => {
    const res = await request(application)
      .put('/api/regions/000000000000000000000000')
      .set('Accept-Language', 'en')
      .send({ name: 'Non-existent' });
    expect(res.status).to.equal(404);
  });

  it('DELETE - /api/regions/:id - 10 - Should return 404 for non-existent region', async () => {
    const res = await request(application).delete(
      '/api/regions/000000000000000000000000'
    );
    expect(res.status).to.equal(404);
  });

  it('POST - /api/regions/ - 11 - Should return 400 for invalid polygon', async () => {
    const res = await request(application)
      .post('/api/regions/')
      .set('Accept-Language', 'en')
      .send({
        name: 'Invalid',
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
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal(
      'Polygon must be a closed loop (first and last points must be the same).'
    );
  });

  it('POST - /api/regions/ - 12 - Should create regions for major Brazilian cities', async () => {
    const cities: { name: string; coordinates: [number, number][] }[] = [
      {
        name: 'São Paulo',
        coordinates: [
          [-46.693419, -23.568704],
          [-46.641146, -23.568704],
          [-46.641146, -23.525024],
          [-46.693419, -23.525024],
          [-46.693419, -23.568704],
        ],
      },
      {
        name: 'Rio de Janeiro',
        coordinates: [
          [-43.233656, -22.964527],
          [-43.100586, -22.964527],
          [-43.100586, -22.874699],
          [-43.233656, -22.874699],
          [-43.233656, -22.964527],
        ],
      },
      {
        name: 'Belo Horizonte',
        coordinates: [
          [-44.05, -19.975],
          [-43.9, -19.975],
          [-43.9, -19.85],
          [-44.05, -19.85],
          [-44.05, -19.975],
        ],
      },
      {
        name: 'Brasília',
        coordinates: [
          [-48.03, -15.87],
          [-47.85, -15.87],
          [-47.85, -15.7],
          [-48.03, -15.7],
          [-48.03, -15.87],
        ],
      },
      {
        name: 'Salvador',
        coordinates: [
          [-38.6, -12.95],
          [-38.4, -12.95],
          [-38.4, -12.8],
          [-38.6, -12.8],
          [-38.6, -12.95],
        ],
      },
    ];
    for (const city of cities) {
      const res = await request(application)
        .post('/api/regions/')
        .send({
          name: city.name,
          geometry: {
            type: 'Polygon',
            coordinates: [city.coordinates],
          },
        });
      expect(res.status).to.equal(201);
      expect(res.body.name).to.equal(city.name);
      ids[city.name] = res.body._id;
    }
  });

  it('GET - /api/regions/query/point - 13 - Should find São Paulo by point', async () => {
    const res = await request(application).get(
      '/api/regions/query/point?longitude=-46.65&latitude=-23.55'
    );
    expect(res.status).to.equal(200);
    expect((res.body as { name: string }[]).some((r) => r.name === 'São Paulo'))
      .to.be.true;
  });

  it('GET - /api/regions/query/distance - 14 - Should find regions within 200km of Belo Horizonte', async () => {
    const res = await request(application).get(
      '/api/regions/query/distance?longitude=-43.94&latitude=-19.92&distance=200000'
    );
    expect(res.status).to.equal(200);
    expect(
      (res.body as { name: string }[]).some((r) => r.name === 'Belo Horizonte')
    ).to.be.true;
  });

  it('PUT - /api/regions/:id - 15 - Should update Brasília region name', async () => {
    const res = await request(application)
      .put(`/api/regions/${ids['Brasília']}`)
      .send({ name: 'Brasília DF' });
    expect(res.status).to.equal(200);
    expect(res.body.name).to.equal('Brasília DF');
  });

  it('DELETE - /api/regions/:id - 16 - Should delete Salvador region', async () => {
    const res = await request(application).delete(
      `/api/regions/${ids['Salvador']}`
    );
    expect(res.status).to.equal(204);
    const getRes = await request(application).get(
      `/api/regions/${ids['Salvador']}`
    );
    expect(getRes.status).to.equal(404);
  });

  it('POST - /api/regions/ - 17 - Should return 400 for open polygon', async () => {
    const res = await request(application)
      .post('/api/regions/')
      .send({
        name: 'Open Polygon',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-40, -10],
              [-41, -10],
              [-41, -11],
              // missing closing point
            ],
          ],
        },
      });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.match(/closed loop|fechado/i);
  });

  it('POST - /api/regions/ - 18 - Should return 400 for polygon with less than 4 points', async () => {
    const res = await request(application)
      .post('/api/regions/')
      .send({
        name: 'Few Points',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-40, -10],
              [-41, -10],
              [-41, -11],
            ],
          ],
        },
      });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.match(/closed loop|fechado/i);
  });
});
