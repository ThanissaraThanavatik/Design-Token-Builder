import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

const meta: Meta = {
  title: 'UI/Toggle',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="w-fit">
      <Toggle>Bold</Toggle>
    </div>
  ),
};

export const Pressed: Story = {
  render: () => (
    <div className="w-fit">
      <Toggle defaultPressed>Bold</Toggle>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex gap-1 w-fit">
      <Toggle aria-label="Bold"><Bold /></Toggle>
      <Toggle aria-label="Italic"><Italic /></Toggle>
      <Toggle aria-label="Underline"><Underline /></Toggle>
    </div>
  ),
};

export const Outline: Story = {
  render: () => (
    <div className="w-fit">
      <Toggle variant="outline" defaultPressed>
        <Bold /> Bold
      </Toggle>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <div className="w-fit">
      <ToggleGroup defaultValue={['left']}>
        <ToggleGroupItem value="left" aria-label="Align left"><AlignLeft /></ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center"><AlignCenter /></ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right"><AlignRight /></ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};
