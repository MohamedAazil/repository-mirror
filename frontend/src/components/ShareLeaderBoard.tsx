import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { ApiResponse } from "@/types";
import { useState } from "react";

interface ShareLeaderboardProps {
  repoUrl: string;
  onShared: () => void;
  data: ApiResponse;
}


export default function ShareLeaderboard({ repoUrl, onShared, data }: ShareLeaderboardProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const shareRepo = async () => {
    setLoading(true);
    try {
      await fetch("http://localhost:8000/api/leaderboard/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo_url: repoUrl,
          score_overall: data.score.overall,
          rank: data.score.rank,
        }),
      });
      onShared(); // callback after sharing
      setOpen(false);
    } catch (err) {
      console.error("Failed to share repo", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Share on Leaderboard</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Repository</DialogTitle>
          </DialogHeader>
          <p>Do you want to share this repository on the public leaderboard?</p>
          <DialogFooter className="flex gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={shareRepo} disabled={loading}>
              {loading ? "Sharing..." : "Share"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
