import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meta: Meta = {
  title: 'UI/Card',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Brand Settings</CardTitle>
        <CardDescription>Manage your brand tokens and design preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          <Label>Brand Name</Label>
          <Input placeholder="My Brand" />
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button>Save changes</Button>
        <Button variant="ghost">Cancel</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithBadge: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>New Feature</CardTitle>
          <Badge>Beta</Badge>
        </div>
        <CardDescription>This feature is currently in beta testing.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Explore our latest feature and provide feedback to help us improve it.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Learn more</Button>
      </CardFooter>
    </Card>
  ),
};
