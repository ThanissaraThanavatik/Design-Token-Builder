import type { Meta, StoryObj } from '@storybook/react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const meta: Meta = {
  title: 'UI/Table',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

const TOKENS = [
  { name: 'Primary', variable: '--color-primary', value: '#942375', type: 'Color' },
  { name: 'Primary Foreground', variable: '--color-primary-foreground', value: '#fafafa', type: 'Color' },
  { name: 'Background', variable: '--color-background', value: '#ffffff', type: 'Color' },
  { name: 'Font Sans', variable: '--font-sans', value: 'Inter', type: 'Typography' },
  { name: 'Radius', variable: '--radius', value: '0.5rem', type: 'Spacing' },
];

export const Default: Story = {
  render: () => (
    <div className="max-w-2xl">
    <Table>
      <TableCaption>Design tokens from the active brand.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>CSS Variable</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {TOKENS.map((token) => (
          <TableRow key={token.variable}>
            <TableCell className="font-medium">{token.name}</TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground">{token.variable}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {token.type === 'Color' && (
                  <div
                    className="size-4 rounded border border-border shrink-0"
                    style={{ backgroundColor: token.value }}
                  />
                )}
                <span className="font-mono text-xs">{token.value}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className="text-[10px]">{token.type}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  ),
};
