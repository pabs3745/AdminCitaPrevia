// Variables
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const mensajeInput = document.querySelector('#sintomas');

const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas')

const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

let editando;

// Listeners
function eventListeners() {
    mascotaInput.addEventListener('change', datosCitas);
    propietarioInput.addEventListener('change', datosCitas);
    telefonoInput.addEventListener('change', datosCitas);
    fechaInput.addEventListener('change', datosCitas);
    horaInput.addEventListener('change', datosCitas);
    mensajeInput.addEventListener('change', datosCitas);

    formulario.addEventListener('submit', nuevaCita);
}

eventListeners();


// Classes
class Citas {
    constructor() {
        this.citas = [];
    }

    /**
     * Agrega una cita al objeto citas
     */
    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    }

    eliminarCita(id) {
        this.citas = this.citas.filter( cita => cita.id !== id);
    }

    editarCita(citaActualizada) {
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita );
    }
}

class UI {
    imprimirAlerta(mensaje, tipo) {
        // crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        // tipo error
        if ( tipo === 'error' ) {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        divMensaje.textContent = mensaje;

        // agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, 
            document.querySelector('.agregar-cita'));

        // quitar la alerta del DOM
        setTimeout( () => {
            divMensaje.remove();
        }, 3000);
    }

    // destructuring desde el parametro --> ({destructuring})
    imprimirCitas({citas}) {
        this.limpiarHTML();
        citas.forEach( cita => {
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;
            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            // scripting de los elementos para la citas
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `<span class="font-weight-bolder">Propietario: </span> ${propietario}`;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Telefono: </span> ${telefono}`;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha: </span> ${fecha}`;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `<span class="font-weight-bolder">Hora: </span> ${hora}`;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `<span class="font-weight-bolder">Síntomas: </span> ${sintomas}`;

            // boton para eliminar citas
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';

            btnEliminar.onclick = () => eliminarCita(id);

            // boton para editar
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = 'Editar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';

            btnEditar.onclick = () => editarCita(cita);

            // agregar los parrafos al div
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            // agregar todo al HTML
            contenedorCitas.appendChild(divCita);
        })
    }

    limpiarHTML() {
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

const ui = new UI();
const administrarCitas = new Citas();

// functions
/**
 * llena el objeto de citas con los campos del formulario
 * @param {*} e 
 */
function datosCitas(e){
    // console.log(e.target.name);     // name es atributo que viene del html
    citaObj[e.target.name] = e.target.value;

    // console.log(citaObj);
}


/**
 * Valida una nueva cita que viene 
 *  del formulario y la agrega a la clase Citas
 */
function nuevaCita(e) {
    e.preventDefault();

    // extraer info del objeto de cita
    const { mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;

    // validar cada campo
    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === ''
    || sintomas === '') {
        // console.log('Todos los campos son obligatorios');
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }

    // modo edicion
    if(editando) {
        console.log('Modo edicion...');

        // Pasar el objeto de la cita a edicion
        administrarCitas.editarCita( {...citaObj });

        // Mensaje para el usuario
        ui.imprimirAlerta('Los cambios se guardaron correctamente');

        // Cambiar el texto del boton de crear cita
        formulario.querySelector('button[type="submit"]').textContent = 'Crear cita';

        editando = false;

    } else {
        console.log('Modo nueva cita');
        // generar un ID a cada cita para poder seleccionarla y editarla
        citaObj.id = Date.now();

        // Crear una nueva cita
        administrarCitas.agregarCita({...citaObj});

        // Mensaje para el usuario
        ui.imprimirAlerta('La nueva cita se agregó correctamente');
    }

    

    // reiniciar el objeto citas
    reiniciarObjeto();

    // reiniciar el formulario
    formulario.reset();

    // mostrar el objeto de la clase citas en el HTML
    ui.imprimirCitas(administrarCitas);
}

/**
 * reiniciar el objeto citas
 */
function reiniciarObjeto() {
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

function eliminarCita(id) {
    // console.log(id);

    // Eliminar la cita
    administrarCitas.eliminarCita(id);

    // Mostrar un mensaje de confirmacion
    ui.imprimirAlerta('La cita ha sido eliminada');

    // Refresh la pagina
    ui.imprimirCitas(administrarCitas);

    // reiniciar el formulario
    formulario.reset();
}

function editarCita(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    // llena el formulario con los datos previos de la cita
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    mensajeInput.value = sintomas;

    // Llenar el objeto cita
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    // Cambiar el texto del boton de crear cita
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    // editando
    editando = true;


}