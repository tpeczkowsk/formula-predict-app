import Race from "../models/race.model.js";
import User from "../models/user.model.js";
import Config from "../models/config.model.js";
import mongoose from "mongoose";

// Create (C) - utworzenie nowego wyścigu
export const createRace = async (req, res) => {
  try {
    const { name, date, betDeadline, season, isSprint, countryName, flagFileName } = req.body;

    // Sprawdź, czy wszystkie wymagane pola są podane
    if (!name || !date || !betDeadline || !season || !countryName || !flagFileName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Sprawdź, czy data deadline'u jest przed datą wyścigu
    if (new Date(betDeadline) > new Date(date)) {
      return res.status(400).json({ message: "Deadline must be before race date" });
    }

    const newRace = await Race.create({
      name,
      date,
      betDeadline,
      season,
      countryName,
      flagFileName,
      isSprint: isSprint || false,
      status: "waiting",
    });

    res.status(201).json(newRace);
  } catch (error) {
    res.status(500).json({ message: "Error while creating race", error: error.message });
  }
};

// Read (R) - pobranie wszystkich wyścigów
export const getAllRaces = async (req, res) => {
  try {
    const races = await Race.find().sort({ date: 1 }).exec();
    res.status(200).json(races);
  } catch (error) {
    res.status(500).json({ message: "Error while getting races", error: error.message });
  }
};

// Read (R) - pobranie jednego wyścigu po ID
export const getRaceById = async (req, res) => {
  try {
    const { id } = req.params;

    const race = await Race.findById(id).exec();

    if (!race) {
      return res.status(404).json({ message: "Race not found" });
    }

    res.status(200).json(race);
  } catch (error) {
    res.status(500).json({ message: "Error while getting race", error: error.message });
  }
};

// Update (U) - aktualizacja wyścigu
export const updateRace = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Przygotuj dane do aktualizacji
    const updates = {};

    // Podstawowe pola
    if (updateData.name !== undefined) updates.name = updateData.name;
    if (updateData.date !== undefined) updates.date = updateData.date;
    if (updateData.betDeadline !== undefined) updates.betDeadline = updateData.betDeadline;
    if (updateData.season !== undefined) updates.season = updateData.season;
    if (updateData.isSprint !== undefined) updates.isSprint = updateData.isSprint;
    if (updateData.status !== undefined) updates.status = updateData.status;
    if (updateData.countryName !== undefined) updates.countryName = updateData.countryName;
    if (updateData.flagFileName !== undefined) updates.flagFileName = updateData.flagFileName;

    // Wyniki kierowców
    if (updateData.driverResults) {
      // Przetwarzaj każdy wynik kierowcy, jeśli istnieje
      const positions = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10", "p11", "p12"];
      positions.forEach((pos) => {
        if (updateData.driverResults[pos] !== undefined) {
          updates[`driverResults.${pos}`] = updateData.driverResults[pos];
        }
      });
    }

    // Wyniki bonusowe
    if (updateData.bonusResults) {
      if (updateData.bonusResults.polePosition !== undefined) {
        updates["bonusResults.polePosition"] = updateData.bonusResults.polePosition;
      }
      if (updateData.bonusResults.fastestLap !== undefined) {
        updates["bonusResults.fastestLap"] = updateData.bonusResults.fastestLap;
      }
      if (updateData.bonusResults.driverOfTheDay !== undefined) {
        updates["bonusResults.driverOfTheDay"] = updateData.bonusResults.driverOfTheDay;
      }
      if (updateData.bonusResults.noDNFs !== undefined) {
        updates["bonusResults.noDNFs"] = updateData.bonusResults.noDNFs;
      }
    }

    // Jeżeli aktualizujemy na status "finished", sprawdź czy wszystkie wyniki są uzupełnione
    if (updateData.status === "finished") {
      const race = await Race.findById(id).exec();
      if (!race) {
        return res.status(404).json({ message: "Race not found" });
      }

      // Sprawdź wyniki główne dla top 10
      const driverResults = { ...race.driverResults, ...updateData.driverResults };
      for (let i = 1; i <= 10; i++) {
        const pos = `p${i}`;
        if (!driverResults[pos]) {
          return res.status(400).json({ message: `Missing driver for pos ${pos}` });
        }
      }

      // Sprawdź wyniki bonusowe
      const bonusResults = { ...race.bonusResults, ...updateData.bonusResults };
      const requiredBonusFields = ["polePosition", "fastestLap", "driverOfTheDay", "noDNFs"];
      for (const field of requiredBonusFields) {
        if (bonusResults[field] === undefined) {
          return res.status(400).json({ message: `Missing bonus field: ${field}` });
        }
      }
    }

    const updatedRace = await Race.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true }).exec();

    if (!updatedRace) {
      return res.status(404).json({ message: "Race not found" });
    }

    // Jeżeli wyścig został zakończony (status = finished), oblicz punkty dla wszystkich zakładów
    if (updatedRace.status === "finished") {
      // Pobierz konfigurację punktacji z bazy danych
      const config = await Config.findOne().exec();
      if (!config) {
        return res.status(500).json({ message: "Config not found" });
      }

      // Znajdź wszystkich użytkowników z zakładami dla tego wyścigu
      const usersWithBets = await User.find({ "bets.race": id }).exec();

      // Dla każdego użytkownika oblicz punkty
      for (const user of usersWithBets) {
        // Znajdź zakład dla tego wyścigu
        const betIndex = user.bets.findIndex((bet) => bet.race.toString() === id);
        if (betIndex === -1) continue; // Jeśli nie znaleziono zakładu, przejdź do następnego użytkownika

        const bet = user.bets[betIndex];
        let totalPoints = 0;

        // 1. Oblicz punkty za pozycje kierowców
        for (let i = 1; i <= 10; i++) {
          const position = `p${i}`;
          const predictedDriver = bet.driverBets[position];
          if (!predictedDriver) continue;

          // Znajdź pozycję tego kierowcy w rzeczywistych wynikach
          let actualPosition = null;
          for (let j = 1; j <= 12; j++) {
            const pos = `p${j}`;
            if (updatedRace.driverResults[pos] === predictedDriver) {
              actualPosition = j;
              break;
            }
          }

          // Przyznaj punkty na podstawie różnicy między przewidywaną a rzeczywistą pozycją
          if (actualPosition !== null) {
            const difference = Math.abs(i - actualPosition);
            if (difference === 0) {
              // Dokładne trafienie
              totalPoints += config.driverBetPoints.exactMatch;
            } else if (difference === 1) {
              // Różnica jednej pozycji
              totalPoints += config.driverBetPoints.oneOff;
            } else if (difference === 2) {
              // Różnica dwóch pozycji
              totalPoints += config.driverBetPoints.twoOff;
            }
          }
        }

        // 2. Oblicz punkty za zakłady bonusowe
        // Pole Position
        if (bet.bonusBets.polePosition === updatedRace.bonusResults.polePosition) {
          totalPoints += config.bonusBetPoints.polePosition;
        }

        // Najszybsze okrążenie
        if (bet.bonusBets.fastestLap === updatedRace.bonusResults.fastestLap) {
          totalPoints += config.bonusBetPoints.fastestLap;
        }

        // Kierowca dnia
        if (bet.bonusBets.driverOfTheDay === updatedRace.bonusResults.driverOfTheDay) {
          totalPoints += config.bonusBetPoints.driverOfTheDay;
        }

        // Brak DNF
        if (bet.bonusBets.noDNFs === updatedRace.bonusResults.noDNFs) {
          totalPoints += config.bonusBetPoints.noDNFs;
        }

        // Zaktualizuj status zakładu i przyznane punkty
        user.bets[betIndex].status = "finished";
        user.bets[betIndex].awardedPoints = totalPoints;

        // Zaktualizuj sumę punktów użytkownika
        user.pointsSum = user.bets.reduce((sum, bet) => sum + bet.awardedPoints, 0);

        // Zapisz zmiany
        await user.save();
      }
    }

    res.status(200).json(updatedRace);
  } catch (error) {
    res.status(500).json({ message: "Error while updating race", error: error.message });
  }
};

