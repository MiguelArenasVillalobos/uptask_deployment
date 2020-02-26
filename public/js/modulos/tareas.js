import axios from "axios";
import Swal from 'sweetalert2';

import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if(tareas) {

  tareas.addEventListener('click', e => {
    if(e.target.classList.contains('fa-check-circle')) {
      const icono = e.target;
      const idTarea = icono.parentElement.parentElement.dataset.tarea;

      // request hacia /tareas/:id
      const url = `${location.origin}/tareas/${idTarea}`;

      axios.patch(url, { idTarea })
        .then(function(respuesta) {
          if(respuesta.status === 200) {
            icono.classList.toggle('completo');

            actualizarAvance();
          }
        });
    }
    if(e.target.classList.contains('fa-trash')) {
      const tareaHTML = e.target.parentElement.parentElement,
            idTarea = tareaHTML.dataset.tarea;

      Swal.fire({
        title: '¿Estás seguro de eliminar esta Tarea?',
        text: "¡Este cambio es irreversible!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí. Eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          // request hacia /tareas/:id
          const url = `${location.origin}/tareas/${idTarea}`;

          // Enviar el delete por medio de axios
          axios.delete(url, { params: { idTarea } })
            .then(function(respuesta) {
              if(respuesta.status === 200) {
                // Eliminar el nodo
                tareaHTML.parentElement.removeChild(tareaHTML);

                // Opcional una alerta
                Swal.fire(
                  'Tarea Eliminada',
                  respuesta.data,
                  'success'
                );

                actualizarAvance();
              }
            });
        }
      });
      

    }
  });
}

export default tareas;
