//after installing the validation files, i import the query and validationResult function
//that will be used as middleware
const {
  query,
  validationResult,
  body,
  matchedData,
} = require("express-validator");

// Import and create an express object START
const express = require("express");
const app = express();
// Import and create an express object END

//MIDDLEWARE
//global middleware
app.use(express.json());

//local  middleware 1
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

//local  middleware 2
//Creating a new middleware for the validations where i define which columns should
//be validated and how they should be validated
const validationConditions = [
  body("firstName")
    .notEmpty()
    .withMessage("name cannot be empty")
    .isLength({ min: 5, max: 32 })
    .withMessage("name must be at least 5 to 32 char")
    .isString()
    .withMessage("name must be a string"),
  body("lastName")
    .isLength({ min: 5, max: 32 })
    .withMessage("user name must be at least 5 to 32 char")
    .isString()
    .withMessage("name must be a string"),
];

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
app.get("/", (request, response) => {
  response.status(201).send("hello world");
});

//Added the "query()" VALIDATION FUNCTION to my route as a middleware and create a
//validation chain I CAN SAVE THE CHAIN IN A VARIABLE AND CALL IT AS A MIDDLEWARE LIKE I DID WITH THE
//POST BELOW USING "validationConditions", but i am gonna leave it here so we know we can also use this method
app.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must be at least 3-10 characters")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-10 characters"),
  (request, response) => {
    //added the "validationResult()" function
    const result = validationResult(request);
    //console.log(result);
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
  }
);

// create a ROUTE that uses ROUTE PARAMETERS to get a single element
app.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
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

//Added the "body()" VALIDATION FUNCTION to my route as a middleware and create a
//validation chain
app.post("/api/users", validationConditions, (request, response) => {
  //added the "validationResult()" function
  const result = validationResult(request);
  //console.log(result);

  //while the validation above gives me the xtics i want,
  //this gives me more info about the error, pointing out
  //where it is located exactly. and it stops the creation of
  //any new entity
  if (!result.isEmpty()) {
    return response.status(400).send({ errors: result.array() });
  }

  //we save the new object when it passes the checks in the
  // "data" variable
  const data = matchedData(request);
  //console.log(data);
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
  mockUsers.push(newUser);
  return response.status(201).send(newUser);
});

//-----------PUT REQUEST--------------------------------------
app.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  //keep the id the same but change the body
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };

  return response.sendStatus(200);
});

//------------PATCH REQUEST-----------------------------------
app.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

//-------------DELETE REQUEST---------------------------------------------
app.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  mockUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

//makes me listen to a port
app.listen(PORT, () => {
  console.log("server running");
});
