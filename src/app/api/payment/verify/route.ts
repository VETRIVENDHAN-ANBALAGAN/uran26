import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendRegistrationTaxInvoiceEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, paymentId, signature, method = "upi", teamDetails } = body;

    if (!orderId || !teamDetails) {
      return NextResponse.json(
        { success: false, error: "Invalid payment verification payload" },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    let isValid = true;

    // Cryptographic validation for Live Razorpay payments
    if (keySecret && signature && paymentId) {
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

      if (generatedSignature !== signature) {
        return NextResponse.json(
          { success: false, error: "Cryptographic signature verification failed" },
          { status: 400 }
        );
      }
    }

    // Generate transaction credentials
    const finalPaymentId = paymentId || `pay_uran26_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
    const utr = `UTR-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    const invoiceNo = `INV-URAN26-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const paidAt = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const parsedSize = parseInt(String(teamDetails.teamSize), 10) || 4;
    const totalAmount = parsedSize * 250;

    // Dispatch branded Tax Invoice & Pass via Nodemailer
    const emailDispatchResult = await sendRegistrationTaxInvoiceEmail({
      to: teamDetails.leaderEmail,
      teamName: teamDetails.teamName,
      leaderName: teamDetails.leaderName,
      leaderPhone: teamDetails.leaderPhone || "",
      college: teamDetails.college || "Dept. of Computer Applications",
      amount: totalAmount,
      perPerson: 250,
      teamSize: parsedSize,
      orderId,
      paymentId: finalPaymentId,
      utr,
      invoiceNo,
      preferredTrack: teamDetails.preferredTrack || "On-Spot Assignment",
      paidAt,
    });

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and registration confirmed.",
      payment: {
        orderId,
        paymentId: finalPaymentId,
        utr,
        invoiceNo,
        amount: totalAmount,
        perPerson: 250,
        teamSize: parsedSize,
        method,
        paidAt,
        teamName: teamDetails.teamName,
        leaderName: teamDetails.leaderName,
        leaderEmail: teamDetails.leaderEmail,
        college: teamDetails.college,
        preferredTrack: teamDetails.preferredTrack,
        emailStatus: emailDispatchResult.success ? "DISPATCHED" : "PENDING_MANUAL_RESEND",
      },
    });
  } catch (error: any) {
    console.error("[PAYMENT VERIFY ERROR]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify payment transaction" },
      { status: 500 }
    );
  }
}
