<?php
// php/conexion.php
$host = "localhost";
$user = "root";
$password = "";
$database = "consultorio_dental";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    // Si es petición AJAX, responde con JSON
    if (strpos($_SERVER['REQUEST_URI'], 'reagendar_cita.php') !== false) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Error de conexión: ' . $conn->connect_error]);
        exit;
    } else {
        die("Error de conexión: " . $conn->connect_error);
    }
}
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
?>