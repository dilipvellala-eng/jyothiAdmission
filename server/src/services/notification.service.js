import nodemailer from 'nodemailer';

function hasSmtpConfig() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

async function sendEmail(to, subject, text) {
  if (!to) return;
  if (!hasSmtpConfig()) {
    console.log(`[email skipped] ${redactEmail(to)}: ${subject}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'Admissions Office <no-reply@school.test>',
    to,
    subject,
    text
  });
}

async function sendSms(phone, message) {
  if (!phone) return;
  console.log(`[sms:${process.env.SMS_PROVIDER || 'log'}] ${redactPhone(phone)}: ${message}`);
}

export async function notifySubmission(application) {
  const message = `Your application ${application.applicationId} has been submitted and is pending review.`;
  await Promise.all([
    sendEmail(application.parent.email, 'Admission application submitted', message),
    sendSms(application.parent.phone, message)
  ]);
}

export async function notifyStatusChange(application) {
  const message = `Your application ${application.applicationId} status changed to ${application.status}.`;
  await Promise.all([
    sendEmail(application.parent.email, 'Admission application status updated', message),
    sendSms(application.parent.phone, message)
  ]);
}

function redactEmail(email) {
  const [name, domain] = String(email).split('@');
  if (!name || !domain) return 'REDACTED';
  return `${name.slice(0, 2)}***@${domain}`;
}

function redactPhone(phone) {
  const digits = String(phone).replace(/\D/g, '');
  return digits.length > 4 ? `xxxxxx${digits.slice(-4)}` : 'REDACTED';
}
