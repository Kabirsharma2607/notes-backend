import express from "express";
import usersRouter from "./userRoutes.js";

import notesRouter from "./notesRoutes.js";

const mainRouter = express.Router();

mainRouter.use("/user", usersRouter);

mainRouter.use("/note", notesRouter);

export default mainRouter;
