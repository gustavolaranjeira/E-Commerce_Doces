const express = require("express");
const routes = express.Router();

const sessionControler = require("../app/controllers/sessionControler");
const userControler = require("../app/controllers/userControler");

const userValidator = require("../app/validators/user");
const sessionValidator = require("../app/validators/session");

// //login / logout
routes.get("/login", sessionControler.loginForm);
routes.post("/login", sessionValidator.login, sessionControler.login);
routes.post("/logout", sessionControler.logout);

// //reset password / forgot
// routes.get("/forgot-password", sessionControler.forgotForm);
// routes.get("/password-reset", sessionControler.resetForm);
// routes.post("/forgot-password", sessionControler.forgot);
// routes.post("/password-reset", sessionControler.reset);

// //user register userController
routes.get("/register", userControler.registerForm);
routes.post("/register", userValidator.post, userControler.post);

routes.get("/", userValidator.show, userControler.show);
routes.put("/", userValidator.update, userControler.update);
// routes.delete("/", userControler.delete);

module.exports = routes;
