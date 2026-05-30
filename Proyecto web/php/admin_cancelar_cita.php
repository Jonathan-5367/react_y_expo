<?php
session_start();
include 'conexion.php';

// Verificar si el usuario ha iniciado sesión y es admin o recepcionista
if (!isset($_SESSION['email']) || ($_SESSION['tipo'] != 'admin' && $_SESSION['tipo'] != 'recepcionista')) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

if (!isset($_POST['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID de cita no proporcionado']);
    exit;
}

$cita_id = intval($_POST['id']);

// CORREGIDO: Para admin, no necesitamos verificar el paciente_id
// Solo verificamos que la cita exista
$stmt = $conn->prepare("SELECT id_cita FROM citas WHERE id_cita = ?");
$stmt->bind_param('i', $cita_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Cita no encontrada']);
    exit;
}

// Actualizar el estado de la cita a 'cancelada'
$stmt = $conn->prepare("UPDATE citas SET estado = 'cancelada' WHERE id_cita = ?");
$stmt->bind_param('i', $cita_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Cita cancelada exitosamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al cancelar la cita: ' . $conn->error]);
}

$conn->close();
?>