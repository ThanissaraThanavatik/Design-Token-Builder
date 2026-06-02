import type { Meta, StoryObj } from '@storybook/react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';

const meta: Meta = {
  title: 'UI/HoverCard',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="max-w-xs p-8">
      <HoverCard>
        <HoverCardTrigger
          render={
            <span className="cursor-pointer font-mono text-sm text-primary underline underline-offset-2">
              --color-primary
            </span>
          }
        />
        <HoverCardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-md border" style={{ backgroundColor: 'var(--color-primary)' }} />
              <div>
                <p className="text-xs font-medium">Primary</p>
                <p className="font-mono text-[10px] text-muted-foreground">--color-primary</p>
              </div>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <Badge variant="secondary" className="text-[10px]">Color</Badge>
              <Badge variant="secondary" className="text-[10px]">Light mode</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Used for primary actions, focus rings, and interactive elements.
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};
