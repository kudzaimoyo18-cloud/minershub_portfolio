import { NextRequest, NextResponse } from "next/server";
import { summarizeText } from "@/lib/huggingface";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobDescription } = body;

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Missing job description" },
        { status: 400 }
      );
    }

    const result = await summarizeText(jobDescription, 200);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Job summarization error:", error);
    return NextResponse.json(
      { error: "Failed to summarize job" },
      { status: 500 }
    );
  }
}
