import { BookOpen, Workflow, Type, Code2, Lightbulb } from 'lucide-react';

function TipCard({ icon: Icon, title, children }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-primary shrink-0" />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="text-xs text-muted-foreground space-y-1.5 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5">
      <span className="size-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
        {n}
      </span>
      <p>{children}</p>
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="inline font-mono bg-muted px-1.5 py-0.5 rounded text-[10px] text-foreground">
      {children}
    </code>
  );
}

export function TipsTab() {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
      <div className="flex items-center gap-2 pb-1">
        <BookOpen className="size-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold">Font & Typography Usage Guide</h2>
      </div>

      {/* Recommended workflow */}
      <TipCard icon={Workflow} title="Recommended Font Workflow">
        <Step n={1}>
          <strong className="text-foreground">Add fonts to the Org Library</strong> (Font Library tab).
          Type any Google Fonts family name — e.g. <Code>Prompt</Code>, <Code>Sarabun</Code>, <Code>Inter</Code>.
          No API key needed. Fonts are shared across all brands.
        </Step>
        <Step n={2}>
          <strong className="text-foreground">Create Font Family tokens</strong> in the Editor tab.
          Add a collection (or use an existing one), create tokens with group <Code>Font Family</Code>
          and names like <Code>font-sans</Code>, <Code>font-mono</Code>, <Code>font-display</Code>.
          Set values like <Code>"Prompt", sans-serif</Code>.
        </Step>
        <Step n={3}>
          <strong className="text-foreground">Set the brand's font in Brand Docs → Typography.</strong>
          Use the Font Family dropdown to pick from your library. This powers the DESIGN.md export
          and the Type Specs preview.
        </Step>
        <Step n={4}>
          <strong className="text-foreground">Reference tokens from other tokens.</strong>
          In the token editor, a Font Family cell can reference another font token
          (e.g. <Code>var(--font-sans)</Code>) — the picker's "From Tokens" section handles this.
        </Step>
      </TipCard>

      {/* Sans vs Mono */}
      <TipCard icon={Type} title="When to Use Sans vs Mono">
        <div className="grid grid-cols-2 gap-3 not-prose">
          <div className="rounded-md border border-border p-3 space-y-1.5">
            <p className="font-semibold text-foreground">font-sans</p>
            <ul className="space-y-1 list-disc list-inside text-muted-foreground">
              <li>Headings &amp; body copy</li>
              <li>Navigation labels</li>
              <li>UI buttons, forms</li>
              <li>Marketing pages</li>
              <li>Thai body text</li>
            </ul>
          </div>
          <div className="rounded-md border border-border p-3 space-y-1.5">
            <p className="font-semibold text-foreground font-mono">font-mono</p>
            <ul className="space-y-1 list-disc list-inside text-muted-foreground">
              <li>Code blocks &amp; snippets</li>
              <li>Token / variable names</li>
              <li>Data tables &amp; IDs</li>
              <li>Tracking numbers</li>
              <li>Terminal output</li>
            </ul>
          </div>
        </div>
        <p className="mt-1">
          Optionally add <Code>font-display</Code> for hero headings when you want a different
          expressive face separate from the UI font.
        </p>
      </TipCard>

      {/* Token naming conventions */}
      <TipCard icon={Code2} title="Naming Conventions for Font Tokens">
        <p>Use group <Code>Font Family</Code> for the font-name tokens:</p>
        <div className="rounded-md border border-border bg-muted/30 p-3 font-mono text-[11px] space-y-1 text-foreground">
          <p><span className="text-muted-foreground">group: </span>Font Family</p>
          <p>font-sans → <span className="text-primary">"Prompt", sans-serif</span></p>
          <p>font-mono → <span className="text-primary">"IBM Plex Mono", monospace</span></p>
          <p>font-display → <span className="text-primary">"Playfair Display", serif</span></p>
          <p>font-thai → <span className="text-primary">"Sarabun", sans-serif</span></p>
        </div>
        <p>Use the other groups for scale tokens:</p>
        <div className="rounded-md border border-border bg-muted/30 p-3 font-mono text-[11px] space-y-1 text-foreground">
          <p><span className="text-muted-foreground">group: </span>Font Size &nbsp; — text-xs … text-5xl</p>
          <p><span className="text-muted-foreground">group: </span>Font Weight — font-light (300) … font-black (900)</p>
          <p><span className="text-muted-foreground">group: </span>Line Height — leading-tight … leading-loose</p>
          <p><span className="text-muted-foreground">group: </span>Letter Spacing — tracking-tight … tracking-widest</p>
        </div>
      </TipCard>

      {/* CSS variable references */}
      <TipCard icon={Lightbulb} title="How Token References Work">
        <p>
          Token A: <Code>font-heading → "Prompt", sans-serif</Code><br />
          Token B: <Code>body-font → var(--font-heading)</Code>
        </p>
        <p>
          In the CSS export, Token B outputs as:{' '}
          <Code>--body-font: var(--font-heading)</Code>
        </p>
        <p>
          This creates a cascading system — change <Code>font-heading</Code> once
          and every token that references it updates automatically in production CSS.
        </p>
        <p>
          Use the <strong className="text-foreground">From Tokens</strong> section in any Font Family
          picker to create these references without typing variable names manually.
        </p>
        <div className="mt-1 p-2.5 rounded-md bg-primary/5 border border-primary/20 text-foreground">
          <strong>Thai font tip:</strong> Create a <Code>font-thai</Code> token pointing to a Thai-script
          Google Font (e.g. Sarabun, Noto Sans Thai, IBM Plex Sans Thai). Reference it in your
          semantic tokens wherever Thai text is expected. The Typography panel previews both
          Latin and Thai specimens side-by-side.
        </div>
      </TipCard>
    </div>
  );
}
