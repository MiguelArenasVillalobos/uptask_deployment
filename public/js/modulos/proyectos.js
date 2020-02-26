import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar) {
  btnEliminar.addEventListener('click', e => {
    const urlProyecto = e.target.dataset.proyectoUrl;

    // console.log(urlProyecto);
    Swal.fire({
      title: '¿Estás seguro de eliminar este proyecto?',
      text: "¡Este cambio es irreversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí. Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        // Enviar petición a axios
        const url = `${location.origin}/proyectos/${urlProyecto}`;
        
        axios.delete(url, {params: {urlProyecto}})
          .then(function(respuesta) {
            console.log(respuesta);

            Swal.fire(
              '¡Eliminado!',
              respuesta.data,
              'success'
              );
              
              const btnConfirm = document.querySelector('.swal2-confirm');
              btnConfirm.addEventListener('click', () => {
                // Redireccionar al inicio
                setTimeout(() => {
                  window.location.href = "/"
                }, 1100);
              });
          }).catch(() => {
            Swal.fire({
              icon    : 'error',
              title   : 'Hubo un error',
              text    : 'Ocurrió un problema al intentar eliminar el proyecto.',
              footer  : 'Si este problema persiste contactame por e-mail: <a href="mailto:soporte@miguelarenasvillalobos.com">soporte@miguelarenasvillalobos.com</a>'
            });
          });


        }
      });
  });
}

export default btnEliminar;
