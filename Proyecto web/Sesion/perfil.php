<?php
session_start();
include '../php/conexion.php';

if (!isset($_SESSION['email'])) {
  header("Location: login.php");
  exit;
}

$email = $_SESSION['email'];
$stmt = $conn->prepare("
    SELECT u.nombre, u.email, u.telefono, u.cedula, u.fecha_nacimiento, 
           r.nombre as rol_nombre
    FROM usuarios u 
    INNER JOIN roles r ON u.id_rol = r.id_rol 
    WHERE u.email = ?
");
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();
$usuario = $result->fetch_assoc();

// Calcular la edad a partir de la fecha de nacimiento
$edad = '';
if (!empty($usuario['fecha_nacimiento'])) {
  $fecha = new DateTime($usuario['fecha_nacimiento']);
  $hoy = new DateTime();
  $edad = $hoy->diff($fecha)->y;
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Perfil de Usuario</title>
  <link rel="stylesheet" href="../assets/css/menu_style.css"/>
  <link rel="stylesheet" href="../assets/css/perfil.css">
  <!--Link Google Fonst Icons-->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" />
</head>

<body>

  <!--Site-navbar-->
  <nav class="site-nav">
    <button class="sidebar-toggle">
      <span class="material-symbols-rounded" title="menu">menu</span>
    </button>
  </nav>

  <aside class="sidebar collapsed">
    <!--Sidebar Header-->
    <header class="sidebar-header">
      <img src="../assets/img/logo.svg" alt="logo" class="header-logo" title="logo" />
      <button class="sidebar-toggle" title="desplegar/ocultar menu">
        <span class="material-symbols-rounded"> keyboard_arrow_left</span>
      </button>
    </header>

    <!--Sidebar Body-->
    <div class="sidebar-content">
      <ul class="menu-list">
        <li class="menu-item">
          <a href="./user.php" class="menu-link" title="Inicio">
            <span class="material-symbols-rounded">dashboard</span>
            <span class="menu-label">Inicio</span>
          </a>
        </li>
        <li class="menu-item">
          <a href="./perfil.php" class="menu-link active" title="Mi Perfil">
            <span class="material-symbols-rounded">person</span>
            <span class="menu-label">Mi Perfil</span>
          </a>
        </li>
        <li class="menu-item">
          <a href="./agendar-citas.php" class="menu-link" title="Agendar Citas">
            <span class="material-symbols-rounded">calendar_month</span>
            <span class="menu-label">Agendar Cita</span>
          </a>
        </li>
        <li class="menu-item">
          <a href="./historial_citas.php" class="menu-link" title="Historial de Tratamientos">
            <span class="material-symbols-rounded">receipt_long</span>
            <span class="menu-label">Historial de Citas</span>
          </a>
        </li>
        <li class="menu-item">
          <a href="../php/logout.php" class="menu-link" title="Cerrar Sesión">
            <span class="material-symbols-rounded">logout</span>
            <span class="menu-label">Cerrar Sesión</span>
          </a>
        </li>
      </ul>
    </div>

    <!--Sidebar Footer-->
    <div class="sidebar-footer">
      <button class="theme-toggle" title="Cambiar tema">
        <div class="theme-label">
          <span class="theme-icon material-symbols-rounded">dark_mode</span>
          <span class="theme-text">Modo Nocturno</span>
        </div>
        <div class="theme-toggle-track">
          <div class="theme-toggle-indicator"></div>
        </div>
      </button>
    </div>
  </aside>

  <!--Main-->
  <main>
    <!--Bienvanida-->
    <div class="main-content">
      <h1 class="page-title">Bienvenido <?php echo isset($_SESSION['user_name']) ? $_SESSION['user_name'] : 'Usuario'; ?></h1>
      <h2 class="card">
        Consultorio Odontológico Dra. Nazaret Lopez
      </h2>
    </div>
    <!--Historial de Citas-->
    <header class="title-header">
      <h1>Mi perfil de usuario</h1>
    </header>

    <div class="perfil-content">
      <div class="perfil-container">
        <div class="perfil-item">
          <span class="material-symbols-rounded perfil-icon">person</span>
          <div class="perfil-info">
            <h2>Nombre</h2>
            <p><?php echo htmlspecialchars($usuario['nombre']); ?></p>
          </div>
        </div>
        <div class="perfil-item">
          <span class="material-symbols-rounded perfil-icon">badge</span>
          <div class="perfil-info">
            <h2>Cédula</h2>
            <p><?php echo htmlspecialchars($usuario['cedula']); ?></p>
          </div>
        </div>
        <div class="perfil-item">
          <span class="material-symbols-rounded perfil-icon">email</span>
          <div class="perfil-info">
            <h2>Email</h2>
            <p><?php echo htmlspecialchars($usuario['email']); ?></p>
          </div>
        </div>
        <div class="perfil-item">
          <span class="material-symbols-rounded perfil-icon">phone</span>
          <div class="perfil-info">
            <h2>Teléfono</h2>
            <p><?php echo htmlspecialchars($usuario['telefono']); ?></p>
          </div>
        </div>
        <div class="perfil-item">
          <span class="material-symbols-rounded perfil-icon">cake</span>
          <div class="perfil-info">
            <h2>Fecha de Nacimiento</h2>
            <p><?php echo !empty($usuario['fecha_nacimiento']) ? date('d/m/Y', strtotime($usuario['fecha_nacimiento'])) : 'No especificada'; ?></p>
          </div>
        </div>
        <?php if (!empty($edad)): ?>
        <div class="perfil-item">
          <span class="material-symbols-rounded perfil-icon">accessibility</span>
          <div class="perfil-info">
            <h2>Edad</h2>
            <p><?php echo $edad; ?> años</p>
          </div>
        </div>
        <?php endif; ?>
        <div class="perfil-item">
          <span class="material-symbols-rounded perfil-icon">verified_user</span>
          <div class="perfil-info">
            <h2>Rol</h2>
            <p><?php echo ucfirst($usuario['rol_nombre']); ?></p>
          </div>
        </div>
      </div>
    </div>

  </main>

  <!--Scripts-->
  <script src="../assets/js/menu.js"></script>

</body>

</html>