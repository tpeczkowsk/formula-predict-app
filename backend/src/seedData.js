import mongoose from "mongoose";
import dotenv from "dotenv";
import Driver from "./models/driver.model.js";
import Race from "./models/race.model.js";
import Config from "./models/config.model.js";

// Załaduj zmienne środowiskowe
dotenv.config();

// Dane aktualnych kierowców F1 (sezon 2023)
const drivers = [
  { fullname: "Max Verstappen", teamName: "Red Bull Racing", isActive: true },
  { fullname: "Sergio Perez", teamName: "Red Bull Racing", isActive: true },
  { fullname: "Lewis Hamilton", teamName: "Mercedes", isActive: true },
  { fullname: "George Russell", teamName: "Mercedes", isActive: true },
  { fullname: "Charles Leclerc", teamName: "Ferrari", isActive: true },
  { fullname: "Carlos Sainz", teamName: "Ferrari", isActive: true },
  { fullname: "Lando Norris", teamName: "McLaren", isActive: true },
  { fullname: "Oscar Piastri", teamName: "McLaren", isActive: true },
  { fullname: "Fernando Alonso", teamName: "Aston Martin", isActive: true },
  { fullname: "Lance Stroll", teamName: "Aston Martin", isActive: true },
  { fullname: "Pierre Gasly", teamName: "Alpine", isActive: true },
  { fullname: "Esteban Ocon", teamName: "Alpine", isActive: true },
  { fullname: "Daniel Ricciardo", teamName: "RB", isActive: true },
  { fullname: "Yuki Tsunoda", teamName: "RB", isActive: true },
  { fullname: "Nico Hulkenberg", teamName: "Haas", isActive: true },
  { fullname: "Kevin Magnussen", teamName: "Haas", isActive: true },
  { fullname: "Valtteri Bottas", teamName: "Kick Sauber", isActive: true },
  { fullname: "Zhou Guanyu", teamName: "Kick Sauber", isActive: true },
  { fullname: "Alexander Albon", teamName: "Williams", isActive: true },
  { fullname: "Logan Sargeant", teamName: "Williams", isActive: true },
];

