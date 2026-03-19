import { apiRequest } from '@/api/client';
import type {
  RegisterUserRequest,
  RegisterEstablishmentRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  RefreshResponse,
} from '@/types/auth.types';

export const registerUser = (data: RegisterUserRequest) =>
  apiRequest<RegisterResponse>('/auth/register-user', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const registerEstablishment = (data: RegisterEstablishmentRequest) =>
  apiRequest<RegisterResponse>('/auth/register-establishment', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const verifyEmail = (data: VerifyEmailRequest) =>
  apiRequest<VerifyEmailResponse>('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const login = (data: LoginRequest) =>
  apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const forgotPassword = (data: ForgotPasswordRequest) =>
  apiRequest<ForgotPasswordResponse>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const verifyCode = (data: VerifyCodeRequest) =>
  apiRequest<VerifyCodeResponse>('/auth/verify-code', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const resetPassword = (data: ResetPasswordRequest) =>
  apiRequest<ResetPasswordResponse>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const refreshToken = () =>
  apiRequest<RefreshResponse>('/auth/refresh', {
    method: 'POST',
  });
