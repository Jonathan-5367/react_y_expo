<?php
include 'conexion.php';

// Inicializar variables para alertas
$alertType = '';
$alertMessage = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = trim($_POST['nombre']);
    $email = trim($_POST['email']);
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);
    $telefono = trim($_POST['telefono']);
    $cedula = trim($_POST['cedula']);
    $fecha_nacimiento = $_POST['fecha_nacimiento'];

    try {
        // Obtener el ID del rol 'paciente' - CORREGIDO: nombre correcto de columna
        $stmt_rol = $conn->prepare("SELECT id_rol FROM roles WHERE nombre = 'paciente'");
        $stmt_rol->execute();
        $result_rol = $stmt_rol->get_result();
        
        if ($result_rol->num_rows > 0) {
            $rol = $result_rol->fetch_assoc();
            $rol_id = $rol['id_rol'];
            
            // CORREGIDO: nombre correcto de columnas y tabla
            $stmt = $conn->prepare("INSERT INTO usuarios (nombre, cedula, email, password, telefono, fecha_nacimiento, id_rol, activo) VALUES (?, ?, ?, ?, ?, ?, ?, 1)");

            if ($stmt) {
                $stmt->bind_param("ssssssi", $nombre, $cedula, $email, $password, $telefono, $fecha_nacimiento, $rol_id);
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    $alertType = "success";
                    $alertMessage = "Registro exitoso!";
                } else {
                    $alertType = "error";
                    $alertMessage = "No se pudo registrar. Intenta de nuevo.";
                }

                $stmt->close();
            } else {
                $alertType = "error";
                $alertMessage = "Error en la preparación de la consulta: " . $conn->error;
            }
            
            $stmt_rol->close();
        } else {
            $alertType = "error";
            $alertMessage = "Error: No se encontró el rol de paciente.";
        }
    } catch (mysqli_sql_exception $e) {
        // Verificar si es error de duplicado (código 1062)
        if ($e->getCode() == 1062) {
            $alertType = "error";
            $alertMessage = "El correo electrónico o cédula ya está registrado. Por favor, utiliza otro.";
        } else {
            $alertType = "error";
            $alertMessage = "Error: " . $e->getMessage();
        }
    }

    $conn->close();
}
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrese</title>
    <link rel="stylesheet" href="../assets/css/registro.css">
    <link rel="stylesheet" href="../assets/css/alertas.css">
</head>

<body>
    <!-- Contenedor para alertas -->
    <div class="alert-container" id="alertContainer"></div>
    
    <main> 
      <div class="contenedor">
        <form action="../php/registro.php" method="POST" class="formulario__login">
            <h1>Registrarse</h1>
            
            <div class="input-box">
              <input type="text" placeholder="Nombre Completo" name="nombre" maxlength="50" required/>
            </div>

            <div class="input-box">
              <input type="text" placeholder="Cédula" name="cedula" maxlength="8" pattern="[0-9]*" required/>
            </div>

            <div class="input-box">
              <input type="email" placeholder="Email" name="email" required/>
            </div>

            <div class="input-box">
              <input type="password" placeholder="Contraseña" name="password" required/>
            </div>
            
            <div class="input-box">
              <input type="tel" placeholder="Número de Contacto" name="telefono" maxlength="11" pattern="[0-9]*" required/>
            </div>

            <div class="input-box">
              <input type="date" placeholder="Fecha de nacimiento" name="fecha_nacimiento" required/>
            </div>

            <button type="submit" class="btn">Registrar</button>

            <div class="login-link">
              <p>¿Ya tienes cuenta?</p>
              <a href="./Login.php">Inicia sesión Aquí</a>
            </div>
            <div class="home-link">
              <a href="../index.html">Inicio</a>
            </div>
        </form>
     </div>
    </main>
  
    <script src="../assets/js/alertas.js"></script>
    <script>
        // Pasar variables de PHP a JavaScript
        <?php if ($alertType && $alertMessage): ?>
            document.addEventListener('DOMContentLoaded', function() {
                showAlert('<?php echo $alertType; ?>', '<?php echo $alertMessage; ?>');
            });
        <?php endif; ?>
    </script>
</body>
</html>