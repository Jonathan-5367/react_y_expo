// historial_cita.js - VERSIÓN COMPLETAMENTE CORREGIDA Y COMPATIBLE

// Variable global para la cita a confirmar
let citaAConfirmarId = null;

// Función para iniciar la confirmación
function iniciarConfirmacion(id, fecha) {
    citaAConfirmarId = id;
    const modal = document.getElementById('confirmarModal');
    const mensaje = document.getElementById('confirmarMensaje');
    mensaje.textContent = `¿Estás seguro de que deseas confirmar la cita del ${fecha}?`;
    modal.style.display = 'block';

    // Evento para botón Confirmar
    document.getElementById('confirmarBtn').onclick = function() {
        confirmarCita(citaAConfirmarId);
        modal.style.display = 'none';
    };

    // Evento para cerrar modal
    document.getElementById('cerrarConfirmar').onclick = function() {
        modal.style.display = 'none';
        citaAConfirmarId = null;
    };
}

// Función para confirmar la cita vía AJAX - COMPATIBLE CON BD
function confirmarCita(id) {
    fetch('../php/confirmar_cita.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'id=' + encodeURIComponent(id)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarAlerta('Cita confirmada exitosamente', 'success');
            setTimeout(() => { location.reload(); }, 2000);
        } else {
            mostrarAlerta('Error al confirmar la cita: ' + data.message, 'error');
        }
    })
    .catch(() => {
        mostrarAlerta('Error de conexión al confirmar cita', 'error');
    });
}

// Variables globales
let citaSeleccionadaId = null;

// Función para iniciar el proceso de cancelación
function iniciarCancelacion(id, fecha, motivo) {
    console.log('Iniciando cancelación para cita ID:', id);
    citaSeleccionadaId = id;
    const modal = document.getElementById('cancelModal');
    const message = document.getElementById('modalMessage');
    
    message.textContent = `¿Estás seguro de que deseas cancelar la cita del ${fecha} para "${motivo}"?`;
    modal.style.display = 'block';
    
    // Configurar eventos de los botones del modal
    document.getElementById('confirmCancel').onclick = function() {
        console.log('Confirmando cancelación de cita ID:', citaSeleccionadaId);
        cancelarCita(citaSeleccionadaId);
        modal.style.display = 'none';
    };
    
    document.getElementById('cancelCancel').onclick = function() {
        console.log('Cancelando operación de cancelación');
        modal.style.display = 'none';
        citaSeleccionadaId = null;
    };
}

// Función para cancelar la cita mediante AJAX - COMPATIBLE CON BD
function cancelarCita(id) {
    console.log('Enviando solicitud de cancelación para cita ID:', id);
    
    const url = '../php/cancelar_cita.php';
    console.log('URL de destino para cancelar:', url);
    
    // Usar FormData para enviar los datos
    const formData = new FormData();
    formData.append('id', id);  // Asegúrate de que sea 'id'
    
    console.log('Datos a enviar para cancelar:', {id: id});
    
    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('Respuesta de cancelación recibida, estado:', response.status);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos de respuesta de cancelación:', data);
        if (data.success) {
            mostrarAlerta('Cita cancelada correctamente', 'success');
            setTimeout(() => {
                location.reload();
            }, 2000);
        } else {
            mostrarAlerta('Error al cancelar la cita: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error en la solicitud de cancelación:', error);
        mostrarAlerta('Error de conexión al cancelar la cita', 'error');
    });
}

