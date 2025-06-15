import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Paper,
  Table,
  Group,
  Badge,
  ActionIcon,
  Text,
  Center,
  Loader,
  Alert,
  Modal,
  Button,
  Select,
  Divider,
  Stack,
  Switch,
  Grid,
  Box,
  Flex,
} from "@mantine/core";
import { IconEdit, IconTrash, IconAlertCircle, IconEye, IconPlus, IconTrophy } from "@tabler/icons-react";
import { axiosInstance } from "../lib/axios";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";

const BetsPage = () => {
  const [bets, setBets] = useState([]);
  const [races, setRaces] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [betToDelete, setBetToDelete] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [currentBet, setCurrentBet] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  // Formularze dla edycji i tworzenia zakładu
  const editForm = useForm({
    initialValues: {
      driverBets: {
        p1: "",
        p2: "",
        p3: "",
        p4: "",
        p5: "",
        p6: "",
        p7: "",
        p8: "",
        p9: "",
        p10: "",
      },
      bonusBets: {
        polePosition: "",
        fastestLap: "",
        driverOfTheDay: "",
        noDNFs: false,
      },
    },
    validate: {
      "driverBets.p1": (value) => (!value ? "P1 prediction is required" : null),
      "driverBets.p2": (value) => (!value ? "P2 prediction is required" : null),
      "driverBets.p3": (value) => (!value ? "P3 prediction is required" : null),
    },
  });

  const createForm = useForm({
    initialValues: {
      race: "",
      driverBets: {
        p1: "",
        p2: "",
        p3: "",
        p4: "",
        p5: "",
        p6: "",
        p7: "",
        p8: "",
        p9: "",
        p10: "",
      },
      bonusBets: {
        polePosition: "",
        fastestLap: "",
        driverOfTheDay: "",
        noDNFs: false,
      },
    },
    validate: {
      race: (value) => (!value ? "Race is required" : null),
      "driverBets.p1": (value) => (!value ? "P1 prediction is required" : null),
      "driverBets.p2": (value) => (!value ? "P2 prediction is required" : null),
      "driverBets.p3": (value) => (!value ? "P3 prediction is required" : null),
    },
  });

  // Pobieranie danych przy ładowaniu strony
  useEffect(() => {
    fetchBets();
    fetchAvailableRaces();
    fetchDrivers();
  }, []);

  const fetchBets = async () => {
    try {
      setLoading(true);
      // Endpoint zwraca listę zakładów użytkownika
      const response = await axiosInstance.get("/bets");
      setBets(response.data);
    } catch (err) {
      console.error("Error fetching bets:", err);
      setError("Failed to load bets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableRaces = async () => {
    try {
      // Endpoint zwraca nadchodzące wyścigi, na które można jeszcze postawić
      const response = await axiosInstance.get("/races/upcoming/list");
      // Upewnij się, że zawsze ustawiamy tablicę, nawet jeśli API zwróci null/undefined
      setRaces(response.data || []);
    } catch (err) {
      console.error("Error fetching available races:", err);
      // Ustaw pustą tablicę w przypadku błędu
      setRaces([]);
      notifications.show({
        title: "Error",
        message: "Failed to load available races",
        color: "red",
      });
    }
  };

  const fetchDrivers = async () => {
    setLoadingDrivers(true);
    try {
      const response = await axiosInstance.get("/drivers");
      console.log("Drivers data from API:", response.data);

      // Teraz używamy fullName zarówno dla value jak i label
      const formattedDrivers = response.data.map((driver) => {
        if (typeof driver === "object" && driver !== null) {
          const fullName = driver.fullname || driver.name || `Driver ID: ${driver._id}`;
          return {
            value: fullName, // Używamy fullName jako wartości
            label: fullName, // I również jako etykiety
          };
        }
        return { value: String(driver), label: String(driver) };
      });

      console.log("Formatted drivers for Select:", formattedDrivers);
      setDrivers(formattedDrivers);
    } catch (err) {
      console.error("Error fetching drivers:", err);
      notifications.show({
        title: "Error",
        message: "Failed to load drivers. Please refresh and try again.",
        color: "red",
      });
    } finally {
      setLoadingDrivers(false);
    }
  };

  const handleDeleteBet = async () => {
    if (!betToDelete) return;

    try {
      setLoadingAction(true);
      // Endpoint usuwa zakład o podanym ID
      await axiosInstance.delete(`/bets/${betToDelete._id}`);
      setBets(bets.filter((bet) => bet._id !== betToDelete._id));
      notifications.show({
        title: "Success",
        message: "Bet has been deleted successfully",
        color: "green",
      });
    } catch (err) {
      console.error("Error deleting bet:", err);
      notifications.show({
        title: "Error",
        message: err.response?.data?.message || "Failed to delete bet",
        color: "red",
      });
    } finally {
      setLoadingAction(false);
      setDeleteModalOpen(false);
      setBetToDelete(null);
    }
  };

  const handleEditBet = async (values) => {
    if (!currentBet) return;

    try {
      setLoadingAction(true);
      // Endpoint aktualizuje istniejący zakład
      const response = await axiosInstance.put(`/bets/${currentBet._id}`, values);
      setBets(bets.map((bet) => (bet._id === currentBet._id ? response.data : bet)));
      notifications.show({
        title: "Success",
        message: "Bet has been updated successfully",
        color: "green",
      });
      setEditModalOpen(false);
    } catch (err) {
      console.error("Error updating bet:", err);
      notifications.show({
        title: "Error",
        message: err.response?.data?.message || "Failed to update bet",
        color: "red",
      });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleCreateBet = async (values) => {
    try {
      setLoadingAction(true);
      // Endpoint tworzy nowy zakład
      // Znajdź dane wybranego wyścigu na podstawie ID
      const selectedRace = races.find((race) => race._id === values.race);

      if (!selectedRace) {
        notifications.show({
          title: "Error",
          message: "Selected race details not found",
          color: "red",
        });
        return;
      }

      // Dodaj raceName i season do danych
      const betData = {
        ...values,
        raceId: values.race, // Zmienione z race na raceId zgodnie z kontrolerem
        raceName: selectedRace.countryName || selectedRace.name || "Unnamed Race",
        season: selectedRace.season || new Date().getFullYear(),
      };

      // Usuń właściwość race aby uniknąć duplikatu (zastąpiliśmy ją przez raceId)
      delete betData.race;

      console.log("Sending bet data:", betData);

      // Endpoint tworzy nowy zakład
      const response = await axiosInstance.post("/bets", betData);
      setBets([...bets, response.data]);
      notifications.show({
        title: "Success",
        message: "New bet has been created",
        color: "green",
      });
      setCreateModalOpen(false);
      createForm.reset();
    } catch (err) {
      console.error("Error creating bet:", err);
      notifications.show({
        title: "Error",
        message: err.response?.data?.message || "Failed to create bet",
        color: "red",
      });
    } finally {
      setLoadingAction(false);
    }
  };

  const openViewModal = (bet) => {
    setCurrentBet(bet);
    setViewModalOpen(true);
  };

  const openEditModal = (bet) => {
    setCurrentBet(bet);
    editForm.setValues({
      driverBets: {
        p1: bet.driverBets?.p1 || "",
        p2: bet.driverBets?.p2 || "",
        p3: bet.driverBets?.p3 || "",
        p4: bet.driverBets?.p4 || "",
        p5: bet.driverBets?.p5 || "",
        p6: bet.driverBets?.p6 || "",
        p7: bet.driverBets?.p7 || "",
        p8: bet.driverBets?.p8 || "",
        p9: bet.driverBets?.p9 || "",
        p10: bet.driverBets?.p10 || "",
      },
      bonusBets: {
        polePosition: bet.bonusBets?.polePosition || "",
        fastestLap: bet.bonusBets?.fastestLap || "",
        driverOfTheDay: bet.bonusBets?.driverOfTheDay || "",
        noDNFs: bet.bonusBets?.noDNFs || false,
      },
    });
    setEditModalOpen(true);
  };

  const confirmDelete = (bet) => {
    setBetToDelete(bet);
    setDeleteModalOpen(true);
  };

  const getBetStatusBadge = (status) => {
    const statusMap = {
      pending: { color: "blue", label: "Pending" },
      finished: { color: "green", label: "Finished" },
    };

    const statusInfo = statusMap[status] || { color: "gray", label: status };

    return <Badge color={statusInfo.color}>{statusInfo.label}</Badge>;
  };

  if (loading) {
    return (
      <Center p="xl">
        <Loader size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Container p="md">
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" py="md">
      <Group position="apart" mb="md">
        <Title order={2}>Bets</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => {
            setCreateModalOpen(true);
            console.log(races);
            console.log(drivers);
          }}
          disabled={races.length === 0}
        >
          Create New Bet
        </Button>
      </Group>

      <Paper withBorder shadow="sm" p="md" radius="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Race name</Table.Th>
              <Table.Th>Season</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Points</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {bets.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={5} align="center">
                  <Text c="dimmed">No bets</Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              bets.map((bet) => (
                <Table.Tr key={bet._id}>
                  <Table.Td>{bet.raceName}</Table.Td>
                  <Table.Td>{bet.season}</Table.Td>
                  <Table.Td>{getBetStatusBadge(bet.status)}</Table.Td>
                  <Table.Td>
                    {bet.status === "finished" ? (
                      <Group spacing="xs">
                        <IconTrophy size={16} color="gold" />
                        <Text fw={700}>{bet.awardedPoints}</Text>
                      </Group>
                    ) : (
                      <Text c="dimmed">-</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Group>
                      {bet.status === "finished" ? (
                        <ActionIcon color="blue" variant="subtle" onClick={() => openViewModal(bet)}>
                          <IconEye size={16} />
                        </ActionIcon>
                      ) : (
                        <ActionIcon color="blue" variant="subtle" onClick={() => openEditModal(bet)} disabled={bet.status !== "pending"}>
                          <IconEdit size={16} />
                        </ActionIcon>
                      )}
                      <ActionIcon color="red" variant="subtle" onClick={() => confirmDelete(bet)} disabled={bet.status !== "pending"}>
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Modal potwierdzenia usunięcia zakładu */}
      <Modal opened={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm deletion" size="sm">
        <Text>
          Do you want to delete bet for{" "}
          <Text fw={700} span>
            {betToDelete?.raceName}
          </Text>
          ?
        </Text>
        <Group position="right" mt="md">
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteBet} loading={loadingAction}>
            Delete bet
          </Button>
        </Group>
      </Modal>

      {/* Modal podglądu zakładu (tylko dla zakończonych) */}
      <Modal opened={viewModalOpen} onClose={() => setViewModalOpen(false)} title={`Bet details for ${currentBet?.raceName}`} size="lg">
        <Stack spacing="md">
          <Box>
            <Text fw={700} mb="xs">
              Driver Positions
            </Text>
            <Grid>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((position) => (
                <Grid.Col key={position} span={6} xs={4} md={2.4}>
                  <Text c="dimmed" size="sm">
                    P{position}:
                  </Text>
                  <Text>{currentBet?.driverBets?.[`p${position}`] || "-"}</Text>
                </Grid.Col>
              ))}
            </Grid>
          </Box>

          <Divider />

          <Box>
            <Text fw={700} mb="xs">
              Bonus Predictions
            </Text>
            <Grid>
              <Grid.Col span={6} md={3}>
                <Text c="dimmed" size="sm">
                  Pole Position:
                </Text>
                <Text>{currentBet?.bonusBets?.polePosition || "-"}</Text>
              </Grid.Col>
              <Grid.Col span={6} md={3}>
                <Text c="dimmed" size="sm">
                  Fastest Lap:
                </Text>
                <Text>{currentBet?.bonusBets?.fastestLap || "-"}</Text>
              </Grid.Col>
              <Grid.Col span={6} md={3}>
                <Text c="dimmed" size="sm">
                  Driver of The Day:
                </Text>
                <Text>{currentBet?.bonusBets?.driverOfTheDay || "-"}</Text>
              </Grid.Col>
              <Grid.Col span={6} md={3}>
                <Text c="dimmed" size="sm">
                  No DNFs:
                </Text>
                <Text>{currentBet?.bonusBets?.noDNFs ? "Yes" : "No"}</Text>
              </Grid.Col>
            </Grid>
          </Box>

          {currentBet?.status === "finished" && (
            <>
              <Divider />
              <Box>
                <Text fw={700} mb="xs" c="green">
                  Results
                </Text>
                <Group>
                  <IconTrophy size={20} color="gold" />
                  <Text size="lg" fw={700}>
                    {currentBet?.awardedPoints || 0} points
                  </Text>
                </Group>
              </Box>
            </>
          )}

          <Group position="right" mt="md">
            <Button onClick={() => setViewModalOpen(false)}>Close</Button>
          </Group>
        </Stack>
      </Modal>

      <Modal opened={editModalOpen} onClose={() => setEditModalOpen(false)} title={`Edit bet for ${currentBet?.raceName}`} size="xl">
        <form onSubmit={editForm.onSubmit(handleEditBet)}>
          <Stack spacing="md">
            {loadingDrivers ? (
              <Flex justify="center" my="xl">
                <Loader />
                <Text ml="md">Loading drivers...</Text>
              </Flex>
            ) : (
              <>
                <div>
                  <Text fw={700} mb="xs">
                    Driver Positions
                  </Text>
                  <Grid>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((position) => (
                      <Grid.Col key={position} span={6} md={4} lg={2.4}>
                        <Select
                          label={`P${position}`}
                          placeholder="Select driver"
                          data={drivers}
                          clearable
                          searchable
                          required={position <= 3}
                          {...editForm.getInputProps(`driverBets.p${position}`)}
                          mb="md"
                          nothingfound="No drivers found"
                        />
                      </Grid.Col>
                    ))}
                  </Grid>
                </div>

                <Divider />

                <div>
                  <Text fw={700} mb="xs">
                    Bonus Predictions
                  </Text>
                  <Grid>
                    <Grid.Col xs={12} sm={6} md={4}>
                      <Select
                        label="Pole Position"
                        placeholder="Select driver"
                        data={drivers}
                        clearable
                        searchable
                        {...editForm.getInputProps("bonusBets.polePosition")}
                        nothingfound="No drivers found"
                      />
                    </Grid.Col>
                    <Grid.Col xs={12} sm={6} md={4}>
                      <Select
                        label="Fastest Lap"
                        placeholder="Select driver"
                        data={drivers}
                        clearable
                        searchable
                        {...editForm.getInputProps("bonusBets.fastestLap")}
                        nothingfound="No drivers found"
                      />
                    </Grid.Col>
                    <Grid.Col xs={12} sm={6} md={4}>
                      <Select
                        label="Driver of The Day"
                        placeholder="Select driver"
                        data={drivers}
                        clearable
                        searchable
                        {...editForm.getInputProps("bonusBets.driverOfTheDay")}
                        nothingfound="No drivers found"
                      />
                    </Grid.Col>
                    <Grid.Col xs={12}>
                      <Switch label="No DNFs in the race" {...editForm.getInputProps("bonusBets.noDNFs", { type: "checkbox" })} mt="lg" />
                    </Grid.Col>
                  </Grid>
                </div>
              </>
            )}

            <Group position="right" mt="md">
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={loadingAction} disabled={loadingDrivers}>
                Save Changes
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Modal tworzenia nowego zakładu z obsługą ładowania kierowców */}
      <Modal opened={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Bet" size="xl">
        <form onSubmit={createForm.onSubmit(handleCreateBet)}>
          <Stack spacing="md">
            <Select
              label="Race"
              placeholder="Select race"
              data={
                Array.isArray(races)
                  ? races.map((race) => ({
                      value: race._id,
                      label: race.countryName || race.name || "Unnamed Race",
                    }))
                  : []
              }
              required
              searchable
              nothingfound="No races available"
              {...createForm.getInputProps("race")}
            />

            {loadingDrivers ? (
              <Flex justify="center" my="xl">
                <Loader />
                <Text ml="md">Loading drivers...</Text>
              </Flex>
            ) : (
              <>
                <div>
                  <Text fw={700} mb="xs">
                    Driver Positions
                  </Text>
                  <Grid>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((position) => (
                      <Grid.Col key={position} span={6} md={4} lg={2.4}>
                        <Select
                          label={`P${position}`}
                          placeholder="Select driver"
                          data={drivers}
                          clearable
                          searchable
                          required={position <= 3}
                          {...createForm.getInputProps(`driverBets.p${position}`)}
                          mb="md"
                          nothingfound="No drivers found"
                        />
                      </Grid.Col>
                    ))}
                  </Grid>
                </div>

                <Divider />

                <div>
                  <Text fw={700} mb="xs">
                    Bonus Predictions
                  </Text>
                  <Grid>
                    <Grid.Col xs={12} sm={6} md={4}>
                      <Select
                        label="Pole Position"
                        placeholder="Select driver"
                        data={drivers}
                        clearable
                        searchable
                        {...createForm.getInputProps("bonusBets.polePosition")}
                        nothingfound="No drivers found"
                      />
                    </Grid.Col>
                    <Grid.Col xs={12} sm={6} md={4}>
                      <Select
                        label="Fastest Lap"
                        placeholder="Select driver"
                        data={drivers}
                        clearable
                        searchable
                        {...createForm.getInputProps("bonusBets.fastestLap")}
                        nothingfound="No drivers found"
                      />
                    </Grid.Col>
                    <Grid.Col xs={12} sm={6} md={4}>
                      <Select
                        label="Driver of The Day"
                        placeholder="Select driver"
                        data={drivers}
                        clearable
                        searchable
                        {...createForm.getInputProps("bonusBets.driverOfTheDay")}
                        nothingfound="No drivers found"
                      />
                    </Grid.Col>
                    <Grid.Col xs={12}>
                      <Switch label="No DNFs in the race" {...createForm.getInputProps("bonusBets.noDNFs", { type: "checkbox" })} mt="lg" />
                    </Grid.Col>
                  </Grid>
                </div>
              </>
            )}
            <Group position="right" mt="md">
              <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={loadingAction}>
                Create Bet
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
};

export default BetsPage;
