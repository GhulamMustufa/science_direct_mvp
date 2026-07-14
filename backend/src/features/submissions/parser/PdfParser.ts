import { DocumentParser, ParsedDocument } from './DocumentParser.js';
import pdfParseModule from 'pdf-parse';

// Handle CommonJS / ESM interop for pdf-parse
const pdfParse = (pdfParseModule as any).default || pdfParseModule;

export class PdfParser implements DocumentParser {
  async parse(buffer: Buffer): Promise<ParsedDocument> {
    const data = await (pdfParse as any)(buffer);
    const rawText = data.text;
    const pageCount = data.numpages;

    const wordCount = rawText.split(/\s+/).filter((w: string) => w.length > 0).length;

    const lines = rawText.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
    
    let title: string | undefined = lines[0];
    let abstract: string | undefined;
    let keywords: string[] = [];
    let references: string[] = [];
    let sections: string[] = [];
    let tables: string[] = [];
    let figures: string[] = [];

    let currentSection = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lower = line.toLowerCase().trim();

      // Heuristic for Sections (e.g. "1. Introduction", "Methods", "Discussion", etc.)
      const isHeadingPattern = /^([0-9]+\.|[IVX]+\.)\s+[A-Z]/i.test(line) || 
        /^\s*(introduction|methods|methodology|results|discussion|conclusions?|references|bibliography|abstract|keywords?)\s*$/i.test(line);
      
      if (isHeadingPattern && line.length < 100) {
        sections.push(line);
      }

      // Heuristic for Tables and Figures
      if (/^\s*(table|fig\.|figure)\s+\d+/i.test(line) && line.length < 200) {
        if (/^\s*(table)\s+\d+/i.test(line)) {
          tables.push(line);
        } else {
          figures.push(line);
        }
      }

      const isAbstractHeader = /^\s*abstract\s*:?\s*$/i.test(line);
      const isKeywordsHeader = /^\s*(keywords?|key\s*words?)\s*:?\s*/i.test(line);
      const isReferencesHeader = /^\s*(references|bibliography|works\s+cited)\s*:?\s*$/i.test(line);

      if (isAbstractHeader) {
        currentSection = 'abstract';
        continue;
      } else if (isKeywordsHeader) {
        currentSection = 'keywords';
        let kwText = line.replace(/^\s*(keywords?|key\s*words?)\s*:?\s*/i, '').trim();
        if (kwText) {
          keywords.push(...kwText.split(/[,;]/).map((k: string) => k.trim()));
        }
        continue;
      } else if (isReferencesHeader) {
        currentSection = 'references';
        continue;
      }

      if (currentSection === 'abstract') {
        const isNextSectionHeader = isHeadingPattern || isKeywordsHeader || isReferencesHeader;
        if (isNextSectionHeader && !isAbstractHeader) {
          currentSection = '';
          i--; 
          continue;
        }
        abstract = (abstract ? abstract + ' ' : '') + line;
      } else if (currentSection === 'keywords') {
        const isNextSectionHeader = isHeadingPattern || isAbstractHeader || isReferencesHeader;
        if (isNextSectionHeader) {
           currentSection = '';
           i--;
        } else {
           keywords.push(...line.split(/[,;]/).map((k: string) => k.trim()));
        }
      } else if (currentSection === 'references') {
        // If we hit another heading pattern in references, maybe it's not references anymore (or acknowledgements)
        const isNextSectionHeader = isHeadingPattern && !isReferencesHeader;
        if (isNextSectionHeader && /acknowledg/i.test(line)) {
          currentSection = '';
          i--;
        } else {
          references.push(line);
        }
      }
    }

    return {
      title: title && title.length > 5 ? title : undefined,
      abstract,
      keywords: keywords.filter(k => k.length > 0),
      sections,
      references,
      tables,
      figures,
      pageCount,
      wordCount
    };
  }
}
