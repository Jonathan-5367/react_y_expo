// confir_cancel_citas.js - CORREGIDO PARA ADMIN

// Función para iniciar la confirmación de cita
function iniciarConfirmacion(citaId, fechaHora) {
    document.getElementById('confirmarMensaje').textContent = `¿Estás seguro de que deseas confirmar la cita del ${fechaHora}?`;
    document.getElementById('confirmarBtn').onclick = function() {
        confirmarCita(citaId);
    };
    document.getElementById('confirmarModal').style.display = 'block';
}

// Función para iniciar la cancelación de cita
function iniciarCancelacion(citaId, fechaHora, motivo) {
    document.getElementById('modalMessage').textContent = `¿Estás seguro de que deseas cancelar la cita del ${fechaHora} para ${motivo}?`;
    document.getElementById('confirmCancel').onclick = function() {
        cancelarCita(citaId);
    };
    document.getElementById('cancelModal').style.display = 'block';
}

// Función para confirmar cita via AJAX - RUTAS CORREGIDAS PARA ADMIN
function confirmarCita(citaId) {
    fetch('../php/admin_confirmar_cita.php', {  // CORREGIDO: usar admin_confirmar_cita.php
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `id=${citaId}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('success', data.message);
            // Recargar la página después de 2 segundos para ver los cambios
            setTimeout(() => {
                location.reload();
            }, 2000);
        } else {
            showAlert('error', data.message);
        }
        document.getElementById('confirmarModal').style.display = 'none';
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('error', 'Error de conexión');
        document.getElementById('confirmarModal').style.display = 'none';
    });
}

// Función para cancelar cita via AJAX - RUTAS CORREGIDAS PARA ADMIN
function cancelarCita(citaId) {
    fetch('../php/admin_cancelar_cita.php', {  // CORREGIDO: usar admin_cancelar_cita.php
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `id=${citaId}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('success', data.message);
            // Recargar la página después de 2 segundos para ver los cambios
            setTimeout(() => {
                location.reload();
            }, 2000);
        } else {
            showAlert('error', data.message);
        }
        document.getElementById('cancelModal').style.display = 'none';
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('error', 'Error de conexión');
        document.getElementById('cancelModal').style.display = 'none';
    });
}

// Cerrar modales
document.getElementById('cerrarConfirmar').onclick = function() {
    document.getElementById('confirmarModal').style.display = 'none';
};
document.getElementById('cancelCancel').onclick = function() {
    document.getElementById('cancelModal').style.display = 'none';
};

// Cerrar modales al hacer clic fuera
window.onclick = function(event) {
    if (event.target == document.getElementById('confirmarModal')) {
        document.getElementById('confirmarModal').style.display = 'none';
    }
    if (event.target == document.getElementById('cancelModal')) {
        document.getElementById('cancelModal').style.display = 'none';
    }
};