import type { Meta, StoryObj } from '@storybook/react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';

const meta: Meta = {
  title: 'UI/Collapsible',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Collapsible className="max-w-xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Color tokens (3)</span>
        <CollapsibleTrigger render={
          <Button variant="ghost" size="sm" className="size-8 p-0">
            <ChevronsUpDown className="size-4" />
          </Button>
        } />
      </div>
      <CollapsibleContent className="space-y-1">
        {['--color-primary', '--color-secondary', '--color-accent'].map((v) => (
          <div key={v} className="rounded-md border px-3 py-2 font-mono text-xs">{v}</div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ),
};
