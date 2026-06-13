<?php
session_start();
include 'conexion.php';

// Verificar si ya hay una sesión activa
if(isset($_SESSION['email'])){
    if(isset($_SESSION['tipo']) && $_SESSION['tipo'] == 'admin'){
        header("location: ../admin/panel.php");
    } else {
        header("location: ../sesion/user.php");
    }
    exit;
}

// Variables para mensajes de error
$error = '';

// Procesar el formulario de login cuando se envía
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!empty($_POST['email']) && !empty($_POST['password'])) {
        $email = trim($_POST['email']);
        $password = $_POST['password'];

        // Buscar en la tabla usuarios
        $stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = ?");
        if ($stmt) {
            $stmt->bind_param('s', $email);
            $stmt->execute();
            $resultado = $stmt->get_result();

            // Verificar si se encontró el usuario
            if ($resultado->num_rows > 0) {
                $usuario = $resultado->fetch_assoc();
                
                // Verificar la contraseña
                if (password_verify($password, $usuario['password'])) {
                    $_SESSION['email'] = $email;
                    // CORREGIDO: nombre correcto de columnas
                    $_SESSION['user_id'] = $usuario['id_usuario'];
                    $_SESSION['user_name'] = $usuario['nombre'];
                    $_SESSION['rol_id'] = $usuario['id_rol'];
                    
                    // Obtener nombre del rol - CORREGIDO: nombre correcto de columnas
                    $stmt_rol = $conn->prepare("SELECT nombre FROM roles WHERE id_rol = ?");
                    $stmt_rol->bind_param('i', $usuario['id_rol']);
                    $stmt_rol->execute();
                    $rol_result = $stmt_rol->get_result();
                    $rol = $rol_result->fetch_assoc();
                    $_SESSION['rol_nombre'] = $rol['nombre'];
                    
                    // Redirigir según rol - CORREGIDO: usar id_rol correctamente
                    if (in_array($usuario['id_rol'], [1, 2, 3])) { // IDs de administrador, doctor, recepcionista
                        $_SESSION['tipo'] = 'admin';
                        header("Location: ../admin/panel.php");
                    } else {
                        $_SESSION['tipo'] = 'paciente';
                        header("Location: ../sesion/user.php");
                    }
                    exit;
                } else {
                    $error = "Contraseña incorrecta.";
                }
            } else {
                $error = "Usuario no encontrado.";
            }
            
            $stmt->close();
        } else {
            $error = "Error en la consulta de base de datos.";
        }
    } else {
        $error = "Por favor, complete todos los campos.";
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inicio de Sesión</title>
    <link rel="stylesheet" href="../assets/css/login.css">
    <link rel="stylesheet" href="../assets/css/alertas.css">
</head>

<body>
    <!-- Contenedor para alertas -->
    <div class="alert-container" id="alertContainer"></div>
    
    <div class="contenedor">
        <form action="login.php" method="POST" class="formulario__login">
            <h1>Inicia Sesión</h1>

            <?php if ($error): ?>
                <script>
                    document.addEventListener('DOMContentLoaded', function() {
                        showAlert('error', '<?php echo $error; ?>');
                    });
                </script>
            <?php endif; ?>

            <div class="input-box">
                <input type="text" placeholder="Email" name="email" required/>
            </div>

            <div class="input-box">
                <input type="password" placeholder="Contraseña" name="password" required/>
            </div>

            <div class="recordar">
                <label><input type="checkbox" /> Recuérdame</label>
            </div>

            <a href="#" class="cambio-pass">¿Olvidaste tu contraseña?</a>

            <button type="submit" class="btn">Iniciar Sesión</button>

            <div class="login-link">
                <p>¿No tienes cuenta?</p>
                <a href="./registro.php">Regístrate aquí</a>
            </div>
            <div class="home-link">
              <a href="../index.html">Inicio</a>
            </div>
        </form>
    </div>

    <script src="../assets/js/alertas.js"></script>
</body>
</html>