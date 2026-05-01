import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const brand = '#0f766e';
const navy = '#12325f';
const red = '#d71920';
const light = '#eef8fb';
const border = '#d6e4ea';
const text = '#17202a';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logoCandidates = [
  path.resolve(__dirname, '../../public/logo.png'),
  path.resolve(__dirname, '../../../client/public/logo.png')
];

export function buildApplicationPdf(application, writable) {
  const doc = new PDFDocument({ margin: 42, size: 'A4' });
  doc.pipe(writable);

  drawHeader(doc, application);
  section(doc, 'Pupil Details');
  fieldGrid(doc, [
    ['Name of the Pupil', application.fullName],
    ['Mother Tongue', application.motherTongue],
    ['Date of Birth', formatDate(application.dateOfBirth)],
    ['Aadhaar No.', maskAadhaar(application.aadhaarNumber)],
    ['PEN No.', application.penNumber],
    ['Child ID', application.childId],
    ['Nationality and State', application.nationalityState],
    ['Religion', application.religion],
    ['SC / ST / BC Details', application.casteCategory],
    ['Living With', application.livingWith]
  ]);

  section(doc, 'Parent / Guardian Details');
  fieldGrid(doc, [
    ['Parent / Guardian Name', application.parent?.name],
    ['Cell No.', application.parent?.phone],
    ['Email', application.parent?.email],
    ['Occupation', application.parent?.occupation],
    ['Mother Name', application.motherName],
    ['Full Address With Cell No.', application.parent?.addressWithCellNo]
  ]);

  section(doc, 'Academic Details');
  fieldGrid(doc, [
    ['Class Last Studied', application.lastClassStudied],
    ['School Last Attended', application.lastSchoolAttended],
    ['Qualified for Promotion', application.qualifiedForPromotion],
    ['T.C. / Record Sheet Attached', application.tcRecordAttached],
    ['T.C. / Record Number and Date', application.tcNumberDate],
    ['Class Sought', application.classApplyingFor],
    ['Medium of Instruction', application.mediumOfInstruction],
    ['First Language Part-I', application.firstLanguage],
    ['Second Language', application.secondLanguage],
    ['Small-pox Protection', application.smallpoxProtection],
    ['Identification Mark (i)', application.identificationMark1],
    ['Identification Mark (ii)', application.identificationMark2],
    ['Previous School History', application.previousSchoolHistory]
  ]);

  section(doc, 'Remarks');
  if (application.remarks?.length) {
    application.remarks.forEach((remark) => {
      ensureSpace(doc, 26);
      doc.fontSize(9).fillColor(text).text(`${remark.status} - ${remark.message} (${formatDate(remark.addedAt)})`, {
        indent: 8
      });
    });
  } else {
    doc.fontSize(9).fillColor(text).text('No remarks yet.', { indent: 8 });
  }

  drawFooter(doc);
  doc.end();
}

function drawHeader(doc, application) {
  doc.rect(0, 0, doc.page.width, 122).fill(navy);
  doc.rect(0, 0, doc.page.width, 10).fill(red);
  const logoPath = logoCandidates.find((candidate) => fs.existsSync(candidate));
  if (logoPath) {
    doc.circle(78, 58, 31).fill('white');
    doc.image(logoPath, 48, 28, { fit: [60, 60], align: 'center', valign: 'center' });
  }
  doc.fillColor('white').fontSize(22).font('Helvetica-Bold').text('JYOTHI E.M. SCHOOL', 112, 26, {
    width: doc.page.width - 154,
    align: 'center'
  });
  doc.fontSize(10).font('Helvetica').text('Recognised by the Government of Andhra Pradesh | Nehru Nagar, Dhone', { align: 'center' });
  doc.moveDown(0.4);
  doc.fontSize(15).font('Helvetica-Bold').text('APPLICATION FOR ADMISSION', { align: 'center' });

  doc.roundedRect(42, 92, doc.page.width - 84, 58, 6).fillAndStroke('#ffffff', border);
  doc.fillColor(text).fontSize(9).font('Helvetica-Bold');
  doc.text(`Application ID: ${application.applicationId}`, 58, 106);
  doc.text(`Status: ${application.status}`, 230, 106);
  doc.text(`Submitted: ${application.submittedAt ? formatDate(application.submittedAt) : 'Draft'}`, 390, 106);
  doc.font('Helvetica');
  doc.text(`Admission No.: ${value(application.admissionNo)}`, 58, 128);
  doc.text(`Class Admitted: ${value(application.classAdmitted)}`, 230, 128);
  doc.text(`Date of Admission: ${value(formatDate(application.dateOfAdmission))}`, 390, 128);
  doc.y = 170;
}

function section(doc, title) {
  ensureSpace(doc, 45);
  doc.moveDown(0.5);
  doc.roundedRect(42, doc.y, doc.page.width - 84, 24, 4).fill(brand);
  doc.fillColor('white').fontSize(11).font('Helvetica-Bold').text(title, 54, doc.y + 7);
  doc.y += 32;
}

function fieldGrid(doc, rows) {
  const left = 42;
  const width = doc.page.width - 84;
  const labelWidth = 145;
  const rowHeight = 26;

  rows.forEach(([label, raw]) => {
    ensureSpace(doc, rowHeight + 8);
    const y = doc.y;
    doc.roundedRect(left, y, width, rowHeight, 3).fillAndStroke(light, border);
    doc.fillColor(navy).fontSize(8).font('Helvetica-Bold').text(label, left + 10, y + 8, { width: labelWidth });
    doc.fillColor(text).fontSize(9).font('Helvetica').text(value(raw), left + labelWidth + 18, y + 8, {
      width: width - labelWidth - 28,
      lineBreak: false
    });
    doc.y = y + rowHeight + 5;
  });
}

function drawFooter(doc) {
  const y = doc.page.height - 72;
  doc.strokeColor(border).moveTo(42, y).lineTo(doc.page.width - 42, y).stroke();
  doc.fillColor(text).fontSize(9).font('Helvetica');
  doc.text('Signature of Parent / Guardian', 42, y + 18);
  doc.text('Signature of Head Master', doc.page.width - 210, y + 18);
}

function ensureSpace(doc, needed) {
  if (doc.y + needed > doc.page.height - 90) {
    drawFooter(doc);
    doc.addPage();
    doc.y = 42;
  }
}

function value(input) {
  return input ? String(input) : 'N/A';
}

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function maskAadhaar(input) {
  if (!input) return input;
  const digits = String(input).replace(/\D/g, '');
  return digits.length === 12 ? `xxxx-xxxx-${digits.slice(-4)}` : input;
}
