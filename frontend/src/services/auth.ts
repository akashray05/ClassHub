import { api } from "./api";
import type { LoginResponse } from "@/types/auth";

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