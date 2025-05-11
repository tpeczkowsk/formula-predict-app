import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Header from "./Components/Header";
import Navbar from "./Components/Navbar";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import BetsPage from "./Pages/BetsPage";
import LeaderboardPage from "./Pages/LeaderboardPage";
import RacesPage from "./Pages/RacesPage";
import ResultsPage from "./Pages/ResultsPage";

function App() {
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: { base: 200, md: 300 },
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      // padding="md"
    >
      <Header opened={opened} toggle={toggle} />
      <Navbar opened={opened} toggle={toggle} />

      <AppShell.Main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bets" element={<BetsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/races" element={<RacesPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
