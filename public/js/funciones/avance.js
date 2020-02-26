export const actualizarAvance = () => {
  // Seleccionar las tareas existentes
  const tareas = document.querySelectorAll('li.tarea');

  if( tareas.length ) {
    // Seleccionar las tareas completadas
    const tareasCompletas = document.querySelectorAll('i.completo');
  
    // calcular el avance
    const avance = Math.round((tareasCompletas.length / tareas.length) * 100);

    // mostrar el avance
    const porcentaje = document.querySelector('#porcentaje');
    porcentaje.style.width = avance+"%";
    porcentaje.style.textAlign = 'center';
    porcentaje.style.color = '#ffffff';
    porcentaje.style.padding = '3px';
    porcentaje.style.fontWeight = '700';

    if(avance === 100) {
      porcentaje.innerHTML = '¡Felicidades! Completaste el proyecto';
    } else {
      porcentaje.innerHTML = '';
    }
  }
  
}
