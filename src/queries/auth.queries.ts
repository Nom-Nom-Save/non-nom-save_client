import { useMutation } from '@tanstack/react-query';
import {
  registerUser,
  registerEstablishment,
  verifyEmail,
  login,
  forgotPassword,
  verifyCode,
  resetPassword,
} from '@/api/auth.api';
import type {
  RegisterUserRequest,
  RegisterEstablishmentRequest,
  VerifyEmailRequest,
  LoginRequest,
  ForgotPasswordRequest,
  VerifyCodeRequest,
  ResetPasswordRequest,
} from '@/types/auth.types';

export const useRegisterUserMutation = () =>
  useMutation({
    mutationFn: (data: RegisterUserRequest) => registerUser(data),
  });

export const useRegisterEstablishmentMutation = () =>
  useMutation({
    mutationFn: (data: RegisterEstablishmentRequest) => registerEstablishment(data),
  });

export const useVerifyEmailMutation = () =>
  useMutation({
    mutationFn: (data: VerifyEmailRequest) => verifyEmail(data),
  });

export const useLoginMutation = () =>
  useMutation({
    mutationFn: (data: LoginRequest) => login(data),
  });

export const useForgotPasswordMutation = () =>
  useMutation({
    mutationFn: (data: ForgotPasswordRequest) => forgotPassword(data),
  });

export const useVerifyCodeMutation = () =>
  useMutation({
    mutationFn: (data: VerifyCodeRequest) => verifyCode(data),
  });

export const useResetPasswordMutation = () =>
  useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetPassword(data),
  });
