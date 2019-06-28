import Swal from "sweetalert2";

export const updateProgressBar = () => {
    //seleccionar las tareas existentes
    const tasks = document.querySelectorAll("li.tarea");
    
    if(tasks.length){
        //seleccionar las tareas completadas
        const completedTasks = document.querySelectorAll('i.completo');
        //calcular el avance
        const progress = Math.round((completedTasks.length / tasks.length ) * 100);
        //mostrar el avance
        const progressBar = document.querySelector("#porcentaje");
        progressBar.style.width = progress+'%';

        if(progress === 100){
            Swal.fire(
                'Has completado el proyecto',
                'Felicidades, has terminado tus tareas',
                'success'
            );   
        }
    }
};