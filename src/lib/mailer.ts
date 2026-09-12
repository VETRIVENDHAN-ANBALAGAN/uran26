import nodemailer from "nodemailer";

export interface InvoiceEmailPayload {
  to: string;
  teamName: string;
  leaderName: string;
  leaderPhone: string;
  college: string;
  amount: number;
  perPerson: number;
  teamSize: number;
  orderId: string;
  paymentId: string;
  utr: string;
  invoiceNo: string;
  preferredTrack: string;
  paidAt: string;
}

import { generateQrDataUrl, getVerificationUrl } from "./qrcode";

function isSmtpConfigured(): boolean {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  return Boolean(
    host &&
      user &&
      pass &&
      !pass.includes("your_gmail") &&
      !pass.includes("<") &&
      pass.trim().length > 5
  );
}

// Production-ready resilient email service
export async function sendRegistrationTaxInvoiceEmail(payload: InvoiceEmailPayload): Promise<{ success: boolean; simulated?: boolean; messageId?: string; error?: string }> {
  try {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || `"URAN 26 Hackathon" <registrations@uran26.edu>`;

    // If SMTP is not yet configured, log the formatted receipt and return simulated success
    if (!isSmtpConfigured()) {
      console.log(`\n======================================================`);
      console.log(`[MAILER SIMULATION] SMTP credentials not set or placeholder in .env.local`);
      console.log(`[RECEIPT DISPATCH] Sending Tax Invoice to: ${payload.to}`);
      console.log(`[ORDER] ${payload.orderId} | [PAYMENT] ${payload.paymentId} | [UTR] ${payload.utr}`);
      console.log(`[INVOICE] ${payload.invoiceNo} | Amount: ₹${payload.amount} (${payload.teamSize} builders @ ₹${payload.perPerson}/person)`);
      console.log(`======================================================\n`);
      return { success: true, simulated: true };
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>URAN 26 - Registration Confirmation & Tax Invoice</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #040813; color: #ffffff; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #0b1222; border-radius: 20px; border: 1px solid #1e293b; overflow: hidden; }
    .header { padding: 32px 24px; text-align: center; background: linear-gradient(180deg, #0f172a 0%, #0b1222 100%); border-bottom: 1px solid #1e293b; }
    .title { font-size: 24px; font-weight: 900; letter-spacing: -0.5px; margin: 8px 0 2px 0; color: #ffffff; }
    .subtitle { font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
    .status-badge { display: inline-block; background-color: #064e3b; color: #34d399; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 9999px; margin-top: 12px; border: 1px solid #059669; }
    .content { padding: 24px; }
    .invoice-card { background-color: #060c18; border: 1px solid #1e293b; border-radius: 14px; padding: 20px; margin-bottom: 24px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1e293b; font-size: 13px; }
    .row:last-child { border-bottom: none; }
    .label { color: #94a3b8; }
    .value { color: #ffffff; font-weight: 600; text-align: right; }
    .total-row { padding-top: 14px; font-size: 16px; font-weight: 800; color: #38bdf8; }
    .token-box { background-color: #0f172a; border: 1px dashed #38bdf8; border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 24px; }
    .token-code { font-family: monospace; font-size: 18px; font-weight: 900; color: #ffffff; letter-spacing: 2px; }
    .footer { padding: 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="subtitle">Official Delegate Pass & Tax Invoice</div>
      <div class="title">URAN 26 International Hackathon</div>
      <div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">Department of Computer Applications • Sept 26, 2026</div>
      <div class="status-badge">✓ PAYMENT VERIFIED & COHORT SPOT CONFIRMED</div>
    </div>
    
    <div class="content">
      <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
        Dear <strong>${payload.leaderName}</strong>,<br>
        Your registration fee for team <strong>${payload.teamName}</strong> has been received and verified. Your workstation is reserved for the 12-Hour Single-Day Hackathon on September 26, 2026.
      </p>

      <div class="token-box">
        <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Cohort Check-in Token</div>
        <div class="token-code">URAN26-TEAM-20SLOT</div>
        <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Present this code during delegate kit issuance at 07:30 AM on Sept 26, 2026</div>
      </div>

      <div class="invoice-card">
        <div style="font-size: 11px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; margin-bottom: 12px;">Tax Invoice Summary (#${payload.invoiceNo})</div>
        <div class="row">
          <span class="label">Transaction Ref (UTR):</span>
          <span class="value" style="font-family: monospace;">${payload.utr}</span>
        </div>
        <div class="row">
          <span class="label">Payment ID:</span>
          <span class="value" style="font-family: monospace;">${payload.paymentId}</span>
        </div>
        <div class="row">
          <span class="label">Institution / Dept:</span>
          <span class="value">${payload.college}</span>
        </div>
        <div class="row">
          <span class="label">Squad Builders:</span>
          <span class="value">${payload.teamSize} Members (@ ₹${payload.perPerson}/person)</span>
        </div>
        <div class="row">
          <span class="label">Track Option:</span>
          <span class="value">${payload.preferredTrack}</span>
        </div>
        <div class="row">
          <span class="label">Date & Time:</span>
          <span class="value">${payload.paidAt}</span>
        </div>
        <div class="row total-row">
          <span>Total Amount Paid:</span>
          <span>₹${payload.amount} INR</span>
        </div>
      </div>

      <p style="font-size: 12px; color: #94a3b8; line-height: 1.5;">
        <strong>Reporting Instructions:</strong> Please arrive by 07:30 AM on Sept 26, 2026 at Campus Computing Labs, Chennai. All team members must carry valid college identity cards.
      </p>
    </div>

    <div class="footer">
      © 2026 Department of Computer Applications. This is a computer-generated tax invoice and registration confirmation.
    </div>
  </div>
</body>
</html>
`;

    const info = await transporter.sendMail({
      from,
      to: payload.to,
      subject: `Confirmed: URAN 26 Registration & Tax Invoice #${payload.invoiceNo}`,
      html: htmlContent,
    });

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("[MAILER ERROR] Failed to send email:", error);
    // Return gracefully so payment verification is never blocked by an email transport hiccup
    return { success: false, error: error.message || "Email dispatch failed" };
  }
}

export interface PreRegistrationEmailPayload {
  to: string;
  teamName: string;
  leaderName: string;
  leaderPhone: string;
  college: string;
  teamSize: number;
  perPerson: number;
  totalPayableOnSpot: number;
  registrationToken: string;
  preferredTrack: string;
  accommodationRequested: boolean;
  registeredAt: string;
}

export async function sendPreRegistrationConfirmationEmail(payload: PreRegistrationEmailPayload): Promise<{ success: boolean; simulated?: boolean; messageId?: string; error?: string }> {
  try {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || `"URAN’26 Hackathon" <join.uran26@gmail.com>`;

    const verifyUrl = getVerificationUrl(payload.registrationToken);
    const qrDataUrl = await generateQrDataUrl(verifyUrl, { width: 320 });

    if (!isSmtpConfigured()) {
      console.log(`\n======================================================`);
      console.log(`[MAILER SIMULATION] Pre-Registration Pass Generated`);
      console.log(`[PASS DISPATCH] Sent to: ${payload.to}`);
      console.log(`[TEAM] ${payload.teamName} (Lead: ${payload.leaderName}) | Token: ${payload.registrationToken}`);
      console.log(`[VERIFY URL] ${verifyUrl}`);
      console.log(`[PAYMENT DUE ON-SPOT] ₹${payload.totalPayableOnSpot} (${payload.teamSize} builders @ ₹${payload.perPerson}/person)`);
      console.log(`[ACCOMMODATION] ${payload.accommodationRequested ? "Requested (Subject to availability & additional payment on-spot)" : "Not Requested"}`);
      console.log(`======================================================\n`);
      return { success: true, simulated: true };
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>URAN’26 - Pre-Registration Confirmation & Check-In Pass</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #040813; color: #ffffff; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #0b1222; border-radius: 20px; border: 1px solid #1e293b; overflow: hidden; }
    .header { padding: 32px 24px; text-align: center; background: linear-gradient(180deg, #0f172a 0%, #0b1222 100%); border-bottom: 1px solid #1e293b; }
    .title { font-size: 26px; font-weight: 900; margin: 8px 0 2px 0; color: #ffffff; }
    .subtitle { font-size: 12px; color: #38bdf8; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; }
    .badge { display: inline-block; background-color: #78350f; color: #fde68a; font-size: 12px; font-weight: 800; padding: 6px 16px; border-radius: 9999px; margin-top: 14px; border: 1px solid #d97706; }
    .content { padding: 24px; }
    .callout-box { background-color: #111e38; border: 2px dashed #f59e0b; border-radius: 14px; padding: 18px; margin-bottom: 24px; text-align: center; }
    .token-box { background-color: #030712; border: 1px solid #334155; border-radius: 12px; padding: 16px; margin-bottom: 24px; font-family: monospace; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1e293b; font-size: 13px; }
    .detail-label { color: #94a3b8; }
    .detail-val { color: #f8fafc; font-weight: 600; }
    .footer { padding: 20px 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; background-color: #070d1a; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div style="font-size: 14px; color: #94a3b8; margin-bottom: 4px;">Periyar Maniammai Institute of Science and Technology (PMIST)</div>
      <div class="title">URAN’26</div>
      <div class="subtitle">12-Hour National-Level Inter-Collegiate Hackathon (Single Day)</div>
      <div class="badge">PRE-REGISTRATION CONFIRMED • ON-SPOT PAYMENT</div>
    </div>

    <div class="content">
      <div class="callout-box">
        <div style="font-size: 13px; font-weight: 800; color: #fbbf24; text-transform: uppercase;">
          ⚠️ Payment is Strictly On-Spot at Venue
        </div>
        <div style="font-size: 20px; font-weight: 900; color: #ffffff; margin-top: 6px;">
          Amount Due On-Spot: ₹${payload.totalPayableOnSpot} INR
        </div>
        <div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">
          (₹250 per participant × ${payload.teamSize} builders)
        </div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 8px;">
          “Register Before You Arrive. Pay When You Arrive. Build When It Begins.”
        </div>
      </div>

      <div class="token-box" style="border: 2px solid #38bdf8; background: #030712; padding: 20px; border-radius: 14px; text-align: center; margin-bottom: 24px;">
        <div style="font-size: 13px; font-weight: 900; color: #38bdf8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">
          🚨 SAVE YOUR TEAM CODE
        </div>
        <div style="font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: 2px; margin: 6px 0;">${payload.registrationToken}</div>
        <div style="font-size: 11px; color: #94a3b8; line-height: 1.4;">
          Your Team Code is required for on-site verification. <strong>All team members must be present with their valid Student IDs.</strong>
        </div>

        ${qrDataUrl ? `
        <div style="margin-top: 16px; padding: 12px; background: #ffffff; border-radius: 12px; display: inline-block;">
          <img src="${qrDataUrl}" width="160" height="160" alt="Verification QR Code" style="display: block; margin: 0 auto;" />
          <div style="font-size: 10px; color: #020617; font-family: monospace; font-weight: bold; margin-top: 6px;">SCAN TO VERIFY CREDENTIALS</div>
        </div>
        ` : ""}

        <div style="margin-top: 14px;">
          <a href="${verifyUrl}" style="display: inline-block; background-color: #0284c7; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: bold; padding: 8px 18px; border-radius: 8px;">
            Open & Print Official Delegate Badge ↗
          </a>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <div class="detail-row">
          <span class="detail-label">Team Name:</span>
          <span class="detail-val">${payload.teamName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Team Lead:</span>
          <span class="detail-val">${payload.leaderName} (${payload.leaderPhone})</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Institution:</span>
          <span class="detail-val">${payload.college}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Squad Size:</span>
          <span class="detail-val">${payload.teamSize} Builders</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Preferred Track:</span>
          <span class="detail-val">${payload.preferredTrack}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Accommodation Request:</span>
          <span class="detail-val">${payload.accommodationRequested ? "Yes (25th September night • Subject to availability & additional payment on-spot)" : "No"}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Dates & Duration:</span>
          <span class="detail-val">Saturday, 26 September 2026 (7:00 AM – 7:00 PM | 12 Hours)</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Venue:</span>
          <span class="detail-val">PMIST Campus, Vallam, Thanjavur, Tamil Nadu</span>
        </div>
      </div>

      <div style="background-color: #060d1b; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; font-size: 12px; color: #94a3b8; line-height: 1.6;">
        <strong style="color: #ffffff; font-size: 13px;">Official On-Site Verification & Entry Flow:</strong><br/>
        <div style="font-family: monospace; color: #38bdf8; font-size: 11px; margin: 6px 0; background: #0b1222; padding: 8px 10px; border-radius: 6px; border: 1px solid #1e293b;">
          Register → Get Team Code → Arrive → Show Code + IDs → Verify → Pay ₹250/person → Enter Hackathon
        </div>
        <strong>Strict Rules:</strong><br/>
        1. <strong>ID Card Name Match:</strong> Every team member's name must match exactly as printed on their physical College/University Student ID Card.<br/>
        2. <strong>Physical Presence:</strong> All team members must report together at 07:00 AM with valid Student ID cards.<br/>
        3. <strong>Verification First:</strong> Pay ₹${payload.totalPayableOnSpot} on-spot only after ID verification is cleared.<br/>
        4. Food is provided for all participants. Hackathon coding ends at 5:00 PM sharp, followed by jury evaluation and awards.
      </div>
    </div>

    <div class="footer">
      Organized by Department of Computer Applications, PMIST, Vallam, Thanjavur – 613403.<br/>
      Queries? Phone: 9025116795 | Email: join.uran26@gmail.com
    </div>
  </div>
</body>
</html>
`;

    const info = await transporter.sendMail({
      from,
      to: payload.to,
      subject: `URAN’26 Pre-Registration Pass - ${payload.teamName} [${payload.registrationToken}]`,
      html: htmlContent,
    });

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("[MAILER ERROR] Failed to send pre-registration pass:", error);
    return { success: false, error: error.message || "Email dispatch failed" };
  }
}
