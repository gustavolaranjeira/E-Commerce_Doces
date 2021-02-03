const express = require("express");
const routes = express.Router();

const sessionControler = require("../app/controllers/sessionControler");
const userControler = require("../app/controllers/userControler");

const validator = require("../app/validators/user");

// //login / logout
// routes.get("/login", sessionControler.loginForm);
// routes.post("/login", sessionControler.login);
// routes.post("/login", sessionControler.logout);

// //reset password / forgot
// routes.get("/forgot-password", sessionControler.forgotForm);
// routes.get("/password-reset", sessionControler.resetForm);
// routes.post("/forgot-password", sessionControler.forgot);
// routes.post("/password-reset", sessionControler.reset);

// //user register userController
routes.get("/register", userControler.registerForm);
routes.post("/register", validator.post, userControler.post);

routes.get("/", userControler.show);
// routes.put("/", userControler.update);
// routes.delete("/", userControler.delete);

module.exports = routes;
