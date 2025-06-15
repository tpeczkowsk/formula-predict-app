import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Header from "./Components/Header";
import Navbar from "./Components/Navbar";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import BetsPage from "./Pages/BetsPage";
import LeaderboardPage from "./Pages/LeaderboardPage";
import RacesPage from "./Pages/RacesPage";
import { useEffect, useRef } from "react"; // dodajemy useRef
import { useAuthStore } from "./store/useAuthStore";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import RacesAdminPage from "./Pages/Admin/RacesAdminPage";
import UsersAdminPage from "./Pages/Admin/UsersAdminPage";
import DriversAdminPage from "./Pages/Admin/DriversAdminPage";
import ConfigAdminPage from "./Pages/Admin/ConfigAdminPage";

// Komponent chroniący ścieżki dla użytkowników
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { authUser, isCheckingAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const navigatedRef = useRef(false);

  useEffect(() => {
    // Użyj referencji, aby zapobiec wielokrotnemu przekierowaniu
    if (navigatedRef.current) return;

    if (!isCheckingAuth && !authUser) {
      navigatedRef.current = true;
      // Zapisz oryginalną ścieżkę, aby wrócić do niej po zalogowaniu
      navigate("/login", { state: { from: location.pathname } });
    } else if (!isCheckingAuth && authUser && allowedRoles && !allowedRoles.includes(authUser.role)) {
      navigatedRef.current = true;
      // Użytkownik jest zalogowany, ale nie ma odpowiedniej roli
      if (authUser.role === "admin") {
        navigate("/admin/races");
      } else {
        navigate("/bets");
      }
    }
  }, [authUser, isCheckingAuth, navigate, location, allowedRoles]);

  // Pokazuj ładowanie podczas sprawdzania autentykacji
  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  // Jeśli użytkownik jest zalogowany i ma odpowiednią rolę, pokaż chronioną zawartość
  if (authUser && (!allowedRoles || allowedRoles.includes(authUser.role))) {
    return children;
  }

  // To nie powinno się wykonać dzięki useEffect, ale jako zabezpieczenie
  return null;
};

function App() {
  const [opened, { toggle }] = useDisclosure();
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Renderowanie głównego layoutu tylko dla zalogowanych użytkowników
  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  // Dla niezalogowanych użytkowników
  if (!authUser) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // Dla zalogowanych użytkowników z odpowiednim interfejsem
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: { base: 200, md: 300 },
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
    >
      <Header opened={opened} toggle={toggle} />
      <Navbar opened={opened} toggle={toggle} />

      <AppShell.Main>
        {authUser.role === "admin" ? (
          // Routing dla administratorów
          <Routes>
            <Route path="/admin/races" element={<RacesAdminPage />} />
            <Route path="/admin/users" element={<UsersAdminPage />} />
            <Route path="/admin/drivers" element={<DriversAdminPage />} />
            <Route path="/admin/config" element={<ConfigAdminPage />} />
            <Route path="*" element={<Navigate to="/admin/races" />} />
          </Routes>
        ) : (
          // Routing dla zwykłych użytkowników
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/bets" element={<BetsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/races" element={<RacesPage />} />
            <Route path="*" element={<Navigate to="/bets" />} />
          </Routes>
        )}
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
