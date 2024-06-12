const express = require("express");

const { User } = require("../models/userModel.js");
const zod = require("zod");

const usersRouter = express.Router();

const userZod = zod.object({
  firstName: zod.string(),
  lastName: zod.string(),
  email: zod.string().email(),
  password: zod.string().min(8),
});

usersRouter.post("/signup", async (req, res) => {
  try {
    const body = req.body;
    console.log(body);
    const { success } = userZod.safeParse(body);
    if (!success) {
      return res.json({
        success: false,
        message: "Invalid Params",
      });
    }
    const { email, password, firstName, lastName } = body;
    console.log(email + " " + password);
    const existingUser = await User.findOne({
      email: body.email,
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
    console.log(user);
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = {
  usersRouter,
};
