<?php
session_start();
require_once 'database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validar datos
    $paciente = trim($_POST['paciente']);
    $telefono = trim($_POST['telefono']);
    $email = trim($_POST['email']);
    $fecha = $_POST['fecha'];
    $hora = $_POST['hora'];
    $procedimiento = $_POST['procedimiento'];
    
    // Validaciones
    if (empty($paciente) || empty($telefono) || empty($email) || empty($fecha) || empty($hora) || empty($procedimiento)) {
        $_SESSION['error'] = "Todos los campos son requeridos";
        header("Location: ../sesion/agendar-citas.php");
        exit();
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $_SESSION['error'] = "El formato de email no es válido";
        header("Location: ../sesion/agendar-citas.php");
        exit();
    }
    
    // Verificar que la fecha no sea en el pasado
    $fecha_actual = new DateTime();
    $fecha_cita = new DateTime($fecha . ' ' . $hora);
    if ($fecha_cita < $fecha_actual) {
        $_SESSION['error'] = "No se pueden agendar citas en fechas pasadas";
        header("Location: ../sesion/agendar-citas.php");
        exit();
    }
    
    // Verificar disponibilidad - CORREGIDO: usar función actualizada
    if (!checkAvailability($fecha, $hora)) {
        $_SESSION['error'] = "Lo sentimos, ese horario ya está ocupado. Por favor seleccione otro.";
        header("Location: ../sesion/agendar-citas.php");
        exit();
    }
    
    // Guardar cita - CORREGIDO
    $datos = [
        'paciente' => $paciente,
        'telefono' => $telefono,
        'email' => $email,
        'fecha' => $fecha,
        'hora' => $hora,
        'procedimiento' => $procedimiento
    ];
    
    if (saveAppointment($datos)) {
        // Preparar mensaje de WhatsApp
        $mensaje = "Hola $paciente, su cita odontológica ha sido agendada para el $fecha a las $hora. Procedimiento: $procedimiento. Por favor llegue 10 minutos antes.";
        $whatsapp_link = "https://api.whatsapp.com/send?phone=" . urlencode($telefono) . "&text=" . urlencode($mensaje);
        
        $_SESSION['success'] = "¡Cita agendada exitosamente! Se ha enviado un mensaje de confirmación por WhatsApp.";
        $_SESSION['whatsapp_link'] = $whatsapp_link;
    } else {
        $_SESSION['error'] = "Error al guardar la cita. Intente nuevamente.";
    }
    
    header("Location: ../sesion/agendar-citas.php");
    exit();
} else {
    header("Location: ../sesion/agendar-citas.php");
    exit();
}
?>