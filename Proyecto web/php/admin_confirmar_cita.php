<?php
session_start();
include 'conexion.php';

// Verificar si el usuario ha iniciado sesión y es admin o recepcionista
if (!isset($_SESSION['email']) || !in_array($_SESSION['tipo'], ['admin', 'recepcionista'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

if (!isset($_POST['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID de cita no proporcionado']);
    exit;
}

$cita_id = intval($_POST['id']);
$admin_id = $_SESSION['user_id'];

// CORREGIDO: usar id_cita en lugar de id
$stmt = $conn->prepare("UPDATE citas SET estado = 'confirmada' WHERE id_cita = ?");
$stmt->bind_param('i', $cita_id);

if ($stmt->execute()) {
    // Registrar en el historial si es necesario
    // CORREGIDO: usar id_cita en lugar de id
    $stmt_historial = $conn->prepare("
        INSERT INTO historial_citas (cita_id, estado_anterior, estado_nuevo, actualizado_por, notas) 
        SELECT id_cita, estado, 'confirmada', ?, 'Confirmada por administrador' 
        FROM citas WHERE id_cita = ?
    ");
    $stmt_historial->bind_param('ii', $admin_id, $cita_id);
    $stmt_historial->execute();
    $stmt_historial->close();
    
    echo json_encode(['success' => true, 'message' => 'Cita confirmada exitosamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al confirmar la cita: ' . $conn->error]);
}

$conn->close();
?>