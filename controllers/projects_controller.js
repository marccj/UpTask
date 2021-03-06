const Projects = require('../models/Projects');
const Tasks = require('../models/Tasks');

exports.projectsIndex = async (req, res) => {
    const userId = res.locals.user.id;
    const projects = await Projects.findAll({where: userId});
    res.render('projects/index', {
        pageTitle: "Proyectos "+res.locals.year,
        projects
    });
};

exports.projectsNewForm = async (req, res) => {
    const userId = res.locals.user.id;
    const projects = await Projects.findAll({ where: userId });

    res.render("projects/new_edit", {
        pageTitle: "Nuevo Proyecto",
        projects
    })
};

exports.projectsNewSubmit = async (req, res) => {
    const userId = res.locals.user.id;
    const projects = await Projects.findAll({ where: userId });

    // validacion de informacion
    const { name } = req.body;
    let errors = []

    //si el nombre esta vacio 
    if(!name){
        errors.push({'text': 'Agrega un nombre al proyecto.'});
    }
    //si hay errores
    if (errors.length > 0 ){
        res.render('projects/new_edit', {
            pageTitle: "Nuevo Proyecto",
            projects,
            errors
        });
    } else{
        // insertar en DB
        const userId = res.locals.user.id;
        await Projects.create({ name, userId });
        res.redirect('/');
    }
};

exports.projectsShow = async (req, res) => {
    const userId = res.locals.user.id;
    const projectsPromise = Projects.findAll({where: userId});
    const projectPromise = Projects.findOne({
        where: {
            url: req.params.url,
            userId
        }
    });
    const [projects, project] = await Promise.all([projectsPromise, projectPromise]);

    // get tasks from current project
    const tasks = await Tasks.findAll({
        where:{
            projectId: project.id
        },
        // include: [
        //     {model: Projects }
        // ]
    });
    
    if(!project) return next();
    
    res.render('projects/show', {
        pageTitle: `Tareas del Proyecto: ${project.name}`,
        projects,
        project,
        tasks
    });
};

exports.projectsEditForm = async (req, res) => {
    const userId = res.locals.user.id;
    const projectsPromise= Projects.findAll({where: userId});
    const projectPromise= Projects.findOne({
        where:{
            id: req.params.id,
            userId
        }
    });
    const [projects, project] = await Promise.all([projectsPromise, projectPromise]);

    if(!project) return next();

    res.render('projects/new_edit', {
        pageTitle: 'Editar Proyecto',
        projects,
        project
    })
};

exports.projectsEditSubmit = async (req, res) => {
    const projects = await Projects.findAll();

    // validacion de informacion
    const { name } = req.body;
    let errors = []

    //si el nombre esta vacio 
    if (!name) {
        errors.push({ 'text': 'Agrega un nombre al proyecto.' });
    }
    //si hay errores
    if (errors.length > 0) {
        res.render('projects/new', {
            pageTitle: "Nuevo Proyecto",
            projects,
            errors
        });
    } else {
        // insertar en DB
        await Projects.update(
            {name: name},
            {where: {id: req.params.id}}
            );
        res.redirect('/');
    }
};

exports.projectsDelete = async (req, res, next) => {
    
    const project_url = req.params.url;
    const result = await Projects.destroy({
        where: {
            url: project_url
        }
    });

    if(!result) return next();
    
    res.status(200).send("Proyecto eliminado correctamente");
    
    //req query o params
    //console.log(req.query);
}