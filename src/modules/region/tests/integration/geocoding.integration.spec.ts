import { expect } from 'chai';
import { geocodingService } from '../../../../common/services/geocoding.service';

describe('GeocodingService Integration', () => {
  it('should return geocode results for a valid address (Google API)', async function () {
    this.timeout(10000);
    const address = 'Avenida Paulista, São Paulo';
    const result = await geocodingService.geocodeAddress(address, 'BR');
    expect(result).to.be.an('object');
    expect(result?.latitude).to.be.a('number');
    expect(result?.longitude).to.be.a('number');
    expect(result?.formattedAddress).to.be.a('string');
    expect(result?.formattedAddress).to.include('Paulista');
  });

  it('should return multiple geocode results for a generic address', async function () {
    this.timeout(10000);
    const address = 'Rua das Flores';
    const results = await geocodingService.geocodeAddressMultiple(
      address,
      'BR'
    );
    expect(results).to.be.an('array');
    expect(results.length).to.be.greaterThan(0);
    expect(results[0].latitude).to.be.a('number');
    expect(results[0].longitude).to.be.a('number');
    expect(results[0].formattedAddress).to.be.a('string');
  });

  it('should return null for an invalid address', async function () {
    this.timeout(10000);
    const address = 'EndereçoQueNaoExiste123456789';
    const result = await geocodingService.geocodeAddress(address, 'BR');
    expect(result).to.be.null;
  });

  it('should return an empty array for geocodeAddressMultiple with invalid address', async function () {
    this.timeout(10000);
    const address = 'EndereçoQueNaoExiste123456789';
    const results = await geocodingService.geocodeAddressMultiple(
      address,
      'BR'
    );
    expect(results).to.be.an('array').that.is.empty;
  });

  it('should reverse geocode valid coordinates', async function () {
    this.timeout(10000);
    // Avenida Paulista coordinates
    const lat = -23.561684;
    const lng = -46.655981;
    const result = await geocodingService.reverseGeocode(lat, lng);
    expect(result).to.be.an('object');
    expect(result?.formattedAddress).to.be.a('string');
    expect(result?.latitude).to.equal(lat);
    expect(result?.longitude).to.equal(lng);
  });

  it('should return null for reverse geocode with invalid coordinates', async function () {
    this.timeout(10000);
    const lat = 0;
    const lng = 0;
    const result = await geocodingService.reverseGeocode(lat, lng);
    expect(result).to.be.null;
  });
});
