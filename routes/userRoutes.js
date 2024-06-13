import express from "express";
import jwt from "jsonwebtoken";
import { z as zod } from "zod";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const usersRouter = express.Router();

const signinZod = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});

const userZod = zod.object({
  firstName: zod.string(),
  lastName: zod.string(),
  email: zod.string().email(),
  password: zod.string().min(8),
});

usersRouter.post("/signup", async (req, res) => {
  try {
    const body = req.body;
    //console.log(body);
    const { success } = userZod.safeParse(body);
    if (!success) {
      return res.json({
        success: false,
        message: "Invalid Params",
      });
    }
    const { email, password, firstName, lastName } = body;
    //console.log(email + " " + password);
    const existingUser = await User.findOne({
      email,
    });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      email,
      firstName,
      lastName,
      password,
    });
    //console.log(user);
    const payload = {
      _id: user._id,
      email: user.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      token: token,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400);
  }
});

usersRouter.get("/signin", async (req, res) => {
  try {
    const body = req.body;
    const { success } = signinZod.safeParse(body);
    if (!success) {
      return res.json({
        success: false,
        message: "Invalid parameters",
      });
    }

    const user = await User.findOne({
      email: body.email,
    });
    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist",
      });
    }

    if (body.password !== user.password) {
      return res.json({
        success: false,
        message: "Passwords does not match",
      });
    }
    const payload = {
      _id: user._id,
      email: user.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return res.status(200).json({
      sucess: true,
      message: "User signed in successfully",
      token: token,
    });
  } catch (error) {
    return res.status(504).json({
      message: "Error",
    });
  }
});

export default usersRouter;
