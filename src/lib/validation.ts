import type { Collection, Token } from '@/types/token';
import type { ValidationIssue } from '@/types/graph';
import type { DependencyMap } from '@/types/graph';
import { detectCircularReferences } from './dependency';

let issueCounter = 0;
function makeId() { return `issue-${++issueCounter}`; }

function validateToken(token: Token, collection: Collection): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const { namingConvention } = collection;

  const name = token.name;

  if (namingConvention.allowedNames && !namingConvention.allowedNames.includes(name)) {
    issues.push({
      id: makeId(),
      tokenId: token.id,
      collectionId: collection.id,
      severity: 'warning',
      rule: 'allowed-names',
      message: `"${name}" is not in the allowed name list for "${collection.name}". Expected one of: ${namingConvention.allowedNames.join(', ')}.`,
      suggestedFix: `Use one of the standard names: ${namingConvention.allowedNames.slice(0, 5).join(', ')}`,
    });
  }

  if (namingConvention.allowedPrefixes) {
    const hasValidPrefix = namingConvention.allowedPrefixes.some((p) => name.startsWith(p));
    if (!hasValidPrefix) {
      issues.push({
        id: makeId(),
        tokenId: token.id,
        collectionId: collection.id,
        severity: 'warning',
        rule: 'naming-prefix',
        message: `"${name}" does not start with a recognized prefix for "${collection.name}". Expected one of: ${namingConvention.allowedPrefixes.map((p) => `${p}*`).join(', ')}.`,
      });
    }
  }

  if (namingConvention.segmentPattern) {
    const re = new RegExp(namingConvention.segmentPattern);
    if (!re.test(name)) {
      issues.push({
        id: makeId(),
        tokenId: token.id,
        collectionId: collection.id,
        severity: 'warning',
        rule: 'naming-pattern',
        message: `"${name}" does not match the expected pattern for "${collection.name}": ${namingConvention.description}`,
      });
    }
  }

  if (namingConvention.pattern === 'kebab-case' && /[^a-z0-9-.]/.test(name)) {
    issues.push({
      id: makeId(),
      tokenId: token.id,
      collectionId: collection.id,
      severity: 'error',
      rule: 'kebab-case',
      message: `"${name}" contains invalid characters. Kebab-case names must use only lowercase letters, digits, hyphens, and dots.`,
      suggestedFix: name.toLowerCase().replace(/[^a-z0-9-.]/g, '-'),
    });
  }

  for (const [mode, val] of Object.entries(token.values)) {
    if (!val?.raw?.trim()) {
      issues.push({
        id: makeId(),
        tokenId: token.id,
        collectionId: collection.id,
        severity: 'error',
        rule: 'empty-value',
        message: `Token "${name}" has an empty value for mode "${mode}".`,
      });
    }
  }

  if (!token.cssVariable.startsWith('--')) {
    issues.push({
      id: makeId(),
      tokenId: token.id,
      collectionId: collection.id,
      severity: 'error',
      rule: 'css-var-format',
      message: `CSS variable "${token.cssVariable}" must start with "--".`,
      suggestedFix: `--${token.cssVariable}`,
    });
  }

  return issues;
}

export function validateAll(collections: Collection[], map: DependencyMap): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Per-token validation
  for (const col of collections) {
    for (const token of col.tokens) {
      issues.push(...validateToken(token, col));
    }
  }

  // Duplicate CSS variable detection
  const cssVarCount = new Map<string, string[]>();
  for (const col of collections) {
    for (const token of col.tokens) {
      const existing = cssVarCount.get(token.cssVariable) ?? [];
      cssVarCount.set(token.cssVariable, [...existing, `${col.name}/${token.name}`]);
    }
  }
  for (const [cssVar, usedBy] of cssVarCount.entries()) {
    if (usedBy.length > 1) {
      issues.push({
        id: makeId(),
        tokenId: cssVar,
        collectionId: 'global',
        severity: 'error',
        rule: 'duplicate-css-var',
        message: `CSS variable "${cssVar}" is defined ${usedBy.length} times: ${usedBy.join(', ')}.`,
      });
    }
  }

  // Dangling references
  for (const [tokenId, refs] of map.danglingRefs.entries()) {
    let collectionId = 'unknown';
    for (const col of collections) {
      if (col.tokens.find((t) => t.id === tokenId)) {
        collectionId = col.id;
        break;
      }
    }
    issues.push({
      id: makeId(),
      tokenId,
      collectionId,
      severity: 'warning',
      rule: 'dangling-reference',
      message: `Token references unresolved CSS variables: ${refs.join(', ')}.`,
    });
  }

  // Circular references
  const cycles = detectCircularReferences(map);
  for (const cycle of cycles) {
    issues.push({
      id: makeId(),
      tokenId: cycle[0],
      collectionId: 'global',
      severity: 'error',
      rule: 'circular-reference',
      message: `Circular reference detected: ${cycle.join(' → ')}.`,
    });
  }

  return issues;
}
