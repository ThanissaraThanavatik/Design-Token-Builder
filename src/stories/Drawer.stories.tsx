import type { Meta, StoryObj } from '@storybook/react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

const meta: Meta = {
  title: 'UI/Drawer',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="w-fit">
    <Drawer>
      <DrawerTrigger asChild><Button variant="outline">Open drawer</Button></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Export tokens</DrawerTitle>
          <DrawerDescription>
            Choose a format to export your design tokens from this brand.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 space-y-2">
          {['CSS (Tailwind 4.0)', 'JSON (DTCG)', 'Swift', 'Kotlin', 'DESIGN.md'].map((fmt) => (
            <div key={fmt} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
              <span>{fmt}</span>
              <Button variant="ghost" size="sm" className="text-xs h-7">Export</Button>
            </div>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose asChild><Button variant="outline" className="w-full">Close</Button></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
    </div>
  ),
};
