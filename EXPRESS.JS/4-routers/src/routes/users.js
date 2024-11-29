//import and create a router object START
const Router = require("express");
const router = Router();
//import and create a router object END

//after installing the validation files, i import the query and validationResult function
//that will be used as middleware
const {
  query,
  validationResult,
  body,
  matchedData,
} = require("express-validator");

// imported the "mockUsers" array from the "constants" file
const { mockUsers } = require("../utils/constants");

// import resolveIndexByUserId  middlewares  file
const resolveIndexByUserId = require("../utils/middlewares");

// after having installed cors i import it here
//it helps when we want to send our api call to a frontend program.Otherwise
//i will have a blockage
const cors = require("cors");

//make cours a global middleware.
//after import i use the cors in this way
router.use(cors());

// MOVED MY VALIDATION MIDDLEWARE FRON INDEX TO HERE
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

//----------------GET START------------------------------------
router.get(
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
router.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  const findUser = mockUsers[findUserIndex];
  //checking if the id that i have is present in the database
  if (!findUser) {
    return response.sendStatus(404);
  } else {
    return response.send(findUser);
  }
});
//----------------GET END------------------------------------

//--------------POST REQUEST-----------------------------

//Added the "body()" VALIDATION FUNCTION to my route as a middleware and create a
//validation chain
router.post("/api/users", validationConditions, (request, response) => {
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
router.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  //keep the id the same but change the body
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };

  return response.sendStatus(200);
});

//------------PATCH REQUEST-----------------------------------
router.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

//-------------DELETE REQUEST---------------------------------------------
router.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  mockUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

module.exports = router;
