import { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Circle, ArrowRight, X, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBrandStore } from '@/store/brandStore';
import { getBrandSetupSteps } from '@/lib/brand-setup-steps';

interface Props {
  onNavigate: (sectionId: string) => void;
}

export function BrandSetupChecklist({ onNavigate }: Props) {
  const { brands, activeBrandId, setActiveBrand } = useBrandStore();

  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [collapsed, setCollapsed] = useState<Set<string>>(
    () => new Set(brands.filter((b) => b.id !== activeBrandId).map((b) => b.id)),
  );

  const pendingScrollRef = useRef<string | null>(null);

  // Auto-expand the newly active brand when activeBrandId changes
  useEffect(() => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.delete(activeBrandId);
      return next;
    });
  }, [activeBrandId]);

  // After a brand switch triggered by clicking Go on an inactive brand, scroll to section
  useEffect(() => {
    if (pendingScrollRef.current) {
      const id = pendingScrollRef.current;
      pendingScrollRef.current = null;
      // Defer one frame so BrandDocsEditor re-renders with the new brand first
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [activeBrandId]);

  function toggleCollapse(brandId: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(brandId)) next.delete(brandId);
      else next.add(brandId);
      return next;
    });
  }

  function dismissBrand(brandId: string) {
    setDismissed((prev) => new Set(prev).add(brandId));
  }

  const visibleBrands = brands.filter((b) => !dismissed.has(b.id));
  if (visibleBrands.length === 0) return null;

  const anyVisible = visibleBrands.some((brand) => {
    const steps = getBrandSetupSteps(brand);
    return !steps.every((s) => s.done);
  });
  if (!anyVisible) return null;

  return (
    <div className="space-y-2">
      {visibleBrands.map((brand) => {
        const steps = getBrandSetupSteps(brand);
        const completedCount = steps.filter((s) => s.done).length;
        const allDone = completedCount === steps.length;

        if (allDone) return null;

        const pct = Math.round((completedCount / steps.length) * 100);
        const isCollapsed = collapsed.has(brand.id);
        const isActive = brand.id === activeBrandId;

        return (
          <div
            key={brand.id}
            className={cn(
              'border rounded-lg overflow-hidden bg-card',
              isActive ? 'border-border' : 'border-border/60',
            )}
          >
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
              <button
                className="flex items-center gap-2 min-w-0 flex-1 text-left"
                onClick={() => toggleCollapse(brand.id)}
              >
                {isCollapsed ? (
                  <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                )}
                <span className="text-xs font-medium shrink-0">Info List</span>
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden min-w-[40px]">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[11px] text-muted-foreground shrink-0">
                  {completedCount}/{steps.length}
                </span>
              </button>
              <button
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                onClick={() => dismissBrand(brand.id)}
                title="Dismiss"
              >
                <X className="size-3.5" />
              </button>
            </div>

            {!isCollapsed && (
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
                    ) : step.required ? (
                      <Circle className="size-4 text-amber-500 shrink-0" />
                    ) : (
                      <Circle className="size-4 text-muted-foreground shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <span
                        className={cn(
                          'text-xs font-medium',
                          !step.done && step.required ? 'text-amber-600 dark:text-amber-400' : '',
                        )}
                      >
                        {step.label}
                        {!step.done && step.required && (
                          <span className="ml-1.5 text-[10px] font-normal text-amber-500">required</span>
                        )}
                      </span>
                      <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                        {step.description}
                      </p>
                    </div>
                    {!step.done && (
                      <button
                        className="flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 transition-colors shrink-0 font-medium"
                        onClick={() => {
                          if (isActive) {
                            onNavigate(step.sectionId);
                          } else {
                            pendingScrollRef.current = step.sectionId;
                            setActiveBrand(brand.id);
                          }
                        }}
                      >
                        Go
                        <ArrowRight className="size-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
