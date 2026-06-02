import { useMemo } from 'react';
import type { Collection } from '@/types/token';
import type { DependencyMap } from '@/types/graph';
import { buildDependencyMap, getImpacted } from '@/lib/dependency';

export function useDependencyGraph(collections: Collection[], highlightedId: string | null) {
  const map: DependencyMap = useMemo(() => buildDependencyMap(collections), [collections]);

  const impacted: Set<string> = useMemo(() => {
    if (!highlightedId) return new Set();
    return new Set(getImpacted(highlightedId, map));
  }, [highlightedId, map]);

  const hasReferences = useMemo(() => {
    for (const [, deps] of map.dependencies.entries()) {
      if (deps.size > 0) return true;
    }
    return false;
  }, [map]);

  return { map, impacted, hasReferences };
}
