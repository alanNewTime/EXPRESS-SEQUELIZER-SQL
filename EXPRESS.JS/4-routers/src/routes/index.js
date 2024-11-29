// USING THIS FILE TO SAVE ALL THE INIDVIDUAL ENTITY ROUTES

//importing the users file in the router folder
const usersRouter = require("./users");
//importing the products file in the router folder
const productsRouter = require("./products");

//import and create a router object START
const Router = require("express");
const router = Router();
//import and create a router object END

router.use(usersRouter); //needed to connect with the users entity in the  routes folder
router.use(productsRouter); //needed to connect with the products entity in the routes folder

module.exports = router;
