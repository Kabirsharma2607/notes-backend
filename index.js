const express = require("express");
const { mainRouter } = require("./routes");

const app = express();
app.use(express.json());
app.use("/api/v1", mainRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(5000, () => {
  console.log(`App is listening on port 5000`);
});
