"use client";

import { useState } from "react";
import { Sparkles, FileText, MessageSquare, Target, Send, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function AIToolsPage() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  // Tool-specific state
  const [coverLetterInput, setCoverLetterInput] = useState({
    jobTitle: "",
    companyName: "",
    jobDescription: "",
    candidateInfo: "",
  });

  const [followUpInput, setFollowUpInput] = useState({
    jobTitle: "",
    companyName: "",
    daysAgo: "7",
  });

  const [jobSummaryInput, setJobSummaryInput] = useState({
    jobDescription: "",
  });

  const tools = [
    {
      id: "cover-letter",
      name: "Cover Letter Generator",
      description: "Create personalized cover letters for job applications",
      icon: FileText,
      color: "text-blue-600 bg-blue-50",
    },
    {
      id: "follow-up",
      name: "Follow-Up Message",
      description: "Generate polite follow-up messages after applications",
      icon: MessageSquare,
      color: "text-green-600 bg-green-50",
    },
    {
      id: "job-summary",
      name: "Job Summary",
      description: "Get quick summaries of long job descriptions",
      icon: Target,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  const handleGenerateCoverLetter = async () => {
    if (!coverLetterInput.jobDescription || !coverLetterInput.candidateInfo) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/ai/hf-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coverLetterInput),
      });

      if (!response.ok) throw new Error("Failed to generate cover letter");

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error(error);
      setResult("Error generating cover letter. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateFollowUp = async () => {
    if (!followUpInput.jobTitle || !followUpInput.companyName) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/ai/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(followUpInput),
      });

      if (!response.ok) throw new Error("Failed to generate follow-up");

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error(error);
      setResult("Error generating follow-up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarizeJob = async () => {
    if (!jobSummaryInput.jobDescription) {
      alert("Please enter a job description");
      return;
    }

    setIsLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/ai/job-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobSummaryInput),
      });

      if (!response.ok) throw new Error("Failed to summarize job");

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error(error);
      setResult("Error summarizing job. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900">AI Tools</h1>
        </div>
        <p className="text-gray-500">
          Powered by Hugging Face - Free AI tools to help you with your job search
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tool Selection */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h2 className="font-semibold text-gray-900 mb-4">Select a Tool</h2>
            <div className="space-y-2">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    setActiveTool(tool.id);
                    setResult("");
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all hover:shadow-md ${
                    activeTool === tool.id
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${tool.color}`}
                    >
                      <tool.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900 mb-1">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-gray-500">{tool.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Info Card */}
          <Card className="p-4 mt-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm text-gray-900">About Hugging Face</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              We use Hugging Face's open-source AI models to power these tools. Your data
              is processed securely and not stored. All AI features are completely free.
            </p>
          </Card>
        </div>

        {/* Tool Input & Output */}
        <div className="lg:col-span-2">
          {!activeTool ? (
            <Card className="p-12 text-center">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Select a tool to get started
              </h2>
              <p className="text-sm text-gray-500">
                Choose an AI tool from the left panel to begin
              </p>
            </Card>
          ) : (
            <Card className="p-6">
              {/* Tool Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {(() => {
                    const tool = tools.find((t) => t.id === activeTool);
                    return tool ? (
                      <>
                        <div className={`h-10 w-10 rounded-xl ${tool.color} flex items-center justify-center`}>
                          <tool.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="font-semibold text-gray-900">{tool.name}</h2>
                          <p className="text-xs text-gray-500">{tool.description}</p>
                        </div>
                      </>
                    ) : null;
                  })()}
                </div>
                <Badge variant="outline">Free</Badge>
              </div>

              <Separator className="mb-6" />

              {/* Cover Letter Tool */}
              {activeTool === "cover-letter" && (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Job Title *
                      </label>
                      <Input
                        placeholder="e.g., Senior Software Engineer"
                        value={coverLetterInput.jobTitle}
                        onChange={(e) =>
                          setCoverLetterInput({ ...coverLetterInput, jobTitle: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Company Name *
                      </label>
                      <Input
                        placeholder="e.g., Google, Amazon, etc."
                        value={coverLetterInput.companyName}
                        onChange={(e) =>
                          setCoverLetterInput({ ...coverLetterInput, companyName: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Job Description *
                      </label>
                      <Textarea
                        placeholder="Paste the job description here..."
                        rows={6}
                        value={coverLetterInput.jobDescription}
                        onChange={(e) =>
                          setCoverLetterInput({ ...coverLetterInput, jobDescription: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Your Information *
                      </label>
                      <Textarea
                        placeholder="Your experience, skills, achievements, etc."
                        rows={4}
                        value={coverLetterInput.candidateInfo}
                        onChange={(e) =>
                          setCoverLetterInput({ ...coverLetterInput, candidateInfo: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerateCoverLetter}
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Cover Letter
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Follow-Up Tool */}
              {activeTool === "follow-up" && (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Job Title *
                      </label>
                      <Input
                        placeholder="e.g., Marketing Manager"
                        value={followUpInput.jobTitle}
                        onChange={(e) =>
                          setFollowUpInput({ ...followUpInput, jobTitle: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Company Name *
                      </label>
                      <Input
                        placeholder="e.g., Microsoft, Meta, etc."
                        value={followUpInput.companyName}
                        onChange={(e) =>
                          setFollowUpInput({ ...followUpInput, companyName: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Days Since Application
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={followUpInput.daysAgo}
                        onChange={(e) =>
                          setFollowUpInput({ ...followUpInput, daysAgo: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerateFollowUp}
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Generate Follow-Up
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Job Summary Tool */}
              {activeTool === "job-summary" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Job Description *
                    </label>
                    <Textarea
                      placeholder="Paste the full job description here..."
                      rows={8}
                      value={jobSummaryInput.jobDescription}
                      onChange={(e) =>
                        setJobSummaryInput({ ...jobSummaryInput, jobDescription: e.target.value })
                      }
                    />
                  </div>

                  <Button
                    onClick={handleSummarizeJob}
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Summarizing...
                      </>
                    ) : (
                      <>
                        <Target className="mr-2 h-4 w-4" />
                        Summarize Job
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Result Output */}
              {result && (
                <div className="mt-6">
                  <Separator className="mb-4" />
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Result</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="gap-1.5"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <Card className="p-4 bg-gray-50">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                      {result}
                    </pre>
                  </Card>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
