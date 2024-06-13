import express from "express";
import Note from "../models/notesModel.js";
import { z as zod } from "zod";

import { upload } from "../middlewares/multer.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const notesRouter = express.Router();

const putNotesZod = zod.object({
  title: zod.string(),
  note: zod.string(),
  image: zod.string(),
});

notesRouter.post("/putnote", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.send("No file found");
    }

    const response = await uploadOnCloudinary(file.path);

    if (!response) {
      return response.send("Error");
    }

    return res.status(200).json({
      url: response.url,
      message: "successfully",
    });
  } catch (error) {
    console.log(error.message);
  }
});

export default notesRouter;