// Función para iniciar el proceso de reagendación
function iniciarReagendacion(id, fechaHora) {
    console.log('Iniciando reagendación para cita ID:', id, 'Fecha actual:', fechaHora);
    citaSeleccionadaId = id;
    const modal = document.getElementById('reagendarModal');
    const inputFecha = document.getElementById('nuevaFechaHora');
    
    // Establecer la fecha y hora actual de la cita
    inputFecha.value = fechaHora;
    modal.style.display = 'block';
    
    // Establecer fecha mínima (hoy)
    const hoy = new Date();
    const fechaMinima = hoy.toISOString().slice(0, 16);
    inputFecha.min = fechaMinima;
    
    console.log('Fecha mínima establecida:', fechaMinima);
    
    // Configurar eventos del modal de reagendación
    document.getElementById('cancelReagendar').onclick = function() {
        console.log('Cancelando reagendación');
        modal.style.display = 'none';
        citaSeleccionadaId = null;
    };
    
    document.getElementById('reagendarForm').onsubmit = function(e) {
        e.preventDefault();
        console.log('Formulario de reagendación enviado');
        
        // Validar que se haya seleccionado una fecha
        if (!inputFecha.value) {
            mostrarAlerta('Por favor, selecciona una fecha y hora', 'error');
            return;
        }
        
        // Validar horario en el frontend (8am - 12pm)
        const selectedDate = new Date(inputFecha.value);
        const hours = selectedDate.getHours();
        
        console.log('Fecha seleccionada:', inputFecha.value, 'Hora:', hours);
        
        if (hours < 8 || hours >= 12) {
            mostrarAlerta('El horario de atención es de 8:00 am a 12:00 pm', 'error');
            return;
        }
        
        // Validar que la fecha no sea en el pasado
        if (selectedDate < new Date()) {
            mostrarAlerta('No puede reagendar una cita en el pasado', 'error');
            return;
        }
        
        reagendarCita(citaSeleccionadaId, inputFecha.value);
    };
    
    // Agregar validación en tiempo real cuando cambia la fecha
    inputFecha.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const hours = selectedDate.getHours();
        
        if (hours < 8 || hours >= 12) {
            mostrarAlerta('El horario de atención es de 8:00 am a 12:00 pm. Por favor, seleccione una hora entre las 8:00 y las 12:00.', 'error');
            // No limpiar el valor, solo mostrar advertencia
        }
    });
}

// Función para reagendar la cita mediante AJAX - COMPATIBLE CON BD
function reagendarCita(id, nuevaFecha) {
    console.log('Enviando solicitud de reagendación. Cita ID:', id, 'Nueva fecha:', nuevaFecha);
    
    const url = '../php/reagendar_cita.php';
    console.log('URL de destino para reagendar:', url);
    
    // Usar FormData para enviar los datos
    const formData = new FormData();
    formData.append('id', id);
    formData.append('fecha', nuevaFecha);
    
    console.log('Datos a enviar para reagendar:', {id: id, fecha: nuevaFecha});
    
    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('Respuesta HTTP recibida, estado:', response.status, response.statusText);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos de respuesta JSON:', data);
        const modal = document.getElementById('reagendarModal');
        if (modal) {
            modal.style.display = 'none';
        }
        
        if (data.success) {
            mostrarAlerta('Cita reagendada correctamente', 'success');
            setTimeout(() => {
                location.reload();
            }, 2000);
        } else {
            mostrarAlerta('Error al reagendar la cita: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error completo en la solicitud de reagendación:', error);
        mostrarAlerta('Error de conexión al intentar reagendar la cita. Verifica la consola para más detalles.', 'error');
    });
}

// Función para mostrar alertas
function mostrarAlerta(mensaje, tipo) {
    console.log('Mostrando alerta:', tipo, mensaje);
    
    // Intentar usar la función de alertas.js si existe
    if (typeof showAlert === 'function') {
        showAlert(tipo, mensaje);
        return;
    }
    
    // Si no existe, crear una alerta básica
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) {
        console.error('No se encontró el contenedor de alertas');
        return;
    }
    
    const alerta = document.createElement('div');
    alerta.className = `alerta alerta-${tipo}`;
    alerta.textContent = mensaje;
    
    alertContainer.appendChild(alerta);
    
    // Eliminar la alerta después de 5 segundos
    setTimeout(() => {
        if (alerta.parentNode) {
            alerta.parentNode.removeChild(alerta);
        }
    }, 5000);
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando funcionalidades de citas');
    
    // Cerrar modales al hacer clic fuera de ellos
    window.onclick = function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                console.log('Cerrando modal al hacer clic fuera');
                modal.style.display = 'none';
                citaSeleccionadaId = null;
            }
        });
    };
});