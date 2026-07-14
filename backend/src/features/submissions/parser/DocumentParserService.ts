import { DocumentParser, ParsedDocument } from './DocumentParser.js';
import { PdfParser } from './PdfParser.js';
import { DocxParser } from './DocxParser.js';

export class DocumentParserService {
  private pdfParser = new PdfParser();
  private docxParser = new DocxParser();

  async parseDocument(buffer: Buffer, mimetype: string, originalName?: string): Promise<ParsedDocument> {
    if (mimetype === 'application/pdf' || originalName?.toLowerCase().endsWith('.pdf')) {
      return this.pdfParser.parse(buffer);
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      mimetype === 'application/msword' ||
      originalName?.toLowerCase().endsWith('.docx') ||
      originalName?.toLowerCase().endsWith('.doc')
    ) {
      return this.docxParser.parse(buffer);
    }

    throw new Error('Unsupported document format');
  }
}

export const documentParserService = new DocumentParserService();
