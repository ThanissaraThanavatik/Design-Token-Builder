import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const meta: Meta = {
  title: 'UI/Slider',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <Slider defaultValue={[50]} className="max-w-xs" />,
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2 max-w-xs">
      <Label>Opacity</Label>
      <Slider defaultValue={[75]} min={0} max={100} />
    </div>
  ),
};

export const Range: Story = {
  render: () => (
    <div className="space-y-2 max-w-xs">
      <Label>Font weight range</Label>
      <Slider defaultValue={[300, 700]} min={100} max={900} step={100} />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => <Slider defaultValue={[40]} disabled className="max-w-xs" />,
};
