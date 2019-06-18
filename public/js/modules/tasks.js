import axios from 'axios';

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
                    }
                });
        }
    });
}

export default tasks