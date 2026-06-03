import { useBrandStore } from '@/store/brandStore';
import { Badge } from '@/components/ui/badge';
import type { Token } from '@/types/token';

const FONT_GROUPS = ['Font Family', 'Font Size', 'Font Weight', 'Line Height', 'Letter Spacing'] as const;
type FontGroup = typeof FONT_GROUPS[number];

function getFirstValue(token: Token): string {
  const modes = Object.keys(token.values) as string[];
  const preferred = ['default', 'light', ...modes];
  for (const m of preferred) {
    const v = token.values[m as keyof typeof token.values]?.raw;
    if (v) return v;
  }
  return '';
}

function FontFamilyCard({ token }: { token: Token }) {
  const value = getFirstValue(token);
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3 space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-foreground">{token.name}</span>
        <span className="text-[10px] font-mono text-muted-foreground">{token.cssVariable}</span>
      </div>
      <p className="text-2xl leading-none" style={{ fontFamily: value }}>
        Aa — {token.name}
      </p>
      <p className="text-sm text-muted-foreground truncate" style={{ fontFamily: value }}>
        The quick brown fox jumps over the lazy dog
      </p>
      <Badge variant="secondary" className="font-mono text-[10px] px-1.5 py-0">{value}</Badge>
    </div>
  );
}

function FontSizeRow({ token }: { token: Token }) {
  const value = getFirstValue(token);
  const numericPx = parseFloat(value);
  const clampedSize = Math.min(Math.max(numericPx || 16, 10), 72);
  return (
    <div className="flex items-baseline gap-4 py-2 border-b border-border last:border-0">
      <span
        className="font-medium text-foreground shrink-0"
        style={{ fontSize: clampedSize, lineHeight: 1 }}
      >
        A
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium">{token.name}</p>
        <p className="text-[10px] font-mono text-muted-foreground">{token.cssVariable}</p>
      </div>
      <Badge variant="secondary" className="font-mono text-[10px] px-1.5 py-0 shrink-0">{value}</Badge>
    </div>
  );
}

function FontWeightRow({ token }: { token: Token }) {
  const value = getFirstValue(token);
  const weight = parseInt(value, 10) || undefined;
  return (
    <div className="flex items-baseline gap-4 py-2 border-b border-border last:border-0">
      <p
        className="flex-1 text-sm text-foreground truncate"
        style={{ fontWeight: weight }}
      >
        The quick brown fox — {token.name}
      </p>
      <div className="text-right shrink-0">
        <p className="text-[10px] font-mono text-muted-foreground">{token.cssVariable}</p>
        <Badge variant="secondary" className="font-mono text-[10px] px-1.5 py-0">{value}</Badge>
      </div>
    </div>
  );
}

function GenericTokenRow({ token }: { token: Token }) {
  const value = getFirstValue(token);
  return (
    <div className="flex items-center gap-4 py-2 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium">{token.name}</p>
        <p className="text-[10px] font-mono text-muted-foreground">{token.cssVariable}</p>
      </div>
      <Badge variant="secondary" className="font-mono text-[10px] px-1.5 py-0 shrink-0">{value}</Badge>
      <p className="text-xs text-muted-foreground shrink-0 w-32 text-right truncate" style={{ letterSpacing: value }}>
        Sample text
      </p>
    </div>
  );
}

export function TokenTypographyTab() {
  const { brands, activeBrandId } = useBrandStore();
  const brand = brands.find((b) => b.id === activeBrandId);
  const collections = brand?.collections ?? [];

  const grouped: Record<FontGroup, Token[]> = {
    'Font Family': [],
    'Font Size': [],
    'Font Weight': [],
    'Line Height': [],
    'Letter Spacing': [],
  };

  for (const col of collections) {
    for (const token of col.tokens) {
      if (token.group && FONT_GROUPS.includes(token.group as FontGroup)) {
        grouped[token.group as FontGroup].push(token);
      }
    }
  }

  const hasAny = FONT_GROUPS.some((g) => grouped[g].length > 0);

  if (!hasAny) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8">
        <p className="text-sm font-medium">No font tokens found</p>
        <p className="text-xs text-muted-foreground">
          Add tokens with groups like "Font Family", "Font Size", or "Font Weight" in the Editor to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-8">
      {grouped['Font Family'].length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Font Family</h3>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            {grouped['Font Family'].map((t) => <FontFamilyCard key={t.id} token={t} />)}
          </div>
        </section>
      )}

      {grouped['Font Size'].length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Font Size</h3>
          <div className="rounded-lg border border-border bg-card px-4 py-1">
            {grouped['Font Size'].map((t) => <FontSizeRow key={t.id} token={t} />)}
          </div>
        </section>
      )}

      {grouped['Font Weight'].length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Font Weight</h3>
          <div className="rounded-lg border border-border bg-card px-4 py-1">
            {grouped['Font Weight'].map((t) => <FontWeightRow key={t.id} token={t} />)}
          </div>
        </section>
      )}

      {grouped['Line Height'].length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Line Height</h3>
          <div className="rounded-lg border border-border bg-card px-4 py-1">
            {grouped['Line Height'].map((t) => <GenericTokenRow key={t.id} token={t} />)}
          </div>
        </section>
      )}

      {grouped['Letter Spacing'].length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Letter Spacing</h3>
          <div className="rounded-lg border border-border bg-card px-4 py-1">
            {grouped['Letter Spacing'].map((t) => <GenericTokenRow key={t.id} token={t} />)}
          </div>
        </section>
      )}
    </div>
  );
}
