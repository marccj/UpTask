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

exports.tasksChangeStatus = async (req, res, next) => {
    const {id} = req.params;
    const task = await Tasks.findOne({where: { id } });
    
    //change status
    let status = 0;
    if (task.status === status){
        status = 1;
    }
    task.status = status;

    const result = await task.save();

    if(!result) return next();

    res.status(200).send("Updated Successfully");
};

exports.tasksDelete = async (req, res, next) => {
    const {idTask} = req.query;
    const result = await Tasks.destroy({
        where:{
            id: idTask
        }
    });
    
    if(!result) return next();

    res.status(200).send("Tarea borrada satisfactoriamente");
};