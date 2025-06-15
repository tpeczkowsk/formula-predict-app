import { useState, useEffect } from "react";
import {
  Button,
  Table,
  Modal,
  TextInput,
  Group,
  Paper,
  Title,
  Badge,
  ActionIcon,
  Container,
  Flex,
  Alert,
  Select,
  NumberInput,
  Checkbox,
  Tabs,
  Divider,
  Grid,
  Box,
  Switch,
  Loader,
  Text,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconPlus, IconTrash, IconEdit, IconTrophy, IconCalendarEvent } from "@tabler/icons-react";
import { axiosInstance } from "../../lib/axios";
import { notifications } from "@mantine/notifications";
import { formatDate } from "../../utils/formatters";

const raceStatuses = [
  { value: "waiting", label: "Waiting" },
  { value: "in progress", label: "In Progress" },
  { value: "finished", label: "Finished" },
];

const RacesAdminPage = () => {
  const [races, setRaces] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentRace, setCurrentRace] = useState(null);
  const [error, setError] = useState(null);

  const createForm = useForm({
    initialValues: {
      name: "",
      date: null,
      betDeadline: null,
      season: new Date().getFullYear(),
      isSprint: false,
      countryName: "",
      flagFileName: "default-flag.png",
    },
    validate: {
      name: (value) => (value.length < 3 ? "Race name must be at least 3 characters" : null),
      date: (value) => (!value ? "Race date is required" : null),
      betDeadline: (value, values) => {
        if (!value) return "Bet deadline is required";
        if (value > values.date) return "Bet deadline must be before race date";
        return null;
      },
      season: (value) => (!value ? "Season is required" : null),
    },
  });

  const editForm = useForm({
    initialValues: {
      name: "",
      date: null,
      betDeadline: null,
      season: new Date().getFullYear(),
      isSprint: false,
      status: "waiting",
      countryName: "",
      flagFileName: "default-flag.png",
      driverResults: {
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
        p11: "",
        p12: "",
      },
      bonusResults: {
        polePosition: "",
        fastestLap: "",
        driverOfTheDay: "",
        noDNFs: false,
      },
    },
    validate: {
      name: (value) => (value.length < 3 ? "Race name must be at least 3 characters" : null),
      date: (value) => (!value ? "Race date is required" : null),
      betDeadline: (value, values) => {
        if (!value) return "Bet deadline is required";
        if (value > values.date) return "Bet deadline must be before race date";
        return null;
      },
      season: (value) => (!value ? "Season is required" : null),
      status: (value, values) => {
        if (value === "finished") {
          // Check if driver results are filled for positions 1-10
          for (let i = 1; i <= 10; i++) {
            const pos = `p${i}`;
            if (!values.driverResults[pos]) {
              return `Driver for position ${i} is required when race is marked as finished`;
            }
          }

          // Check if bonus results are filled
          const { polePosition, fastestLap, driverOfTheDay } = values.bonusResults;
          if (!polePosition) return "Pole position driver is required when race is marked as finished";
          if (!fastestLap) return "Fastest lap driver is required when race is marked as finished";
          if (!driverOfTheDay) return "Driver of the day is required when race is marked as finished";
        }
        return null;
      },
    },
  });

  // Fetch races and drivers when component mounts
  useEffect(() => {
    fetchRaces();
    fetchDrivers();
  }, []);

  // Ta część dotyczy tylko funkcji fetchDrivers - zmieniamy sposób formatowania danych
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

  const fetchRaces = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/races");
      setRaces(response.data);
    } catch (err) {
      console.error("Error fetching races:", err);
      setError("Failed to load races. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRace = async (values) => {
    try {
      await axiosInstance.post("/races", values);
      fetchRaces(); // Refresh race list
      setCreateModalOpen(false);
      createForm.reset();
      notifications.show({
        title: "Success",
        message: "Race created successfully",
        color: "green",
      });
    } catch (err) {
      console.error("Error creating race:", err);
      notifications.show({
        title: "Error",
        message: err.response?.data?.message || "Failed to create race",
        color: "red",
      });
    }
  };

  const handleEditRace = async (values) => {
    try {
      if (!currentRace?._id) return;

      await axiosInstance.put(`/races/${currentRace._id}`, values);
      fetchRaces(); // Refresh race list
      setEditModalOpen(false);
      setCurrentRace(null);
      notifications.show({
        title: "Success",
        message: "Race updated successfully",
        color: "green",
      });
    } catch (err) {
      console.error("Error updating race:", err);
      notifications.show({
        title: "Error",
        message: err.response?.data?.message || "Failed to update race",
        color: "red",
      });
    }
  };

  const handleDeleteRace = async (raceId) => {
    if (window.confirm("Are you sure you want to delete this race? This will also remove all associated bets.")) {
      try {
        await axiosInstance.delete(`/races/${raceId}`);
        setRaces(races.filter((race) => race._id !== raceId));
        notifications.show({
          title: "Success",
          message: "Race deleted successfully",
          color: "green",
        });
      } catch (err) {
        console.error("Error deleting race:", err);
        notifications.show({
          title: "Error",
          message: err.response?.data?.message || "Failed to delete race",
          color: "red",
        });
      }
    }
  };

  const openEditModal = (race) => {
    setCurrentRace(race);

    editForm.setValues({
      name: race.name,
      date: new Date(race.date),
      betDeadline: new Date(race.betDeadline),
      season: race.season,
      isSprint: race.isSprint,
      status: race.status,
      countryName: race.countryName || "",
      flagFileName: race.flagFileName || "default-flag.png",
      driverResults: {
        p1: race.driverResults?.p1 || "",
        p2: race.driverResults?.p2 || "",
        p3: race.driverResults?.p3 || "",
        p4: race.driverResults?.p4 || "",
        p5: race.driverResults?.p5 || "",
        p6: race.driverResults?.p6 || "",
        p7: race.driverResults?.p7 || "",
        p8: race.driverResults?.p8 || "",
        p9: race.driverResults?.p9 || "",
        p10: race.driverResults?.p10 || "",
        p11: race.driverResults?.p11 || "",
        p12: race.driverResults?.p12 || "",
      },
      bonusResults: {
        polePosition: race.bonusResults?.polePosition || "",
        fastestLap: race.bonusResults?.fastestLap || "",
        driverOfTheDay: race.bonusResults?.driverOfTheDay || "",
        noDNFs: race.bonusResults?.noDNFs || false,
      },
    });

    setEditModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const colorMap = {
      waiting: "blue",
      "in progress": "yellow",
      finished: "green",
    };

    return (
      <Badge color={colorMap[status]} variant="filled">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const isRaceEditable = (race) => {
    // Race can be edited if it's not finished or if no bets are placed yet
    return race.status !== "finished";
  };

  const renderDriverSelect = (position, required = false) => (
    <Select
      label={`Position ${position}`}
      placeholder={loadingDrivers ? "Loading drivers..." : "Select driver"}
      data={drivers}
      required={required}
      {...editForm.getInputProps(`driverResults.p${position}`)}
      disabled={loadingDrivers}
      rightSection={loadingDrivers ? <Loader size="xs" /> : null}
      searchable
      nothingfound="No drivers found"
    />
  );

  return (
    <Container size="xl">
      <Title order={2} mb="md" mt="md">
        Race Management
      </Title>

      <Flex justify="flex-end" mb="md">
        <Button leftSection={<IconPlus size={20} />} onClick={() => setCreateModalOpen(true)}>
          Create New Race
        </Button>
      </Flex>

      {error && (
        <Alert color="red" mb="md" title="Error">
          {error}
        </Alert>
      )}

      <Paper withBorder p="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Season</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading ? (
              <Table.Tr>
                <Table.Td colSpan={6} align="center">
                  Loading races...
                </Table.Td>
              </Table.Tr>
            ) : races.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6} align="center">
                  No races found
                </Table.Td>
              </Table.Tr>
            ) : (
              races.map((race) => (
                <Table.Tr key={race._id}>
                  <Table.Td>{race.name}</Table.Td>
                  <Table.Td>{formatDate(race.date)}</Table.Td>
                  <Table.Td>{race.season}</Table.Td>
                  <Table.Td>
                    <Badge color={race.isSprint ? "orange" : "blue"} variant="light">
                      {race.isSprint ? "Sprint" : "Race"}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{getStatusBadge(race.status)}</Table.Td>
                  <Table.Td>
                    <Group>
                      <ActionIcon color="blue" variant="subtle" onClick={() => openEditModal(race)}>
                        <IconEdit size={18} />
                      </ActionIcon>
                      <ActionIcon color="red" variant="subtle" onClick={() => handleDeleteRace(race._id)} disabled={!isRaceEditable(race)}>
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Create Race Modal */}
      <Modal opened={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Race" size="lg">
        <form onSubmit={createForm.onSubmit(handleCreateRace)}>
          <Grid>
            <Grid.Col span={12}>
              <TextInput label="Race Name" placeholder="e.g. Monaco Grand Prix" required {...createForm.getInputProps("name")} />
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput label="Country" placeholder="e.g. Monaco" {...createForm.getInputProps("countryName")} />
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput label="Flag Filename" placeholder="e.g. monaco-flag.png" {...createForm.getInputProps("flagFileName")} />
            </Grid.Col>

            <Grid.Col span={6}>
              <DateTimePicker label="Race Date and Time" placeholder="Select date and time" required {...createForm.getInputProps("date")} />
            </Grid.Col>

            <Grid.Col span={6}>
              <DateTimePicker label="Betting Deadline" placeholder="Select date and time" required {...createForm.getInputProps("betDeadline")} />
            </Grid.Col>

            <Grid.Col span={6}>
              <NumberInput label="Season" placeholder="e.g. 2025" required {...createForm.getInputProps("season")} min={2020} max={2030} />
            </Grid.Col>

            <Grid.Col span={6}>
              <Checkbox label="Sprint Race" {...createForm.getInputProps("isSprint", { type: "checkbox" })} mt="lg" />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="xl">
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Race</Button>
          </Group>
        </form>
      </Modal>

      {/* Edit Race Modal */}
      <Modal opened={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Race" size="xl">
        <form onSubmit={editForm.onSubmit(handleEditRace)}>
          <Tabs defaultValue="details">
            <Tabs.List>
              <Tabs.Tab value="details" leftSection={<IconCalendarEvent size={14} />}>
                Race Details
              </Tabs.Tab>
              <Tabs.Tab value="results" leftSection={<IconTrophy size={14} />}>
                Results
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="details" pt="md">
              <Grid>
                <Grid.Col span={12}>
                  <TextInput label="Race Name" placeholder="e.g. Monaco Grand Prix" required {...editForm.getInputProps("name")} />
                </Grid.Col>

                <Grid.Col span={6}>
                  <TextInput label="Country" placeholder="e.g. Monaco" {...editForm.getInputProps("countryName")} />
                </Grid.Col>

                <Grid.Col span={6}>
                  <TextInput label="Flag Filename" placeholder="e.g. monaco-flag.png" {...editForm.getInputProps("flagFileName")} />
                </Grid.Col>

                <Grid.Col span={6}>
                  <DateTimePicker label="Race Date and Time" placeholder="Select date and time" required {...editForm.getInputProps("date")} />
                </Grid.Col>

                <Grid.Col span={6}>
                  <DateTimePicker label="Betting Deadline" placeholder="Select date and time" required {...editForm.getInputProps("betDeadline")} />
                </Grid.Col>

                <Grid.Col span={6}>
                  <NumberInput label="Season" placeholder="e.g. 2025" required {...editForm.getInputProps("season")} min={2020} max={2030} />
                </Grid.Col>

                <Grid.Col span={6}>
                  <Checkbox label="Sprint Race" {...editForm.getInputProps("isSprint", { type: "checkbox" })} mt="lg" />
                </Grid.Col>

                <Grid.Col span={12}>
                  <Select label="Status" data={raceStatuses} {...editForm.getInputProps("status")} mt="md" />
                </Grid.Col>
              </Grid>
            </Tabs.Panel>

            <Tabs.Panel value="results" pt="md">
              <Alert color="blue" mb="md" title="Note">
                When setting a race as finished, you must provide all results for positions 1-10 and all bonus categories.
              </Alert>

              {loadingDrivers ? (
                <Flex justify="center" my="xl">
                  <Loader />
                  <Text ml="md">Loading drivers...</Text>
                </Flex>
              ) : (
                <>
                  <Box mb="md">
                    <Title order={4} mb="sm">
                      Driver Results
                    </Title>
                    <Grid gutter="md">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((position) => (
                        <Grid.Col span={6} key={position}>
                          <Select
                            label={`Position ${position}`}
                            placeholder="Select driver"
                            data={drivers}
                            required={position <= 10 && editForm.values.status === "finished"}
                            {...editForm.getInputProps(`driverResults.p${position}`)}
                            searchable
                            nothingfound="No drivers found"
                          />
                        </Grid.Col>
                      ))}
                    </Grid>
                  </Box>

                  <Divider my="md" />

                  <Box>
                    <Title order={4} mb="sm">
                      Bonus Results
                    </Title>
                    <Grid gutter="md">
                      <Grid.Col span={6}>
                        <Select
                          label="Pole Position"
                          placeholder="Select driver"
                          data={drivers}
                          required={editForm.values.status === "finished"}
                          {...editForm.getInputProps("bonusResults.polePosition")}
                          searchable
                          nothingfound="No drivers found"
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Select
                          label="Fastest Lap"
                          placeholder="Select driver"
                          data={drivers}
                          required={editForm.values.status === "finished"}
                          {...editForm.getInputProps("bonusResults.fastestLap")}
                          searchable
                          nothingfound="No drivers found"
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Select
                          label="Driver of the Day"
                          placeholder="Select driver"
                          data={drivers}
                          required={editForm.values.status === "finished"}
                          {...editForm.getInputProps("bonusResults.driverOfTheDay")}
                          searchable
                          nothingfound="No drivers found"
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Switch label="No DNFs in the race" {...editForm.getInputProps("bonusResults.noDNFs", { type: "checkbox" })} mt="lg" />
                      </Grid.Col>
                    </Grid>
                  </Box>
                </>
              )}
            </Tabs.Panel>
          </Tabs>

          <Group justify="flex-end" mt="xl">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" color="blue">
              Save Changes
            </Button>
          </Group>
        </form>
      </Modal>
    </Container>
  );
};

export default RacesAdminPage;
