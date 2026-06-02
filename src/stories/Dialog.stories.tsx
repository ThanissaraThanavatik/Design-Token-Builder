import type { Meta, StoryObj } from '@storybook/react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meta: Meta = {
  title: 'UI/Dialog',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="w-fit">
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Open Dialog</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Brand Settings</DialogTitle>
          <DialogDescription>
            Update your brand name and slug. Changes are saved automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label>Brand name</Label>
            <Input placeholder="My Brand" />
          </div>
          <div className="space-y-1.5">
            <Label>Slug</Label>
            <Input placeholder="my-brand" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  ),
};

export const Destructive: Story = {
  render: () => (
    <div className="w-fit">
    <Dialog>
      <DialogTrigger render={<Button variant="destructive">Delete Brand</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete brand?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. All tokens and settings for this brand will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  ),
};
