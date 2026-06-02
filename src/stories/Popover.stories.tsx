import type { Meta, StoryObj } from '@storybook/react';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meta: Meta = {
  title: 'UI/Popover',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="w-fit">
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Open popover</Button>} />
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Token info</PopoverTitle>
          <PopoverDescription>Details about the selected design token.</PopoverDescription>
        </PopoverHeader>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-xs">CSS Variable</Label>
            <Input className="h-7 text-xs font-mono" value="--color-primary" readOnly />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Value</Label>
            <Input className="h-7 text-xs font-mono" value="#942375" readOnly />
          </div>
        </div>
      </PopoverContent>
    </Popover>
    </div>
  ),
};

export const Simple: Story = {
  render: () => (
    <div className="w-fit">
    <Popover>
      <PopoverTrigger render={<Button variant="ghost" size="sm">More info</Button>} />
      <PopoverContent className="w-60">
        <p className="text-xs text-muted-foreground">
          Design tokens are CSS custom properties that map semantic names to raw values.
          Update once in DTB and sync everywhere.
        </p>
      </PopoverContent>
    </Popover>
    </div>
  ),
};
