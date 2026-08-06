import { api } from "./api";
import type {
  LoginResponse,
  RegisterPayload,
  UserResponse,
  MessageResponse,
  ForgotPasswordPayload,
  ResendVerificationPayload,
  ResetPasswordPayload,
} from "@/types/auth";

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {

  const form = new URLSearchParams();

  form.append("username", email);
  form.append("password", password);

  const response = await api.post<LoginResponse>(
    "/auth/login",
    form,
    {
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
}
export async function register(
  payload: RegisterPayload
): Promise<UserResponse> {
  const response = await api.post<UserResponse>(
    "/users/register",
    payload
  );

  return response.data;
}

export async function verifyEmail(
  token: string
): Promise<MessageResponse> {
  const response = await api.get<MessageResponse>(
    "/users/verify-email",
    {
      params: { token },
    }
  );

  return response.data;
}

export async function resendVerification(
  payload: ResendVerificationPayload
): Promise<MessageResponse> {
  const response = await api.post<MessageResponse>(
    "/users/resend-verification",
    payload
  );

  return response.data;
}

export async function forgotPassword(
  payload: ForgotPasswordPayload
): Promise<MessageResponse> {
  const response = await api.post<MessageResponse>(
    "/users/forgot-password",
    payload
  );

  return response.data;
}

export async function resetPassword(
  payload: ResetPasswordPayload
): Promise<MessageResponse> {
  const response = await api.post<MessageResponse>(
    "/users/reset-password",
    payload
  );

  return response.data;
}

export async function logout(): Promise<void> {
  const refreshToken = localStorage.getItem("refresh_token");

  await api.post("/auth/logout", {
    refresh_token: refreshToken,
  });
}

export async function logoutAll(): Promise<void> {
  await api.post("/auth/logout-all");
}

export async function refreshAccessToken(): Promise<LoginResponse> {
  const refreshToken = localStorage.getItem("refresh_token");

  const response = await api.post<LoginResponse>("/auth/refresh", {
    refresh_token: refreshToken,
  });

  return response.data;
}
