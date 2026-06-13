<?php
include 'conexion.php';

// Inicializar variables para alertas
$alertType = '';
$alertMessage = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = trim($_POST['nombre']);
    $cedula = trim($_POST['cedula']);
    $email = trim($_POST['email']);
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);
    $rol_nombre = trim($_POST['rol']);

    // DEBUG: Ver qué valor está llegando
    error_log("Rol recibido: " . $rol_nombre);

    try {
        // Obtener el ID del rol seleccionado
        $stmt_rol = $conn->prepare("SELECT id_rol FROM roles WHERE nombre = ?");
        $stmt_rol->bind_param("s", $rol_nombre);
        $stmt_rol->execute();
        $result_rol = $stmt_rol->get_result();

        // DEBUG: Ver cuántos resultados obtiene
        error_log("Resultados encontrados: " . $result_rol->num_rows);

        if ($result_rol->num_rows > 0) {
            $rol = $result_rol->fetch_assoc();
            $rol_id = $rol['id_rol'];

            $stmt = $conn->prepare("INSERT INTO usuarios (nombre, cedula, email, password, id_rol, activo) VALUES (?, ?, ?, ?, ?, 1)");

            if ($stmt) {
                $stmt->bind_param("ssssi", $nombre, $cedula, $email, $password, $rol_id);
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
        } else {
            $alertType = "error";
            $alertMessage = "Rol no válido. Rol recibido: '" . $rol_nombre . "'";
        }
        
        $stmt_rol->close();
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
    <title>Registro de Personal</title>
    <link rel="stylesheet" href="../assets/css/registro.css">
    <link rel="stylesheet" href="../assets/css/alertas.css">
</head>

<body>
    <!-- Contenedor para alertas -->
    <div class="alert-container" id="alertContainer"></div>
    
    <main> 
      <div class="contenedor">
        <form action="../php/registro_admin.php" method="POST" class="formulario__login">
            <h1>Registro de Personal</h1>
            
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

            <div class="select-box">
                <select name="rol" required>
                    <option value="">Seleccione un Rol</option>
                    <!-- CORREGIDO: usar 'administrador' en lugar de 'admin' -->
                    <option value="administrador">Administrador</option>
                    <option value="doctor">Doctor</option>
                    <option value="recepcionista">Recepcionista</option>
                </select>
            </div>

            <button type="submit" class="btn">Registrar</button>

            <div class="panel-link">
              <a href="../admin/panel.php">Volver al Panel de Control</a>
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