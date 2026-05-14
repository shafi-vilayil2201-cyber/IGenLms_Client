import { create } from "zustand";
import { loginUser, logoutUser, refreshSession, registerUser } from "./auth.api";
import type { AuthResponse, AuthState, RegisterRequest } from "./auth.types";

const STORAGE_KEY = "igen.auth";

function loadStoredUser(): AuthResponse | null {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthResponse;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function persistUser(user: AuthResponse | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: loadStoredUser(),
  hasCheckedSession: false,
  async login(email, password) {
    try {
      const user = await loginUser({ email, password });
      persistUser(user);
      set({ currentUser: user, hasCheckedSession: true });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed.",
      };
    }
  },
  async register(payload: RegisterRequest) {
    try {
      const user = await registerUser(payload);
      persistUser(user);
      set({ currentUser: user, hasCheckedSession: true });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed.",
      };
    }
  },
  async refreshSession() {
    try {
      const user = await refreshSession();
      persistUser(user);
      set({ currentUser: user, hasCheckedSession: true });
      return { success: true };
    } catch (error) {
      persistUser(null);
      set({ currentUser: null, hasCheckedSession: true });
      return {
        success: false,
        error: error instanceof Error ? error.message : "Session refresh failed.",
      };
    }
  },
  async logout() {
    try {
      await logoutUser();
    } finally {
      persistUser(null);
      set({ currentUser: null, hasCheckedSession: true });
    }
  },
}));
