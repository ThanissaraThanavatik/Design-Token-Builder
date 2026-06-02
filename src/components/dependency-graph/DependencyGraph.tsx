import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  MarkerType,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { useBrandStore } from '@/store/brandStore';
import { useUIStore } from '@/store/uiStore';
import { useDependencyGraph } from '@/hooks/useDependencyGraph';
import { TokenNode } from './TokenNode';
import { ImpactPanel } from './ImpactPanel';
import type { Collection } from '@/types/token';

const nodeTypes = { tokenNode: TokenNode };

function buildLayout(
  collections: Collection[],
  map: ReturnType<typeof useDependencyGraph>['map'],
  highlighted: string | null,
  impacted: Set<string>,
) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', nodesep: 60, ranksep: 80 });

  const allTokens: { collectionName: string; token: { id: string; name: string; cssVariable: string; type: string; values: Record<string, { raw: string }> } }[] = [];

  for (const col of collections) {
    for (const token of col.tokens) {
      const deps = map.dependencies.get(token.id) ?? new Set();
      const inDeps = map.dependents.get(token.id) ?? new Set();
      if (deps.size === 0 && inDeps.size === 0) continue;
      allTokens.push({ collectionName: col.name, token });
    }
  }

  const nodes: Node[] = allTokens.map(({ collectionName, token }) => {
    g.setNode(token.id, { width: 200, height: 56 });
    return {
      id: token.id,
      type: 'tokenNode',
      position: { x: 0, y: 0 },
      data: {
        token,
        collectionName,
        collectionId: '',
        isHighlighted: token.id === highlighted,
        isAffected: impacted.has(token.id),
      },
    };
  });

  const edges: Edge[] = [];
  for (const [fromId, deps] of map.dependencies.entries()) {
    for (const toId of deps) {
      if (g.hasNode(fromId) && g.hasNode(toId)) {
        const edgeId = `${fromId}-${toId}`;
        g.setEdge(fromId, toId);
        edges.push({
          id: edgeId,
          source: fromId,
          target: toId,
          animated: fromId === highlighted || toId === highlighted,
          markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10 },
          style: { stroke: impacted.has(toId) ? '#942375' : undefined },
        });
      }
    }
  }

  dagre.layout(g);

  return {
    nodes: nodes.map((n) => {
      const pos = g.node(n.id);
      return { ...n, position: { x: pos.x - 100, y: pos.y - 28 } };
    }),
    edges,
  };
}

export function DependencyGraph() {
  const { brands, activeBrandId } = useBrandStore();
  const { graphHighlightedTokenId, setGraphHighlight } = useUIStore();
  const brand = brands.find((b) => b.id === activeBrandId);
  const collections = brand?.collections ?? [];

  const { map, impacted } = useDependencyGraph(collections, graphHighlightedTokenId);

  const { nodes: layoutNodes, edges: layoutEdges } = useMemo(
    () => buildLayout(collections, map, graphHighlightedTokenId, impacted),
    [collections, map, graphHighlightedTokenId, impacted],
  );

  const [nodes, , onNodesChange] = useNodesState(layoutNodes);
  const [edges, , onEdgesChange] = useEdgesState(layoutEdges);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setGraphHighlight(node.id === graphHighlightedTokenId ? null : node.id);
    },
    [graphHighlightedTokenId, setGraphHighlight],
  );

  if (layoutNodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
        <p className="text-sm">No token references found in this brand.</p>
        <p className="text-xs">Use <code className="bg-muted px-1 rounded">var(--token-name)</code> in token values to create references.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
      {graphHighlightedTokenId && (
        <ImpactPanel
          tokenId={graphHighlightedTokenId}
          collections={collections}
          impacted={impacted}
          onClose={() => setGraphHighlight(null)}
        />
      )}
    </div>
  );
}
