// imported the "mockUsers" array from the "constants" file
const { mockUsers } = require("./constants");

// local middleware 1
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

// console.log(Array.isArray(mockUsers)); // This should log `true` if it's an array.
// console.log(mockUsers); // Logs the content of `mockUsers`.

module.exports = resolveIndexByUserId;
