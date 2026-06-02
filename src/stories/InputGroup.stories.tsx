import type { Meta, StoryObj } from '@storybook/react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group';
import { Search, Copy } from 'lucide-react';

const meta: Meta = {
  title: 'UI/InputGroup',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const WithIcon: Story = {
  render: () => (
    <InputGroup className="max-w-xs">
      <InputGroupAddon>
        <InputGroupText>
          <Search />
        </InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="Search tokens…" />
    </InputGroup>
  ),
};

export const WithButton: Story = {
  render: () => (
    <InputGroup className="max-w-xs">
      <InputGroupInput className="font-mono text-xs" value="--color-primary" readOnly />
      <InputGroupAddon align="inline-end">
        <InputGroupButton>
          <Copy />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const WithPrefix: Story = {
  render: () => (
    <InputGroup className="max-w-xs">
      <InputGroupAddon>
        <InputGroupText>--color-</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="primary" />
    </InputGroup>
  ),
};
