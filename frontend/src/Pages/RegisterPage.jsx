import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { TextInput, PasswordInput, Button, Paper, Title, Text, Container, Stack, Group, Anchor } from "@mantine/core";
import { useForm } from "@mantine/form";

const RegisterPage = () => {
  const { signup, isRegistering } = useAuthStore();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      registrationToken: "",
    },
    validate: {
      username: (value) => (value.length < 3 ? "Username must be at least 3 characters long" : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email format"),
      password: (value) => (value.length < 6 ? "Password must be at least 6 characters long" : null),
      confirmPassword: (value, values) => (value !== values.password ? "Passwords do not match" : null),
      registrationToken: (value) => (value.length < 8 ? "Invalid registration token" : null),
    },
  });

  const handleSubmit = async (values) => {
    setError(null);

    try {
      await signup({
        username: values.username,
        email: values.email,
        password: values.password,
        registrationToken: values.registrationToken,
      });

      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during registration. Please try again.");
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" fw={900} size="h1" mb={50}>
        Formula Predict
      </Title>

      <Paper radius="md" p="xl" withBorder>
        <Title ta="center" order={2} mb="md">
          Registration
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {error && (
              <Text c="red" size="sm" ta="center">
                {error}
              </Text>
            )}

            <TextInput
              withAsterisk
              label="Username"
              placeholder="Enter your assigned username"
              {...form.getInputProps("username")}
              description="Enter username provided by the administrator"
            />

            <TextInput withAsterisk label="Email" placeholder="your@email.com" {...form.getInputProps("email")} />

            <PasswordInput withAsterisk label="Password" placeholder="Create a password" {...form.getInputProps("password")} />

            <PasswordInput withAsterisk label="Confirm Password" placeholder="Repeat your password" {...form.getInputProps("confirmPassword")} />

            <TextInput
              withAsterisk
              label="Registration Token"
              placeholder="Enter your registration token"
              {...form.getInputProps("registrationToken")}
              description="This token was provided to you by the administrator"
            />
          </Stack>

          <Group justify="space-between" mt="xl">
            <Text size="sm">
              Already have an account?{" "}
              <Anchor component={Link} to="/login" fw={700}>
                Log in
              </Anchor>
            </Text>
            <Button type="submit" loading={isRegistering}>
              Register
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
