const express = require("express");
const app = express();

app.use(express.json());
const PORT = 3000;

const cylinderRouter = require("./routes/index");
app.use(cylinderRouter);

app.get("/", (request, response) => {
  response.status(201).send("main route");
});

app.listen(PORT, () => {
  console.log("server running");
});
