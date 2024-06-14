import express from "express";
import Note from "../models/notesModel.js";
import { z as zod } from "zod";

import { upload } from "../middlewares/multer.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import User from "../models/userModel.js";
import formattedDateTime from "../utils/currentDateTime.js";
import { flightRouterStateSchema } from "next/dist/server/app-render/types.js";

const notesRouter = express.Router();

const putNotesZod = zod.object({
  title: zod.string(),
  note: zod.string(),
});

notesRouter.post(
  "/putnote",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    let cloudinaryPublicId = null;

    try {
      const file = req.file;
      let imageUrl = null;

      if (file) {
        const response = await uploadOnCloudinary(file.path);
        // console.log(response);
        if (!response) {
          return res.status(500).send("Error uploading image");
        }
        imageUrl = response.url;
        cloudinaryPublicId = response.public_id;
      }

      console.log(req.body, req._id);
      const body = req.body;
      console.log(body.note);
      const { success } = putNotesZod.safeParse(body);
      if (!success) {
        if (cloudinaryPublicId) {
          await deleteFromCloudinary(cloudinaryPublicId);
        }
        return res.status(500).json({
          success,
          message: "Invalid inputs",
        });
      }
      const newNote = new Note({
        title: body.title,
        note: body.note,
        image: imageUrl,
        userId: req._id,
        date: formattedDateTime,
      });

      const created = await newNote.save();
      if (!created) {
        if (cloudinaryPublicId) {
          await deleteFromCloudinary(cloudinaryPublicId);
        }
        return res.status(500).json({
          success: false,
          message: "Error uploading",
        });
      }

      const updatedToUser = await User.findByIdAndUpdate(req._id, {
        $push: { notes: newNote._id },
      });

      const currUser = await User.findById(req._id);
      if (!updatedToUser) {
        if (cloudinaryPublicId) {
          await deleteFromCloudinary(cloudinaryPublicId);
        }
        return res.status(500).json({
          message: "Some error has occurred",
        });
      }

      return res.status(200).json({
        message: "Note created successfully",
        note: newNote,
        user: currUser,
      });
    } catch (error) {
      console.log(error.message);

      if (cloudinaryPublicId) {
        await deleteFromCloudinary(cloudinaryPublicId);
      }

      return res.status(500).json({
        success: false,
        message: "An error occurred while processing your request",
        error: error.message,
      });
    }
  }
);

notesRouter.get("/notes", authMiddleware, async (req, res) => {
  try {
    const currUser = await User.findById(req._id);
    if (!currUser) {
      return res.status(404).json({
        success: false,
        message: "Invalid user",
      });
    }
    const allNotes = await Promise.all(
      currUser.notes.map(async (noteId) => {
        return await Note.findById(noteId).select("-userId");
      })
    );
    console.log(allNotes);
    return res.status(200).json(allNotes);
  } catch (error) {
    return res.status(500).json({
      message: "Error occured",
    });
  }
});

export default notesRouter;
