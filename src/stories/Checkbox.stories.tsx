import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const meta: Meta = {
  title: 'UI/Checkbox',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <div className="w-fit"><Checkbox /></div>,
};

export const Checked: Story = {
  render: () => <div className="w-fit"><Checkbox defaultChecked /></div>,
};

export const Disabled: Story = {
  render: () => <div className="w-fit"><Checkbox disabled /></div>,
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2 w-fit">
      <Checkbox id="accept" />
      <Label htmlFor="accept">Accept design token guidelines</Label>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <div className="space-y-2 max-w-xs">
      {[
        { id: 'colors', label: 'Color tokens', checked: true },
        { id: 'typography', label: 'Typography tokens', checked: true },
        { id: 'spacing', label: 'Spacing tokens', checked: false },
        { id: 'icons', label: 'Icon tokens', checked: false },
      ].map(({ id, label, checked }) => (
        <div key={id} className="flex items-center gap-2">
          <Checkbox id={id} defaultChecked={checked} />
          <Label htmlFor={id}>{label}</Label>
        </div>
      ))}
    </div>
  ),
};
