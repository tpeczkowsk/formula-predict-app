import { useState, useEffect } from "react";
import { Container, Title, Paper, NumberInput, Group, Button, Text, Loader, Alert, Divider, Grid, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { axiosInstance } from "../../lib/axios";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconSettings, IconRefresh } from "@tabler/icons-react";

const ConfigAdminPage = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const form = useForm({
    initialValues: {
      driverBetPoints: {
        exactMatch: 5,
        oneOff: 3,
        twoOff: 1,
      },
      bonusBetPoints: {
        polePosition: 5,
        fastestLap: 5,
        driverOfTheDay: 5,
        noDNFs: 5,
      },
    },
  });

  // Pobierz konfigurację przy inicjalizacji komponentu
  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/config");
      setConfig(response.data);
      form.setValues({
        driverBetPoints: {
          exactMatch: response.data.driverBetPoints.exactMatch,
          oneOff: response.data.driverBetPoints.oneOff,
          twoOff: response.data.driverBetPoints.twoOff,
        },
        bonusBetPoints: {
          polePosition: response.data.bonusBetPoints.polePosition,
          fastestLap: response.data.bonusBetPoints.fastestLap,
          driverOfTheDay: response.data.bonusBetPoints.driverOfTheDay,
          noDNFs: response.data.bonusBetPoints.noDNFs,
        },
      });
    } catch (err) {
      console.error("Error fetching config:", err);
      setError(err.response?.data?.message || "Failed to load configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values) => {
    try {
      setSaving(true);
      setError(null);

      if (config) {
        // Aktualizacja istniejącej konfiguracji
        const response = await axiosInstance.put(`/config/${config._id}`, values);
        setConfig(response.data);
        notifications.show({
          title: "Success",
          message: "Configuration saved successfully",
          color: "green",
        });
      } else {
        // Tworzenie nowej konfiguracji jeśli nie istnieje
        const response = await axiosInstance.post("/config", values);
        setConfig(response.data);
        notifications.show({
          title: "Success",
          message: "Configuration created successfully",
          color: "green",
        });
      }
    } catch (err) {
      console.error("Error saving config:", err);
      setError(err.response?.data?.message || "Failed to save configuration");
      notifications.show({
        title: "Error",
        message: "Failed to save configuration",
        color: "red",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setSaving(true);
      setError(null);
      const response = await axiosInstance.post("/config/reset");
      setConfig(response.data.config);
      form.setValues({
        driverBetPoints: {
          exactMatch: response.data.config.driverBetPoints.exactMatch,
          oneOff: response.data.config.driverBetPoints.oneOff,
          twoOff: response.data.config.driverBetPoints.twoOff,
        },
        bonusBetPoints: {
          polePosition: response.data.config.bonusBetPoints.polePosition,
          fastestLap: response.data.config.bonusBetPoints.fastestLap,
          driverOfTheDay: response.data.config.bonusBetPoints.driverOfTheDay,
          noDNFs: response.data.config.bonusBetPoints.noDNFs,
        },
      });
      notifications.show({
        title: "Success",
        message: "Configuration has been reset to defaults",
        color: "blue",
      });
    } catch (err) {
      console.error("Error resetting config:", err);
      setError(err.response?.data?.message || "Failed to reset configuration");
      notifications.show({
        title: "Error",
        message: "Failed to reset configuration",
        color: "red",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container size="md" py="xl">
        <Group position="center">
          <Loader size="lg" />
          <Text>Loading configuration...</Text>
        </Group>
      </Container>
    );
  }

  return (
    <Container size="md" py="md">
      <Paper radius="md" p="xl" withBorder>
        <Group position="apart" mb="lg">
          <Title order={2}>
            <Group spacing="xs">
              <IconSettings size={28} />
              <Text>Point System Configuration</Text>
            </Group>
          </Title>
          <Button lefticon={<IconRefresh size={16} />} variant="outline" onClick={handleReset} loading={saving}>
            Reset to Defaults
          </Button>
        </Group>

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" mb="md">
            {error}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSave)}>
          <Stack spacing="xl">
            <div>
              <Title order={4} mb="md">
                Driver Position Bet Points
              </Title>
              <Text size="sm" color="dimmed" mb="md">
                Configure points awarded for driver position predictions
              </Text>
              <Grid>
                <Grid.Col sm={4}>
                  <NumberInput
                    label="Exact Position Match"
                    description="Points for predicting the exact position"
                    min={0}
                    max={20}
                    {...form.getInputProps("driverBetPoints.exactMatch")}
                  />
                </Grid.Col>
                <Grid.Col sm={4}>
                  <NumberInput
                    label="Off by 1 Position"
                    description="Points when prediction is off by 1 position"
                    min={0}
                    max={20}
                    {...form.getInputProps("driverBetPoints.oneOff")}
                  />
                </Grid.Col>
                <Grid.Col sm={4}>
                  <NumberInput
                    label="Off by 2 Positions"
                    description="Points when prediction is off by 2 positions"
                    min={0}
                    max={20}
                    {...form.getInputProps("driverBetPoints.twoOff")}
                  />
                </Grid.Col>
              </Grid>
            </div>

            <Divider />

            <div>
              <Title order={4} mb="md">
                Bonus Bet Points
              </Title>
              <Text size="sm" color="dimmed" mb="md">
                Configure points awarded for correct bonus predictions
              </Text>
              <Grid>
                <Grid.Col sm={6} md={3}>
                  <NumberInput
                    label="Pole Position"
                    description="Points for correct pole position"
                    min={0}
                    max={20}
                    {...form.getInputProps("bonusBetPoints.polePosition")}
                  />
                </Grid.Col>
                <Grid.Col sm={6} md={3}>
                  <NumberInput
                    label="Fastest Lap"
                    description="Points for correct fastest lap"
                    min={0}
                    max={20}
                    {...form.getInputProps("bonusBetPoints.fastestLap")}
                  />
                </Grid.Col>
                <Grid.Col sm={6} md={3}>
                  <NumberInput
                    label="Driver of the Day"
                    description="Points for correct DOTD"
                    min={0}
                    max={20}
                    {...form.getInputProps("bonusBetPoints.driverOfTheDay")}
                  />
                </Grid.Col>
                <Grid.Col sm={6} md={3}>
                  <NumberInput
                    label="No DNFs"
                    description="Points for correct no-DNFs prediction"
                    min={0}
                    max={20}
                    {...form.getInputProps("bonusBetPoints.noDNFs")}
                  />
                </Grid.Col>
              </Grid>
            </div>

            <Group position="right" mt="md">
              <Button type="submit" size="md" loading={saving}>
                Save Configuration
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default ConfigAdminPage;
