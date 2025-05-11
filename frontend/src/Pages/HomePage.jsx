import { Center, Container, Divider, Title } from "@mantine/core";
import RaceCard from "../Components/RaceCard";
const HomePage = () => {
  return (
    <Container maw={{ base: "100%", sm: 600, md: 800 }} p={{ base: "xs", sm: "md" }}>
      <Title order={3}>Welcome Tomasz</Title>
      <Divider my="md" />
      <Center>
        <RaceCard
          raceTitle={"Polish Grand Prix"}
          raceInfo={"Race info"}
          badgeType={""}
          showNextRaceHeader={true}
          flag={"/australia.png"}
          image="/albert-park.jpg"
          isSprint={false}
        />
      </Center>
    </Container>
  );
};

export default HomePage;
