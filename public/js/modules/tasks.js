import axios from 'axios';
import Swal from "sweetalert2";
import { updateProgressBar } from './functions/progressbar'


const tasks = document.querySelector('.listado-pendientes');

if(tasks){
    tasks.addEventListener('click', (e) => {
        if(e.target.classList.contains('fa-check-circle')){
            const icon = e.target;
            const idTask = icon.parentElement.parentElement.dataset.task;

            //request a /tareas/:id
            const url = `${location.origin}/tareas/${idTask}`;

            axios.patch(url, {idTask})
                .then((response) =>{
                    if(response.status === 200){
                        icon.classList.toggle('completo');
                        updateProgressBar();
                    }
                });
        }
        if(e.target.classList.contains('fa-trash')){
            const taskHTML = e.target.parentElement.parentElement,
                  idTask = taskHTML.dataset.task;
            Swal.fire({
                title: 'Deseas borrar esta tarea?',
                text: "Una tarea eliminada no se puede recuperar",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar',
                cancelButtonText: 'No, cancelar'
            }).then((result) => {
                if (result.value) {
                    const url = `${location.origin}/tareas/${idTask}`;
                    axios.delete(url, {params: {idTask}})
                        .then((response) =>{
                            if(response.status === 200){
                                taskHTML.parentElement.removeChild(taskHTML);
                                Swal.fire(
                                    'Tarea eliminada',
                                    response.data,
                                    'success'
                                );
                            }
                            updateProgressBar();
                        });
                }
            });
        }
    });
}

export default tasks