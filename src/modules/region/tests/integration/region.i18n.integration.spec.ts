import { expect } from 'chai';
import request from 'supertest';
import { application } from '../../../../server';

describe('Region API I18n Integration', () => {
  it('should return region.not_found in English', async () => {
    const res = await request(application)
      .get('/api/regions/000000000000000000000000')
      .set('Accept-Language', 'en');
    expect(res.status).to.equal(404);
    expect(res.body.message).to.equal('Region not found.');
  });

  it('should return region.not_found in Portuguese', async () => {
    const res = await request(application)
      .get('/api/regions/000000000000000000000000')
      .set('Accept-Language', 'pt');
    expect(res.status).to.equal(404);
    expect(res.body.message).to.equal('Região não encontrada.');
  });

  it('should return region.invalid_polygon in English', async () => {
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
    expect(res.body.message).to.satisfy(
      (msg: string) =>
        msg ===
          'Polygon must have at least 4 coordinates to form a closed shape' ||
        msg ===
          'Polygon must be a closed loop (first and last points must be the same).'
    );
  });

  it('should return region.invalid_polygon in Portuguese', async () => {
    const res = await request(application)
      .post('/api/regions/')
      .set('Accept-Language', 'pt')
      .send({
        name: 'Inválido',
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
    expect(res.body.message).to.satisfy(
      (msg: string) =>
        msg ===
          'O polígono deve ter pelo menos 4 coordenadas para formar uma forma fechada' ||
        msg ===
          'O polígono deve ser um loop fechado (primeiro e último pontos devem ser iguais).'
    );
  });
});
