console.log("DUZELT ROUTE HIT");

export const runtime = "nodejs";

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const usageFilePath = path.join(process.cwd(), "data", "usage.json");

function getClientIP(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown-ip";
}

function readUsage() {
  if (!fs.existsSync(usageFilePath)) {
    fs.writeFileSync(usageFilePath, JSON.stringify({}));
  }
  const raw = fs.readFileSync(usageFilePath, "utf-8");
  return JSON.parse(raw || "{}");
}

function writeUsage(data: any) {
  fs.writeFileSync(usageFilePath, JSON.stringify(data, null, 2));
}


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const ip = getClientIP(req);
const usageData = readUsage();

if (!usageData[ip]) {
  usageData[ip] = { remaining: 3 };
}

if (usageData[ip].remaining <= 0) {
  return Response.json(
    { error: "Usage limit reached. Please leave feedback or donate." },
    { status: 403 }
  );
}

// decrease usage
usageData[ip].remaining -= 1;
writeUsage(usageData);

  try {
    const body = await req.json();
    const text = body.text;

    if (!text) {
      return new Response(
        JSON.stringify({ error: "No text provided" }),
        { status: 400 }
      );
    }

    const response: any = await openai.responses.create({

      model: "gpt-4.1-mini",
      input: `Fix punctuation, capitalization and grammar:\n\n${text}`,
    });

    const fixedText =
  response.output?.[0]?.content?.[0]?.text;


    return new Response(
      JSON.stringify({ result: fixedText }),
      { status: 200 }
    );

} catch (err: any) {
  console.error("REAL ERROR:", err);

  return new Response(
    JSON.stringify({
      error: err?.message || "Unknown error",
    }),
    { status: 500 }
  );
}

}
