import { NextResponse } from "next/server";

// This endpoint logs user feedback (demo mode - no file storage)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rating, message } = body;

    // Simple validation
    if (!rating) {
      return NextResponse.json(
        { error: "Rating is required" },
        { status: 400 }
      );
    }

    // DEMO: Just log feedback instead of saving to file
    console.log("NEW FEEDBACK:", {
      rating,
      message: message || "",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to save feedback" },
      { status: 500 }
    );
  }
}
