import { useState, useEffect } from "react";
import { Center, Container, Flex, Group, Title, Loader, Text, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import RaceCard from "../Components/RaceCard";
import { axiosInstance } from "../lib/axios";

const RacesPage = () => {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextRace, setNextRace] = useState(null);

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/races");

        // Przetwarzamy dane wyścigów
        const processedRaces = response.data.map((race) => ({
          raceTitle: race.countryName || race.name,
          isSprint: race.isSprint,
          raceInfo: {
            dateRace: race.date,
            dateDeadline: race.betDeadline,
            length: "5500", // Ustawiamy stałą długość dla wszystkich torów
          },
          status: getStatusType(race.status),
          flag: `/flags/${race.flagFileName || "default-flag.png"}`,
          image: "/tracks/albert-park.jpg", // Używamy jednego obrazu dla wszystkich torów
          _id: race._id,
        }));

        // Sortujemy wyścigi według daty
        processedRaces.sort((a, b) => new Date(a.raceInfo.dateRace) - new Date(b.raceInfo.dateRace));

        // Znajdujemy najbliższy wyścig (pierwszy, który ma datę w przyszłości)
        const now = new Date();
        const upcoming = processedRaces.find((race) => new Date(race.raceInfo.dateRace) > now);

        setRaces(processedRaces);
        setNextRace(upcoming || null);
      } catch (err) {
        console.error("Error fetching races:", err);
        setError("Failed to load races data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRaces();
  }, []);

  // Konwersja statusu z API na typ wyświetlany w komponencie
  const getStatusType = (apiStatus) => {
    switch (apiStatus) {
      case "waiting":
        return "later";
      case "in progress":
        return "ongoing";
      case "finished":
        return "finished";
      default:
        return "later";
    }
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
        <Alert icon={<IconAlertCircle size={16} />} title="Błąd" color="red">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maw={{ base: "100%", sm: 600, md: 800 }} p={{ base: "sm", md: "md" }}>
      <Center>
        <Flex align="center" w={"100%"} direction="column" gap="md">
          {nextRace && (
            <RaceCard
              raceTitle={nextRace.raceTitle}
              raceInfo={nextRace.raceInfo}
              badgeType={nextRace.status}
              showNextRaceHeader={true}
              flag={nextRace.flag}
              image={nextRace.image}
              isSprint={nextRace.isSprint}
            />
          )}

          <Group justify="start" w="100%">
            <Title order={3} mt="2rem">
              Calendar
            </Title>
          </Group>

          {races.length === 0 ? (
            <Text c="dimmed">No races</Text>
          ) : (
            races.map((race) => (
              <RaceCard
                key={race._id}
                raceInfo={race.raceInfo}
                raceTitle={race.raceTitle}
                badgeType={race.status}
                showNextRaceHeader={false}
                flag={race.flag}
                image={race.image}
                isSprint={race.isSprint}
              />
            ))
          )}
        </Flex>
      </Center>
    </Container>
  );
};

export default RacesPage;
