import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const meta: Meta = {
  title: 'UI/RadioGroup',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="css-tailwind" className="max-w-xs">
      {[
        { value: 'css-tailwind', label: 'CSS (Tailwind 4.0)' },
        { value: 'json-dtcg', label: 'JSON (DTCG)' },
        { value: 'swift', label: 'Swift' },
        { value: 'kotlin', label: 'Kotlin' },
      ].map(({ value, label }) => (
        <div key={value} className="flex items-center gap-2">
          <RadioGroupItem id={value} value={value} />
          <Label htmlFor={value}>{label}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="light" className="flex gap-4 w-fit">
      {['Light', 'Dark', 'System'].map((mode) => (
        <div key={mode} className="flex items-center gap-2">
          <RadioGroupItem id={mode} value={mode.toLowerCase()} />
          <Label htmlFor={mode}>{mode}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
};
