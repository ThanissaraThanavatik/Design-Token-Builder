import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const meta: Meta = {
  title: 'UI/Alert',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="max-w-md">
      <Alert>
        <Info />
        <AlertTitle>Brand tokens updated</AlertTitle>
        <AlertDescription>
          Your design tokens have been synced to Storybook. Refresh to see changes.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

export const Destructive: Story = {
  render: () => (
    <div className="max-w-md">
      <Alert variant="destructive">
        <XCircle />
        <AlertTitle>Export failed</AlertTitle>
        <AlertDescription>
          Could not generate CSS export. Check that all token values are valid.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

export const Warning: Story = {
  render: () => (
    <div className="max-w-md">
      <Alert>
        <AlertTriangle />
        <AlertTitle>Missing dark mode tokens</AlertTitle>
        <AlertDescription>
          Some tokens don't have dark mode values. They'll fall back to light mode.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

export const Success: Story = {
  render: () => (
    <div className="max-w-md">
      <Alert>
        <CheckCircle />
        <AlertTitle>Sync complete</AlertTitle>
        <AlertDescription>All brands have been synced to Storybook successfully.</AlertDescription>
      </Alert>
    </div>
  ),
};
