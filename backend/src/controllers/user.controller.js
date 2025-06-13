import User from "../models/user.model";
import bcrypt from "bcrypt";
import crypto from "crypto";

// Create (C)
export const createUser = async (req, res) => {
  try {
    const { username } = req.body;
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

    // tworzenie nowego użytkownika
    const newUser = new User({
      username,
      password: hashedPassword,
      email: `temp_${username}@temp.com`,
      registrationToken,
      tokenExpiryTime,
      isRegistered: false,
      isVerified: false,
      role: "user",
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
      message: "Rejestracja zakończona pomyślnie",
      userId: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Read (R)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -registrationToken -tokenExpiryTime").exec();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
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
      .select("-password -registrationToken -tokenExpiryTime -bets")
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
