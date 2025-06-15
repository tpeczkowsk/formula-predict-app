import { useState, useEffect } from "react";
import { Container, Paper, Table, Title, Text, Loader, Center, Badge, Group, Avatar, Alert } from "@mantine/core";
import { IconTrophy, IconAlertCircle } from "@tabler/icons-react";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import classes from "./LeaderboardPage.module.css";

const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authUser } = useAuthStore();

  // Pobieranie danych leaderboard z API
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/users/leaderboard/global");
        // Zakładamy, że dane są już posortowane na backendzie
        setLeaderboardData(response.data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Generowanie miejsca z odpowiednim formatowaniem
  const renderPosition = (position) => {
    if (position === 1) {
      return (
        <Group nowrap="true" spacing="xs">
          <IconTrophy size={18} color="#FFD700" />
          <Text fw={700} c="gold">
            1
          </Text>
        </Group>
      );
    } else if (position === 2) {
      return (
        <Group nowrap="true" spacing="xs">
          <IconTrophy size={16} color="#C0C0C0" />
          <Text fw={700} c="gray.5">
            2
          </Text>
        </Group>
      );
    } else if (position === 3) {
      return (
        <Group nowrap="true" spacing="xs">
          <IconTrophy size={14} color="#CD7F32" />
          <Text fw={700} c="brown.5">
            3
          </Text>
        </Group>
      );
    }
    return <Text>{position}</Text>;
  };

  // Sprawdzanie, czy wiersz odpowiada zalogowanemu użytkownikowi
  const isCurrentUser = (username) => {
    return authUser && authUser.username === username;
  };

  return (
    <Container size="lg" py="md">
      <Title order={2} mb="md">
        Leaderboards
      </Title>

      {loading ? (
        <Center p="xl">
          <Loader size="md" />
        </Center>
      ) : error ? (
        <Alert icon={<IconAlertCircle size={16} />} title="Błąd" color="red" radius="md">
          {error}
        </Alert>
      ) : (
        <Paper withBorder shadow="md" p="md" radius="md">
          <Table striped highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: 80 }}>Place</Table.Th>
                <Table.Th>Player</Table.Th>
                <Table.Th style={{ width: 120 }} align="right">
                  Points
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {leaderboardData.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={3} align="center">
                    <Text c="dimmed">No data</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                leaderboardData.map((user, index) => (
                  <Table.Tr key={user.username} className={isCurrentUser(user.username) ? classes.currentUserRow : undefined}>
                    <Table.Td>{renderPosition(index + 1)}</Table.Td>
                    <Table.Td>
                      <Group nowrap="true">
                        <Avatar size="sm" color={user.role === "admin" ? "blue" : "green"} radius="xl">
                          {user.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <div>
                          <Text className={isCurrentUser(user.username) ? classes.currentUserText : undefined} fw={500}>
                            {user.username}
                          </Text>
                          {user.role === "admin" && (
                            <Badge size="xs" color="blue">
                              Admin
                            </Badge>
                          )}
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td align="left">
                      <Text fw={700} size="lg">
                        {user.pointsSum || 0}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Paper>
      )}
    </Container>
  );
};

export default LeaderboardPage;
