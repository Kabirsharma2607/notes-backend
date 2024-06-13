const express = require("express");
const { mainRouter } = require("./routes");
const { connectToDatabase } = require("./db/db");
connectToDatabase();

const app = express();
app.use(express.json({ urlencoded: false }));

app.use("/api/v1", mainRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
