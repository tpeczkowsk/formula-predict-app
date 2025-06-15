import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TextInput, PasswordInput, Button, Paper, Title, Text, Container, Stack, Group, Anchor } from "@mantine/core";
import { useForm } from "@mantine/form";

const LoginPage = () => {
  const { login, isLoggingIn } = useAuthStore();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Odzyskaj zamierzoną ścieżkę, jeśli istnieje
  const from = location.state?.from || "/bets";

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Wrong email format"),
      password: (value) => (value.length < 6 ? "Password must contain at least 6 characters" : null),
    },
  });

  const handleSubmit = async (values) => {
    setError(null);
    try {
      await login(values);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Error logging in. Please try again.");
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" fw={900} fs={"italic"} size="h1" mb={50}>
        Formula Predict
      </Title>
      <Paper radius="md" p="xl" withBorder>
        <Title ta="center" order={2} mb="md">
          Login Page
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {error && (
              <Text c="red" size="sm" ta="center">
                {error}
              </Text>
            )}

            <TextInput withAsterisk label="Email" placeholder="your@email.com" {...form.getInputProps("email")} />

            <PasswordInput withAsterisk label="Password" placeholder="********" {...form.getInputProps("password")} />
          </Stack>

          <Group justify="space-between" mt="xl">
            <Text size="sm">
              No account?{" "}
              <Anchor component={Link} to="/register" fw={700}>
                Register
              </Anchor>
            </Text>
            <Button type="submit" loading={isLoggingIn}>
              Log In
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;
