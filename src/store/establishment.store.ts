import { create } from 'zustand';
import type { EstablishmentProfile } from '@/types/establishment.types';

interface EstablishmentState {
  profile: EstablishmentProfile | null;
  setProfile: (profile: EstablishmentProfile) => void;
  clearProfile: () => void;
}

export const useEstablishmentStore = create<EstablishmentState>(set => ({
  profile: null,
  setProfile: profile => set({ profile }),
  clearProfile: () => set({ profile: null }),
}));
