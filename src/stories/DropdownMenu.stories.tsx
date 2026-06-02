import type { Meta, StoryObj } from '@storybook/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const meta: Meta = {
  title: 'UI/DropdownMenu',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="w-fit">
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">Open menu</Button>} />
      <DropdownMenuContent>
        <DropdownMenuLabel>Brand actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Duplicate brand</DropdownMenuItem>
        <DropdownMenuItem>Export tokens</DropdownMenuItem>
        <DropdownMenuItem>View DESIGN.md</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Delete brand</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="w-fit">
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">Options</Button>} />
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Token actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Add token</DropdownMenuItem>
        <DropdownMenuItem>Edit token</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Remove token</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  ),
};
