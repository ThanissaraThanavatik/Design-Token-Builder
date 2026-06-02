import { useState } from 'react';
import { CheckCircle2, Circle, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Brand } from '@/types/brand';

interface Step {
  id: string;
  label: string;
  sectionId: string;
  done: boolean;
  description: string;
}

interface Props {
  brand: Brand;
  onNavigate: (sectionId: string) => void;
}

export function BrandSetupChecklist({ brand, onNavigate }: Props) {
  const [dismissed, setDismissed] = useState(false);

  const steps: Step[] = [
    {
      id: 'colors',
      label: 'Colors',
      sectionId: 'section-colors',
      done: true,
      description: 'Primary scale generated. Review semantic color overrides for light/dark modes.',
    },
    {
      id: 'typography',
      label: 'Typography',
      sectionId: 'section-typography',
      done: !!brand.typography?.fontFamily,
      description: 'Choose your brand font and define the type scale (H1 → caption).',
    },
    {
      id: 'platforms',
      label: 'Platform & Screens',
      sectionId: 'section-platforms',
      done: (brand.platforms ?? []).length > 0,
      description: 'Set target platforms and responsive breakpoints for layout tokens.',
    },
    {
      id: 'rounded',
      label: 'Border Radius',
      sectionId: 'section-rounded',
      done: Object.keys(brand.rounded ?? {}).length > 0,
      description: 'Set corner style — sharp (2–4 px), soft (8–16 px), or pill-friendly (≥24 px).',
    },
    {
      id: 'shadows',
      label: 'Shadows',
      sectionId: 'section-shadows',
      done: Object.keys(brand.shadow ?? {}).length > 0,
      description: 'Define elevation levels: soft, hover, button, and glow variants.',
    },
    {
      id: 'icons',
      label: 'Icons',
      sectionId: 'section-icons',
      done:
        (brand.icons?.approvedIcons ?? []).some((a) => a.names.length > 0) ||
        (brand.icons?.libraries ?? []).length > 0,
      description: 'Select your icon library and curate the approved icon set.',
    },
    {
      id: 'assets',
      label: 'Brand Assets',
      sectionId: 'section-assets',
      done: !!(brand.assets?.logoFull || brand.assets?.logoMark || brand.assets?.logoWordmark),
      description: 'Upload logo variants (full, mark, wordmark) for documentation and handoff.',
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const allDone = completedCount === steps.length;

  if (dismissed || allDone) return null;

  const pct = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="text-sm font-medium shrink-0">Brand Setup</span>
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground shrink-0">
            {completedCount} / {steps.length}
          </span>
        </div>
        <button
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          onClick={() => setDismissed(true)}
          title="Dismiss"
        >
          <X className="size-3.5" />
        </button>
      </div>

      {/* Steps */}
      <div className="divide-y divide-border/60">
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5',
              step.done ? 'opacity-60' : '',
            )}
          >
            {step.done ? (
              <CheckCircle2 className="size-4 text-green-500 shrink-0" />
            ) : (
              <Circle className="size-4 text-muted-foreground shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <span className="text-xs font-medium">{step.label}</span>
              <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                {step.description}
              </p>
            </div>
            {!step.done && (
              <button
                className="flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 transition-colors shrink-0 font-medium"
                onClick={() => onNavigate(step.sectionId)}
              >
                Go
                <ArrowRight className="size-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
