<?php
// get_horarios.php
require_once 'database.php';

if (isset($_GET['fecha'])) {
    $fecha = $_GET['fecha'];
    
    // Validar formato de fecha
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
        echo json_encode(['success' => false, 'error' => 'Formato de fecha inválido']);
        exit;
    }
    
    // Verificar que la fecha no sea en el pasado
    $fecha_actual = new DateTime();
    $fecha_solicitada = new DateTime($fecha);
    if ($fecha_solicitada < $fecha_actual->setTime(0, 0, 0)) {
        echo json_encode(['success' => false, 'error' => 'No se pueden agendar citas en fechas pasadas']);
        exit;
    }
    
    // Obtener horarios disponibles - CORREGIDO: usar función actualizada
    $horarios = getAvailableHours($fecha);
    
    if (!empty($horarios)) {
        echo json_encode(['success' => true, 'horarios' => $horarios]);
    } else {
        echo json_encode(['success' => false, 'error' => 'No hay horarios disponibles para esta fecha']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Fecha no proporcionada']);
}
?>