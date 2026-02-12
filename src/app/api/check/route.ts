import { NextResponse } from "next/server";
import nodemailer from "nodemailer"; // <-- TEGO BRAKOWAŁO

export async function POST(req: Request) {
  try {
    const { subject, message } = await req.json();

    // KONFIGURACJA SMTP
    const transporter = nodemailer.createTransport({
      host: "mail.glazlukasz.pl",
      port: 465,
      secure: true,
      auth: {
        user: "kontakt@glazlukasz.pl",
        pass: "mjU&*IK<2#223@!",
      },
    });

    const mailOptions = {
      from: "kontakt@glazlukasz.pl",
      to: "kontakt@glazlukasz.pl",
      subject: subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // <-- DODANO : any DLA TYPESCRYPTA
    console.error("Błąd wysyłki maila:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Błąd wysyłki" },
      { status: 500 },
    );
  }
}
