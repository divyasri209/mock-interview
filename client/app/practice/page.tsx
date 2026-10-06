"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const INTERVIEW_DOMAINS = [
  {
    label: "JavaScript/Node.js",
    icon: "🟨",
    desc: "ES6+, async, Node runtime",
  },
  {
    label: "React",
    icon: "⚛️",
    desc: "Hooks, state, lifecycle",
  },
  {
    label: "Python",
    icon: "🐍",
    desc: "OOP, data structures, stdlib",
  },
  {
    label: "Data Science",
    icon: "📊",
    desc: "ML, pandas, statistics",
  },
  {
    label: "DevOps",
    icon: "⚙️",
    desc: "CI/CD, Docker, Kubernetes",
  },
  {
    label: "System Design",
    icon: "🏗️",
    desc: "Scalability, architecture",
  },
  {
    label: "Database Design",
    icon: "🗄️",
    desc: "SQL, NoSQL, indexing",
  },
  {
    label: "General",
    icon: "🎯",
    desc: "Behavioural & fundamentals",
  },
];

export default function PracticePage() {
  const router = useRouter();
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) return null;

  const startInterview = () => {
    if (!selectedDomain) return;

    router.push(
      `/interview?domain=${encodeURIComponent(selectedDomain)}`
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* Header */}
        <section className="mb-8">
          <p className="text-sm text-muted-foreground font-medium mb-1">
            🎯 Improve your interview skills
          </p>

          <h1 className="text-3xl md:text-4xl font-black text-foreground">
            Practice Interview
          </h1>

          <p className="text-sm text-muted-foreground mt-2">
            Choose a domain and start an AI-powered mock interview.
          </p>
        </section>

        {/* Domains */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INTERVIEW_DOMAINS.map((domain) => (
              <button
                key={domain.label}
                onClick={() => setSelectedDomain(domain.label)}
                className={`text-left transition-all duration-200 ${
                  selectedDomain === domain.label
                    ? "scale-[1.02]"
                    : ""
                }`}
              >
                <Card
                  className={`p-5 h-full border transition-all ${
                    selectedDomain === domain.label
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border/50 hover:border-primary/40 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-4">

                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border ${
                        selectedDomain === domain.label
                          ? "bg-primary/10 border-primary/30"
                          : "bg-muted/50 border-border/50"
                      }`}
                    >
                      {domain.icon}
                    </div>

                    <div className="flex-1">
                      <h2 className="text-sm font-bold text-foreground">
                        {domain.label}
                      </h2>

                      <p className="text-xs text-muted-foreground mt-1">
                        {domain.desc}
                      </p>
                    </div>

                    {selectedDomain === domain.label && (
                      <span className="text-primary text-lg">
                        ✓
                      </span>
                    )}
                  </div>
                </Card>
              </button>
            ))}
          </div>
        </section>

        {/* Start button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={startInterview}
            disabled={!selectedDomain}
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white rounded-full px-8 font-semibold disabled:opacity-40"
          >
            ⚡ Start Interview
          </Button>
        </div>

        {/* Info */}
        <Card className="mt-8 p-5 border border-border/50">
          <div className="flex items-start gap-3">
            <span className="text-xl">🤖</span>

            <div>
              <p className="text-sm font-semibold text-foreground">
                AI-powered practice
              </p>

              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Your interview questions are generated based on the
                selected domain. Answer the questions and receive
                feedback on your performance.
              </p>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}