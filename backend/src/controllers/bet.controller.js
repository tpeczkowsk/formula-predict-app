import User from "../models/user.model.js";
import mongoose from "mongoose";

// Create - utworzenie zakładu dla danego użytkownika i wyścigu
export const createBet = async (req, res) => {
  try {
    const { userId, raceId, raceName, season, driverBets, bonusBets } = req.body;

    // Sprawdź, czy wszystkie wymagane pola są podane
    if (!userId || !raceId || !raceName || !season || !driverBets || !bonusBets) {
      return res.status(400).json({ message: "Wszystkie pola są wymagane" });
    }

    // Sprawdź, czy wszystkie wymagane pola driverBets są podane
    const requiredDriverPositions = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
    for (const position of requiredDriverPositions) {
      if (!driverBets[position]) {
        return res.status(400).json({ message: `Kierowca na pozycji ${position} jest wymagany` });
      }
    }

    // Sprawdź, czy wszystkie wymagane pola bonusBets są podane
    const requiredBonusFields = ["polePosition", "fastestLap", "driverOfTheDay", "noDNFs"];
    for (const field of requiredBonusFields) {
      if (bonusBets[field] === undefined) {
        return res.status(400).json({ message: `Pole ${field} jest wymagane` });
      }
    }

    // Sprawdź, czy użytkownik istnieje i czy nie ma już zakładu na ten wyścig
    const existingBet = await User.findOne({ _id: userId, "bets.race": raceId }, { "bets.$": 1 }).exec();

    if (existingBet) {
      return res.status(400).json({ message: "Zakład dla tego wyścigu już istnieje" });
    }

    // Utwórz nowy zakład bezpośrednio w dokumencie użytkownika
    const newBet = {
      race: raceId,
      raceName,
      season,
      driverBets,
      bonusBets,
      status: "pending",
      awardedPoints: 0,
    };

    // Dodaj zakład do użytkownika
    const result = await User.findByIdAndUpdate(userId, { $push: { bets: newBet } }, { new: true, runValidators: true }).exec();

    if (!result) {
      return res.status(404).json({ message: "Użytkownik nie został znaleziony" });
    }

    // Znajdź dodany zakład (ostatni w tablicy)
    const addedBet = result.bets[result.bets.length - 1];

    res.status(201).json(addedBet);
  } catch (error) {
    res.status(500).json({ message: "Wystąpił błąd podczas tworzenia zakładu", error: error.message });
  }
};

// Read - odczytanie zakładu użytkownika
export const getBetById = async (req, res) => {
  try {
    const { userId, betId } = req.params;

    // Sprawdź, czy ID jest prawidłowym obiektem ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(betId)) {
      return res.status(400).json({ message: "Nieprawidłowy format ID" });
    }

    // Używaj zapytania findOne zamiast agregacji
    const result = await User.findOne({ _id: userId, "bets._id": betId }, { "bets.$": 1 }).exec();

    if (!result || !result.bets || result.bets.length === 0) {
      return res.status(404).json({ message: "Zakład nie został znaleziony" });
    }

    res.status(200).json(result.bets[0]);
  } catch (error) {
    res.status(500).json({ message: "Wystąpił błąd podczas pobierania zakładu", error: error.message });
  }
};

// Update - aktualizacja zakładu dla użytkownika
export const updateBet = async (req, res) => {
  try {
    const { userId, betId } = req.params;
    const updateData = req.body;

    // Sprawdź, czy ID jest prawidłowym obiektem ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(betId)) {
      return res.status(400).json({ message: "Nieprawidłowy format ID" });
    }

    // Najpierw sprawdź, czy zakład ma status "finished"
    const existingBet = await User.findOne({ _id: userId, "bets._id": betId }, { "bets.$": 1 }).exec();

    if (!existingBet) {
      return res.status(404).json({ message: "Zakład nie został znaleziony" });
    }

    if (existingBet.bets[0].status === "finished") {
      return res.status(400).json({ message: "Nie można zaktualizować zakończonego zakładu" });
    }

    // Przygotuj obiekt z aktualizacjami
    const updates = {};

    if (updateData.driverBets) {
      Object.keys(updateData.driverBets).forEach((key) => {
        updates[`bets.$.driverBets.${key}`] = updateData.driverBets[key];
      });
    }

    if (updateData.bonusBets) {
      Object.keys(updateData.bonusBets).forEach((key) => {
        updates[`bets.$.bonusBets.${key}`] = updateData.bonusBets[key];
      });
    }

    if (updateData.status) {
      updates["bets.$.status"] = updateData.status;
    }

    if (updateData.awardedPoints !== undefined) {
      updates["bets.$.awardedPoints"] = updateData.awardedPoints;
    }

    // Wykonaj aktualizację betu
    const result = await User.findOneAndUpdate({ _id: userId, "bets._id": betId }, { $set: updates }, { new: true, runValidators: true }).exec();

    if (!result) {
      return res.status(404).json({ message: "Nie udało się zaktualizować zakładu" });
    }

    // Znajdź zaktualizowany zakład
    const updatedBet = result.bets.id(betId);

    res.status(200).json(updatedBet);
  } catch (error) {
    res.status(500).json({ message: "Wystąpił błąd podczas aktualizacji zakładu", error: error.message });
  }
};

// Delete - usunięcie zakładu użytkownika
export const deleteBet = async (req, res) => {
  try {
    const { userId, betId } = req.params;

    // Sprawdź, czy ID jest prawidłowym obiektem ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(betId)) {
      return res.status(400).json({ message: "Nieprawidłowy format ID" });
    }

    // Usuń zakład uzytkownika
    const result = await User.findByIdAndUpdate(userId, { $pull: { bets: { _id: betId } } }, { new: true }).exec();

    if (!result) {
      return res.status(404).json({ message: "Użytkownik nie został znaleziony" });
    }

    res.status(200).json({ message: "Zakład został pomyślnie usunięty" });
  } catch (error) {
    res.status(500).json({ message: "Wystąpił błąd podczas usuwania zakładu", error: error.message });
  }
};

// Pobierz wszystkie zakłady użytkownika
export const getAllUserBets = async (req, res) => {
  try {
    const { userId } = req.params;

    // Sprawdź, czy ID jest prawidłowym obiektem ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Nieprawidłowy format ID użytkownika" });
    }

    // Używaj projekcji do pobrania tylko zakładów zamiast całego dokumentu użytkownika
    const result = await User.findById(userId, { bets: 1, _id: 0 }).exec();

    if (!result) {
      return res.status(404).json({ message: "Użytkownik nie został znaleziony" });
    }

    res.status(200).json(result.bets);
  } catch (error) {
    res.status(500).json({ message: "Wystąpił błąd podczas pobierania zakładów", error: error.message });
  }
};
