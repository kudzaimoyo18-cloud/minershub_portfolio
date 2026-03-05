import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/huggingface";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobTitle, companyName, daysAgo } = body;

    if (!jobTitle || !companyName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const days = daysAgo || "7";
    const context = `
I applied for the ${jobTitle} position at ${companyName} ${days} days ago and haven't heard back yet.
I want to send a polite follow-up message to check on my application status.
`;

    const result = await generateAIResponse(
      "follow_up",
      context,
      { maxTokens: 150 }
    );

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Follow-up generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate follow-up message" },
      { status: 500 }
    );
  }
}
