import { FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useBrandStore } from '@/store/brandStore';
import type { TypographySpec } from '@/types/brand';
import { useUIStore } from '@/store/uiStore';

const LEVELS: { key: 'h1' | 'h2' | 'h3' | 'body' | 'label' | 'caption'; label: string; sample: string }[] = [
  { key: 'h1', label: 'H1 — Heading 1', sample: 'Design token systems at scale' },
  { key: 'h2', label: 'H2 — Heading 2', sample: 'Consistent visual language' },
  { key: 'h3', label: 'H3 — Heading 3', sample: 'Component-driven design' },
  { key: 'body', label: 'Body', sample: 'The quick brown fox jumps over the lazy dog. Good typography creates a reading rhythm that guides the eye.' },
  { key: 'label', label: 'Label', sample: 'Button label / form label / tag text' },
  { key: 'caption', label: 'Caption', sample: 'Image caption · helper text · annotation' },
];

function SpecBadge({ label, value }: { label: string; value?: string | number }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-1">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-mono">
        {value}
      </Badge>
    </div>
  );
}

export function TypeSpecsTab() {
  const { brands, activeBrandId } = useBrandStore();
  const { setActivePanel } = useUIStore();
  const brand = brands.find((b) => b.id === activeBrandId);
  const typography = brand?.typography;

  if (!typography) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8">
        <FileText className="size-10 text-muted-foreground/40" />
        <div>
          <p className="text-sm font-medium">No typography defined</p>
          <p className="text-xs text-muted-foreground mt-1">
            Set up typography for <strong>{brand?.name ?? 'this brand'}</strong> in{' '}
            <button
              className="underline underline-offset-2 hover:text-foreground"
              onClick={() => setActivePanel('docs')}
            >
              Brand Docs
            </button>
            .
          </p>
        </div>
      </div>
    );
  }

  const fontFamily = typography.fontFamily
    ? `'${typography.fontFamily}', sans-serif`
    : undefined;

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-4 py-2.5 border-b border-border shrink-0 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Font family</span>
        <Badge variant="outline" className="font-mono text-xs" style={{ fontFamily }}>
          {typography.fontFamily || 'Not set'}
        </Badge>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-border">
        {LEVELS.map(({ key, label, sample }) => {
          const spec: TypographySpec | undefined = typography[key];
          if (!spec) {
            return (
              <div key={key} className="px-4 py-4 opacity-40">
                <p className="text-xs text-muted-foreground font-medium mb-1">{label}</p>
                <p className="text-xs text-muted-foreground italic">Not configured</p>
              </div>
            );
          }
          return (
            <div key={key} className="px-4 py-4 space-y-2">
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-xs text-muted-foreground font-medium min-w-[80px]">{label}</span>
                <div className="flex flex-wrap gap-2">
                  <SpecBadge label="size" value={spec.fontSize} />
                  <SpecBadge label="weight" value={spec.fontWeight} />
                  <SpecBadge label="line-h" value={spec.lineHeight} />
                  {spec.letterSpacing && <SpecBadge label="tracking" value={spec.letterSpacing} />}
                </div>
              </div>
              <p
                style={{
                  fontFamily,
                  fontSize: spec.fontSize,
                  fontWeight: spec.fontWeight,
                  lineHeight: spec.lineHeight,
                  letterSpacing: spec.letterSpacing,
                }}
              >
                {sample}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
