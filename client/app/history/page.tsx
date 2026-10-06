"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Interview {
  id: string;
  date: string;
  score: number;
  duration: number;
  topic: string;
}

const INTERVIEW_DOMAINS = [
  {
    label: "JavaScript/Node.js",
    icon: "🟨",
  },
  {
    label: "React",
    icon: "⚛️",
  },
  {
    label: "Python",
    icon: "🐍",
  },
  {
    label: "Data Science",
    icon: "📊",
  },
  {
    label: "DevOps",
    icon: "⚙️",
  },
  {
    label: "System Design",
    icon: "🏗️",
  },
  {
    label: "Database Design",
    icon: "🗄️",
  },
  {
    label: "General",
    icon: "🎯",
  },
];

export default function HistoryPage() {
  const router = useRouter();

  const {
    isLoggedIn,
    isLoading: authLoading,
  } = useAuth();

  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, authLoading, router]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchInterviews();
    }
  }, [isLoggedIn]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);

      const { data } = await axiosInstance.get("/api/interviews");

      setInterviews(data.interviews || []);
    } catch (error) {
      console.error("Failed to fetch interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">
            Loading…
          </p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) return null;

  const filteredInterviews =
    filter === "All"
      ? interviews
      : interviews.filter(
          (interview) => interview.topic === filter
        );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* Header */}
        <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">
              📊 Track your progress
            </p>

            <h1 className="text-3xl md:text-4xl font-black text-foreground">
              My Sessions
            </h1>

            <p className="text-sm text-muted-foreground mt-2">
              Review your previous interview practice sessions.
            </p>
          </div>

          <Button
            onClick={() => router.push("/practice")}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white rounded-full px-6 font-semibold"
          >
            ⚡ New Practice
          </Button>
        </section>

        {/* Filters */}
        {interviews.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter("All")}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                filter === "All"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              All
            </button>

            {INTERVIEW_DOMAINS.map((domain) => (
              <button
                key={domain.label}
                onClick={() => setFilter(domain.label)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                  filter === domain.label
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {domain.icon} {domain.label}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <Card
                key={item}
                className="p-5 border border-border/50"
              >
                <div className="animate-pulse flex gap-4">
                  <div className="w-11 h-11 rounded-xl bg-muted" />

                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>

                  <div className="w-16 h-8 bg-muted rounded-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredInterviews.length === 0 ? (

          /* Empty */
          <Card className="p-12 text-center border-2 border-dashed border-border">
            <div className="text-5xl mb-4">
              📝
            </div>

            <h3 className="text-lg font-bold text-foreground mb-2">
              {interviews.length === 0
                ? "No sessions yet"
                : "No sessions found"}
            </h3>

            <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
              {interviews.length === 0
                ? "Start your first AI-powered mock interview to see your sessions here."
                : `No sessions found for "${filter}".`}
            </p>

            {interviews.length === 0 && (
              <Button
                onClick={() => router.push("/practice")}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white rounded-full px-6"
              >
                🎯 Start Practicing
              </Button>
            )}
          </Card>

        ) : (

          /* Sessions */
          <div className="space-y-3">
            {[...filteredInterviews]
              .reverse()
              .map((interview) => {

                const domain = INTERVIEW_DOMAINS.find(
                  (item) => item.label === interview.topic
                );

                return (
                  <Card
                    key={interview.id}
                    className="p-5 border border-border/50 hover:border-primary/40 hover:shadow-sm transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">

                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-muted/50 border border-border/60 flex items-center justify-center text-2xl flex-shrink-0">
                        {domain?.icon || "🎯"}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-sm font-bold text-foreground">
                            {interview.topic}
                          </h2>

                          <ScoreBadge
                            score={interview.score}
                          />
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                          <span>
                            📅{" "}
                            {new Date(
                              interview.date
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>

                          <span>
                            ⏱ {interview.duration} min
                          </span>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="w-full md:w-32">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-muted-foreground">
                            Score
                          </span>

                          <span className="text-xs font-bold text-foreground">
                            {interview.score}%
                          </span>
                        </div>

                        <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                            style={{
                              width: `${interview.score}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Retake */}
                      <Button
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/interview?domain=${encodeURIComponent(
                              interview.topic
                            )}`
                          )
                        }
                        className="rounded-full text-xs bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
                      >
                        Retake
                      </Button>

                    </div>
                  </Card>
                );
              })}
          </div>
        )}

      </div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400"
      : score >= 60
        ? "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400"
        : "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-bold ${color}`}
    >
      {score >= 80
        ? "🟢"
        : score >= 60
          ? "🔵"
          : "🟠"}{" "}
      {score}%
    </span>
  );
}