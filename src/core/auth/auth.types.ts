export type UserRole = "Student" | "Mentor" | "Admin";

export type RegistrationNextStep =
  | "StudentDashboard"
  | "MentorOnboarding"
  | "AdminDashboard";

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: Exclude<UserRole, "Admin">;
  targetYear?: number;
  expertise?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
  accessToken: string;
  nextStep: RegistrationNextStep;
}

export interface CommonResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: string[];
}

export interface AuthState {
  currentUser: AuthResponse | null;
  hasCheckedSession: boolean;
  login: (email: string, password: string) => Promise<{ success: true } | { success: false; error: string }>;
  register: (
    payload: RegisterRequest,
  ) => Promise<{ success: true } | { success: false; error: string }>;
  refreshSession: () => Promise<{ success: true } | { success: false; error: string }>;
  logout: () => Promise<void>;
}
