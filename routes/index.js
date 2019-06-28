const router = require("express").Router();

// config express-validator for body
const { body } = require("express-validator/check");

// Controllers
const projectsController = require('../controllers/projects_controller');
const tasksController = require('../controllers/tasks_controller');
const usersController = require('../controllers/users_controller');
const authController = require('../controllers/auth_controller');

// Routing
module.exports = function() {
    // index
    router.get("/", authController.userAuthenticated, projectsController.projectsIndex);
    // new projects
    router.get("/nuevo-proyecto", authController.userAuthenticated, projectsController.projectsNewForm);
    router.post("/nuevo-proyecto",
        authController.userAuthenticated, 
        body('name')
            .trim()
            .escape(),
        projectsController.projectsNewSubmit
    );
    // show projects
    router.get("/proyectos/:url", authController.userAuthenticated, projectsController.projectsShow);
    // update project
    router.get("/proyecto/editar/:id", authController.userAuthenticated, projectsController.projectsEditForm);
    router.post("/nuevo-proyecto/:id",
        authController.userAuthenticated, 
        body('name')
            .trim()
            .escape(),
        projectsController.projectsEditSubmit
    );
    // delete project
    router.delete("/proyectos/:url", authController.userAuthenticated, projectsController.projectsDelete);

    // add task
    router.post("/proyectos/:url", authController.userAuthenticated, tasksController.tasksNewSubmit);
    // update task
    router.patch("/tareas/:id", authController.userAuthenticated, tasksController.tasksChangeStatus);
    // delete task
    router.delete("/tareas/:id", authController.userAuthenticated, tasksController.tasksDelete);
    
    // create account
    router.get("/crear-cuenta", usersController.usersNewForm);
    router.post("/crear-cuenta", usersController.usersNewSubmit);
    // sign in 
    router.get('/iniciar-sesion', usersController.usersSignIn);
    router.post('/iniciar-sesion', authController.authenticateUser);
    // close session
    router.get('/cerrar-sesion', authController.closeSession);
    // recover password
    router.get('/recuperar-password', usersController.recoverPasswordForm)
    router.post('/recuperar-password', authController.sendToken);
    router.get('/recuperar-password/:token', authController.resetPasswordForm);
    router.post('/recuperar-password/:token', authController.resetPasswordSubmit);
    
    return router;
};