const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../../test_pdfs');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Helpers
const lorem100 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ".repeat(2);
const lorem300 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ".repeat(6);

function generatePDF(filename, config) {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(path.join(outDir, filename)));

    doc.fontSize(18).text(config.title, { align: 'center' });
    doc.moveDown();

    // Abstract
    doc.fontSize(14).text('Abstract');
    doc.fontSize(12).text(config.abstractText);
    doc.moveDown();

    // Keywords
    doc.fontSize(12).text(`Keywords: ${config.keywords.join(', ')}`);
    doc.moveDown();

    // Sections
    for (const section of config.sections) {
      doc.fontSize(14).text(section);
      doc.fontSize(12).text(lorem100);
      doc.moveDown();
    }

    // References
    doc.fontSize(14).text('References');
    for (let i = 1; i <= config.refCount; i++) {
      doc.fontSize(12).text(`[${i}] Reference Author et al., Journal of Science, 202${i}, ${i}0-${i}5.`);
    }

    doc.end();
    resolve();
  });
}

async function generateAll() {
  // 3 SUCCESS PDFs
  for (let i = 1; i <= 3; i++) {
    await generatePDF(`Success_Article_${i}.pdf`, {
      title: `Successful Validation Article ${i}`,
      abstractText: "This is a short abstract under 250 words. " + lorem100, // ~100 words
      keywords: ["Biochemistry", "Molecular Biology", "Health", "Research"],
      sections: ["Introduction", "Methods", "Results", "Discussion", "Conclusions"],
      refCount: 12
    });
  }

  // 3 WARNING PDFs
  for (let i = 1; i <= 3; i++) {
    await generatePDF(`Warning_Article_${i}.pdf`, {
      title: `Warning Validation Article ${i}`,
      abstractText: "This is a short abstract under 250 words. " + lorem100,
      keywords: ["Biochemistry", "Molecular Biology", "Health", "Research"],
      sections: ["Introduction", "Methods", "Results", "Discussion", "Conclusions"],
      refCount: 7 // triggers reference warning (between 5 and 9)
    });
  }

  // 3 INVALID PDFs
  // Invalid 1: Missing Results, Conclusions
  await generatePDF(`Invalid_MissingSections_1.pdf`, {
    title: `Invalid Article - Missing Sections`,
    abstractText: "This is a short abstract under 250 words. " + lorem100,
    keywords: ["Biochemistry", "Molecular Biology", "Health"],
    sections: ["Introduction", "Methods", "Discussion"], // missing Results and Conclusions
    refCount: 12
  });

  // Invalid 2: Abstract too long
  await generatePDF(`Invalid_LongAbstract_2.pdf`, {
    title: `Invalid Article - Long Abstract`,
    abstractText: "This is a very long abstract over 250 words. " + lorem300, // ~300+ words
    keywords: ["Biochemistry", "Molecular Biology", "Health"],
    sections: ["Introduction", "Methods", "Results", "Discussion", "Conclusions"],
    refCount: 12
  });

  // Invalid 3: Keywords > 5 and References < 5
  await generatePDF(`Invalid_KeywordsAndRefs_3.pdf`, {
    title: `Invalid Article - Keywords and Refs`,
    abstractText: "This is a short abstract under 250 words. " + lorem100,
    keywords: ["Bio", "Chem", "Physics", "Math", "Stat", "Health", "Medicine"], // 7 keywords
    sections: ["Introduction", "Methods", "Results", "Discussion", "Conclusions"],
    refCount: 3 // less than 5
  });

  console.log('All PDFs generated successfully in /test_pdfs directory.');
}

generateAll();
