import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from '@/components/ui/progress';

const meta: Meta = {
  title: 'UI/Progress',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <Progress value={50} className="max-w-sm" />,
};

export const Low: Story = {
  render: () => <Progress value={25} className="max-w-sm" />,
};

export const Full: Story = {
  render: () => <Progress value={100} className="max-w-sm" />,
};

export const Steps: Story = {
  render: () => (
    <div className="space-y-3 max-w-sm">
      {[
        { label: 'Colors', value: 100 },
        { label: 'Typography', value: 75 },
        { label: 'Spacing', value: 40 },
        { label: 'Icons', value: 10 },
      ].map(({ label, value }) => (
        <div key={label} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>{label}</span>
            <span className="text-muted-foreground">{value}%</span>
          </div>
          <Progress value={value} />
        </div>
      ))}
    </div>
  ),
};
