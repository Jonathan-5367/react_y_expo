// Función para mostrar alertas
function showAlert(type, message) {
    const alertContainer = document.getElementById('alertContainer');
    
    // Crear elemento de alerta
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    
    // Icono según el tipo
    let icon = 'ⓘ';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    
    alert.innerHTML = `
        <span class="alert-icon">${icon}</span>
        <div class="alert-content">${message}</div>
        <button class="alert-close" onclick="closeAlert(this.parentElement)">×</button>
    `;
    
    // Agregar al contenedor
    alertContainer.appendChild(alert);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => closeAlert(alert), 5000);
}

// Función para cerrar alertas
function closeAlert(alertElement) {
    alertElement.classList.add('hide');
    setTimeout(() => {
        if (alertElement.parentNode) {
            alertElement.parentNode.removeChild(alertElement);
        }
    }, 300);
}