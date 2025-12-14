import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

type LeaderboardRepo = {
  repo_name: string;
  repo_owner: string;
  repo_url: string;
  score: number;
  rank: string;
};

export function LeaderboardSidebar() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const VITE_BACKEND_API = import.meta.env.VITE_BACKEND_API

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
    const res = await fetch(`${VITE_BACKEND_API}/api/leaderboard/`);
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      const data: LeaderboardRepo[] = await res.json();
      setLeaderboard(Array.isArray(data) ? data : []);
      console.log("Leaderboard fetched:", data);
    } catch (err) {
      console.error(err);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
<Sidebar className="">
  <SidebarHeader>
    <h2 className="text-lg font-semibold">🏆 Leaderboard</h2>
  </SidebarHeader>

  <SidebarContent>
    <ScrollArea className="h-full">
      <SidebarGroup>
        <SidebarGroupLabel>Top Repositories</SidebarGroupLabel>

        <SidebarMenu>
          {loading ? (
            <p className="text-sm text-muted-foreground p-2">Loading...</p>
          ) : leaderboard.length > 0 ? (
            leaderboard.map((repo, index) => (
            <SidebarMenuItem key={repo.repo_name + repo.repo_owner} className="w-full" onClick={() => window.open(repo.repo_url, "_blank")}>
              <SidebarMenuButton className="flex flex-row justify-between items-center gap-2 p-2 w-full text-left py-6">

                {/* Left: position badge */}
                <Badge variant={index === 0 ? "default" : "secondary"} className="shrink-0">
                  #{index + 1}
                </Badge>

                {/* Middle: repo info */}
                <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                  <span className="font-medium line-clamp-1">{repo.repo_name}</span>
                  <span className="text-xs text-muted-foreground truncate">{repo.repo_owner}</span>
                </div>

                {/* Right: score & rank */}
                <div className="flex flex-row items-center gap-1 shrink-0">
                  <Badge variant="secondary">{repo.score}</Badge>
                  {/* <Badge>{repo.rank}</Badge> */}
                </div>

              </SidebarMenuButton>
            </SidebarMenuItem>
            ))
          ) : (
            <p className="text-sm text-muted-foreground p-2">
              No entries yet
            </p>
          )}
        </SidebarMenu>
      </SidebarGroup>
    </ScrollArea>
  </SidebarContent>
</Sidebar>

  );
}
