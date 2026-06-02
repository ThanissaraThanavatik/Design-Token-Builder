import type { Token } from './token';

export interface TokenGraphNodeData {
  token: Token;
  collectionName: string;
  collectionId: string;
  isHighlighted: boolean;
  isAffected: boolean;
}

export interface TokenGraphNode {
  id: string;
  type: 'tokenNode';
  position: { x: number; y: number };
  data: TokenGraphNodeData;
}

export interface TokenGraphEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
}

export interface DependencyMap {
  dependents: Map<string, Set<string>>;
  dependencies: Map<string, Set<string>>;
  danglingRefs: Map<string, string[]>;
}

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationIssue {
  id: string;
  tokenId: string;
  collectionId: string;
  severity: ValidationSeverity;
  rule: string;
  message: string;
  suggestedFix?: string;
}
