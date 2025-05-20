import { GOOGLE_MAPS_API_KEY } from '../../config/config';
import {
  Client,
  GeocodeRequest,
  ReverseGeocodeRequest,
} from '@googlemaps/google-maps-services-js';

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

export interface IGeocodingService {
  geocodeAddress(
    address: string,
    countryCode?: string
  ): Promise<GeocodeResult | null>;
  reverseGeocode(lat: number, lng: number): Promise<GeocodeResult | null>;
  geocodeAddressMultiple(
    address: string,
    countryCode?: string
  ): Promise<GeocodeResult[]>;
}

/**
 * Geocoding service for address and coordinate lookups using Google Maps API.
 * Provides methods for geocoding and reverse geocoding.
 */
export class GeocodingService implements IGeocodingService {
  private readonly apiKey: string;
  private readonly client: Client;

  constructor(apiKey: string = GOOGLE_MAPS_API_KEY) {
    this.apiKey = apiKey;
    this.client = new Client({});
  }

  async geocodeAddress(
    address: string,
    countryCode?: string
  ): Promise<GeocodeResult | null> {
    try {
      const params: GeocodeRequest['params'] = {
        address,
        key: this.apiKey,
      };
      if (countryCode) {
        params.region = countryCode;
      }
      const response = await this.client.geocode({ params });
      if (
        response.data.status !== 'OK' ||
        !response.data.results ||
        !response.data.results.length
      ) {
        return null;
      }
      const result = response.data.results[0];
      return {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
      };
    } catch (error) {
      return null;
    }
  }

  async reverseGeocode(
    lat: number,
    lng: number
  ): Promise<GeocodeResult | null> {
    try {
      const params: ReverseGeocodeRequest['params'] = {
        latlng: { lat, lng },
        key: this.apiKey,
      };
      const response = await this.client.reverseGeocode({ params });
      if (
        response.data.status !== 'OK' ||
        !response.data.results ||
        !response.data.results.length
      ) {
        return null;
      }
      const result = response.data.results[0];
      return {
        latitude: lat,
        longitude: lng,
        formattedAddress: result.formatted_address,
      };
    } catch (error) {
      return null;
    }
  }

  async geocodeAddressMultiple(
    address: string,
    countryCode?: string
  ): Promise<GeocodeResult[]> {
    try {
      const params: GeocodeRequest['params'] = {
        address,
        key: this.apiKey,
      };
      if (countryCode) {
        params.region = countryCode;
      }
      const response = await this.client.geocode({ params });
      if (
        response.data.status !== 'OK' ||
        !response.data.results ||
        !response.data.results.length
      ) {
        return [];
      }
      return response.data.results.map((result) => ({
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
      }));
    } catch (error) {
      return [];
    }
  }
}

export const geocodingService: IGeocodingService = new GeocodingService();
