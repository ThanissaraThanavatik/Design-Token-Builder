import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from '@/components/ui/calendar';

const meta: Meta = {
  title: 'UI/Calendar',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="w-fit">
      <Calendar mode="single" />
    </div>
  ),
};

export const WithSelected: Story = {
  render: () => (
    <div className="w-fit">
      <Calendar
        mode="single"
        defaultMonth={new Date(2026, 4)}
        selected={new Date(2026, 4, 28)}
      />
    </div>
  ),
};

export const Range: Story = {
  render: () => (
    <div className="w-fit">
      <Calendar
        mode="range"
        defaultMonth={new Date(2026, 4)}
        selected={{ from: new Date(2026, 4, 10), to: new Date(2026, 4, 20) }}
      />
    </div>
  ),
};
