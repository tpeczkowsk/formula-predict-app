import { AppShell, NavLink } from "@mantine/core";
import {
  IconChartBar,
  IconChevronRight,
  IconNumber123,
  IconSmartHome,
  IconTrophy,
  IconUsers,
  IconHelmet,
  IconAdjustments,
  IconFlag,
} from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import classes from "./Navbar.module.css";

const Navbar = ({ opened, toggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser } = useAuthStore();

  // Check if user is admin
  const isAdmin = authUser?.role === "admin";

  return (
    <AppShell.Navbar className={classes.navbar}>
      {!isAdmin ? (
        // Navigation links for regular users (role "user")
        <>
          <NavLink
            className={classes.link}
            leftSection={<IconSmartHome size={22} />}
            label="Home"
            active={location.pathname === "/"}
            onClick={() => {
              navigate("/");
              if (opened) toggle();
            }}
            styles={{
              label: { fontSize: "18px" },
            }}
            variant="filled"
          />
          <NavLink
            className={classes.link}
            label="Bets"
            leftSection={<IconNumber123 size={22} />}
            rightSection={<IconChevronRight size={22} />}
            active={location.pathname === "/bets"}
            onClick={() => {
              navigate("/bets");
              if (opened) toggle();
            }}
            styles={{
              label: { fontSize: "18px" },
            }}
            variant="filled"
          />
          <NavLink
            className={classes.link}
            label="Leaderboard"
            leftSection={<IconChartBar size={22} />}
            rightSection={<IconChevronRight size={22} />}
            active={location.pathname === "/leaderboard"}
            onClick={() => {
              navigate("/leaderboard");
              if (opened) toggle();
            }}
            styles={{
              label: { fontSize: "18px" },
            }}
            variant="filled"
          />
          <NavLink
            className={classes.link}
            label="Races"
            leftSection={<IconTrophy size={22} />}
            rightSection={<IconChevronRight size={22} />}
            active={location.pathname === "/races"}
            onClick={() => {
              navigate("/races");
              if (opened) toggle();
            }}
            styles={{
              label: { fontSize: "18px" },
            }}
            variant="filled"
          />
        </>
      ) : (
        // Navigation links for administrators (role "admin")
        <>
          <NavLink
            className={classes.link}
            label="Race Management"
            leftSection={<IconFlag size={22} />}
            rightSection={<IconChevronRight size={22} />}
            active={location.pathname === "/admin/races"}
            onClick={() => {
              navigate("/admin/races");
              if (opened) toggle();
            }}
            styles={{
              label: { fontSize: "18px" },
            }}
            variant="filled"
          />
          <NavLink
            className={classes.link}
            label="User Management"
            leftSection={<IconUsers size={22} />}
            rightSection={<IconChevronRight size={22} />}
            active={location.pathname === "/admin/users"}
            onClick={() => {
              navigate("/admin/users");
              if (opened) toggle();
            }}
            styles={{
              label: { fontSize: "18px" },
            }}
            variant="filled"
          />
          <NavLink
            className={classes.link}
            label="Driver Management"
            leftSection={<IconHelmet size={22} />}
            rightSection={<IconChevronRight size={22} />}
            active={location.pathname === "/admin/drivers"}
            onClick={() => {
              navigate("/admin/drivers");
              if (opened) toggle();
            }}
            styles={{
              label: { fontSize: "18px" },
            }}
            variant="filled"
          />
          <NavLink
            className={classes.link}
            label="Config Management"
            leftSection={<IconAdjustments size={22} />}
            rightSection={<IconChevronRight size={22} />}
            active={location.pathname === "/admin/config"}
            onClick={() => {
              navigate("/admin/config");
              if (opened) toggle();
            }}
            styles={{
              label: { fontSize: "18px" },
            }}
            variant="filled"
          />
        </>
      )}
    </AppShell.Navbar>
  );
};

export default Navbar;