// Kalendarz wyścigów F1 na sezon 2023
// Kalendarz wyścigów F1 na sezon 2023
const races = [
  {
    name: "Bahrain Grand Prix",
    date: new Date("2023-03-02T15:00:00.000Z"),
    betDeadline: new Date("2023-03-01T23:59:59.000Z"),
    status: "finished",
    season: 2023,
    isSprint: false,
    flagFileName: "bahrain-flag.png",
    countryName: "Bahrain",
  },
  {
    name: "Saudi Arabian Grand Prix",
    date: new Date("2023-03-16T17:00:00.000Z"),
    betDeadline: new Date("2023-03-15T23:59:59.000Z"),
    status: "finished",
    season: 2023,
    isSprint: false,
    flagFileName: "saudi-arabia-flag.png",
    countryName: "Saudi Arabia",
  },
  {
    name: "Australian Grand Prix",
    date: new Date("2023-03-30T06:00:00.000Z"),
    betDeadline: new Date("2023-03-29T23:59:59.000Z"),
    status: "finished",
    season: 2023,
    isSprint: false,
    flagFileName: "australia-flag.png",
    countryName: "Australia",
  },
  {
    name: "Azerbaijan Grand Prix",
    date: new Date("2023-04-27T12:00:00.000Z"),
    betDeadline: new Date("2023-04-26T23:59:59.000Z"),
    status: "finished",
    season: 2023,
    isSprint: false,
    flagFileName: "azerbaijan-flag.png",
    countryName: "Azerbaijan",
  },
  {
    name: "Miami Grand Prix",
    date: new Date("2023-05-05T20:00:00.000Z"),
    betDeadline: new Date("2023-05-04T23:59:59.000Z"),
    status: "finished",
    season: 2023,
    isSprint: true,
    flagFileName: "usa-flag.png",
    countryName: "USA",
  },
  {
    name: "Emilia Romagna Grand Prix",
    date: new Date("2023-05-18T14:00:00.000Z"),
    betDeadline: new Date("2023-05-17T23:59:59.000Z"),
    status: "finished",
    season: 2023,
    isSprint: false,
    flagFileName: "italy-flag.png",
    countryName: "Italy",
  },
  {
    name: "Monaco Grand Prix",
    date: new Date("2023-05-25T14:00:00.000Z"),
    betDeadline: new Date("2023-05-24T23:59:59.000Z"),
    status: "finished",
    season: 2023,
    isSprint: false,
    flagFileName: "monaco-flag.png",
    countryName: "Monaco",
  },
  {
    name: "Canadian Grand Prix",
    date: new Date("2023-06-08T19:00:00.000Z"),
    betDeadline: new Date("2023-06-07T23:59:59.000Z"),
    status: "finished",
    season: 2023,
    isSprint: false,
    flagFileName: "canada-flag.png",
    countryName: "Canada",
  },
  {
    name: "Spanish Grand Prix",
    date: new Date("2023-06-22T14:00:00.000Z"),
    betDeadline: new Date("2023-06-21T23:59:59.000Z"),
    status: "finished",
    season: 2023,
    isSprint: false,
    flagFileName: "spain-flag.png",
    countryName: "Spain",
  },
  {
    name: "Austrian Grand Prix",
    date: new Date("2023-06-29T14:00:00.000Z"),
    betDeadline: new Date("2023-06-28T23:59:59.000Z"),
    status: "finished",
    season: 2023,
    isSprint: true,
    flagFileName: "austria-flag.png",
    countryName: "Austria",
  },
  {
    name: "British Grand Prix",
    date: new Date("2023-07-06T15:00:00.000Z"),
    betDeadline: new Date("2023-07-05T23:59:59.000Z"),
    status: "finished",
    season: 2023,
    isSprint: false,
    flagFileName: "uk-flag.png",
    countryName: "United Kingdom",
  },
  {
    name: "Hungarian Grand Prix",
    date: new Date("2023-07-20T14:00:00.000Z"),
    betDeadline: new Date("2023-07-19T23:59:59.000Z"),
    status: "finished",
    season: 2023,
    isSprint: false,
    flagFileName: "hungary-flag.png",
    countryName: "Hungary",
  },
  {
    name: "Belgian Grand Prix",
    date: new Date("2023-07-27T14:00:00.000Z"),
    betDeadline: new Date("2023-07-26T23:59:59.000Z"),
    status: "finished",
    season: 2023,
    isSprint: false,
    flagFileName: "belgium-flag.png",
    countryName: "Belgium",
  },
  {
    name: "Dutch Grand Prix",
    date: new Date("2023-08-24T14:00:00.000Z"),
    betDeadline: new Date("2023-08-23T23:59:59.000Z"),
    status: "finished",
    season: 2023,
    isSprint: false,
    flagFileName: "netherlands-flag.png",
    countryName: "Netherlands",
  },
  {
    name: "Italian Grand Prix",
    date: new Date("2023-08-31T14:00:00.000Z"),
    betDeadline: new Date("2023-08-30T23:59:59.000Z"),
    status: "finished",
    season: 2023,
    isSprint: false,
    flagFileName: "italy-flag.png",
    countryName: "Italy",
  },
  {
    name: "Azerbaijan Grand Prix",
    date: new Date("2023-09-14T12:00:00.000Z"),
    betDeadline: new Date("2023-09-13T23:59:59.000Z"),
    status: "finished",
    season: 2023,
    isSprint: false,
    flagFileName: "azerbaijan-flag.png",
    countryName: "Azerbaijan",
  },
  {
    name: "Singapore Grand Prix",
    date: new Date("2023-09-21T12:00:00.000Z"),
    betDeadline: new Date("2023-09-20T23:59:59.000Z"),
    status: "finished",
    season: 2023,
    isSprint: false,
    flagFileName: "singapore-flag.png",
    countryName: "Singapore",
  },
  {
    name: "United States Grand Prix",
    date: new Date("2023-10-19T19:00:00.000Z"),
    betDeadline: new Date("2023-10-18T23:59:59.000Z"),
    status: "finished",
    season: 2023,
    isSprint: true,
    flagFileName: "usa-flag.png",
    countryName: "USA",
  },
  {
    name: "Mexican Grand Prix",
    date: new Date("2023-10-26T20:00:00.000Z"),
    betDeadline: new Date("2023-10-25T23:59:59.000Z"),
    status: "finished",
    season: 2023,
    isSprint: false,
    flagFileName: "mexico-flag.png",
    countryName: "Mexico",
  },
  {
    name: "Brazilian Grand Prix",
    date: new Date("2023-11-02T18:00:00.000Z"),
    betDeadline: new Date("2023-11-01T23:59:59.000Z"),
    status: "finished",
    season: 2023,
    isSprint: true,
    flagFileName: "brazil-flag.png",
    countryName: "Brazil",
  },
  {
    name: "Las Vegas Grand Prix",
    date: new Date("2023-11-16T06:00:00.000Z"),
    betDeadline: new Date("2023-11-15T23:59:59.000Z"),
    status: "finished",
    season: 2023,
    isSprint: false,
    flagFileName: "usa-flag.png",
    countryName: "USA",
  },
  {
    name: "Qatar Grand Prix",
    date: new Date("2023-11-30T15:00:00.000Z"),
    betDeadline: new Date("2023-11-29T23:59:59.000Z"),
    status: "finished",
    season: 2023,
    isSprint: true,
    flagFileName: "qatar-flag.png",
    countryName: "Qatar",
  },
  {
    name: "Abu Dhabi Grand Prix",
    date: new Date("2023-12-07T14:00:00.000Z"),
    betDeadline: new Date("2023-12-06T23:59:59.000Z"),
    status: "finished",
    season: 2023,
    isSprint: false,
    flagFileName: "abu-dhabi-flag.png",
    countryName: "United Arab Emirates",
  },

  // Nadchodzące wyścigi F1 na sezon 2024
  {
    name: "Bahrain Grand Prix",
    date: new Date("2024-03-02T15:00:00.000Z"),
    betDeadline: new Date("2024-03-01T23:59:59.000Z"),
    status: "waiting",
    season: 2024,
    isSprint: false,
    flagFileName: "bahrain-flag.png",
    countryName: "Bahrain",
  },
  {
    name: "Saudi Arabian Grand Prix",
    date: new Date("2024-03-09T17:00:00.000Z"),
    betDeadline: new Date("2024-03-08T23:59:59.000Z"),
    status: "waiting",
    season: 2024,
    isSprint: false,
    flagFileName: "saudi-arabia-flag.png",
    countryName: "Saudi Arabia",
  },
  {
    name: "Australian Grand Prix",
    date: new Date("2024-03-24T06:00:00.000Z"),
    betDeadline: new Date("2024-03-23T23:59:59.000Z"),
    status: "waiting",
    season: 2024,
    isSprint: false,
    flagFileName: "australia-flag.png",
    countryName: "Australia",
  },
];

