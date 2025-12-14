import HomeComponent from "./components/HomeComponent"
import { LeaderboardSidebar } from "./components/LeaderboardSidebar"
import { SidebarInset, SidebarTrigger } from "./components/ui/sidebar"

const App = () => {
   document.documentElement.classList.add("dark")
  return (

      <div className="flex min-h-screen w-full">
      <LeaderboardSidebar />

      <SidebarInset>
        <SidebarTrigger className="m-1" />
        <HomeComponent/>
      </SidebarInset>

    </div>
  )
}

export default App