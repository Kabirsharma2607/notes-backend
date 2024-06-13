import express, { json } from "express";
import mainRouter from "./routes/index.js";
import connectToDatabase from "./db/db.js";
connectToDatabase();
import cors from "cors";

const app = express();
app.use(cors());
app.use(json({ urlencoded: false }));

app.use("/api/v1", mainRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
