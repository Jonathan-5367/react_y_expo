<?php
session_start();
include 'conexion.php';

// Verificar si el usuario ha iniciado sesión
if (!isset($_SESSION['email'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

// Verificar que se haya recibido el ID de la cita y la nueva fecha
if (!isset($_POST['id']) || !isset($_POST['fecha'])) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
    exit;
}

$cita_id = intval($_POST['id']);
$nueva_fecha = $_POST['fecha'];
$email = $_SESSION['email'];

// Verificar que la cita pertenece al usuario actual
$stmt = $conn->prepare("
    SELECT c.id 
    FROM citas c
    JOIN pacientes p ON c.paciente_id = p.id
    WHERE c.id = ? AND p.email = ?
");
$stmt->bind_param('is', $cita_id, $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Cita no encontrada o no pertenece al usuario']);
    exit;
}

// Actualizar la fecha de la cita
$stmt = $conn->prepare("UPDATE citas SET fecha_hora = ? WHERE id = ?");
$stmt->bind_param('si', $nueva_fecha, $cita_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Cita reagendada exitosamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al reagendar la cita']);
}

$conn->close();
?>



