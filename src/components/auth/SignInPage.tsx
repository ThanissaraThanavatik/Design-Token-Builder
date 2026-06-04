import { useState } from 'react';
import { Palette, Eye, EyeOff, ArrowRight, GitFork, AlertCircle } from 'lucide-react';
import { authenticateUser } from '@/types/user';
import type { User } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const TOKEN_PALETTE: { name: string; swatches: { label: string; color: string }[] }[] = [
  {
    name: 'Brand',
    swatches: [
      { label: '50',  color: 'oklch(0.97 0.02 265)' },
      { label: '100', color: 'oklch(0.93 0.04 265)' },
      { label: '200', color: 'oklch(0.86 0.08 265)' },
      { label: '300', color: 'oklch(0.76 0.14 265)' },
      { label: '400', color: 'oklch(0.64 0.20 265)' },
      { label: '500', color: 'oklch(0.55 0.24 265)' },
      { label: '600', color: 'oklch(0.47 0.22 265)' },
      { label: '700', color: 'oklch(0.39 0.18 265)' },
      { label: '800', color: 'oklch(0.30 0.13 265)' },
      { label: '900', color: 'oklch(0.22 0.08 265)' },
    ],
  },
  {
    name: 'Accent',
    swatches: [
      { label: '50',  color: 'oklch(0.97 0.02 340)' },
      { label: '100', color: 'oklch(0.93 0.05 340)' },
      { label: '200', color: 'oklch(0.87 0.09 340)' },
      { label: '300', color: 'oklch(0.78 0.15 340)' },
      { label: '400', color: 'oklch(0.67 0.21 340)' },
      { label: '500', color: 'oklch(0.57 0.25 340)' },
      { label: '600', color: 'oklch(0.48 0.22 340)' },
      { label: '700', color: 'oklch(0.40 0.18 340)' },
      { label: '800', color: 'oklch(0.31 0.13 340)' },
      { label: '900', color: 'oklch(0.23 0.08 340)' },
    ],
  },
  {
    name: 'Success',
    swatches: [
      { label: '50',  color: 'oklch(0.97 0.02 152)' },
      { label: '100', color: 'oklch(0.93 0.05 152)' },
      { label: '200', color: 'oklch(0.86 0.09 152)' },
      { label: '300', color: 'oklch(0.76 0.15 152)' },
      { label: '400', color: 'oklch(0.65 0.20 152)' },
      { label: '500', color: 'oklch(0.55 0.22 152)' },
      { label: '600', color: 'oklch(0.46 0.19 152)' },
      { label: '700', color: 'oklch(0.38 0.15 152)' },
      { label: '800', color: 'oklch(0.29 0.10 152)' },
      { label: '900', color: 'oklch(0.21 0.06 152)' },
    ],
  },
  {
    name: 'Warning',
    swatches: [
      { label: '50',  color: 'oklch(0.98 0.02 80)' },
      { label: '100', color: 'oklch(0.95 0.06 80)' },
      { label: '200', color: 'oklch(0.90 0.12 80)' },
      { label: '300', color: 'oklch(0.82 0.19 80)' },
      { label: '400', color: 'oklch(0.73 0.24 80)' },
      { label: '500', color: 'oklch(0.65 0.22 80)' },
      { label: '600', color: 'oklch(0.54 0.19 80)' },
      { label: '700', color: 'oklch(0.44 0.15 80)' },
      { label: '800', color: 'oklch(0.34 0.10 80)' },
      { label: '900', color: 'oklch(0.25 0.06 80)' },
    ],
  },
  {
    name: 'Neutral',
    swatches: [
      { label: '50',  color: 'oklch(0.98 0 0)' },
      { label: '100', color: 'oklch(0.95 0 0)' },
      { label: '200', color: 'oklch(0.90 0 0)' },
      { label: '300', color: 'oklch(0.82 0 0)' },
      { label: '400', color: 'oklch(0.68 0 0)' },
      { label: '500', color: 'oklch(0.54 0 0)' },
      { label: '600', color: 'oklch(0.42 0 0)' },
      { label: '700', color: 'oklch(0.32 0 0)' },
      { label: '800', color: 'oklch(0.22 0 0)' },
      { label: '900', color: 'oklch(0.14 0 0)' },
    ],
  },
];

interface SignInPageProps {
  onSignIn: (user: User) => void;
}

