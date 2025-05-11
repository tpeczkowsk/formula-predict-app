import { Badge, Card, Flex, Group, Image, Overlay, Text, Title, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import styles from "./RaceCard.module.css";
import { useEffect, useState } from "react";

const RaceCard = ({ badgeType, showNextRaceHeader, raceTitle, raceInfo, image, isSprint, flag }) => {
  const [timeRemaining, setTimeRemaining] = useState("");
  const computedColorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true });
  // Formatowanie przedziału dat (np. "2-3 Mar")
  const formatDateRange = () => {
    if (!raceInfo?.dateRace || !raceInfo?.dateDeadline) return "";

    const deadlineDate = new Date(raceInfo.dateDeadline);
    const raceDate = new Date(raceInfo.dateRace);

    const deadlineDay = deadlineDate.getDate();
    const deadlineMonth = deadlineDate.toLocaleString("en-US", { month: "short" });
    const raceDay = raceDate.getDate();
    const raceMonth = raceDate.toLocaleString("en-US", { month: "short" });

    // Jeśli miesiące są różne
    if (deadlineMonth !== raceMonth) {
      return `${deadlineDay} ${deadlineMonth}-${raceDay} ${raceMonth}`;
    } else {
      // Jeśli miesiące są takie same
      return `${deadlineDay}-${raceDay} ${raceMonth}`;
    }
  };
  // Formatowanie dnia tygodnia i godziny
  const formatDayAndTime = (dateStr) => {
    if (!dateStr) return { day: "", time: "" };

    const date = new Date(dateStr);
    const day = date.toLocaleString("en-US", { weekday: "long" });
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return { day, time: `${hours}:${minutes}` };
  };

  // Aktualizacja pozostałego czasu co sekundę
  useEffect(() => {
    // Obliczanie pozostałego czasu
    const calculateTimeRemaining = () => {
      if (!raceInfo?.dateDeadline) return "";

      const nowUTC = Date.now();
      const deadlineUTC = new Date(raceInfo.dateDeadline).getTime();
      const diff = deadlineUTC - nowUTC;

      if (diff <= 0) return "Bets closed";

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0) parts.push(`${hours}h`);
      if (minutes > 0) parts.push(`${minutes}m`);
      if (seconds > 0) parts.push(`${seconds}s`);

      return parts.join(" ") || "0s";
    };

    if (badgeType === "ongoing" || badgeType === "finished") {
      setTimeRemaining("Bets closed");
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    // Inicjalne ustawienie
    setTimeRemaining(calculateTimeRemaining());

    return () => clearInterval(timer);
  }, [raceInfo, badgeType]);

  const deadline = formatDayAndTime(raceInfo?.dateDeadline);
  const race = formatDayAndTime(raceInfo?.dateRace);
  const dateRange = formatDateRange();
  return (
    <Card
      h={showNextRaceHeader ? 235 : 200}
      w={{ base: "100%", sm: "80%" }}
      shadow="md"
      className={styles[`card-hover`]}
      // p="lg"
      my="md"
      withBorder
      radius={"lg"}
      style={image ? { backgroundImage: `url(${image})` } : {}}
    >
      <Overlay className={styles.overlay} opacity={computedColorScheme === "light" ? 0.8 : 0.6} zIndex={0} />
      <div className={styles.content}>
        {showNextRaceHeader && (
          <Card.Section bg="var(--mantine-color-f1-red-4)" py={5}>
            <Title mx="md" order={5}>
              Next race
            </Title>
          </Card.Section>
        )}
        <Flex direction={{ base: "column", xs: "row" }} gap="5px" wrap="wrap" pt={showNextRaceHeader ? "md" : 0}>
          <Flex justify="space-between" align="center" w="100%">
            <Group gap="xs">
              <Image style={{ border: "1px solid white", borderRadius: "5px" }} src={flag} alt="logo" width={30} height={30} />
              <Text>{dateRange}</Text>
            </Group>

            <div>
              {badgeType === "ongoing" && (
                <Badge w={90} bg="green">
                  Ongoing
                </Badge>
              )}
              {badgeType === "upcoming" && <Badge w={90}>Next</Badge>}
              {badgeType === "finished" && (
                <Badge w={90} bg="var(--mantine-color-dimmed)">
                  Finished
                </Badge>
              )}
            </div>
          </Flex>

          <Group w="100%" gap="xs">
            <Title order={3}>{raceTitle}</Title>
            {isSprint && <Badge>Sprint</Badge>}
          </Group>
        </Flex>

        <Flex justify="space-between" px={{ base: 0, xs: "lg" }} pt="0" direction="column">
          <Flex justify="space-between">
            <Text>Deadline</Text>
            <Text>{`${deadline.day} ${deadline.time}`}</Text>
          </Flex>
          <Flex justify="space-between">
            <Text>Race</Text>
            <Text>{`${race.day} ${race.time}`}</Text>
          </Flex>
          <Flex justify="space-between">
            <Text>Length</Text>
            <Text>{raceInfo.length} m</Text>
          </Flex>
          <Flex justify="space-between">
            <Text fz="lg" style={{ fontWeight: "bold" }}>
              Remaining
            </Text>
            <Text fz="lg" style={{ fontWeight: "bold" }}>
              {badgeType === "ongoing" || badgeType === "finished" ? "Bets closed" : timeRemaining}
            </Text>
          </Flex>
        </Flex>
      </div>
    </Card>
  );
};

export default RaceCard;
