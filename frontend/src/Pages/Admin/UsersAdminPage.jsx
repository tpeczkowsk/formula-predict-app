import { useState, useEffect } from "react";
import {
  Button,
  Table,
  Modal,
  TextInput,
  Group,
  Text,
  Paper,
  Title,
  Badge,
  Card,
  ActionIcon,
  Switch,
  CopyButton,
  Tooltip,
  Container,
  Flex,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTrash, IconCopy, IconCheck, IconUserPlus } from "@tabler/icons-react";
import { axiosInstance } from "../../lib/axios";
import { notifications } from "@mantine/notifications";

const UsersAdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);
  const [error, setError] = useState(null);

  const createForm = useForm({
    initialValues: {
      username: "",
      role: false, // false = user, true = admin
    },
    validate: {
      username: (value) => (value.length < 3 ? "Username must be at least 3 characters" : null),
    },
  });

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/users");
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (values) => {
    try {
      const response = await axiosInstance.post("/users", {
        username: values.username,
        role: values.role ? "admin" : "user",
      });

      setCreatedUser(response.data.user);
      createForm.reset();
      fetchUsers(); // Refresh user list
      notifications.show({
        title: "Success",
        message: "User created successfully",
        color: "green",
      });
    } catch (err) {
      console.error("Error creating user:", err);
      notifications.show({
        title: "Error",
        message: err.response?.data?.message || "Failed to create user",
        color: "red",
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axiosInstance.delete(`/users/${userId}`);
        setUsers(users.filter((user) => user._id !== userId));
        notifications.show({
          title: "Success",
          message: "User deleted successfully",
          color: "green",
        });
      } catch (err) {
        console.error("Error deleting user:", err);
        notifications.show({
          title: "Error",
          message: err.response?.data?.message || "Failed to delete user",
          color: "red",
        });
      }
    }
  };

  const closeModal = () => {
    setCreateModalOpen(false);
    setCreatedUser(null);
  };

  return (
    <Container size="xl">
      <Title order={2} mb="md">
        User Management
      </Title>

      <Flex justify="flex-end" mb="md">
        <Button leftSection={<IconUserPlus size={20} />} onClick={() => setCreateModalOpen(true)}>
          Create New User
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
              <Table.Th>Username</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading ? (
              <Table.Tr>
                <Table.Td colSpan={5} align="center">
                  Loading users...
                </Table.Td>
              </Table.Tr>
            ) : users.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={5} align="center">
                  No users found
                </Table.Td>
              </Table.Tr>
            ) : (
              users.map((user) => (
                <Table.Tr key={user._id}>
                  <Table.Td>{user.username}</Table.Td>
                  <Table.Td>{user.email}</Table.Td>
                  <Table.Td>
                    <Badge color={user.role === "admin" ? "blue" : "green"} variant="filled">
                      {user.role}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={user.isRegistered ? "green" : "yellow"} variant="light">
                      {user.isRegistered ? "Registered" : "Pending"}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => handleDeleteUser(user._id)}
                      disabled={user.role === "admin"} // Prevent deleting admins
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Create User Modal */}
      <Modal
        opened={createModalOpen}
        onClose={closeModal}
        title={createdUser ? "User Created Successfully" : "Create New User"}
        size={createdUser ? "lg" : "md"}
      >
        {!createdUser ? (
          <form onSubmit={createForm.onSubmit(handleCreateUser)}>
            <TextInput label="Username" placeholder="Enter username" required mb="md" {...createForm.getInputProps("username")} />
            <Switch
              label="Admin role"
              description="Toggle to give admin privileges"
              mb="xl"
              {...createForm.getInputProps("role", { type: "checkbox" })}
            />
            <Group justify="flex-end">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">Create User</Button>
            </Group>
          </form>
        ) : (
          <Card withBorder shadow="sm" p="lg" radius="md">
            <Title order={3} mb="md">
              Registration Information
            </Title>
            <Text mb="xs">Username: {createdUser.username}</Text>
            <Text mb="xs">Role: {createdUser.role}</Text>

            <Group mb="md">
              <Text>Registration Token:</Text>
              <CopyButton value={createdUser.registrationToken} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
                    <Button onClick={copy} variant="light" size="xs" rightSection={copied ? <IconCheck size={16} /> : <IconCopy size={16} />}>
                      {createdUser.registrationToken.substring(0, 20)}...
                    </Button>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>

            <Text size="sm" c="dimmed" mb="xl">
              Token expires: {new Date(createdUser.tokenExpiryTime).toLocaleString()}
            </Text>

            <Alert color="blue" mb="md" title="Important">
              Provide the username and registration token to the new user. They will need these to complete their registration.
            </Alert>

            <Group justify="center">
              <Button onClick={closeModal}>Close</Button>
            </Group>
          </Card>
        )}
      </Modal>
    </Container>
  );
};

export default UsersAdminPage;
