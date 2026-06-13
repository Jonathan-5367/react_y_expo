 let citaIdActual = null;
        
function iniciarCancelacion(id, fecha, motivo) {
    citaIdActual = id;
    const modal = document.getElementById('confirmModal');
    const modalMessage = document.getElementById('modalMessage');
    
    modalMessage.textContent = `¿Estás seguro de que deseas cancelar la cita del ${fecha} para ${motivo}?`;
    modal.style.display = 'block';
}

function cancelarCita() {
    if (!citaIdActual) return;
    
    const formData = new FormData();
    formData.append('id', citaIdActual);  // CAMBIADO: 'cita_id' → 'id'
    
    fetch('../php/cancelar_cita.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('success', data.message);
            // Recargar la página después de 2 segundos
            setTimeout(() => {
                location.reload();
            }, 2000);
        } else {
            showAlert('error', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('error', 'Error al conectar con el servidor');
    })
    .finally(() => {
        document.getElementById('confirmModal').style.display = 'none';
        citaIdActual = null;
    });
}

function reagendarCita(citaId) {
    alert('Funcionalidad de reagendamiento en desarrollo. Cita ID: ' + citaId);
}

// Event listeners para el modal
document.getElementById('confirmCancel').addEventListener('click', cancelarCita);
document.getElementById('cancelCancel').addEventListener('click', function() {
    document.getElementById('confirmModal').style.display = 'none';
    citaIdActual = null;
});

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', function(event) {
    const modal = document.getElementById('confirmModal');
    if (event.target === modal) {
        modal.style.display = 'none';
        citaIdActual = null;
    }
});