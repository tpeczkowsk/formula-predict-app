import { Container, Divider, Title, Text, Paper, Group, Badge } from "@mantine/core";
import { useAuthStore } from "../store/useAuthStore";
import { IconTrophy } from "@tabler/icons-react";

const HomePage = () => {
  const { authUser } = useAuthStore();

  return (
    <Container maw={{ base: "100%", sm: 600, md: 800 }} p={{ base: "xs", sm: "md" }}>
      <Paper p="md" withBorder shadow="sm" radius="md">
        <Group position="apart">
          <Title order={3}>Welcome, {authUser?.username || "User"}</Title>
          <Badge size="lg" color={authUser?.role === "admin" ? "blue" : "green"} variant="filled">
            {authUser?.role === "admin" ? "Admin" : "Player"}
          </Badge>
        </Group>
        <Divider my="md" />

        <Paper p="md" withBorder radius="md">
          <Group>
            <IconTrophy size={24} stroke={1.5} color="#FFD700" />
            <div>
              <Text size="sm">Your points</Text>
              <Text size="xl" fw={700}>
                {authUser?.pointsSum || 0}
              </Text>
            </div>
          </Group>
        </Paper>
      </Paper>
    </Container>
  );
};

export default HomePage;
