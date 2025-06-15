import Driver from "../models/driver.model.js";

// Create (C)
export const createDriver = async (req, res) => {
  try {
    const { fullname, teamName, isActive } = req.body;

    if (!fullname || !teamName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newDriver = await Driver.create({
      fullname,
      teamName,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json(newDriver);
  } catch (error) {
    res.status(500).json({ message: "Error while creating driver", error: error.message });
  }
};

// Read (R)
// Read (R)
export const getAllDrivers = async (req, res) => {
  try {
    // Sprawdzamy czy w zapytaniu jest parametr isActive
    const { isActive } = req.query;

    let query = {};

    // Jeśli parametr isActive ma wartość "true", dodajemy warunek do zapytania
    if (isActive === "true") {
      query.isActive = true;
    }

    // Wykonujemy zapytanie z opcjonalnym filtrem
    const drivers = await Driver.find(query).exec();

    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: "Error while fetching drivers", error: error.message });
  }
};

// Update (U)
export const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, teamName, isActive } = req.body;

    const updatedDriver = await Driver.findByIdAndUpdate(id, { fullname, teamName, isActive }, { new: true, runValidators: true }).exec();

    if (!updatedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json(updatedDriver);
  } catch (error) {
    res.status(500).json({ message: "Error while updating driver", error: error.message });
  }
};

// Delete (D)
export const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDriver = await Driver.findByIdAndDelete(id).exec();

    if (!deletedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({ message: "Driver deleted successfully", driver: deletedDriver });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting driver", error: error.message });
  }
};
