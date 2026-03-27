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

export const searchCityOrCountry = async (query: string) => {
  const params = new URLSearchParams({ q: query });
  const baseUrl = `${import.meta.env.VITE_API_URL}/osm/search`;

  const response = await fetch(`${baseUrl}?${params}`);

  if (!response.ok) {
    throw new Error(`Search API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data as NominatimFeature[];
};
