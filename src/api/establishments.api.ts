import { BASE_URL } from './client';

export const getNearbyEstablishments = async (lon: number, lat: number, radius: number) => {
  const response = await fetch(
    `${BASE_URL}/establishments/nearby?lat=${lat}&lon=${lon}&radius=${radius}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch nearby establishments: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
};
