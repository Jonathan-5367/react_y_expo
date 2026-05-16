<?php
// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_NAME', 'consultorio_dental');
define('DB_USER', 'root');
define('DB_PASS', '');

// Conexión a la base de datos
function getDBConnection() {
    try {
        $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch(PDOException $e) {
        die("ERROR: No se pudo conectar. " . $e->getMessage());
    }
}

// Verificar disponibilidad de horario - CORREGIDO
function checkAvailability($fecha, $hora) {
    $pdo = getDBConnection();
    
    // Convertir fecha y hora separadas a formato datetime
    $fecha_hora = $fecha . ' ' . $hora . ':00';
    
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM citas WHERE fecha_hora = ? AND estado IN ('pendiente', 'confirmada')");
    $stmt->execute([$fecha_hora]);
    $count = $stmt->fetchColumn();
    return $count == 0;
}

// Obtener o crear un doctor por defecto - CORREGIDO
function getDefaultDoctorId($pdo) {
    // Buscar un usuario con rol de doctor (id_rol = 2)
    $stmt = $pdo->query("SELECT id_usuario FROM usuarios WHERE id_rol = 2 LIMIT 1");
    $doctor = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($doctor) {
        return $doctor['id_usuario'];
    }
    
    // Si no hay doctores, crear uno por defecto
    $password_hash = password_hash('doctor123', PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO usuarios (nombre, email, password, telefono, id_rol) VALUES (?, ?, ?, ?, 2)");
    $stmt->execute(['Doctor Por Defecto', 'doctor@consultorio.com', $password_hash, '0000000000']);
    
    return $pdo->lastInsertId();
}

// Guardar cita en la base de datos - CORREGIDO
function saveAppointment($datos) {
    $pdo = getDBConnection();
    
    // Convertir fecha y hora separadas a formato datetime
    $fecha_hora = $datos['fecha'] . ' ' . $datos['hora'] . ':00';
    
    // Obtener el ID del paciente basado en el email - CORREGIDO
    $stmt = $pdo->prepare("
        SELECT p.id_paciente, u.id_usuario 
        FROM pacientes p 
        INNER JOIN usuarios u ON p.id_origen = u.id_usuario 
        WHERE u.email = ? AND u.id_rol = 4
    ");
    $stmt->execute([$datos['email']]);
    $paciente = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$paciente) {
        return false; // Paciente no encontrado
    }
    
    $paciente_id = $paciente['id_paciente'];
    $usuario_id = $paciente['id_usuario'];
    
    // Obtener un doctor_id válido (crear uno por defecto si es necesario)
    $doctor_id = getDefaultDoctorId($pdo);
    
    // Insertar en la tabla citas con la estructura correcta - CORREGIDO
    $sql = "INSERT INTO citas (paciente_id, doctor_id, fecha_hora, motivo, estado, creado_por) 
            VALUES (?, ?, ?, ?, 'pendiente', ?)";
    $stmt = $pdo->prepare($sql);
    return $stmt->execute([
        $paciente_id,
        $doctor_id,
        $fecha_hora,
        $datos['procedimiento'],
        $usuario_id
    ]);
}

// Función para obtener horarios disponibles - NUEVA
function getAvailableHours($fecha) {
    $pdo = getDBConnection();
    
    // Horarios de trabajo (8:00 AM - 12:00 PM)
    $horarios_base = [
        '08:00', '08:30', '09:00', '09:30', 
        '10:00', '10:30', '11:00', '11:30'
    ];
    
    // Obtener horarios ocupados para la fecha
    $stmt = $pdo->prepare("
        SELECT TIME(fecha_hora) as hora 
        FROM citas 
        WHERE DATE(fecha_hora) = ? 
        AND estado IN ('pendiente', 'confirmada')
    ");
    $stmt->execute([$fecha]);
    $horarios_ocupados = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Filtrar horarios disponibles
    $horarios_disponibles = array_diff($horarios_base, $horarios_ocupados);
    
    return array_values($horarios_disponibles);
}
?>