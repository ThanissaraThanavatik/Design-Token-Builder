export interface User {
  email: string;
  name: string;
  initials: string;
}

const DEMO_EMAIL = import.meta.env.VITE_DEMO_EMAIL as string | undefined;
const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD as string | undefined;
const DEMO_NAME = (import.meta.env.VITE_DEMO_NAME as string | undefined) ?? 'User';
const DEMO_INITIALS = (import.meta.env.VITE_DEMO_INITIALS as string | undefined) ?? 'U';

export function authenticateUser(email: string, password: string): User | null {
  if (!DEMO_EMAIL || !DEMO_PASSWORD) return null;
  if (
    email.trim().toLowerCase() === DEMO_EMAIL.toLowerCase() &&
    password === DEMO_PASSWORD
  ) {
    return { email: DEMO_EMAIL, name: DEMO_NAME, initials: DEMO_INITIALS };
  }
  return null;
}
