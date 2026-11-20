'use client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'public' | 'lawyer';
  barNumber?: string;
  phone?: string;
  city?: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password: string; // Stored in verified database
  role: 'public' | 'lawyer';
  phone?: string;
  city?: string;
  barNumber?: string;
  barCouncil?: string;
  practiceCourt?: string;
  createdAt: string;
}

const AUTH_KEY = 'casekeeper_auth_user';
const USERS_DB_KEY = 'casekeeper_users_database';

// Initial verified seed database accounts for immediate testing
const SEED_USERS: UserRecord[] = [
  {
    id: 'user-citizen-1',
    name: 'Ramesh Kumar Sharma',
    email: 'ramesh.sharma@gmail.com',
    password: 'citizen123',
    role: 'public',
    phone: '+91 98110 24891',
    city: 'New Delhi',
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'user-lawyer-1',
    name: 'Adv. Rajesh Verma',
    email: 'rajesh.verma@delhibar.org',
    password: 'advocate123',
    role: 'lawyer',
    barNumber: 'D/1420/2008',
    barCouncil: 'Bar Council of Delhi',
    practiceCourt: 'High Court of Delhi',
    phone: '+91 98202 81923',
    city: 'New Delhi',
    createdAt: '2026-01-10T09:30:00Z'
  }
];

// --- USERS DATABASE MANAGEMENT ---

export function getUsersDatabase(): UserRecord[] {
  if (typeof window === 'undefined') return SEED_USERS;
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    if (!raw) {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_USERS;
  } catch (e) {
    console.error('Failed to load users database', e);
    return SEED_USERS;
  }
}

export function saveUsersDatabase(users: UserRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users database', e);
  }
}

export function findUserByEmail(email: string): UserRecord | undefined {
  const users = getUsersDatabase();
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email.trim().toLowerCase() === normalized);
}

export function findUserByBarNumber(barNumber: string): UserRecord | undefined {
  const users = getUsersDatabase();
  const normalized = barNumber.trim().toLowerCase();
  return users.find((u) => u.barNumber && u.barNumber.trim().toLowerCase() === normalized);
}

// --- REGISTRATION VERIFICATION ---

export interface RegistrationInput {
  name: string;
  email: string;
  password: string;
  role: 'public' | 'lawyer';
  phone?: string;
  city?: string;
  barNumber?: string;
  barCouncil?: string;
  practiceCourt?: string;
}

export function registerUser(input: RegistrationInput): { success: boolean; error?: string; user?: AuthUser } {
  const users = getUsersDatabase();
  const normalizedEmail = input.email.trim().toLowerCase();

  // 1. Check if email is already registered in the database
  const existingUser = users.find((u) => u.email.trim().toLowerCase() === normalizedEmail);
  if (existingUser) {
    return {
      success: false,
      error: `An account is already registered with email "${input.email.trim()}". Please click "Sign In" instead.`
    };
  }

  // 2. If advocate, check if Bar Number is already registered in the database
  if (input.role === 'lawyer' && input.barNumber) {
    const normalizedBar = input.barNumber.trim().toLowerCase();
    const existingBar = users.find((u) => u.barNumber && u.barNumber.trim().toLowerCase() === normalizedBar);
    if (existingBar) {
      return {
        success: false,
        error: `Bar Enrollment Number "${input.barNumber.trim()}" is already registered under advocate "${existingBar.name}".`
      };
    }
  }

  // 3. Password validation
  if (input.password.length < 6) {
    return {
      success: false,
      error: 'Password must be at least 6 characters long.'
    };
  }

  // 4. Create and store user record in database
  const newUser: UserRecord = {
    id: `user-${Date.now()}`,
    name: input.name.trim(),
    email: input.email.trim(),
    password: input.password,
    role: input.role,
    phone: input.phone?.trim() || '',
    city: input.city?.trim() || 'New Delhi',
    barNumber: input.barNumber?.trim(),
    barCouncil: input.barCouncil?.trim(),
    practiceCourt: input.practiceCourt?.trim(),
    createdAt: new Date().toISOString()
  };

  const updatedUsers = [newUser, ...users];
  saveUsersDatabase(updatedUsers);

  // 5. Establish session
  const sessionUser: AuthUser = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    barNumber: newUser.barNumber,
    phone: newUser.phone,
    city: newUser.city
  };

  setAuthUser(sessionUser);
  return { success: true, user: sessionUser };
}

// --- AUTHENTICATION & LOGIN VERIFICATION ---

export interface LoginInput {
  email: string;
  password: string;
  role: 'public' | 'lawyer';
  barNumber?: string;
}

export function authenticateUser(input: LoginInput): { success: boolean; error?: string; user?: AuthUser } {
  const normalizedEmail = input.email.trim().toLowerCase();
  const user = findUserByEmail(normalizedEmail);

  // 1. Verify user existence in database
  if (!user) {
    return {
      success: false,
      error: `No registered account found with email "${input.email.trim()}". Please click "Create Account / Register" to sign up first.`
    };
  }

  // 2. Verify registered role
  if (user.role !== input.role) {
    const expectedRoleName = user.role === 'lawyer' ? 'Advocate / Lawyer' : 'Citizen / Litigant';
    return {
      success: false,
      error: `This account is registered as a ${expectedRoleName}. Please switch to the "${expectedRoleName}" tab to sign in.`
    };
  }

  // 3. Verify password
  if (user.password !== input.password) {
    return {
      success: false,
      error: 'Incorrect password. Please verify and enter your registered password.'
    };
  }

  // 4. For advocates, verify Bar Council Number
  if (input.role === 'lawyer' && input.barNumber) {
    const inputBar = input.barNumber.trim().toLowerCase();
    const storedBar = (user.barNumber || '').trim().toLowerCase();
    if (storedBar && inputBar !== storedBar) {
      return {
        success: false,
        error: `Bar Council Enrollment Number does not match our records for this account (Expected: ${user.barNumber}).`
      };
    }
  }

  // 5. Establish active session
  const sessionUser: AuthUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    barNumber: user.barNumber,
    phone: user.phone,
    city: user.city
  };

  setAuthUser(sessionUser);
  return { success: true, user: sessionUser };
}

// --- ACTIVE SESSION MANAGEMENT ---

export function getAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setAuthUser(user: AuthUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('auth_changed'));
  window.dispatchEvent(new Event('storage'));
}

export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event('auth_changed'));
  window.dispatchEvent(new Event('storage'));
}

export function isLoggedIn(): boolean {
  return getAuthUser() !== null;
}

export function isLawyer(): boolean {
  const user = getAuthUser();
  return user?.role === 'lawyer';
}
