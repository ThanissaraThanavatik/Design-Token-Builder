export type ExportFormat = 'css-tailwind' | 'json-dtcg' | 'design-md' | 'swift' | 'kotlin';

export interface DTCGTokenValue {
  $value: string | number;
  $type: 'color' | 'dimension' | 'number' | 'string' | 'fontFamily';
  $description?: string;
  $extensions?: Record<string, unknown>;
}

export interface DTCGGroup {
  [key: string]: DTCGTokenValue | DTCGGroup;
}

export interface DTCGFile {
  $schema: string;
  $metadata: {
    name: string;
    brand: string;
    primaryColorShade?: string | null;
    secondaryColorShade?: string | null;
    generatedAt: string;
    generatedBy: string;
  };
  [collectionName: string]: DTCGGroup | unknown;
}

export interface ExportResult {
  format: ExportFormat;
  filename: string;
  mimeType: string;
  content: string;
}
