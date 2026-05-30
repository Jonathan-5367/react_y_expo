<?php
session_start();
// Verificar si el usuario ha iniciado sesión
if (!isset($_SESSION['email'])) {
  header("Location: login.php");
  exit;
}

// Incluir la conexión a la base de datos
include '../php/conexion.php';

// Obtener datos del usuario - CORREGIDO
$email = $_SESSION['email'];
$stmt = $conn->prepare("
    SELECT u.id_usuario, u.nombre, u.telefono, u.email, p.id_paciente
    FROM usuarios u 
    INNER JOIN roles r ON u.id_rol = r.id_rol 
    INNER JOIN pacientes p ON u.id_usuario = p.id_origen
    WHERE u.email = ? AND r.nombre = 'paciente'
");
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();
$usuario = $result->fetch_assoc();

// Mostrar mensajes de éxito o error
$error = isset($_SESSION['error']) ? $_SESSION['error'] : '';
$success = isset($_SESSION['success']) ? $_SESSION['success'] : '';
$whatsapp_link = isset($_SESSION['whatsapp_link']) ? $_SESSION['whatsapp_link'] : '';

// Limpiar mensajes después de mostrarlos
unset($_SESSION['error']);
unset($_SESSION['success']);
unset($_SESSION['whatsapp_link']);
?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenido Usuario</title>
  <link rel="stylesheet" href="../assets/css/citas_style.css" />
  <link rel="stylesheet" href="../assets/css/menu_style.css" />
  <!--Link Google Fonst Icons-->
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" />
</head>

<body>
  <!--Site-navbar-->
  <nav class="site-nav">
    <button class="sidebar-toggle">
      <span class="material-symbols-rounded" title="menu">menu</span>
    </button>
  </nav>

  <!--Sidebar-->
  <aside class="sidebar collapsed">
    <!--Sidebar Header-->
    <header class="sidebar-header">
      <img src="../assets/img/logo.svg" alt="logo" class="header-logo" />
      <button class="sidebar-toggle" title="desplegar/ocultar menu">
        <span class="material-symbols-rounded">keyboard_arrow_left</span>
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
          <a href="./perfil.php" class="menu-link" title="Mi Perfil">
            <span class="material-symbols-rounded">person</span>
            <span class="menu-label">Mi Perfil</span>
          </a>
        </li>
        <li class="menu-item">
          <a href="./agendar-citas.php" class="menu-link active" title="Agendar Citas">
            <span class="material-symbols-rounded">calendar_month</span>
            <span class="menu-label">Agendar Cita</span>
          </a>
        </li>
        <li class="menu-item">
          <a href="./historial_citas.php" class="menu-link" title="Historial de Tratamientos">
            <span class="material-symbols-rounded">
              receipt_long</span>
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
    <div class="main-content">
      <h1 class="page-title">Bienvenido <?php echo isset($_SESSION['user_name']) ? $_SESSION['user_name'] : 'Usuario'; ?></h1>
      <h2 class="card">
        Consultorio Odontológico Dra. Nazaret Lopez
      </h2>
    </div>
    <div class="container">
      <header>
        <h1>Agenda tu cita de manera fácil y rápida</h1>
      </header>

      <div class="form-container">

        <?php if ($error): ?>
          <div class="error">
            <p><?php echo $error; ?></p>
          </div>
        <?php endif; ?>

        <?php if ($success): ?>
          <div class="success">
            <p><?php echo $success; ?></p>
            <?php if ($whatsapp_link): ?>
              <a href="<?php echo $whatsapp_link; ?>" target="_blank" class="whatsapp-link">
                Abrir conversación de WhatsApp para confirmación
              </a>
            <?php endif; ?>
          </div>
        <?php else: ?>
          <!-- CORREGIDO: action actualizado -->
          <form method="POST" action="process.php" class="form-column">
            <div class="form-group">
              <label for="paciente">Nombre completo del paciente:</label>
              <input type="text" id="paciente" name="paciente" maxlength="50" value="<?php echo htmlspecialchars($usuario['nombre']); ?>" required readonly>
            </div>

            <div class="form-group">
              <label for="telefono">Número de teléfono (WhatsApp):</label>
              <input type="tel" id="telefono" name="telefono" maxlength="11" pattern="[0-9]*" value="<?php echo htmlspecialchars($usuario['telefono']); ?>" required>
            </div>

            <div class="form-group">
              <label for="email">Correo electrónico:</label>
              <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($usuario['email']); ?>" required readonly>
            </div>

            <div class="form-group">
              <label for="fecha">Fecha de la cita:</label>
              <input type="date" id="fecha" name="fecha" required min="<?php echo date('Y-m-d'); ?>">
            </div>

            <div class="form-group">
              <label for="hora">Hora de la cita:</label>
              <select id="hora" name="hora" required>
                <option value="">Seleccione una fecha primero</option>
                <!-- Las opciones se llenarán con JavaScript -->
              </select>
            </div>

            <div class="form-group">
              <label for="procedimiento">Tipo de procedimiento:</label>
              <select id="procedimiento" name="procedimiento" required>
                <option value="">Seleccione un procedimiento</option>
                <option value="Limpieza dental">Limpieza dental</option>
                <option value="Extracción">Extracción</option>
                <option value="Ortodoncia">Ortodoncia</option>
                <option value="Blanqueamiento">Blanqueamiento</option>
                <option value="Consulta">Consulta general</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div class="button-container">
              <button type="submit">Agendar Cita</button>
            </div>
          </form>
        <?php endif; ?>
      </div> 
  </main>

  <footer></footer>

  <!--Scripts-->
  <script src="../assets/js/menu.js"></script>
  <script src="../assets/js/horario.js"></script>
</body>

</html>