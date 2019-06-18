const router = require("express").Router();

// config express-validator for body
const { body } = require("express-validator/check");

// Controllers
const projectsController = require('../controllers/projects_controller');
const tasksController = require('../controllers/tasks_controller');

// Routing
module.exports = function() {
    // index
    router.get("/", projectsController.projectsIndex);
    // new projects
    router.get("/nuevo-proyecto", projectsController.projectsNewForm);
    router.post("/nuevo-proyecto",
        body('name')
            .trim()
            .escape(),
        projectsController.projectsNewSubmit
    );
    // show projects
    router.get("/proyectos/:url", projectsController.projectsShow);
    // update project
    router.get("/proyecto/editar/:id", projectsController.projectsEditForm);
    router.post("/nuevo-proyecto/:id",
        body('name')
            .trim()
            .escape(),
        projectsController.projectsEditSubmit
    );
    // delete project
    router.delete("/proyectos/:url", projectsController.projectsDelete);

    // add task
    router.post("/proyectos/:url", tasksController.tasksNewSubmit);
    // update task
    router.patch("/tareas/:id", tasksController.tasksChangeStatus);
    return router;
};