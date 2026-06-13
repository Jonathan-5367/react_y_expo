<?php
session_start();
require_once 'conexion.php';

if (!isset($_SESSION['email'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? '';

    if (empty($id)) {
        echo json_encode(['success' => false, 'message' => 'ID de cita no proporcionado']);
        exit;
    }

    // Usar la conexión existente en lugar de crear una nueva
    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'message' => 'Error de conexión']);
        exit;
    }

    // CORREGIDO: usar id_cita en lugar de id
    $stmt = $conn->prepare("UPDATE citas SET estado = 'confirmada' WHERE id_cita = ?");
    $stmt->bind_param('i', $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Cita confirmada exitosamente']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar la cita: ' . $conn->error]);
    }

    $stmt->close();
}
?>