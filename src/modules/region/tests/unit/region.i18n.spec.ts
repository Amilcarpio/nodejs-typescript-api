import { expect } from 'chai';
import i18n from '../../../../I18n/i18n';

describe('Region I18n', () => {
  before(() => {
    i18n.configure({
      locales: ['pt', 'en'],
      defaultLocale: 'pt',
      directory: __dirname + '/../../../../I18n',
      objectNotation: true,
      register: global,
    });
  });

  it('should translate region.not_found to English', () => {
    i18n.setLocale('en');
    expect(i18n.__('region.not_found')).to.equal('Region not found.');
  });

  it('should translate region.not_found to Portuguese', () => {
    i18n.setLocale('pt');
    expect(i18n.__('region.not_found')).to.equal('Região não encontrada.');
  });

  it('should translate region.invalid_polygon to English', () => {
    i18n.setLocale('en');
    expect(i18n.__('region.invalid_polygon')).to.equal(
      'Polygon must be a closed loop (first and last points must be the same).'
    );
  });

  it('should translate region.invalid_polygon to Portuguese', () => {
    i18n.setLocale('pt');
    expect(i18n.__('region.invalid_polygon')).to.equal(
      'O polígono deve ser um loop fechado (primeiro e último pontos devem ser iguais).'
    );
  });

  it('should translate region.too_few_coordinates to English', () => {
    i18n.setLocale('en');
    expect(i18n.__('region.too_few_coordinates')).to.equal(
      'Polygon must have at least 4 coordinates to form a closed shape'
    );
  });

  it('should translate region.too_few_coordinates to Portuguese', () => {
    i18n.setLocale('pt');
    expect(i18n.__('region.too_few_coordinates')).to.equal(
      'O polígono deve ter pelo menos 4 coordenadas para formar uma forma fechada'
    );
  });
});
