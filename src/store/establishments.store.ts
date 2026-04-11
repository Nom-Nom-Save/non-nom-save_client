import { create } from 'zustand';
import { SortOrder } from '@/types/common.types';
import { EstablishmentsSortBy } from '@/types/establishments.types';

interface EstablishmentsFiltersState {
  distanceFilter: number | null;
  minRating: number | null;
  sortBy: EstablishmentsSortBy;
  sortOrder: SortOrder;
  city: string;
  productTypes: string[] | null;

  setDistanceFilter: (distance: number | null) => void;
  setMinRating: (rating: number | null) => void;
  setSortBy: (sortBy: EstablishmentsSortBy) => void;
  setSortOrder: (sortOrder: SortOrder) => void;
  setCity: (city: string) => void;
  setProductTypes: (types: string[] | null) => void;
  resetFilters: (hasLocation: boolean) => void;
}

export const useEstablishmentsStore = create<EstablishmentsFiltersState>(set => ({
  distanceFilter: null,
  minRating: null,
  sortBy: EstablishmentsSortBy.DISTANCE,
  sortOrder: SortOrder.ASC,
  city: 'All cities',
  productTypes: null,

  setDistanceFilter: distance => set({ distanceFilter: distance }),
  setMinRating: rating => set({ minRating: rating }),
  setSortBy: sortBy => set({ sortBy }),
  setSortOrder: sortOrder => set({ sortOrder }),
  setCity: city => set({ city }),
  setProductTypes: productTypes => set({ productTypes }),
  resetFilters: (hasLocation: boolean) =>
    set({
      distanceFilter: null,
      minRating: null,
      sortBy: EstablishmentsSortBy.DISTANCE,
      sortOrder: SortOrder.ASC,
      productTypes: null,
      city: hasLocation ? 'My location' : 'All cities',
    }),
}));
