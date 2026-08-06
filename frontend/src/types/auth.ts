export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
}

export interface StorageInfo {
  used: number;
  quota: number;
  available: number;
  usage_percent: number;
}

export interface MessageResponse {
  message?: string;
  detail?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResendVerificationPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  new_password: string;
}