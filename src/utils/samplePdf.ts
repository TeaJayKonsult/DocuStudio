import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Generates a clean, professional sample agreement PDF binary on the fly
 * so users can test viewing, filling, checkmarking, and signing without needing their own file.
 */
export async function generateSamplePdf(): Promise<{ buffer: ArrayBuffer; name: string }> {
  const pdfDoc = await PDFDocument.create();
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const page = pdfDoc.addPage([600, 780]);
  const { width, height } = page.getSize();

  // Header banner
  page.drawRectangle({
    x: 0,
    y: height - 80,
    width: width,
    height: 80,
    color: rgb(0.06, 0.08, 0.12)
  });

  page.drawText('DocuStudio by TeaJay Konsult', {
    x: 40,
    y: height - 42,
    size: 18,
    font: timesRoman,
    color: rgb(1, 1, 1)
  });

  page.drawText('CLIENT CONSULTING & MASTER WORKSPACE AGREEMENT', {
    x: 40,
    y: height - 62,
    size: 10,
    font: helveticaBold,
    color: rgb(0.6, 0.65, 0.8)
  });

  // Reference & Date
  page.drawText('Reference: DS-AGR-2026-0049', {
    x: 40,
    y: height - 110,
    size: 10,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.5)
  });

  page.drawText(`Issue Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, {
    x: 380,
    y: height - 110,
    size: 10,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.5)
  });

  // Section 1
  page.drawText('1. PARTIES & ENGAGEMENT SCOPE', {
    x: 40,
    y: height - 145,
    size: 12,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.2)
  });

  const body1 = 
    'This Agreement is made between TeaJay Konsult ("Provider") and the designated Client ("Recipient"). ' +
    'Provider delivers digital document workspace management, PDF verification tools, and secure cryptographic signing workflows.';
  
  page.drawText(body1, {
    x: 40,
    y: height - 175,
    size: 10,
    font: helvetica,
    color: rgb(0.2, 0.2, 0.3),
    maxWidth: 520,
    lineHeight: 14
  });

  // Form Fields to Fill
  page.drawRectangle({
    x: 40,
    y: height - 310,
    width: 520,
    height: 100,
    color: rgb(0.97, 0.98, 1.0),
    borderColor: rgb(0.8, 0.85, 0.95),
    borderWidth: 1
  });

  page.drawText('FORM FIELDS TO COMPLETE:', {
    x: 55,
    y: height - 230,
    size: 10,
    font: helveticaBold,
    color: rgb(0.25, 0.3, 0.6)
  });

  page.drawText('Client Name: _________________________________', {
    x: 55,
    y: height - 255,
    size: 10,
    font: helvetica,
    color: rgb(0.2, 0.2, 0.3)
  });

  page.drawText('[   ]  I agree to the electronic signature policy and data governance terms.', {
    x: 55,
    y: height - 280,
    size: 10,
    font: helvetica,
    color: rgb(0.2, 0.2, 0.3)
  });

  page.drawText('Date of Verification: _________________________', {
    x: 55,
    y: height - 302,
    size: 10,
    font: helvetica,
    color: rgb(0.2, 0.2, 0.3)
  });

  // Section 2
  page.drawText('2. CONFIDENTIALITY & AUDIT INTEGRITY', {
    x: 40,
    y: height - 340,
    size: 12,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.2)
  });

  const body2 = 
    'All annotations, checkmarks, and signature elements stamped into this document execute within ' +
    'browser memory. Both parties confirm that electronic signatures placed hereon carry full legal validity under applicable e-commerce legislation.';

  page.drawText(body2, {
    x: 40,
    y: height - 370,
    size: 10,
    font: helvetica,
    color: rgb(0.2, 0.2, 0.3),
    maxWidth: 520,
    lineHeight: 14
  });

  // Signature Block Area
  page.drawRectangle({
    x: 40,
    y: height - 510,
    width: 520,
    height: 110,
    color: rgb(0.99, 0.99, 1.0),
    borderColor: rgb(0.85, 0.88, 0.94),
    borderWidth: 1
  });

  page.drawText('SIGNATURE & VERIFICATION AREA', {
    x: 55,
    y: height - 425,
    size: 10,
    font: helveticaBold,
    color: rgb(0.3, 0.3, 0.4)
  });

  page.drawText('Authorized Signature:', {
    x: 55,
    y: height - 455,
    size: 10,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.4)
  });

  page.drawLine({
    start: { x: 55, y: height - 485 },
    end: { x: 260, y: height - 485 },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7)
  });

  page.drawText('Company Stamp / Seal:', {
    x: 320,
    y: height - 455,
    size: 10,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.4)
  });

  page.drawRectangle({
    x: 320,
    y: height - 500,
    width: 120,
    height: 40,
    borderColor: rgb(0.75, 0.78, 0.85),
    borderWidth: 1,
    color: rgb(1, 1, 1)
  });

  // Footer
  page.drawText('DocuStudio Document ID: DS-DOC-98214-X  •  Generated on behalf of TeaJay Konsult', {
    x: 40,
    y: 35,
    size: 8,
    font: helvetica,
    color: rgb(0.5, 0.5, 0.6)
  });

  const pdfBytes = await pdfDoc.save();
  return {
    buffer: pdfBytes.buffer as ArrayBuffer,
    name: 'Sample_Agreement_DocuStudio.pdf'
  };
}
