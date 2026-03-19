// --- Registration ---

export interface RegisterUserRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterEstablishmentRequest {
  establishmentName: string;
  email: string;
  password: string;
  address: string;
}

export interface RegisterResponse {
  message: string;
  email: string;
}

// --- Login ---

export type LoginType = 'user' | 'establishment';

export interface LoginRequest {
  email: string;
  password: string;
  loginType: LoginType;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
}

// --- Forgot / Reset Password ---

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  email: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface VerifyCodeResponse {
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// --- Token Refresh ---

export interface RefreshResponse {
  message: string;
  accessToken: string;
}

// --- Email Verification ---

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface VerifyEmailResponse {
  message: string;
}
