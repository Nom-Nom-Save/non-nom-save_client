export interface EstablishmentResponse {
  id: string;
  email: string;
  isEmailVerified: boolean;
  password: string | null;
  name: string | null;
  description: string | null;
  address: string | null;
  latitude: string | null;
  longitude: string | null;
  workingHours: string | null;
  logo: string | null;
  banner: string | null;
  rating: string | null;
  boundTo: string;
  createdAt: Date | null;
  status: string;
}
