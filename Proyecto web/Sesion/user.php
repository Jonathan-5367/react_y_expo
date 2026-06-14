<?php
session_start();
// Verificar si el usuario ha iniciado sesión
if (!isset($_SESSION['email'])) {
  header("Location: login.php");
  exit;
}

include '../php/conexion.php';

// Obtener el ID del usuario logueado - CORREGIDO CON VERIFICACIÓN
$email = $_SESSION['email'];
$stmt = $conn->prepare("
    SELECT u.id_usuario, u.nombre, p.id_paciente
    FROM usuarios u 
    LEFT JOIN pacientes p ON u.id_usuario = p.id_origen
    WHERE u.email = ? AND u.id_rol = 4
");
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();
$usuario = $result->fetch_assoc();

// Verificar si se encontró el usuario y tiene paciente asociado
if (!$usuario) {
  // Si no existe, redirigir con error
  $_SESSION['error'] = "Perfil de paciente no encontrado. Contacte al administrador.";
  header("Location: login.php");
  exit;
}

// Si no tiene paciente asociado, crearlo automáticamente
if (empty($usuario['id_paciente'])) {
  $stmt_paciente = $conn->prepare("INSERT INTO pacientes (tipo, id_origen) VALUES ('adulto', ?)");
  $stmt_paciente->bind_param('i', $usuario['id_usuario']);
  $stmt_paciente->execute();
  $usuario['id_paciente'] = $conn->insert_id;
  $stmt_paciente->close();
}

$paciente_id = $usuario['id_paciente'];
$nombre_usuario = $usuario['nombre'];

// Obtener SOLO las citas del usuario para el calendario - CORREGIDO
$stmt = $conn->prepare("
    SELECT c.id_cita, c.fecha_hora, c.motivo, c.estado, 
           d.nombre as doctor_nombre
    FROM citas c
    LEFT JOIN usuarios d ON c.doctor_id = d.id_usuario
    WHERE c.paciente_id = ?
    ORDER BY c.fecha_hora ASC
");
$stmt->bind_param('i', $paciente_id);
$stmt->execute();
$citas_result = $stmt->get_result();

$citas = [];
while ($cita = $citas_result->fetch_assoc()) {
  $fecha = date('Y-m-d', strtotime($cita['fecha_hora']));
  $citas[$fecha][] = $cita;
}

$conn->close();

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
  <link rel="stylesheet" href="../assets/css/menu_style.css" />
  <link rel="stylesheet" href="../assets/css/calendar.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.css">
  <!--Link Google Fonst Icons-->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.min.css" integrity="sha512-XcIsjKMcuVe0Ucj/xgIXQnytNwBttJbNjltBV18IOnru2lDPe9KRRyvCXw6Y5H415vbBLRm8+q6fmLUU7DfO6Q==" crossorigin="anonymous" referrerpolicy="no-referrer" />
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
          <a href="./user.php" class="menu-link active" title="Inicio">
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
    <div class="main-content">
      <h1 class="page-title">Bienvenido <?php echo $nombre_usuario; ?></h1>
      <h2 class="card">
        Consultorio Odontológico Dra. Nazaret Lopez
      </h2>
    </div>
    <!--Calendario-->
    <header class="title-header">
      <h1>Mi Calendario de Citas</h1>
    </header>

    <div class="container_calendar">
      <section class="calendar">
        <header class="calendar__header">
          <div class="header__container">
            <button class="calendar__button calendar__button--previous" aria-label="Ir al Anterior Mes"><i class="ri-arrow-left-s-line"></i></button>
            <h3 class="container__heading" id="calendar-date"></h3>
            <button class="calendar__button calendar__button--next" aria-label="Ir al Siguiente Mes"><i class="ri-arrow-right-s-line"></i></button>
          </div>
          <button class="calendar__button calendar__button--info" aria-label="Tener en Cuenta"><i class="ri-information-line"></i></button>
        </header>

        <!-- Días de la semana -->
        <section class="calendar__weekdays">
          <div class="calendar__weekday">
            <h4>Lunes</h4><abbr>Lun</abbr>
          </div>
          <div class="calendar__weekday">
            <h4>Martes</h4><abbr>Mar</abbr>
          </div>
          <div class="calendar__weekday">
            <h4>Miércoles</h4><abbr>Mié</abbr>
          </div>
          <div class="calendar__weekday">
            <h4>Jueves</h4><abbr>Jue</abbr>
          </div>
          <div class="calendar__weekday">
            <h4>Viernes</h4><abbr>Vie</abbr>
          </div>
          <div class="calendar__weekday">
            <h4>Sábado</h4><abbr>Sáb</abbr>
          </div>
          <div class="calendar__weekday">
            <h4>Domingo</h4><abbr>Dom</abbr>
          </div>
        </section>

        <!-- Días del mes - Se generan dinámicamente -->
        <ol class="calendar__days" id="calendar-days">
          <!-- Los días se generarán con JavaScript -->
        </ol>
      </section>
    </div>
  </main>

  <!-- Modal-->
  <dialog class="modal" id="appointments-modal" role="dialog" aria-labelledby="Modal vista de Citas" aria-describedby="Citas para un día en específico">
    <div class="modal__container">
      <section class="modal__card">
        <header class="modal__header">
          <h3 class="modal__heading" id="modal-date-title">Mis Citas del día</h3>
          <button type="button" class="modal__close" aria-label="Cerrar Modal"><i class="ri-close-line"></i></button>
        </header>
        <div class="modal__list__container">
          <ul class="modal__list" id="modal-appointments-list">
            <!-- Las citas se cargarán aquí -->
          </ul>
        </div>
        <footer class="modal__footer">
          <button type="button" class="modal__button modal__button--close" aria-label="Cancelar y Cerrar Modal">Cerrar</button>
          <a href="./agendar-citas.php" class="modal__button modal__button--primary modal__button--control">Agendar Nueva Cita</a>
        </footer>
      </section>
    </div>
  </dialog>

  <footer></footer>

  <!-- Pasar las citas a JavaScript -->
  <script>
    const userCitas = <?php echo json_encode($citas); ?>;
    const pacienteId = <?php echo $paciente_id; ?>;
    const esAdministrador = false;
  </script>

  <!--Scripts-->
  <script src="../assets/js/menu.js"></script>
  <script src="../assets/js/calendario.js"></script>
</body>

</html>