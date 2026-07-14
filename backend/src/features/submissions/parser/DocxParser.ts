import { DocumentParser, ParsedDocument } from './DocumentParser.js';
import * as mammoth from 'mammoth';
import * as cheerio from 'cheerio';

export class DocxParser implements DocumentParser {
  async parse(buffer: Buffer): Promise<ParsedDocument> {
    const textResult = await mammoth.extractRawText({ buffer });
    const rawText = textResult.value;

    const htmlResult = await mammoth.convertToHtml({ buffer });
    const html = htmlResult.value;
    const $ = cheerio.load(html);

    // Heuristics
    const wordCount = rawText.split(/\s+/).filter(w => w.length > 0).length;
    // Word doesn't easily give page count through simple text extraction
    const pageCount = Math.max(1, Math.ceil(wordCount / 500)); 

    // Find tables and figures via HTML tags
    const tables: string[] = [];
    $('table').each((i, el) => {
      tables.push($.html(el));
    });

    const figures: string[] = [];
    $('img').each((i, el) => {
      figures.push($(el).attr('src') || 'image');
    });

    // Sections via headers
    const sections: string[] = [];
    $('h1, h2, h3').each((i, el) => {
      sections.push($(el).text().trim());
    });

    // Simple regex for Abstract and Keywords and References
    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    let title: string | undefined = lines[0]; // assume first line is title
    let abstract: string | undefined;
    let keywords: string[] = [];
    let references: string[] = [];

    let currentSection = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lower = line.toLowerCase().trim();
      
      const isHeadingPattern = /^([0-9]+\.|[IVX]+\.)\s+[A-Z]/i.test(line) || 
        /^\s*(introduction|methods|methodology|results|discussion|conclusions?|references|bibliography|abstract|keywords?)\s*$/i.test(line);

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
          keywords.push(...kwText.split(/[,;]/).map(k => k.trim()));
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
           keywords.push(...line.split(/[,;]/).map(k => k.trim()));
        }
      } else if (currentSection === 'references') {
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
