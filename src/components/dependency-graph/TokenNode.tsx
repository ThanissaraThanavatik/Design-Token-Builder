import { Handle, Position, type NodeProps } from '@xyflow/react';
import { cn, isColorValue } from '@/lib/utils';

export function TokenNode({ data }: NodeProps) {
  const { token, collectionName, isHighlighted, isAffected } = data as {
    token: { name: string; cssVariable: string; values: Record<string, { raw: string }> };
    collectionName: string;
    isHighlighted: boolean;
    isAffected: boolean;
  };

  const val = token.values['light'] ?? token.values['default'];
  const rawVal = val?.raw ?? '';
  const isColor = isColorValue(rawVal);

  return (
    <div
      className={cn(
        'rounded-lg border px-3 py-2 bg-card text-xs shadow-sm w-[200px]',
        isHighlighted && 'border-primary ring-2 ring-primary/20',
        isAffected && 'border-orange-400 bg-orange-50 dark:bg-orange-950/20',
        !isHighlighted && !isAffected && 'border-border',
      )}
    >
      <Handle type="target" position={Position.Top} className="!size-2 !bg-muted-foreground" />
      <div className="flex items-center gap-2 mb-1">
        {isColor && rawVal.startsWith('#') && (
          <span className="size-4 rounded shrink-0 border border-border" style={{ backgroundColor: rawVal }} />
        )}
        <span className="font-mono font-medium truncate">{token.name}</span>
      </div>
      <div className="text-muted-foreground truncate">{collectionName}</div>
      {rawVal && <div className="font-mono text-muted-foreground truncate mt-0.5">{rawVal}</div>}
      <Handle type="source" position={Position.Bottom} className="!size-2 !bg-muted-foreground" />
    </div>
  );
}
