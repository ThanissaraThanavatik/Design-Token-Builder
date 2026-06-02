import type { Collection } from '@/types/token';
import type { DependencyMap } from '@/types/graph';

const VAR_REGEX = /var\(\s*(--[\w-]+)/g;

export function parseReferences(value: string): string[] {
  const refs: string[] = [];
  let match: RegExpExecArray | null;
  const re = new RegExp(VAR_REGEX.source, 'g');
  while ((match = re.exec(value)) !== null) {
    refs.push(match[1]);
  }
  return [...new Set(refs)];
}

export function buildDependencyMap(collections: Collection[]): DependencyMap {
  const cssVarToId = new Map<string, string>();
  for (const col of collections) {
    for (const token of col.tokens) {
      cssVarToId.set(token.cssVariable, token.id);
    }
  }

  const dependencies = new Map<string, Set<string>>();
  const dependents = new Map<string, Set<string>>();
  const danglingRefs = new Map<string, string[]>();

  for (const col of collections) {
    for (const token of col.tokens) {
      if (!dependencies.has(token.id)) dependencies.set(token.id, new Set());
      if (!dependents.has(token.id)) dependents.set(token.id, new Set());

      for (const modeVal of Object.values(token.values)) {
        const refs = parseReferences(modeVal.raw);
        for (const ref of refs) {
          const refId = cssVarToId.get(ref);
          if (refId) {
            dependencies.get(token.id)!.add(refId);
            if (!dependents.has(refId)) dependents.set(refId, new Set());
            dependents.get(refId)!.add(token.id);
          } else {
            const existing = danglingRefs.get(token.id) ?? [];
            danglingRefs.set(token.id, [...existing, ref]);
          }
        }
      }
    }
  }

  return { dependencies, dependents, danglingRefs };
}

export function getImpacted(tokenId: string, map: DependencyMap): string[] {
  const visited = new Set<string>();
  const queue = [tokenId];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    const deps = map.dependents.get(current);
    if (deps) {
      for (const dep of deps) {
        if (!visited.has(dep)) queue.push(dep);
      }
    }
  }
  visited.delete(tokenId);
  return [...visited];
}

export function detectCircularReferences(map: DependencyMap): string[][] {
  const cycles: string[][] = [];
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map<string, number>();
  const path: string[] = [];

  function dfs(node: string) {
    color.set(node, GRAY);
    path.push(node);
    const deps = map.dependencies.get(node) ?? new Set();
    for (const dep of deps) {
      const c = color.get(dep) ?? WHITE;
      if (c === GRAY) {
        const cycleStart = path.indexOf(dep);
        cycles.push(path.slice(cycleStart));
      } else if (c === WHITE) {
        dfs(dep);
      }
    }
    path.pop();
    color.set(node, BLACK);
  }

  for (const node of map.dependencies.keys()) {
    if ((color.get(node) ?? WHITE) === WHITE) {
      dfs(node);
    }
  }

  return cycles;
}
