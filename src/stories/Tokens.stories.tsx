import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from '@/components/ui/separator';

const SEMANTIC_COLORS = [
  { name: 'Primary', var: '--color-primary', label: 'primary' },
  { name: 'Primary Foreground', var: '--color-primary-foreground', label: 'primary-foreground' },
  { name: 'Background', var: '--color-background', label: 'background' },
  { name: 'Foreground', var: '--color-foreground', label: 'foreground' },
  { name: 'Card', var: '--color-card', label: 'card' },
  { name: 'Muted', var: '--color-muted', label: 'muted' },
  { name: 'Muted Foreground', var: '--color-muted-foreground', label: 'muted-foreground' },
  { name: 'Border', var: '--color-border', label: 'border' },
  { name: 'Destructive', var: '--color-destructive', label: 'destructive' },
  { name: 'Accent', var: '--color-accent', label: 'accent' },
];

function ColorSwatch({ name, cssVar }: { name: string; cssVar: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-md border border-black/10 shrink-0"
        style={{ backgroundColor: `var(${cssVar})` }}
      />
      <div>
        <p className="text-xs font-medium">{name}</p>
        <p className="text-[10px] text-muted-foreground font-mono">{cssVar}</p>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Brand/Tokens',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const ColorPalette: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <div>
        <h3 className="text-sm font-semibold mb-1">Semantic Colors</h3>
        <p className="text-xs text-muted-foreground mb-3">
          These values come from the brand tokens exported from Design Token Builder.
          Update <code className="font-mono text-[10px] bg-muted px-1 rounded">src/stories/brand-tokens.css</code> to reflect your brand.
        </p>
        <Separator className="mb-4" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {SEMANTIC_COLORS.map(({ name, var: cssVar }) => (
          <ColorSwatch key={cssVar} name={name} cssVar={cssVar} />
        ))}
      </div>
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div className="space-y-6 max-w-lg">
      <div>
        <h3 className="text-sm font-semibold mb-1">Typography Scale</h3>
        <Separator className="mb-4" />
      </div>
      <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 700, lineHeight: 1.1 }}>
        Heading 1 — 36px
      </div>
      <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 600 }}>
        Heading 2 — 30px
      </div>
      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 600 }}>
        Heading 3 — 24px
      </div>
      <div style={{ fontSize: 'var(--text-base)', lineHeight: 1.6 }} className="text-muted-foreground">
        Body — The quick brown fox jumps over the lazy dog. Design systems help teams build
        consistent, accessible, and scalable products faster.
      </div>
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>
        Label — Form field label text
      </div>
      <div style={{ fontSize: 'var(--text-xs)' }} className="text-muted-foreground">
        Caption — Supporting detail text
      </div>
    </div>
  ),
};
