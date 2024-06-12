const express = require("express");
const { usersRouter } = require("./userRoutes");

const mainRouter = express.Router();

mainRouter.use("/user", usersRouter);

module.exports = {
  mainRouter,
};
