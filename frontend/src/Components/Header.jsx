import { AppShell, Burger, Button, Flex, Group, Menu, Title, UnstyledButton, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { IconChevronDown, IconLogout, IconMoon, IconSun } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import classes from "./Header.module.css";
import { useAuthStore } from "../store/useAuthStore";

const Header = ({ opened, toggle }) => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const navigate = useNavigate();
  const computedColorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true });
  const { authUser, logout } = useAuthStore();

  // Get display name from authUser (username or email if username is not available)
  const displayName = authUser?.username || authUser?.email?.split("@")[0] || "User";

  const handleLogout = async () => {
    try {
      console.log("logout called");
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <AppShell.Header className={classes.header} bg="var(--mantine-color-f1-red-filled)">
      <Flex h="100%" justify="space-between" align="center" px={{ base: "xs", sm: "3rem", md: "6rem" }}>
        <Group>
          <Burger color="white" opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <UnstyledButton
            onClick={() => {
              navigate("/");
              if (opened) toggle();
            }}
          >
            <Group align="center">
              <Title fw={900} fs={"italic"} className={classes.header_name} order={2} visibleFrom="xs">
                FORMULA PREDICT
              </Title>
              <Title fw={900} fs={"italic"} className={classes.header_name} order={2} hiddenFrom="xs">
                PREDICT
              </Title>
            </Group>
          </UnstyledButton>
        </Group>
        <Group gap={{ base: "xs", sm: "md" }}>
          <Menu position="bottom-end" offset={4} shadow="md" width={200}>
            <Menu.Target>
              <Button rightSection={<IconChevronDown />} variant="light" color="light">
                {displayName}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={colorScheme === "dark" ? <IconSun size={16} /> : <IconMoon size={16} />}
                onClick={() => setColorScheme(computedColorScheme === "light" ? "dark" : "light")}
                aria-label="Toggle color scheme"
              >
                Toggle scheme
              </Menu.Item>
              {/* <Menu.Item leftSection={<IconSettings size={16} />}>Settings</Menu.Item> */}
              <Menu.Item color="red" leftSection={<IconLogout size={16} />} onClick={handleLogout}>
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Flex>
    </AppShell.Header>
  );
};

export default Header;