// Delete (D) - usunięcie wyścigu
export const deleteRace = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRace = await Race.findByIdAndDelete(id).exec();

    if (!deletedRace) {
      return res.status(404).json({ message: "Race not found" });
    }

    res.status(200).json({ message: "Race deleted successfully", race: deletedRace });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting race", error: error.message });
  }
};

// Dodatkowe metody

// Pobierz nadchodzące wyścigi
export const getUpcomingRaces = async (req, res) => {
  try {
    const now = new Date();
    const races = await Race.find({
      date: { $gt: now },
      status: { $in: ["waiting", "in progress"] },
    })
      .sort({ date: 1 })
      .exec();

    res.status(200).json(races);
  } catch (error) {
    res.status(500).json({ message: "Error while getting upcoming races", error: error.message });
  }
};

// Pobierz wyścigi z danego sezonu
export const getRacesBySeason = async (req, res) => {
  try {
    const { season } = req.params;

    const races = await Race.find({ season: parseInt(season) })
      .sort({ date: 1 })
      .exec();

    res.status(200).json(races);
  } catch (error) {
    res.status(500).json({ message: "Error while getting race for season", error: error.message });
  }
};

// Pobierz tablicę liderów dla konkretnego wyścigu
export const getRaceLeaderboard = async (req, res) => {
  try {
    const { raceId } = req.params;

    // Sprawdź czy ID jest prawidłowym ObjectId
    if (!mongoose.Types.ObjectId.isValid(raceId)) {
      return res.status(400).json({ message: "Invalid race ID" });
    }

    // Sprawdź czy wyścig istnieje
    const race = await Race.findById(raceId).exec();
    if (!race) {
      return res.status(404).json({ message: "Race not found" });
    }

    // Konwertuj raceId na ObjectId przed użyciem w agregacji
    const objectIdRaceId = new mongoose.Types.ObjectId(raceId);

    const leaderboard = await User.aggregate([
      // Rozwiń tablicę zakładów
      { $unwind: "$bets" },
      // Filtruj tylko zakłady dla danego wyścigu
      { $match: { "bets.race": objectIdRaceId } },
      // Wybierz potrzebne pola
      {
        $project: {
          username: 1,
          points: "$bets.awardedPoints",
          betId: "$bets._id",
        },
      },
      // Posortuj malejąco wg punktów
      {
        $sort: {
          points: -1,
          username: 1,
        },
      },
    ]).exec();

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Error while getting race leaderboards", error: error.message });
  }
};

// Pobierz dashboard dla użytkownika i wyścigu
export const getUserRaceDashboard = async (req, res) => {
  try {
    const { userId, raceId } = req.params;

    // Sprawdź czy ID są prawidłowymi ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(raceId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    // Pobierz dane wyścigu
    const race = await Race.findById(raceId).exec();
    if (!race) {
      return res.status(404).json({ message: "Race not found" });
    }

    // Pobierz zakład użytkownika dla tego wyścigu (jeśli istnieje)
    const user = await User.findOne({ _id: userId, "bets.race": raceId }, { "bets.$": 1, username: 1 }).exec();

    // Przygotuj odpowiedź
    const dashboard = {
      race: race,
      user: {
        id: userId,
        username: user ? user.username : null,
      },
      bet: user && user.bets && user.bets.length > 0 ? user.bets[0] : null,
    };

    res.status(200).json(dashboard);
  } catch (error) {
    res.status(500).json({ message: "Error while getting race dashboard", error: error.message });
  }
};
