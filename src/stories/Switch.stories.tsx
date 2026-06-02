import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const meta: Meta = {
  title: 'UI/Switch',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2 w-fit">
      <Switch />
      <Label>Toggle me</Label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-2 w-fit">
      <Switch defaultChecked />
      <Label>Enabled by default</Label>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <div className="space-y-3 max-w-xs">
      <div className="flex items-center gap-2">
        <Switch defaultChecked />
        <Label>Email notifications</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch />
        <Label>SMS notifications</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch defaultChecked />
        <Label>Marketing emails</Label>
      </div>
    </div>
  ),
};
