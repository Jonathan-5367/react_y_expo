<?php
session_start();
// Verificar si el usuario ha iniciado sesión
if (!isset($_SESSION['email'])) {
    header("Location: ../php/login.php");
    exit;
}

include '../php/conexion.php';

// Obtener el ID del usuario logueado - CORREGIDO
$email = $_SESSION['email'];
$stmt = $conn->prepare("
    SELECT u.id_usuario, u.nombre, p.id_paciente 
    FROM usuarios u 
    INNER JOIN roles r ON u.id_rol = r.id_rol 
    INNER JOIN pacientes p ON u.id_usuario = p.id_origen
    WHERE u.email = ? AND r.nombre = 'paciente'
");
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();
$usuario = $result->fetch_assoc();
$paciente_id = $usuario['id_paciente'];
$nombre_usuario = $usuario['nombre'];

// Obtener las citas del usuario - CORREGIDO
$stmt = $conn->prepare("
    SELECT c.id_cita, c.fecha_hora, c.motivo, c.estado, c.creado_en, 
           d.nombre as doctor_nombre
    FROM citas c
    LEFT JOIN usuarios d ON c.doctor_id = d.id_usuario
    WHERE c.paciente_id = ?
    ORDER BY c.fecha_hora DESC
");
$stmt->bind_param('i', $paciente_id);
$stmt->execute();
$citas = $stmt->get_result();

$conn->close();
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Historial de Citas</title>
    <!--Link Google Fonst Icons-->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0">
    <link rel="stylesheet" href="../assets/css/historial_citas.css" />
    <link rel="stylesheet" href="../assets/css/menu_style.css" />
    <link rel="stylesheet" href="../assets/css/alertas_cancelar.css">
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
                    <a href="user.php" class="menu-link" title="Inicio">
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
                    <a href="./historial_citas.php" class="menu-link active" title="Historial de Tratamientos">
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

    <!-- Contenedor para alertas -->
    <div class="alert-container" id="alertContainer"></div>

    <!-- Modal de cancelar -->
    <div id="cancelModal" class="modal">
        <div class="modal-content">
            <div class="modal-title">
                <h3>Confirmar Cancelación</h3>
            </div>
            <div class="containar-mensaje">
                <p id="modalMessage">¿Estás seguro de que deseas cancelar esta cita?</p>
            </div>
            <div class="modal-buttons">
                <button id="confirmCancel" class="acciones-btn btn-cancelar-modal">Cancelar cita</button>
                <button id="cancelCancel" class="acciones-btn btn-cerrar-modal">Cerrar</button>
            </div>
        </div>
    </div>

    <!--Main content-->
    <main>
        <div class="main-content">
            <h1 class="page-title">Bienvenido <?php echo isset($_SESSION['user_name']) ? $_SESSION['user_name'] : 'Usuario'; ?></h1>
            <h2 class="card">
                Consultorio Odontológico Dra. Nazaret Lopez
            </h2>
        </div>
        <header class="historial-header">
            <h1>Mis Citas Agendadas</h1>
        </header>

        <div class="historial-container">
            <?php if ($citas->num_rows > 0): ?>
                <table class="citas-table">
                    <thead>
                        <tr>
                            <th>Fecha y Hora</th>
                            <th>Procedimiento</th>
                            <th>Doctor</th>
                            <th>Estado</th>
                            <th>Fecha de Creación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $now = new DateTime();
                        while ($cita = $citas->fetch_assoc()):
                            $fecha_hora = new DateTime($cita['fecha_hora']);
                            $creado_en = new DateTime($cita['creado_en']);
                            $clase_extra = '';

                            if ($fecha_hora < $now && $cita['estado'] == 'pendiente') {
                                $clase_extra = 'cita-pasada';
                            } elseif ($fecha_hora > $now && ($cita['estado'] == 'pendiente' || $cita['estado'] == 'confirmada')) {
                                $clase_extra = 'cita-proxima';
                            }
                        ?>
                            <tr class="fila-cita <?php echo $clase_extra; ?>" data-estado="<?php echo $cita['estado']; ?>">
                                <td data-label="Fecha y Hora:"><?php echo $fecha_hora->format('d/m/Y H:i'); ?></td>
                                <td data-label="Procedimiento:"><?php echo htmlspecialchars($cita['motivo']); ?></td>
                                <td data-label="Doctor:"><?php echo htmlspecialchars($cita['doctor_nombre'] ?? 'Por asignar'); ?></td>
                                <td data-label="Estado:">
                                    <span class="estado-badge estado-<?php echo $cita['estado']; ?>">
                                        <?php echo ucfirst($cita['estado']); ?>
                                    </span>
                                </td>
                                <td data-label="Fecha de Creación:"><?php echo $creado_en->format('d/m/Y H:i'); ?></td>
                                <td data-label="Acciones:">
                                    <div class="container-btn">
                                        <?php if (($cita['estado'] == 'pendiente' || $cita['estado'] == 'confirmada') && $fecha_hora > $now): ?>
                                            <!-- Botón para cancelar cita -->
                                            <button class="acciones-btn btn-cancelar" onclick="iniciarCancelacion(<?php echo $cita['id_cita']; ?>, '<?php echo $fecha_hora->format('d/m/Y H:i'); ?>', '<?php echo htmlspecialchars($cita['motivo']); ?>')" title="Cancelar cita">
                                                <span class="material-symbols-rounded">delete</span>
                                            </button>
                                        <?php endif; ?>
                                    </div>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <div class="sin-citas">
                    <p>No tienes citas agendadas.</p>
                    <a href="agendar-citas.php" class="btn">Agendar mi primera cita</a>
                </div>
            <?php endif; ?>
        </div>

    </main>

    <footer></footer>

    <!--Scripts-->
    <script src="../assets/js/menu.js"></script>
    <script src="../assets/js/alertas.js"></script>
    <script src="../assets/js/historial_cita.js"></script>
</body>

</html>