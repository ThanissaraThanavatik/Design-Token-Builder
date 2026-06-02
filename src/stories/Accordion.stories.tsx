import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const meta: Meta = {
  title: 'UI/Accordion',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Accordion className="max-w-md">
      <AccordionItem value="colors">
        <AccordionTrigger>Colors</AccordionTrigger>
        <AccordionContent>
          Brand color palette including primary, secondary, and semantic colors.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="typography">
        <AccordionTrigger>Typography</AccordionTrigger>
        <AccordionContent>
          Font families, sizes, weights, and line heights for the brand.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="spacing">
        <AccordionTrigger>Spacing</AccordionTrigger>
        <AccordionContent>
          Spacing scale used across components and layouts.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const MultipleOpen: Story = {
  render: () => (
    <Accordion multiple className="max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Can I open multiple items?</AccordionTrigger>
        <AccordionContent>Yes — this accordion allows multiple items open simultaneously.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How do tokens work?</AccordionTrigger>
        <AccordionContent>
          Design tokens are CSS variables that map semantic names to raw values.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
