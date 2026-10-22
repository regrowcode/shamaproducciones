import { User, AuthSession, UserRole } from "../types/auth";

const USER_SESSION_KEY = "shama_user_session_v1";
const ADMIN_SESSION_KEY = "shama_admin_session_v1";
const USERS_STORAGE_KEY = "shama_registered_users_v1";

const DEFAULT_USERS: User[] = [
  {
    id: "usr-client-01",
    fullName: "Carlos Eduardo Silva",
    email: "carlos.silva@gmail.com",
    idCard: "V-18452910",
    phone: "0414-9876543",
    role: "cliente",
    createdAt: "2026-10-01T10:00:00Z",
  },
  {
    id: "usr-admin-01",
    fullName: "Administrador Shama",
    email: "admin@shamaproducciones.com",
    idCard: "V-12345678",
    phone: "0412-1234567",
    role: "admin",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "usr-scanner-01",
    fullName: "Staff Puerta Principal",
    email: "staff@shamaproducciones.com",
    idCard: "V-20111222",
    phone: "0424-5559988",
    role: "staff_scanner",
    createdAt: "2026-05-01T00:00:00Z",
  },
];

export function getStoredUsers(): User[] {
  if (typeof window === "undefined") return DEFAULT_USERS;
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USERS;
  }
}

/**
 * Register a new customer
 */
export function registerUser(params: {
  fullName: string;
  email: string;
  idCard: string;
  phone: string;
  password?: string;
}): { success: boolean; user?: User; error?: string } {
  const users = getStoredUsers();
  const existing = users.find((u) => u.email.toLowerCase() === params.email.trim().toLowerCase());
  if (existing) {
    return { success: false, error: "Ya existe una cuenta con este correo electrónico." };
  }

  const newUser: User = {
    id: `usr-${Date.now().toString().slice(-6)}`,
    fullName: params.fullName.trim(),
    email: params.email.trim().toLowerCase(),
    idCard: params.idCard.trim().toUpperCase(),
    phone: params.phone.trim(),
    role: "cliente",
    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [...users, newUser];
  if (typeof window !== "undefined") {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    // Auto-login newly registered user
    loginUser(newUser.email);
  }

  return { success: true, user: newUser };
}

/**
 * Customer Login
 */
export function loginUser(email: string): { success: boolean; user?: User; error?: string } {
  const users = getStoredUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!user) {
    return { success: false, error: "No encontramos ninguna cuenta con este correo. Por favor regístrate." };
  }

  const session: AuthSession = {
    user,
    token: `tkn_${user.id}_${Date.now()}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
  }

  return { success: true, user };
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthSession;
    return session.user;
  } catch {
    return null;
  }
}

export function logoutUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_SESSION_KEY);
  }
}

/**
 * Admin / Staff Login (Restricted to admin role)
 */
export function loginAdmin(email: string, password: string): { success: boolean; user?: User; error?: string } {
  const users = getStoredUsers();
  const staff = users.find(
    (u) => (u.role === "admin" || u.role === "staff_scanner") && u.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (!staff) {
    return { success: false, error: "Credenciales administrativas inválidas o usuario sin permisos." };
  }

  // Demo pass check (in production replaced with bcrypt / db)
  if (password.trim() !== "shama2026" && password.trim() !== "admin") {
    return { success: false, error: "Contraseña incorrecta. (Prueba: admin)" };
  }

  const session: AuthSession = {
    user: staff,
    token: `adm_${staff.id}_${Date.now()}`,
    expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  }

  return { success: true, user: staff };
}

export function getCurrentAdmin(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthSession;
    return session.user;
  } catch {
    return null;
  }
}

export function logoutAdmin(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }
}
