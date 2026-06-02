import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const meta: Meta = {
  title: 'UI/Form',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const TextInput: Story = {
  render: () => (
    <div className="space-y-1.5 max-w-sm">
      <Label>Email address</Label>
      <Input type="email" placeholder="you@example.com" />
    </div>
  ),
};

export const PasswordInput: Story = {
  render: () => (
    <div className="space-y-1.5 max-w-sm">
      <Label>Password</Label>
      <Input type="password" placeholder="••••••••" />
    </div>
  ),
};

export const DisabledInput: Story = {
  render: () => (
    <div className="space-y-1.5 max-w-sm">
      <Label>Read only</Label>
      <Input disabled value="Cannot edit this" />
    </div>
  ),
};

export const TextareaField: Story = {
  render: () => (
    <div className="space-y-1.5 max-w-sm">
      <Label>Description</Label>
      <Textarea placeholder="Write something..." rows={4} />
    </div>
  ),
};

export const FullForm: Story = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <div className="space-y-1.5">
        <Label>Full name</Label>
        <Input placeholder="John Doe" />
      </div>
      <div className="space-y-1.5">
        <Label>Email</Label>
        <Input type="email" placeholder="john@example.com" />
      </div>
      <div className="space-y-1.5">
        <Label>Message</Label>
        <Textarea placeholder="Your message..." rows={3} />
      </div>
    </div>
  ),
};
