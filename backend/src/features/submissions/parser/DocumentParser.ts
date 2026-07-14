export interface ParsedDocument {
  title: string | undefined;
  abstract: string | undefined;
  keywords: string[];
  sections: string[];
  references: string[];
  tables: string[];
  figures: string[];
  pageCount: number;
  wordCount: number;
}

export interface DocumentParser {
  parse(buffer: Buffer, originalName?: string): Promise<ParsedDocument>;
}
