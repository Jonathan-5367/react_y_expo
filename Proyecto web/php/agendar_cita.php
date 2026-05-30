<?php
session_start();
include 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $_SESSION['error'] = 'Método no permitido';
    header('Location: ../sesion/agendar-citas.php');
    exit;
}

// Obtener datos del formulario
$paciente_nombre = $_POST['paciente'] ?? '';
$telefono = $_POST['telefono'] ?? '';
$email = $_POST['email'] ?? '';
$fecha = $_POST['fecha'] ?? '';
$hora = $_POST['hora'] ?? '';
$procedimiento = $_POST['procedimiento'] ?? '';

// Validaciones básicas
if (empty($paciente_nombre) || empty($telefono) || empty($email) || empty($fecha) || empty($hora) || empty($procedimiento)) {
    $_SESSION['error'] = 'Todos los campos son obligatorios';
    header('Location: ../sesion/agendar-citas.php');
    exit;
}

// Validar formato de fecha y hora
$fecha_hora = $fecha . ' ' . $hora . ':00';
if (!DateTime::createFromFormat('Y-m-d H:i:s', $fecha_hora)) {
    $_SESSION['error'] = 'Formato de fecha u hora inválido';
    header('Location: ../sesion/agendar-citas.php');
    exit;
}

// Validar que la fecha no sea en el pasado
if (strtotime($fecha_hora) < time()) {
    $_SESSION['error'] = 'No puede agendar citas en el pasado';
    header('Location: ../sesion/agendar-citas.php');
    exit;
}

// Validar que no sea fin de semana ni viernes
$dia_semana = date('w', strtotime($fecha));
if ($dia_semana == 0 || $dia_semana == 5 || $dia_semana == 6) { // 0=domingo, 5=viernes, 6=sábado, 
    $_SESSION['error'] = 'El consultorio solo atiende de lunes a jueves';
    header('Location: ../sesion/agendar-citas.php');
    exit;
}

// Validar horario (8am - 12pm)
$hora_num = (int) explode(':', $hora)[0];
if ($hora_num < 8 || $hora_num >= 12) {
    $_SESSION['error'] = 'El horario de atención es de 8:00 am a 12:00 pm';
    header('Location: ../sesion/agendar-citas.php');
    exit;
}

try {
    // Obtener ID del paciente
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $usuario = $result->fetch_assoc();
    
    if (!$usuario) {
        throw new Exception('Usuario no encontrado');
    }
    
    $paciente_id = $usuario['id'];
    
    // Verificar si ya existe una cita en esa fecha y hora
    $stmt = $conn->prepare("SELECT id FROM citas WHERE fecha_hora = ? AND estado != 'cancelada'");
    $stmt->bind_param('s', $fecha_hora);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $_SESSION['error'] = 'Ya existe una cita agendada para esta fecha y hora';
        header('Location: ../sesion/agendar-citas.php');
        exit;
    }
    
    // Insertar la cita en la base de datos
    $stmt = $conn->prepare("INSERT INTO citas (paciente_id, fecha_hora, motivo, estado, creado_por) VALUES (?, ?, ?, 'pendiente', ?)");
    $stmt->bind_param('issi', $paciente_id, $fecha_hora, $procedimiento, $paciente_id);
    
    if ($stmt->execute()) {
        $cita_id = $conn->insert_id;
        
        // Generar enlace de WhatsApp
        $mensaje_whatsapp = urlencode("Hola, he agendado una cita para el procedimiento: $procedimiento\nFecha: $fecha\nHora: $hora\nPaciente: $paciente_nombre\nTeléfono: $telefono");
        $whatsapp_link = "https://wa.me/584161413301?text=$mensaje_whatsapp";
        
        $_SESSION['success'] = 'Cita agendada exitosamente. Por favor, confirme su cita por WhatsApp.';
        $_SESSION['whatsapp_link'] = $whatsapp_link;
        
        header('Location: ../sesion/agendar-citas.php');
        exit;
    } else {
        throw new Exception('Error al agendar la cita en la base de datos');
    }
    
} catch (Exception $e) {
    $_SESSION['error'] = 'Error al procesar la cita: ' . $e->getMessage();
    header('Location: ../sesion/agendar-citas.php');
    exit;
}
?>