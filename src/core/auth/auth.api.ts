import type {
  AuthResponse,
  CommonResponse,
  LoginRequest,
  RegisterRequest,
} from "./auth.types";

import { API_BASE_URL } from "../api/apiConfig";


async function postJson<T>(path: string, payload: unknown): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Unable to reach the server. Check that the API is running and CORS is configured.");
  }

  const result = (await response.json()) as CommonResponse<T>;

  if (!response.ok || !result.success || !result.data) {
    const message = result.errors[0] ?? result.message ?? "Request failed.";
    throw new Error(message);
  }

  return result.data;
}

async function postWithoutBody<T>(path: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    throw new Error("Unable to reach the server. Check that the API is running and CORS is configured.");
  }

  const result = (await response.json()) as CommonResponse<T>;

  if (!response.ok || !result.success || !result.data) {
    const message = result.errors[0] ?? result.message ?? "Request failed.";
    throw new Error(message);
  }

  return result.data;
}

export function loginUser(payload: LoginRequest) {
  return postJson<AuthResponse>("/api/auth/login", payload);
}

export function registerUser(payload: RegisterRequest) {
  return postJson<AuthResponse>("/api/auth/register", payload);
}

export function refreshSession() {
  return postWithoutBody<AuthResponse>("/api/auth/refresh");
}

export function logoutUser() {
  return postWithoutBody<string>("/api/auth/logout");
}
