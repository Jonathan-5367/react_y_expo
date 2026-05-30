<?php
session_start();
include 'conexion.php';

// Verificar si el usuario ha iniciado sesión
if (!isset($_SESSION['email'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

if (!isset($_POST['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID de cita no proporcionado']);
    exit;
}

$cita_id = intval($_POST['id']);
$email = $_SESSION['email'];

// CORREGIDO: Obtener el paciente_id correctamente según la estructura de tu base de datos
$stmt = $conn->prepare("
    SELECT u.id_usuario, p.id_paciente 
    FROM usuarios u 
    INNER JOIN pacientes p ON u.id_usuario = p.id_origen
    WHERE u.email = ?
");
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Paciente no encontrado']);
    exit;
}

$usuario = $result->fetch_assoc();
$paciente_id = $usuario['id_paciente'];

// CORREGIDO: Verificar que la cita pertenece al paciente actual usando id_cita
$stmt = $conn->prepare("
    SELECT c.id_cita 
    FROM citas c
    WHERE c.id_cita = ? AND c.paciente_id = ?
");
$stmt->bind_param('ii', $cita_id, $paciente_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Cita no encontrada o no pertenece al usuario']);
    exit;
}

// CORREGIDO: Actualizar el estado de la cita usando id_cita
$stmt = $conn->prepare("UPDATE citas SET estado = 'cancelada' WHERE id_cita = ?");
$stmt->bind_param('i', $cita_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Cita cancelada exitosamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al cancelar la cita: ' . $conn->error]);
}

$conn->close();
?>