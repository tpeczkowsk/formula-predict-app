import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateToken } from "../lib/utils.js";

// Create (C)
export const createUser = async (req, res) => {
  try {
    const { username, role } = req.body;
    // sprawdzenie, czy nazwa użytkownika jest unikalna
    const existingUser = await User.findOne({ username }).exec();
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // generowanie tokena rejestracyjnego
    const registrationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // generowanie losowego hasła, aby uzupełnić schema
    const password = crypto.randomBytes(8).toString("hex");
    const hashedPassword = await bcrypt.hash(password, 10);

    // sprawdzenie poprawności roli (jeśli podana)
    const validRoles = ["user", "admin"];
    const userRole = role && validRoles.includes(role) ? role : "user";

    // tworzenie nowego użytkownika
    const newUser = new User({
      username,
      password: hashedPassword,
      email: `temp_${username}@temp.com`,
      registrationToken,
      tokenExpiryTime,
      isRegistered: false,
      isVerified: false,
      role: userRole,
      pointsSum: 0,
      bets: [],
    });

    // zapis do bazy danych
    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role,
        registrationToken: savedUser.registrationToken,
        tokenExpiryTime: savedUser.tokenExpiryTime,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, registrationToken } = req.body;

    // walidacja danych wejściowych
    if (!username || !email || !password || !registrationToken) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // znalezienie użytkownika po tokenie rejestracyjnym i nazwie
    const user = await User.findOne({ username, registrationToken, isRegistered: false }).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found or wrong token or already registered" });
    }

    // sprawdzenie tokenu
    if (user.tokenExpiryTime < new Date()) {
      return res.status(400).json({ message: "Registration token has expired" });
    }
    // sprawdzenie unikalności emaila
    const emailExists = await User.findOne({ email, _id: { $ne: user._id } }).exec();
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // haszowanie hasła
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // aktualizacja użytkownika
    user.email = email;
    user.password = hashedPassword;
    user.isRegistered = true;
    user.isVerified = true;
    user.registrationToken = undefined;
    user.tokenExpiryTime = undefined;

    // zapisanie aktualizacji do bazy danych
    await user.save();

    res.status(200).json({
      message: "Registration successful",
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      pointsSum: user.pointsSum,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Read (R)
export const getAllUsers = async (req, res) => {
  try {
    // znajdz wszystkich użytkowników
    const users = await User.find().select("-password -registrationToken -tokenExpiryTime -bets").exec();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    // znajdz pojedynczego użytkownika po ID
    const user = await User.findById(userId).select("-password -registrationToken -tokenExpiryTime").exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update (U)
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, role } = req.body;
    const updateData = { username, email, role };

    // czy podano nowe hasło
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.password, salt);
    }

    // filtrowanie pustych pól
    Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

    // aktualizacja użytkownika
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true })
      .select("-password -registrationToken -tokenExpiryTime")
      .exec();

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete (D)
export const deleteUser = async (req, res) => {
  try {
    // znalezienie i usunięcie użytkownika
    const deletedUser = await User.findByIdAndDelete(req.params.id).exec();
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", userId: deletedUser._id });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Pobierz tablicę liderów (wszyscy użytkownicy posortowani wg sumy punktów)
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.aggregate([
      // Filtruj tylko użytkowników z rolą "user"
      {
        $match: {
          role: "user", // Dodane filtrowanie - tylko użytkownicy z rolą "user"
        },
      },
      // Wybierz tylko potrzebne pola
      {
        $project: {
          username: 1,
          pointsSum: 1,
          role: 1, // Zachowujemy rolę na wszelki wypadek, gdyby była potrzebna na frontend
        },
      },
      // Posortuj malejąco wg punktów
      {
        $sort: {
          pointsSum: -1,
          username: 1, // W przypadku równych punktów, sortuj alfabetycznie
        },
      },
    ]).exec();

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Error while getting leaderboards", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      pointsSum: user.pointsSum,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in user logout: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checking auth: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
