import type { Preview } from '@storybook/react-vite';
import '../src/index.css';
import brandsSnapshot from '../src/stories/brands-snapshot.json';

type BrandEntry = {
  id: string;
  name: string;
  vars: Record<string, string>;
  darkVars: Record<string, string>;
};

const brands = brandsSnapshot.brands as BrandEntry[];

const brandItems =
  brands.length > 0
    ? brands.map((b) => ({ value: b.id, title: b.name }))
    : [{ value: '__none__', title: 'No brands synced' }];

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    brand: {
      name: 'Brand',
      defaultValue: brandItems[0].value,
      toolbar: {
        icon: 'paintbrush',
        items: brandItems,
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals['theme'] === 'dark';
      const selectedBrand = brands.find((b) => b.id === context.globals['brand']);
      const cssVars = selectedBrand
        ? { ...selectedBrand.vars, ...(isDark ? selectedBrand.darkVars : {}) }
        : {};
      return (
        <div className={isDark ? 'dark' : ''} style={cssVars as React.CSSProperties}>
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--color-background)',
              color: 'var(--color-foreground)',
              minHeight: '100vh',
            }}
          >
            <Story />
          </div>
        </div>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: { test: 'todo' },
  },
};

export default preview;
