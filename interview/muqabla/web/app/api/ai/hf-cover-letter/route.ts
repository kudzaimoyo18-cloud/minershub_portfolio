import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/huggingface";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobTitle, companyName, jobDescription, candidateInfo } = body;

    if (!jobTitle || !companyName || !jobDescription || !candidateInfo) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const context = `
Job Title: ${jobTitle}
Company: ${companyName}

Job Description:
${jobDescription}
`;

    const candidateContext = `
Candidate Information:
${candidateInfo}
`;

    const result = await generateAIResponse(
      "cover_letter",
      context,
      { candidateInfo: candidateContext, maxTokens: 400 }
    );

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Cover letter generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}
