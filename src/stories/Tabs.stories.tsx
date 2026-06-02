import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

const meta: Meta = {
  title: 'UI/Tabs',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="max-w-md">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="tokens">Tokens</TabsTrigger>
        <TabsTrigger value="exports">Exports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Brand overview content here.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="tokens">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Design tokens content here.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="exports">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Export settings content here.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};
