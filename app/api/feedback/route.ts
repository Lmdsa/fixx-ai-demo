import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// This endpoint saves user feedback to a local JSON file
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

    const feedbackDir = path.join(process.cwd(), "data");
    const feedbackFile = path.join(feedbackDir, "feedback.json");

    // Create data folder if it doesn't exist
    if (!fs.existsSync(feedbackDir)) {
      fs.mkdirSync(feedbackDir);
    }

    let feedbacks: any[] = [];

    // Read existing feedbacks
    if (fs.existsSync(feedbackFile)) {
      const fileData = fs.readFileSync(feedbackFile, "utf-8");
      feedbacks = JSON.parse(fileData || "[]");
    }

    // Add new feedback
    feedbacks.push({
      rating,
      message: message || "",
      createdAt: new Date().toISOString(),
    });

    // Save back to file
    fs.writeFileSync(feedbackFile, JSON.stringify(feedbacks, null, 2));

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to save feedback" },
      { status: 500 }
    );
  }
}
