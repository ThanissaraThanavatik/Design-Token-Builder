import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { SignInPage } from '@/components/auth/SignInPage';
import type { User } from '@/types/user';

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  if (!user) {
    return <SignInPage onSignIn={setUser} />;
  }

  return <AppShell user={user} onSignOut={() => setUser(null)} />;
}
