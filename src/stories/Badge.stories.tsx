import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@/components/ui/badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Badge' },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = { decorators: [(S) => <div className="w-fit"><S /></div>] };
export const Secondary: Story = { args: { variant: 'secondary' }, decorators: [(S) => <div className="w-fit"><S /></div>] };
export const Outline: Story = { args: { variant: 'outline' }, decorators: [(S) => <div className="w-fit"><S /></div>] };
export const Destructive: Story = { args: { variant: 'destructive' }, decorators: [(S) => <div className="w-fit"><S /></div>] };

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 max-w-sm">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  ),
};
