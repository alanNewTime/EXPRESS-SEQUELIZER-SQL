//importing all the individual entity routes in the index file, in the routes folder
const indexRouter = require("./routes/index");

// Import and create an express object START
const express = require("express");
const app = express();
// Import and create an express object END

//MIDDLEWARE
//global middleware
app.use(express.json());
app.use(indexRouter); //needed to connect with the index file, in the routes

//Save the rout to the port variable or give it 3000,if there is no element in the env file
const PORT = process.env.PORT || 3000;

app.get("/", (request, response) => {
  response.status(201).send("hello world");
});

//makes me listen to a port
app.listen(PORT, () => {
  console.log("server running");
});
