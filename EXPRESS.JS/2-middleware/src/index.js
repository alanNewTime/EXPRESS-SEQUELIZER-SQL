// Import and create an express object START
const express = require("express");
const app = express();
// Import and create an express object END

//MIDDLEWARE

//global middleware 1
app.use(express.json());

//local  middleware 1
const loggingMiddleware = (request, response, next) => {
  console.log("MIDDLEWARE CALLED");
  //need to call the next function so that after the middleware is
  //processed, the program continues, else we will remain in a pending loop
  next();
};

//local  middleware 2
// i create a middleware, where i put part of the code i already used in some of
//my request that i see repeating itself
const resolveIndexByUserId = (request, response, next) => {
  const {
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
  //here i am passing findUserIndex so that it can be captured
  //by a potential next middleware or my the rest of the endpoint
  request.findUserIndex = findUserIndex;
  next();
};

//this calls my middleware globaly.So any rout i call will activate it
// app.use(loggingMiddleware);

//Save the rout to the port variable or give it 3000,if there is no element in the env file
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
  { id: 2, type: "pen", brand: "bic", price: "2.00" },
  { id: 3, type: "pasta", brand: "panzani", price: "12.50" },
  { id: 4, type: "pc", brand: "lenovo", price: "462.68" },
];

//----------------GET START------------------------------------
//adding the middleware here and not using "app.use(loggingMiddleware)" above
//makes that the middleware will be activated only when i go through this route
app.get("/", loggingMiddleware, (request, response) => {
  response.status(201).send("hello world");
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
});

// create a ROUTE that uses ROUTE PARAMETERS to get a single element
app.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
  //THE COMENTED PART BELOW IS IN THE MIDDLEWARE
  // //turns my id from a string to a number, b/c when i receive it,it is always as a string
  // const parsedId = parseInt(request.params.id);

  // //check if the id that i pass is a valid number
  // if (isNaN(parsedId)) {
  //   return response.status(400).send({ msg: "bad request" });
  // }

  // const findUser = mockUsers.find((user) => user.id === parsedId);

  const { findUserIndex } = request;
  const findUser = mockUsers[findUserIndex];
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
app.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  //THE COMENTED PART BELOW IS IN THE MIDDLEWARE
  // const {
  //   body,
  //   params: { id },
  // } = request;

  // const parsedId = parseInt(id);
  // if (isNaN(parsedId)) {
  //   return response.sendStatus(400);
  // }

  // const findUserIndex = mockUsers.findIndex(
  //   //user PREDICATE function
  //   (user) => user.id === parsedId
  // );
  // if (findUserIndex === -1) {
  //   return response.sendStatus(404);
  // }
  const { body, findUserIndex } = request;
  //keep the id the same but change the body
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };

  return response.sendStatus(200);
});

//------------PATCH REQUEST-----------------------------------
app.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  //THE COMENTED PART BELOW IS IN THE MIDDLEWARE
  // const {
  //   body,
  //   params: { id },
  // } = request;

  // const parsedId = parseInt(id);
  // if (isNaN(parsedId)) {
  //   return response.sendStatus(400);
  // }

  // const findUserIndex = mockUsers.findIndex(
  //   //user PREDICATE function
  //   (user) => user.id === parsedId
  // );
  // if (findUserIndex === -1) {
  //   return response.sendStatus(404);
  // }
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

//-------------DELETE REQUEST---------------------------------------------
app.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  //THE COMENTED PART BELOW IS IN THE MIDDLEWARE
  // const {
  //   params: { id },
  // } = request;

  // const parsedId = parseInt(id);

  // if (isNaN(parsedId)) {
  //   return response.sendStatus(400);
  // }

  // const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  // if (findUserIndex === -1) {
  //   return response.sendStatus(404);
  // }
  const { findUserIndex } = request;
  mockUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

//makes me listen to a port
app.listen(PORT, () => {
  console.log("server running");
});
