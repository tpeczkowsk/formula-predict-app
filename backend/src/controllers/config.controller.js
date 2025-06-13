import Config from "../models/config.model.js";

// Create - Utwórz nową konfigurację
export const createConfig = async (req, res) => {
  try {
    const { driverBetPoints, bonusBetPoints } = req.body;

    // Sprawdź, czy nie ma już konfiguracji (powinien być tylko jeden rekord)
    const existingConfig = await Config.findOne().exec();
    if (existingConfig) {
      return res.status(400).json({ message: "Konfiguracja już istnieje. Użyj metody UPDATE do modyfikacji." });
    }

    // Utwórz nową konfigurację
    const newConfig = await Config.create({
      driverBetPoints,
      bonusBetPoints,
    });

    res.status(201).json(newConfig);
  } catch (error) {
    res.status(500).json({ message: "Wystąpił błąd podczas tworzenia konfiguracji", error: error.message });
  }
};

// Read - Pobierz aktualną konfigurację
export const getConfig = async (req, res) => {
  try {
    // Pobierz pierwszą (i jedyną) konfigurację
    const config = await Config.findOne().exec();

    if (!config) {
      return res.status(404).json({ message: "Nie znaleziono konfiguracji. Utwórz ją najpierw." });
    }

    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: "Wystąpił błąd podczas pobierania konfiguracji", error: error.message });
  }
};

// Update - Zaktualizuj konfigurację
export const updateConfig = async (req, res) => {
  try {
    const { configId } = req.params;
    const updateData = req.body;

    // Przygotuj obiekt z aktualizacjami
    const updates = {};

    // Aktualizuj punkty dla zakładów kierowców
    if (updateData.driverBetPoints) {
      if (updateData.driverBetPoints.exactMatch !== undefined) {
        updates["driverBetPoints.exactMatch"] = updateData.driverBetPoints.exactMatch;
      }
      if (updateData.driverBetPoints.oneOff !== undefined) {
        updates["driverBetPoints.oneOff"] = updateData.driverBetPoints.oneOff;
      }
      if (updateData.driverBetPoints.twoOff !== undefined) {
        updates["driverBetPoints.twoOff"] = updateData.driverBetPoints.twoOff;
      }
    }

    // Aktualizuj punkty dla bonusowych zakładów
    if (updateData.bonusBetPoints) {
      if (updateData.bonusBetPoints.polePosition !== undefined) {
        updates["bonusBetPoints.polePosition"] = updateData.bonusBetPoints.polePosition;
      }
      if (updateData.bonusBetPoints.fastestLap !== undefined) {
        updates["bonusBetPoints.fastestLap"] = updateData.bonusBetPoints.fastestLap;
      }
      if (updateData.bonusBetPoints.driverOfTheDay !== undefined) {
        updates["bonusBetPoints.driverOfTheDay"] = updateData.bonusBetPoints.driverOfTheDay;
      }
      if (updateData.bonusBetPoints.noDNFs !== undefined) {
        updates["bonusBetPoints.noDNFs"] = updateData.bonusBetPoints.noDNFs;
      }
    }

    // Wykonaj aktualizację
    const updatedConfig = await Config.findByIdAndUpdate(configId, { $set: updates }, { new: true, runValidators: true }).exec();

    if (!updatedConfig) {
      return res.status(404).json({ message: "Nie znaleziono konfiguracji o podanym ID" });
    }

    res.status(200).json(updatedConfig);
  } catch (error) {
    res.status(500).json({ message: "Wystąpił błąd podczas aktualizacji konfiguracji", error: error.message });
  }
};

// Delete - Usuń konfigurację
export const deleteConfig = async (req, res) => {
  try {
    const { configId } = req.params;

    // Usuń konfigurację
    const deletedConfig = await Config.findByIdAndDelete(configId).exec();

    if (!deletedConfig) {
      return res.status(404).json({ message: "Nie znaleziono konfiguracji o podanym ID" });
    }

    res.status(200).json({ message: "Konfiguracja została pomyślnie usunięta", config: deletedConfig });
  } catch (error) {
    res.status(500).json({ message: "Wystąpił błąd podczas usuwania konfiguracji", error: error.message });
  }
};

// Przywróć domyślne ustawienia
export const resetConfig = async (req, res) => {
  try {
    // Znajdź istniejącą konfigurację
    const existingConfig = await Config.findOne().exec();

    // Jeśli istnieje, usuń ją i utwórz nową z domyślnymi wartościami
    if (existingConfig) {
      await Config.deleteOne({ _id: existingConfig._id }).exec();
    }

    // Utwórz nową konfigurację z domyślnymi wartościami
    const defaultConfig = await Config.create({});

    res.status(200).json({ message: "Przywrócono domyślną konfigurację", config: defaultConfig });
  } catch (error) {
    res.status(500).json({ message: "Wystąpił błąd podczas resetowania konfiguracji", error: error.message });
  }
};
