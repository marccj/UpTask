import Swal from 'sweetalert2';
import axios from 'axios';

const deleteBtn = document.querySelector("#eliminar-proyecto");

if(deleteBtn){
    deleteBtn.addEventListener('click', (e) => {
        const projectUrl = e.target.dataset.projectUrl;
        Swal.fire({
            title: 'Deseas borrar este proyecto?',
            text: "Un proyecto eliminado no se puede recuperar",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.value) {     
                const url = `${location.origin}/proyectos/${projectUrl}`;
                axios.delete(url, {params: {projectUrl}})
                    .then((res) => {
                        console.log(res);
                        Swal.fire(
                            'Proyecto eliminado',
                            res.data,
                            'success'
                        );
                        setTimeout(() => {
                            window.location.href = "/";
                        }, 1500);
                    })
                    .catch(() => {
                        Swal.fire({
                            type: 'error',
                            title: 'Hubo un error',
                            text: 'No se pudo borrar el proyecto'
                        })
                    })
            }
        });
    });
}

export default deleteBtn;