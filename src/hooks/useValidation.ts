import { useMemo } from 'react';
import type { Collection } from '@/types/token';
import type { DependencyMap } from '@/types/graph';
import type { ValidationIssue } from '@/types/graph';
import { validateAll } from '@/lib/validation';

export function useValidation(collections: Collection[], map: DependencyMap): ValidationIssue[] {
  return useMemo(() => validateAll(collections, map), [collections, map]);
}
