/*Abrir Modal Eliminar Pacientes*/
function abrirModalEliminar(id) {
    document.getElementById('eliminarId').value = id;
    document.getElementById('modalEliminar').style.display = 'block';
}

/*Abrir Modal Editar Pacientes*/
function abrirModalEditar(id, nombre, email, telefono) {
    document.getElementById('editarId').value = id;
    document.getElementById('editarNombre').value = nombre;
    document.getElementById('editarEmail').value = email;
    document.getElementById('editarTelefono').value = telefono;
    document.getElementById('modalEditar').style.display = 'block';
}

/*Cerrar Modales*/
function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}