export function SignInPage({ onSignIn }: SignInPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hoveredSwatch, setHoveredSwatch] = useState<{ row: number; col: number } | null>(null);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const user = authenticateUser(email, password);
    setIsLoading(false);
    if (user) {
      onSignIn(user);
    } else {
      setError('Invalid email or password.');
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left panel — token palette showcase */}
      <div className="relative hidden lg:flex lg:w-[58%] flex-col overflow-hidden bg-[oklch(0.10_0_0)] dark:bg-[oklch(0.08_0_0)]">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(oklch(1 0 0) 1px, transparent 1px),
              linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Radial gradient glow */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 40% 50%, oklch(0.35 0.12 265 / 0.4), transparent 70%)',
          }}
        />

        {/* Header */}
        <div className="relative z-10 p-8 flex items-center gap-3">
          <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Palette className="size-4 text-white/80" />
          </div>
          <span className="text-white/70 font-medium text-sm tracking-tight">Design Token Builder</span>
        </div>

        {/* Token grid */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-8 pb-8">
          <div className="mb-6">
            <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-1">Token Collection</p>
            <h2 className="text-white/90 text-2xl font-semibold tracking-tight leading-tight">
              Your design system,<br />one source of truth.
            </h2>
          </div>

          <div className="space-y-1.5">
            {TOKEN_PALETTE.map((row, rowIdx) => (
              <div key={row.name} className="flex items-center gap-3">
                <span
                  className="text-white/25 text-[10px] font-mono w-14 shrink-0 text-right"
                  style={{ animationDelay: `${rowIdx * 60}ms` }}
                >
                  {row.name}
                </span>
                <div className="flex gap-1 flex-1">
                  {row.swatches.map((swatch, colIdx) => {
                    const isHovered = hoveredSwatch?.row === rowIdx && hoveredSwatch?.col === colIdx;
                    const animDelay = `${rowIdx * 80 + colIdx * 30}ms`;
                    return (
                      <div
                        key={swatch.label}
                        className="relative group flex-1"
                        onMouseEnter={() => setHoveredSwatch({ row: rowIdx, col: colIdx })}
                        onMouseLeave={() => setHoveredSwatch(null)}
                        style={{
                          animation: `fadeSlideIn 0.5s ease-out ${animDelay} both`,
                        }}
                      >
                        <div
                          className={cn(
                            'h-8 rounded-sm transition-all duration-200 cursor-default',
                            isHovered ? 'scale-y-[1.6] rounded' : '',
                          )}
                          style={{ backgroundColor: swatch.color }}
                        />
                        {isHovered && (
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black/90 text-white/90 text-[9px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap z-20 pointer-events-none">
                            --{row.name.toLowerCase()}-{swatch.label}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Scale labels */}
          <div className="flex items-center gap-3 mt-2">
            <span className="w-14 shrink-0" />
            <div className="flex gap-1 flex-1">
              {TOKEN_PALETTE[0].swatches.map((s) => (
                <span key={s.label} className="flex-1 text-center text-[9px] font-mono text-white/20">
                  {s.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer quote */}
        <div className="relative z-10 px-8 pb-8">
          <p className="text-white/20 text-xs leading-relaxed max-w-xs">
            Define tokens once. Export to CSS, Tailwind, Swift, Kotlin, and more — keeping every platform perfectly in sync.
          </p>
        </div>

        <style>{`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>

      {/* Right panel — sign in form */}
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="size-7 rounded-md bg-foreground/10 flex items-center justify-center">
            <Palette className="size-4 text-foreground" />
          </div>
          <span className="font-semibold text-sm">Design Token Builder</span>
        </div>

        <div className="w-full max-w-[360px]">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-1.5">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to access your design tokens.
            </p>
          </div>

          {/* Social auth */}
          <div className="flex flex-col gap-2 mb-6">
            <Button variant="outline" className="w-full gap-2.5 font-normal" type="button">
              <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full gap-2.5 font-normal" type="button">
              <GitFork className="size-4" />
              Continue with GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-[11px] text-muted-foreground">
              or
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/8 border border-destructive/20 rounded-md px-3 py-2">
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={isLoading || !email || !password}
            >
              {isLoading ? (
                <>
                  <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          {/* Sign up */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button className="text-foreground font-medium hover:underline underline-offset-4 transition-all">
              Request access
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
