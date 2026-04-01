import { apiRequest } from './client';

export interface NominatimFeature {
  properties: {
    osmId?: number;
    name: string;
    type: string;
    countryCode: string;
    country: string;
    state?: string;
    city?: string;
    postcode?: string;
    displayName: string;
  };
}

export const searchCityOrCountry = (query: string) =>
  apiRequest<NominatimFeature[]>(`/osm/search?${new URLSearchParams({ q: query })}`);
