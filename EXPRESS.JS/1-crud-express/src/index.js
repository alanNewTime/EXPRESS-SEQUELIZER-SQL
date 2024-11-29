// Import and create an express object START
const express = require("express");
const app = express();
// Import and create an express object END

// MIDDLEWARE
// Global middlewares
app.use(express.json());

// Save the route to the port variable or give it 3000, if there is no element in the env file
const PORT = process.env.PORT || 3000;

//create an array of users i will use to test my routes
const mockUsers = [
  { id: 1, firstName: "Andy", lastName: "Nloga", age: 24 },
  { id: 2, firstName: "Alan", lastName: "Omam", age: 28 },
  { id: 3, firstName: "Paul", lastName: "Aibi", age: 32 },
  { id: 4, firstName: "Debora", lastName: "Nloga", age: 20 },
];

//create an array of products i will use to test my routes
const mockProducts = [
  { id: 1, type: "car", brand: "toyota", price: "23462.78" },
  { id: 2, type: "car", brand: "toyota", price: "23462.78" },
  { id: 3, type: "car", brand: "toyota", price: "23462.78" },
  { id: 4, type: "car", brand: "toyota", price: "23462.78" },
];

//----------------GET START------------------------------------
//created a ROUTE that gets data
app.get("/", (request, response) => {
  response.status(201).send("hello world prova");
});

//create a ROUTE that gets all the mock users
app.get("/api/users", (request, response) => {
  //use QUERY PARAMETERS to filter through the users
  const {
    query: { filter, value },
  } = request;

  //when filter and value are defined it returns what i want filtered and how i want it filtered
  if (filter && value) {
    return response.send(
      mockUsers.filter((user) => user[filter].includes(value))
    );
  } else {
    return response.send(mockUsers);
  }
  // an api call with the query params can have the form "localhost:3000/api/users?filter=name&value=n"
  // this will give all the users that have in their name the letter "n"
});

// create a ROUTE that uses ROUTE PARAMETERS to get a single element
app.get("/api/users/:id", (request, response) => {
  //turns my id from a string to a number, b/c when i receive it,it is always as a string
  const parsedId = parseInt(request.params.id);

  //check if the id that i pass is a valid number
  if (isNaN(parsedId)) {
    return response.status(400).send({ msg: "bad request" });
  }

  const findUser = mockUsers.find((user) => user.id === parsedId);

  //checking if the id that i have is present in the database
  if (!findUser) {
    return response.sendStatus(404);
  } else {
    return response.send(findUser);
  }
});

//create a ROUTE that gets all the mock products
app.get("/api/products", (request, response) => {
  response.send(mockProducts);
});
//----------------GET END------------------------------------

//--------------POST REQUEST-----------------------------
app.post("/api/users", (request, response) => {
  //console.log(request.body);
  const { body } = request;
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
  mockUsers.push(newUser);
  return response.status(201).send(newUser);
});

//-----------PUT REQUEST--------------------------------------
//put ubdates the entire object even if we only modify one of its properties
//so every time we want to modify just one property, we need to pass the whole object
app.put("/api/users/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return response.sendStatus(400);
  }

  const findUserIndex = mockUsers.findIndex(
    //user PREDICATE function
    (user) => user.id === parsedId
  );
  if (findUserIndex === -1) {
    return response.sendStatus(404);
  }
  //keep the id the same but change the body
  mockUsers[findUserIndex] = { id: parsedId, ...body };

  return response.sendStatus(200);
});

//------------PATCH REQUEST-----------------------------------
//patch updates the object partially by only targeting the property
//we want to update
app.patch("/api/users/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return response.sendStatus(400);
  }

  const findUserIndex = mockUsers.findIndex(
    //user PREDICATE function
    (user) => user.id === parsedId
  );
  if (findUserIndex === -1) {
    return response.sendStatus(404);
  }

  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

//-------------DELETE REQUEST---------------------------------------------
app.delete("/api/users/:id", (request, response) => {
  const {
    params: { id },
  } = request;

  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return response.sendStatus(400);
  }

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1) {
    return response.sendStatus(404);
  }

  mockUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

// Makes me listen to a port
app.listen(PORT, () => {
  console.log("server is running");
});
