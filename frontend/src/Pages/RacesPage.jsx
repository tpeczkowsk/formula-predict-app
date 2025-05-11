import { Center, Container, Flex, Group, Title } from "@mantine/core";
import RaceCard from "../Components/RaceCard";

const mockData = [
  {
    raceTitle: "Australia",
    isSprint: false,
    raceInfo: { dateRace: "2025-03-16T04:00Z", dateDeadline: "2025-03-15T04:00Z", length: "5303" },
    status: "finished",
    flag: "/flags/australia-flag.png",
    image: "/tracks/albert-park.jpg",
  },
  {
    raceTitle: "China",
    isSprint: true,
    raceInfo: { dateRace: "2025-03-22T03:00Z", dateDeadline: "2025-03-21T06:30Z", length: "5451" },
    status: "later",
    flag: "/flags/china-flag.png",
    image: "/tracks/shanghai.jpg",
  },
  {
    raceTitle: "China",
    isSprint: false,
    raceInfo: { dateRace: "2025-03-23T07:00Z", dateDeadline: "2025-03-22T06:00Z", length: "5451" },
    status: "later",
    flag: "/flags/china-flag.png",
    image: "/tracks/shanghai.jpg",
  },
  {
    raceTitle: "Japan",
    isSprint: false,
    raceInfo: { dateRace: "2025-04-06T05:00Z", dateDeadline: "2025-04-05T05:00Z", length: "5807" },
    status: "later",
    flag: "/flags/japan-flag.png",
    image: "/tracks/albert-park.jpg",
  },
  {
    raceTitle: "Bahrain",
    isSprint: false,
    raceInfo: { dateRace: "2025-04-13T15:00Z", dateDeadline: "2025-04-12T15:00Z", length: "5412" },
    status: "upcoming",
    flag: "/flags/bahrain-flag.png",
    image: "/tracks/albert-park.jpg",
  },
  {
    raceTitle: "Saudi Arabia",
    isSprint: false,
    raceInfo: { dateRace: "2025-04-20T17:00Z", dateDeadline: "2025-04-19T16:00Z", length: "5412" },
    status: "upcoming",
    flag: "/flags/saudi-arabia-flag.png",
    image: "/tracks/albert-park.jpg",
  },
  {
    raceTitle: "Miami",
    isSprint: true,
    raceInfo: { dateRace: "2025-04-13T15:00Z", dateDeadline: "2025-04-12T15:00Z", length: "5412" },
    status: "upcoming",
    flag: "/flags/united-states-flag.png",
    image: "/tracks/albert-park.jpg",
  },
  {
    raceTitle: "Miami",
    isSprint: false,
    raceInfo: { dateRace: "2025-04-13T15:00Z", dateDeadline: "2025-04-12T15:00Z", length: "5412" },
    status: "upcoming",
    flag: "/flags/united-states-flag.png",
    image: "/tracks/albert-park.jpg",
  },
  {
    raceTitle: "Emilia-Romagna",
    isSprint: false,
    raceInfo: { dateRace: "2025-06-22T05:00Z", dateDeadline: "2025-06-21T04:00Z", length: "5842" },
    status: "ongoing",
    flag: "/flags/italy-flag.png",
    image: "/tracks/albert-park.jpg",
  },
  {
    raceTitle: "Monaco",
    isSprint: false,
    raceInfo: { dateRace: "2025-05-25T05:00Z", dateDeadline: "2025-05-24T04:00Z", length: "3337" },
    status: "later",
    flag: "/flags/monaco-flag.png",
    image: "/tracks/albert-park.jpg",
  },
  {
    raceTitle: "Spain",
    isSprint: false,
    raceInfo: { dateRace: "2025-05-11T05:00Z", dateDeadline: "2025-05-10T04:00Z", length: "4655" },
    status: "later",
    flag: "/flags/spain-flag.png",
    image: "/tracks/albert-park.jpg",
  },
  {
    raceTitle: "Canada",
    isSprint: false,
    raceInfo: { dateRace: "2025-06-08T05:00Z", dateDeadline: "2025-06-07T04:00Z", length: "4361" },
    status: "later",
    flag: "/flags/canada-flag.png",
    image: "/tracks/albert-park.jpg",
  },

  {
    raceTitle: "Austria",
    isSprint: false,
    raceInfo: { dateRace: "2025-07-06T05:00Z", dateDeadline: "2025-07-05T04:00Z", length: "4318" },
    status: "later",
    flag: "/flags/austria-flag.png",
    image: "/tracks/Red-Bull-Ring.jpg",
  },
  {
    raceTitle: "United Kingdom",
    isSprint: false,
    raceInfo: { dateRace: "2025-07-20T05:00Z", dateDeadline: "2025-07-19T04:00Z", length: "5891" },
    status: "later",
    flag: "/flags/united-kingdom-flag.png",
    image: "/tracks/albert-park.jpg",
  },
  {
    raceTitle: "Belgium",
    isSprint: true,
    raceInfo: { dateRace: "2025-08-17T05:00Z", dateDeadline: "2025-08-16T04:00Z", length: "7004" },
    status: "later",
    flag: "/flags/belgium-flag.png",
    image: "/tracks/albert-park.jpg",
  },
  {
    raceTitle: "Belgium",
    isSprint: false,
    raceInfo: { dateRace: "2025-08-17T05:00Z", dateDeadline: "2025-08-16T04:00Z", length: "7004" },
    status: "later",
    flag: "/flags/belgium-flag.png",
    image: "/tracks/albert-park.jpg",
  },
  {
    raceTitle: "Hungary",
    isSprint: false,
    raceInfo: { dateRace: "2025-08-03T05:00Z", dateDeadline: "2025-08-02T04:00Z", length: "4381" },
    status: "later",
    flag: "/flags/hungary-flag.png",
    image: "/tracks/albert-park.jpg",
  },
  {
    raceTitle: "Netherlands",
    isSprint: false,
    raceInfo: { dateRace: "2025-08-31T05:00Z", dateDeadline: "2025-08-30T04:00Z", length: "4259" },
    status: "later",
    flag: "/flags/netherlands-flag.png",
    image: "/tracks/albert-park.jpg",
  },
  {
    raceTitle: "Italy",
    isSprint: false,
    raceInfo: { dateRace: "2025-09-14T05:00Z", dateDeadline: "2025-09-13T04:00Z", length: "5793" },
    status: "later",
    flag: "/flags/italy-flag.png",
    image: "/tracks/albert-park.jpg",
  },
  {
    raceTitle: "Azerbaijan",
    isSprint: false,
    raceInfo: { dateRace: "2025-04-20T05:00Z", dateDeadline: "2025-04-19T04:00Z", length: "6003" },
    status: "later",
    flag: "/flags/azerbaijan-flag.png",
    image: "/tracks/albert-park.jpg",
  },
  {
    raceTitle: "Singapore",
    isSprint: false,
    raceInfo: { dateRace: "2025-09-28T05:00Z", dateDeadline: "2025-09-27T04:00Z", length: "5063" },
    status: "later",
    flag: "/flags/singapore-flag.png",
    image: "/tracks/albert-park.jpg",
  },
  {
    raceTitle: "United States",
    isSprint: true,
    raceInfo: { dateRace: "2025-10-26T05:00Z", dateDeadline: "2025-10-25T04:00Z", length: "5513" },
    status: "later",
    flag: "/flags/united-states-flag.png",
    image: "/tracks/albert-park.jpg",
  },
  {
    raceTitle: "United States",
    isSprint: false,
    raceInfo: { dateRace: "2025-10-26T05:00Z", dateDeadline: "2025-10-25T04:00Z", length: "5513" },
    status: "later",
    flag: "/flags/united-states-flag.png",
    image: "/tracks/albert-park.jpg",
  },
  {
    raceTitle: "Mexico",
    isSprint: false,
    raceInfo: { dateRace: "2025-11-09T05:00Z", dateDeadline: "2025-11-08T04:00Z", length: "4304" },
    status: "later",
    flag: "/flags/mexico-flag.png",
    image: "/tracks/albert-park.jpg",
  },
  {
    raceTitle: "Brazil",
    isSprint: true,
    raceInfo: { dateRace: "2025-11-23T05:00Z", dateDeadline: "2025-11-22T04:00Z", length: "4309" },
    status: "later",
    flag: "/flags/brazil-flag.png",
    image: "/tracks/albert-park.jpg",
  },
  {
    raceTitle: "Brazil",
    isSprint: false,
    raceInfo: { dateRace: "2025-11-23T05:00Z", dateDeadline: "2025-11-22T04:00Z", length: "4309" },
    status: "later",
    flag: "/flags/brazil-flag.png",
    image: "/tracks/albert-park.jpg",
  },
  {
    raceTitle: "Las Vegas",
    isSprint: false,
    raceInfo: { dateRace: "2025-10-26T05:00Z", dateDeadline: "2025-10-25T04:00Z", length: "5513" },
    status: "later",
    flag: "/flags/united-states-flag.png",
    image: "/tracks/albert-park.jpg",
  },
  {
    raceTitle: "Qatar",
    isSprint: true,
    raceInfo: { dateRace: "2025-10-26T05:00Z", dateDeadline: "2025-10-25T04:00Z", length: "5513" },
    status: "later",
    flag: "/flags/qatar-flag.png",
    image: "/tracks/albert-park.jpg",
  },
  {
    raceTitle: "Qatar",
    isSprint: false,
    raceInfo: { dateRace: "2025-10-26T05:00Z", dateDeadline: "2025-10-25T04:00Z", length: "5513" },
    status: "later",
    flag: "/flags/qatar-flag.png",
    image: "/tracks/albert-park.jpg",
  },
  {
    raceTitle: "Abu Dhabi",
    isSprint: false,
    raceInfo: { dateRace: "2025-12-07T05:00Z", dateDeadline: "2025-12-06T04:00Z", length: "5554" },
    status: "later",
    flag: "/flags/united-arab-emirates-flag.png",
    image: "/tracks/albert-park.jpg",
  },
];
const RacesPage = () => {
  return (
    <Container maw={{ base: "100%", sm: 600, md: 800 }} p={{ base: "sm", md: "md" }}>
      <Center>
        <Flex align="center" w={"100%"} direction="column" gap="md">
          <RaceCard
            raceTitle={mockData[0].raceTitle}
            raceInfo={mockData[0].raceInfo}
            badgeType={"later"}
            showNextRaceHeader={true}
            flag={"/flags/australia-flag.png"}
            image="/tracks/Red-Bull-Ring.jpg"
          />
          <Group justify="start">
            <Title order={3} mt="2rem">
              Calendar
            </Title>
          </Group>
          {mockData.map((gp, idx) => (
            <RaceCard
              key={idx}
              raceInfo={gp.raceInfo}
              raceTitle={gp.raceTitle}
              badgeType={gp.status}
              showNextRaceHeader={false}
              flag={gp.flag}
              image={gp.image}
              isSprint={gp.isSprint}
            />
          ))}
        </Flex>
      </Center>
    </Container>
  );
};

export default RacesPage;
