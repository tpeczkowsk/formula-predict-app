import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Paper,
  Table,
  Button,
  Group,
  ActionIcon,
  Flex,
  TextInput,
  Modal,
  Text,
  Loader,
  Alert,
  Avatar,
  Switch,
} from "@mantine/core";
import { IconPlus, IconEdit, IconTrash, IconAlertCircle } from "@tabler/icons-react";
import { axiosInstance } from "../../lib/axios";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";

const DriversAdminPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Create driver form
  const createForm = useForm({
    initialValues: {
      fullname: "",
      teamName: "",
      isActive: true,
    },
    validate: {
      fullname: (value) => (value.trim() ? null : "Driver name is required"),
      teamName: (value) => (value.trim() ? null : "Team name is required"),
    },
  });

  // Edit driver form
  const editForm = useForm({
    initialValues: {
      fullname: "",
      teamName: "",
      isActive: true,
    },
    validate: {
      fullname: (value) => (value.trim() ? null : "Driver name is required"),
      teamName: (value) => (value.trim() ? null : "Team name is required"),
    },
  });

  // Fetch drivers on page load
  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/drivers");
      setDrivers(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching drivers:", err);
      setError("Failed to fetch drivers data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDriver = async (values) => {
    try {
      const response = await axiosInstance.post("/drivers", values);
      setDrivers([...drivers, response.data]);
      setCreateModalOpen(false);
      createForm.reset();
      notifications.show({
        title: "Success",
        message: "Driver has been created successfully",
        color: "green",
      });
    } catch (err) {
      console.error("Error creating driver:", err);
      notifications.show({
        title: "Error",
        message: err.response?.data?.message || "Failed to create driver",
        color: "red",
      });
    }
  };

  const openEditModal = (driver) => {
    setSelectedDriver(driver);
    editForm.setValues({
      fullname: driver.fullname,
      teamName: driver.teamName,
      isActive: driver.isActive,
    });
    setEditModalOpen(true);
  };

  const handleEditDriver = async (values) => {
    try {
      const response = await axiosInstance.put(`/drivers/${selectedDriver._id}`, values);
      setDrivers(drivers.map((driver) => (driver._id === selectedDriver._id ? response.data : driver)));
      setEditModalOpen(false);
      notifications.show({
        title: "Success",
        message: "Driver has been updated successfully",
        color: "green",
      });
    } catch (err) {
      console.error("Error updating driver:", err);
      notifications.show({
        title: "Error",
        message: err.response?.data?.message || "Failed to update driver",
        color: "red",
      });
    }
  };

  const openDeleteModal = (driver) => {
    setSelectedDriver(driver);
    setDeleteModalOpen(true);
  };

  const handleDeleteDriver = async () => {
    try {
      await axiosInstance.delete(`/drivers/${selectedDriver._id}`);
      setDrivers(drivers.filter((driver) => driver._id !== selectedDriver._id));
      setDeleteModalOpen(false);
      notifications.show({
        title: "Success",
        message: "Driver has been deleted successfully",
        color: "green",
      });
    } catch (err) {
      console.error("Error deleting driver:", err);
      notifications.show({
        title: "Error",
        message: err.response?.data?.message || "Failed to delete driver",
        color: "red",
      });
    }
  };

  return (
    <Container size="xl">
      <Title order={2} mb="md">
        Driver Management
      </Title>

      <Flex justify="flex-end" mb="md">
        <Button leftSection={<IconPlus size={20} />} onClick={() => setCreateModalOpen(true)}>
          Create New Driver
        </Button>
      </Flex>

      {error && (
        <Alert color="red" mb="md" title="Error" icon={<IconAlertCircle size={16} />}>
          {error}
        </Alert>
      )}

      <Paper withBorder p="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Driver</Table.Th>
              <Table.Th>Team</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading ? (
              <Table.Tr>
                <Table.Td colSpan={4} align="center">
                  <Loader my="lg" />
                </Table.Td>
              </Table.Tr>
            ) : drivers.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={4} align="center">
                  <Text c="dimmed">No drivers found</Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              drivers.map((driver) => (
                <Table.Tr key={driver._id}>
                  <Table.Td>
                    <Group>
                      <Avatar color="indigo" radius="xl">
                        {driver.fullname?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Text>{driver.fullname}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>{driver.teamName}</Table.Td>
                  <Table.Td>
                    {driver.isActive ? (
                      <Text c="green" fw={500}>
                        Active
                      </Text>
                    ) : (
                      <Text c="gray" fw={500}>
                        Inactive
                      </Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Group>
                      <ActionIcon color="blue" variant="subtle" onClick={() => openEditModal(driver)}>
                        <IconEdit size={18} />
                      </ActionIcon>
                      <ActionIcon color="red" variant="subtle" onClick={() => openDeleteModal(driver)}>
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

      {/* Create Driver Modal */}
      <Modal opened={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Driver" size="md">
        <form onSubmit={createForm.onSubmit(handleCreateDriver)}>
          <TextInput label="Full Name" placeholder="e.g. Lewis Hamilton" required mb="md" {...createForm.getInputProps("fullname")} />
          <TextInput label="Team Name" placeholder="e.g. Mercedes" required mb="md" {...createForm.getInputProps("teamName")} />
          <Switch
            label="Active Driver"
            checked={createForm.values.isActive}
            onChange={(event) => createForm.setFieldValue("isActive", event.currentTarget.checked)}
            mb="md"
          />
          <Group justify="flex-end" mt="xl">
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Driver</Button>
          </Group>
        </form>
      </Modal>

      {/* Edit Driver Modal */}
      <Modal opened={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Driver" size="md">
        <form onSubmit={editForm.onSubmit(handleEditDriver)}>
          <TextInput label="Full Name" placeholder="e.g. Lewis Hamilton" required mb="md" {...editForm.getInputProps("fullname")} />
          <TextInput label="Team Name" placeholder="e.g. Mercedes" required mb="md" {...editForm.getInputProps("teamName")} />
          <Switch
            label="Active Driver"
            checked={editForm.values.isActive}
            onChange={(event) => editForm.setFieldValue("isActive", event.currentTarget.checked)}
            mb="md"
          />
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

      {/* Delete Confirmation Modal */}
      <Modal opened={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Deletion" size="sm">
        <Text mb="lg">
          Are you sure you want to delete driver{" "}
          <Text span fw={700}>
            {selectedDriver?.fullname}
          </Text>
          ?
        </Text>
        <Group justify="flex-end">
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteDriver}>
            Delete Driver
          </Button>
        </Group>
      </Modal>
    </Container>
  );
};

export default DriversAdminPage;