// Konfiguracja punktacji
const config = {
  driverBetPoints: {
    exactMatch: 5, // Dokładne trafienie pozycji
    oneOff: 3, // Trafienie o jedną pozycję obok
    twoOff: 1, // Trafienie o dwie pozycje obok
  },
  bonusBetPoints: {
    polePosition: 5, // Trafienie pole position
    fastestLap: 5, // Trafienie najszybszego okrążenia
    driverOfTheDay: 5, // Trafienie kierowcy dnia
    noDNFs: 5, // Trafienie braku DNF
  },
};

// Funkcja do połączenia z bazą danych
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/formula-predict");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Funkcja zasiewająca dane
const seedData = async () => {
  try {
    // Połącz z bazą danych
    const conn = await connectDB();

    // Dodaj kierowców
    const createdDrivers = await Driver.insertMany(drivers);
    console.log(`Dodano ${createdDrivers.length} kierowców`);

    // Dodaj wyścigi
    const createdRaces = await Race.insertMany(races);
    console.log(`Dodano ${createdRaces.length} wyścigów`);

    // Dodaj konfigurację
    const createdConfig = await Config.create(config);
    console.log("Dodano konfigurację punktacji");

    console.log("Pomyślnie zasiano dane!");

    // Zamknij połączenie z bazą danych
    await mongoose.disconnect();
    console.log("Zamknięto połączenie z bazą danych");

    process.exit(0);
  } catch (error) {
    console.error(`Błąd podczas zasilania bazy danych: ${error}`);
    process.exit(1);
  }
};

// Uruchom funkcję zasiewającą dane
seedData();
