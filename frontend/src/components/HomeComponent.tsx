import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useState } from 'react'
import ShareLeaderboard from "./ShareLeaderBoard"


interface ScoreBreakdown {
  code_quality: number
  documentation: number
  tests: number
  project_structure: number
  real_world_value: number
}

interface Score {
  overall: number
  rank: string
  breakdown: ScoreBreakdown
}

interface Roadmap {
  immediate: string[]
  short_term: string[]
  long_term: string[]
}

interface ApiResponse {
  score: Score
  summary: string
  roadmap: Roadmap
}
const HomeComponent = () => {
    const savedTheme = localStorage.getItem("theme")

  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark")
  }
  const [repoUrl, setRepoUrl] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string>("")
  const VITE_BACKEND_API = import.meta.env.VITE_BACKEND_API

  const analyzeRepo = async (): Promise<void> => {
    setLoading(true)
    setError("")
    setData(null)

    try {
      const res = await fetch(`${VITE_BACKEND_API}/api/analyze-repo/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_url: repoUrl })
      })

      if (!res.ok) {
        throw new Error("Analysis failed")
      }

      const result: ApiResponse = await res.json()
      setData(result)
    } catch (err) {
      setError("Unable to analyze repository. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Repository Mirror</h1>
          <p className="text-muted-foreground">
            Evaluate your GitHub repository like a recruiter or mentor
          </p>
        </div>

        {/* INPUT CARD */}
        <Card className="w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Analyze GitHub Repository</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Input
              placeholder="https://github.com/username/repository"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />
            <Button onClick={analyzeRepo} disabled={loading || !repoUrl}>
              {loading ? "Analyzing..." : "Analyze"}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <p className="text-red-500 text-center">{error}</p>
        )}

        {data && (
          <>
            {/* SCORE SECTION */}
            <Card>
              <CardHeader>
                <CardTitle>Repository Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-bold">
                    {data.score.overall}
                  </span>
                  <Badge variant="secondary" className="text-lg">
                    {data.score.rank}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <p className="text-sm">Code Quality</p>
                    <Progress value={data.score.breakdown.code_quality} />
                  </div>
                  <div>
                    <p className="text-sm">Documentation</p>
                    <Progress value={data.score.breakdown.documentation} />
                  </div>
                  <div>
                    <p className="text-sm">Testing</p>
                    <Progress value={data.score.breakdown.tests} />
                  </div>
                  <div>
                    <p className="text-sm">Testing</p>
                    <Progress value={data.score.breakdown.tests} />
                  </div>
                  <div>
                    <p className="text-sm">Project Structure</p>
                    <Progress value={data.score.breakdown.project_structure} />
                  </div>
                  <div>
                    <p className="text-sm">Real World Value</p>
                    <Progress value={data.score.breakdown.real_world_value} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SUMMARY SECTION */}
            <Card>
              <CardHeader>
                <CardTitle>Repository Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {data.summary}
                </p>
              </CardContent>
            </Card>

            {/* ROADMAP SECTION */}
            <Card>
              <CardHeader>
                <CardTitle>Personalized Improvement Roadmap</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-6">
                {(Object.entries(data.roadmap) as [keyof Roadmap, string[]][])
                  .map(([phase, steps]) => (
                    <div key={phase} className="space-y-3">
                      <h3 className="font-semibold capitalize">
                        {phase.replace("_", " ")}
                      </h3>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground">
                        {steps.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </CardContent>
            </Card>
            <div className="mt-4 text-center">
              <ShareLeaderboard 
                repoUrl={repoUrl} 
                onShared={() => {
                  // Optionally show a toast or refresh leaderboard
                  console.log("Repository shared successfully!");
                }} 
                data={data}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default HomeComponent