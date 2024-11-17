const ROLES = {
  USER: "user",
  ADMIN: "admin",
};

const MESSAGES = {
  EXISTING_USER: "Username and email already exists! please login",
  SERVER_ERROR: "Internale server error during resgisteration",
  SUCCESS: (role) => `Sucessfully registered as ${role}`,
};

import zod from "zod";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// * ZOD Schemas
const usernameSchema = zod.string().min(3);
const emailSchema = zod.string().email();
const passSchema = zod.string().min(8);

//TODO: Remove the redendency in userand admin registration functions

// * Helper functipon
const userExist = async (username, email) => {
  try {
    const user = await User.findOne({
      $or: [{ email }, { username }],
    });
    return user;
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw new Error("Error checking user existence");
  }
};

const ValidateInputs = (username, password, email, res) => {
  const usernameCheck = usernameSchema.safeParse(username);
  const passwordCheck = passSchema.safeParse(password);
  const emailCheck = emailSchema.safeParse(email);
  if (!usernameCheck.success || !passwordCheck.success || !emailCheck.success) {
    res.json({
      username: usernameCheck.error,
      password: passwordCheck.error,
      email: emailCheck.error,
    });
  } else if (!usernameCheck.success) {
    res.json({ error: usernameCheck.error });
  } else if (!passwordCheck.success) {
    res.json({ error: passwordCheck.error });
  } else if (!emailCheck.success) {
    res.json({ error: emailCheck.error });
  }
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const GenerateToken = async (user) => {
  return await jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: user.role === ROLES.ADMIN ? "1h" : "24h" }
  );
};

// * Register User and Admin
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    ValidateInputs(username, password, email, res);

    const existingUser = await userExist(username, email);
    if (existingUser) {
      return res.status(403).json({
        message: "Username or email already exists! please login",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    const temporaryToken = await GenerateToken(user);

    console.log("User created", user._id);
    return res.status(201).json({
      message: MESSAGES.SUCCESS(ROLES.USER),
      user: user._id,
      token: temporaryToken,
    });
  } catch (error) {
    console.error("Register user error: ", error);
    return res.status(500).json({
      message: error.message || MESSAGES.SERVER_ERROR,
    });
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    ValidateInputs(username, password, email, res);

    // TODO: add a middleware for super admin check not sure how to do that! any kind of validation
    const existingUser = await userExist(username, email);
    if (existingUser) {
      return res.status(403).json({
        message: "Username or email already exists! please login",
      });
    }

    const hashedPassword = await hashPassword(password);

    const admin = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "admin",
    });
    const temporaryToken = await GenerateToken(admin);

    return res.status(201).json({
      message: MESSAGES.SUCCESS(ROLES.ADMIN),
      admin: admin._id,
      token: temporaryToken,
    });
  } catch (error) {
    console.error("Register admin error: ", error);
    return res.status(500).json({
      message: error.message || MESSAGES.SERVER_ERROR,
    });
  }
};

// * Login User and Admin
const loginUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    ValidateInputs(username, password, email);

    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found! please register",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const temporaryToken = await GenerateToken(existingUser);

    return res.status(200).json({
      message: "Login Successfull",
      admin: existingUser._id,
      token: temporaryToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { registerUser, loginUser, registerAdmin };
