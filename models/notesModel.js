import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    minlength: 3,
  },
  note: {
    type: String,
  },
  status: {
    type: String,
    default: "Not yet completed",
  },
  image: {
    type: String,
  },
  date: {
    type: String,
  },
});

const Note = mongoose.model("Note", noteSchema);

export default Note;
