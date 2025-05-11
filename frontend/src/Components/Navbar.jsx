import { AppShell, NavLink } from "@mantine/core";
import { IconChartBar, IconChevronRight, IconList, IconNumber123, IconSmartHome, IconTrophy } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import classes from "./Navbar.module.css";

const Navbar = ({ opened, toggle }) => {
  const navigate = useNavigate();
  return (
    <AppShell.Navbar className={classes.navbar}>
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
      <NavLink
        className={classes.link}
        label="Results"
        leftSection={<IconList size={22} />}
        rightSection={<IconChevronRight size={22} />}
        active={location.pathname === "/results"}
        onClick={() => {
          navigate("/results");
          if (opened) toggle();
        }}
        styles={{
          label: { fontSize: "18px" },
        }}
        variant="filled"
      />
    </AppShell.Navbar>
  );
};

export default Navbar;
