import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useBrandStore } from '@/store/brandStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '@/components/ui/card';
import type { TokenMode, Collection } from '@/types/token';

function buildStyleVars(collections: Collection[], mode: TokenMode): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const col of collections) {
    for (const token of col.tokens) {
      const val = token.values[mode] ?? token.values['default'];
      if (!val?.raw) continue;
      vars[token.cssVariable] = val.raw;
      // Tailwind v4 @theme inline maps --color-X → var(--X), so bg-primary resolves
      // to var(--primary), not var(--color-primary). We must emit both so Tailwind
      // utilities pick up the brand token value instead of the app's :root default.
      if (token.cssVariable.startsWith('--color-')) {
        vars[`--${token.cssVariable.slice('--color-'.length)}`] = val.raw;
      }
    }
  }
  return vars;
}

function PreviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0">
          {title}
        </p>
        <Separator />
      </div>
      {children}
    </div>
  );
}

export function PreviewPanel() {
  const { brands, activeBrandId } = useBrandStore();
  const brand = brands.find((b) => b.id === activeBrandId);
  const collections = brand?.collections ?? [];
  const brandFont = brand?.typography?.fontFamily;
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light');

  const styleVars = buildStyleVars(collections, previewMode);

  // Brand color scale — include all shades that exist in the collection
  const primaryShade = brand?.primaryColorShade;
  const paletteShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
  const palette = paletteShades.filter((shade) =>
    collections.some((col) => col.tokens.some((t) => t.cssVariable === `--color-primary-${shade}`)),
  );

  const typo = brand?.typography;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border shrink-0">
        <h2 className="font-semibold text-sm">Component Preview</h2>
        <div className="flex items-center gap-1 ml-auto">
          {(['light', 'dark'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setPreviewMode(m)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border transition-colors',
                previewMode === m
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:bg-muted',
              )}
            >
              {m === 'light' ? <Sun className="size-3" /> : <Moon className="size-3" />}
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <ScrollArea className="flex-1 min-h-0">
        <div
          className={cn('dtb-preview p-6', previewMode === 'dark' && 'dark')}
          style={{
            ...styleVars,
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-foreground)',
            fontFamily: brandFont ? `'${brandFont}', sans-serif` : undefined,
            minHeight: '100%',
          } as React.CSSProperties}
        >
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Brand indicator */}
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  {brand?.name?.charAt(0).toUpperCase() ?? 'B'}
                </span>
              </div>
              <div>
                <p className="font-semibold text-sm">{brand?.name ?? 'Brand'}</p>
                <p className="text-xs text-muted-foreground">
                  {previewMode} mode · shadcn/ui components
                </p>
              </div>
            </div>

            {/* Buttons */}
            <PreviewSection title="Buttons">
              <div className="flex flex-wrap gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Small</Button>
                <Button size="sm" variant="outline">Outline SM</Button>
                <Button disabled>Disabled</Button>
                <Button variant="outline" size="sm" disabled>Disabled Outline</Button>
              </div>
            </PreviewSection>

            {/* Badges */}
            <PreviewSection title="Badges">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </PreviewSection>

            {/* Form */}
            <PreviewSection title="Form Elements">
              <div className="grid gap-4 max-w-sm">
                <div className="space-y-1.5">
                  <Label>Email address</Label>
                  <Input type="email" placeholder="you@example.com" />
                </div>
                <div className="space-y-1.5">
                  <Label>Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <Label>Enable notifications</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch />
                  <Label>Marketing emails</Label>
                </div>
              </div>
            </PreviewSection>

            {/* Card */}
            <PreviewSection title="Card">
              <Card className="max-w-sm">
                <CardHeader>
                  <CardTitle>Brand Settings</CardTitle>
                  <CardDescription>
                    Manage your brand tokens and design preferences.
                  </CardDescription>
                  <CardAction>
                    <Badge>New</Badge>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1.5">
                    <Label>Brand Name</Label>
                    <Input placeholder={brand?.name ?? 'My Brand'} />
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button>Save changes</Button>
                  <Button variant="ghost">Cancel</Button>
                </CardFooter>
              </Card>
            </PreviewSection>

            {/* Typography */}
            {typo && (
              <PreviewSection title="Typography">
                <div className="space-y-4">
                  {typo.h1 && (
                    <div
                      style={{
                        fontSize: typo.h1.fontSize,
                        fontWeight: typo.h1.fontWeight,
                        lineHeight: typo.h1.lineHeight,
                        letterSpacing: typo.h1.letterSpacing,
                      }}
                    >
                      Heading 1
                    </div>
                  )}
                  {typo.h2 && (
                    <div
                      style={{
                        fontSize: typo.h2.fontSize,
                        fontWeight: typo.h2.fontWeight,
                        lineHeight: typo.h2.lineHeight,
                      }}
                    >
                      Heading 2
                    </div>
                  )}
                  {typo.h3 && (
                    <div
                      style={{
                        fontSize: typo.h3.fontSize,
                        fontWeight: typo.h3.fontWeight,
                        lineHeight: typo.h3.lineHeight,
                      }}
                      className="text-muted-foreground"
                    >
                      Heading 3
                    </div>
                  )}
                  {typo.body && (
                    <p
                      style={{
                        fontSize: typo.body.fontSize,
                        fontWeight: typo.body.fontWeight,
                        lineHeight: typo.body.lineHeight,
                      }}
                      className="text-muted-foreground"
                    >
                      Body — The quick brown fox jumps over the lazy dog. Design systems help
                      teams build consistent, accessible, and scalable products faster.
                    </p>
                  )}
                  {typo.label && (
                    <p
                      style={{
                        fontSize: typo.label.fontSize,
                        fontWeight: typo.label.fontWeight,
                      }}
                    >
                      Label text
                    </p>
                  )}
                  {typo.caption && (
                    <p
                      style={{
                        fontSize: typo.caption.fontSize,
                        fontWeight: typo.caption.fontWeight,
                      }}
                      className="text-muted-foreground"
                    >
                      Caption — Supporting detail text
                    </p>
                  )}
                </div>
              </PreviewSection>
            )}

            {/* Color palette */}
            {palette.length > 0 && (
              <PreviewSection title="Brand Color Scale">
                <div className="flex gap-1 flex-wrap">
                  {palette.map((shade) => {
                    const isPrimary = shade === primaryShade;
                    return (
                      <div key={shade} className="flex flex-col items-center gap-1" title={`${shade}${isPrimary ? ' · primary' : ''}`}>
                        <div
                          className={cn(
                            'rounded-md border border-black/10 transition-all',
                            isPrimary
                              ? 'w-10 h-10 ring-2 ring-offset-1 ring-primary/60'
                              : 'w-8 h-8',
                          )}
                          style={{ backgroundColor: `var(--color-primary-${shade})` }}
                        />
                        <span className={cn('text-[10px] font-mono', isPrimary ? 'text-primary font-semibold' : 'text-muted-foreground')}>
                          {shade}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </PreviewSection>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
