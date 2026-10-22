export type UserRole = "cliente" | "admin" | "staff_scanner";

export interface User {
  id: string;
  fullName: string;
  email: string;
  idCard: string; // Cédula o DNI (V-XXXXXXXX)
  phone: string;  // WhatsApp / Móvil
  role: UserRole;
  createdAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}
