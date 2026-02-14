import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rating, message } = body;

    if (!rating) {
      return NextResponse.json(
        { error: "Rating is required" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "umut23052000@gmail.com",
      subject: "New FIXx.ai Feedback",
      html: `
        <h2>New Feedback Received</h2>
        <p><strong>Rating:</strong> ${rating}</p>
        <p><strong>Message:</strong> ${message || "No message"}</p>
        <p><strong>Date:</strong> ${new Date().toISOString()}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("EMAIL ERROR:", err);

    return NextResponse.json(
      { error: "Failed to send feedback email" },
      { status: 500 }
    );
  }
}
