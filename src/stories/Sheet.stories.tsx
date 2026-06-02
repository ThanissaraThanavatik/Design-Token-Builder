import type { Meta, StoryObj } from '@storybook/react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meta: Meta = {
  title: 'UI/Sheet',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Right: Story = {
  render: () => (
    <div className="w-fit">
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Open side panel</Button>} />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Brand settings</SheetTitle>
          <SheetDescription>Adjust your brand configuration from this panel.</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label>Brand name</Label>
            <Input placeholder="My Brand" />
          </div>
          <div className="space-y-1.5">
            <Label>Primary color</Label>
            <Input placeholder="#942375" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose render={<Button variant="outline">Cancel</Button>} />
          <Button>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
    </div>
  ),
};

export const Left: Story = {
  render: () => (
    <div className="w-fit">
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Open left panel</Button>} />
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Token library</SheetTitle>
          <SheetDescription>Browse and select tokens from your brand.</SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-2">
          {['Primary', 'Secondary', 'Accent', 'Destructive', 'Muted'].map((name) => (
            <div key={name} className="flex items-center gap-2 text-sm py-1 border-b border-border">
              <div className="w-4 h-4 rounded-sm border border-border" style={{ backgroundColor: `var(--color-${name.toLowerCase()})` }} />
              {name}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
    </div>
  ),
};
