import type { Brand, GoogleFont } from '@/types/brand';
import type { ExportFormat, ExportResult } from '@/types/export';
import { generateCSS } from '@/lib/css-export';
import { generateJSON } from '@/lib/json-export';
import { generateDesignMD } from '@/lib/design-md-export';
import { generateSwift } from '@/lib/swift-export';
import { generateKotlin } from '@/lib/kotlin-export';
import { downloadFile } from '@/lib/utils';

export function generateExport(brand: Brand, format: ExportFormat, orgFonts?: GoogleFont[]): ExportResult {
  const slug = brand.slug;
  switch (format) {
    case 'css-tailwind':
      return { format, filename: `${slug}-tokens.css`, mimeType: 'text/css', content: generateCSS(brand, orgFonts) };
    case 'json-dtcg':
      return { format, filename: `${slug}-tokens.json`, mimeType: 'application/json', content: generateJSON(brand) };
    case 'design-md':
      return { format, filename: `${slug}-DESIGN.md`, mimeType: 'text/markdown', content: generateDesignMD(brand) };
    case 'swift':
      return { format, filename: `${slug.replace(/-/g, '')}-Tokens.swift`, mimeType: 'text/plain', content: generateSwift(brand) };
    case 'kotlin':
      return { format, filename: `${slug.replace(/-/g, '')}Tokens.kt`, mimeType: 'text/plain', content: generateKotlin(brand) };
  }
}

export function downloadExport(brand: Brand, format: ExportFormat, orgFonts?: GoogleFont[]) {
  const result = generateExport(brand, format, orgFonts);
  downloadFile(result.filename, result.content, result.mimeType);
}
