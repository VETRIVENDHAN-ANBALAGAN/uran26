import QRCode from "qrcode";

export function getVerificationUrl(token: string, customOrigin?: string): string {
  const cleanToken = encodeURIComponent((token || "").trim().toUpperCase());
  
  if (customOrigin && typeof customOrigin === "string" && customOrigin.startsWith("http")) {
    return `${customOrigin.replace(/\/$/, "")}/verify/${cleanToken}`;
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}/verify/${cleanToken}`;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;
  if (appUrl) {
    const prefix = appUrl.startsWith("http") ? appUrl : `https://${appUrl}`;
    return `${prefix.replace(/\/$/, "")}/verify/${cleanToken}`;
  }

  return `https://uran26.pmist.edu/verify/${cleanToken}`;
}

export async function generateQrDataUrl(
  text: string,
  options?: {
    width?: number;
    margin?: number;
    darkColor?: string;
    lightColor?: string;
  }
): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: options?.width || 400,
      margin: options?.margin ?? 2,
      errorCorrectionLevel: "H", // High error correction so logo or damage doesn't break scanning
      color: {
        dark: options?.darkColor || "#050b14",
        light: options?.lightColor || "#ffffff",
      },
    });
  } catch (err) {
    console.error("[QRCODE GENERATION ERROR]:", err);
    return "";
  }
}

export async function generateQrSvg(
  text: string,
  options?: {
    width?: number;
    margin?: number;
    darkColor?: string;
    lightColor?: string;
  }
): Promise<string> {
  try {
    return await QRCode.toString(text, {
      type: "svg",
      width: options?.width || 300,
      margin: options?.margin ?? 2,
      errorCorrectionLevel: "H",
      color: {
        dark: options?.darkColor || "#050b14",
        light: options?.lightColor || "#ffffff",
      },
    });
  } catch (err) {
    console.error("[QRCODE SVG ERROR]:", err);
    return "";
  }
}
