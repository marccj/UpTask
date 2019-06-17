const Tasks = require('../models/Tasks');
const Projects = require('../models/Projects');

exports.tasksNewSubmit = async (req, res, next) => {
    // obtenemos el proyecto actual
    const project = await Projects.findOne({where: {url: req.params.url}})
    // leemos el valor del input
    const {task} = req.body;
    // estado default 0 = incompleto
    const status = 0;
    // id del proyecto al que pertenece
    const projectId = project.id;
    
    const result = await Tasks.create({task, status, projectId});

    if(!result) return next();

    res.redirect(`/proyectos/${req.params.url}`);
};