-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-06-2026 a las 08:01:37
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `consultorio_dental`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `adjuntos_pacientes`
--

CREATE TABLE `adjuntos_pacientes` (
  `id_adjunto` int(11) NOT NULL,
  `paciente_id` int(11) DEFAULT NULL,
  `cita_id` int(11) DEFAULT NULL,
  `tipo` enum('foto','documento','radiografia','analisis','receta','otro') DEFAULT NULL,
  `url_archivo` varchar(255) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `subido_por` int(11) DEFAULT NULL,
  `subido_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `agenda_horaria`
--

CREATE TABLE `agenda_horaria` (
  `id_agenda` int(11) NOT NULL,
  `doctor_id` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_fin` time DEFAULT NULL,
  `cupos_disponibles` int(11) DEFAULT NULL,
  `cupos_ocupados` int(11) DEFAULT 0,
  `estado` enum('disponible','ocupado','cancelado','bloqueado') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bloqueos_horarios`
--

CREATE TABLE `bloqueos_horarios` (
  `id_bloqueo` int(11) NOT NULL,
  `doctor_id` int(11) DEFAULT NULL,
  `fecha_inicio` datetime DEFAULT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `motivo` enum('vacaciones','enfermedad','capacitacion','reunion','emergencia','otro') DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `citas`
--

CREATE TABLE `citas` (
  `id_cita` int(11) NOT NULL,
  `paciente_id` int(11) DEFAULT NULL,
  `doctor_id` int(11) DEFAULT NULL,
  `id_agenda` int(11) DEFAULT NULL,
  `fecha_hora` datetime DEFAULT NULL,
  `motivo` text DEFAULT NULL,
  `estado` enum('pendiente','confirmada','en_progreso','completada','cancelada','no_asistio') DEFAULT NULL,
  `creado_por` int(11) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `citas`
--

INSERT INTO `citas` (`id_cita`, `paciente_id`, `doctor_id`, `id_agenda`, `fecha_hora`, `motivo`, `estado`, `creado_por`, `creado_en`) VALUES
(2, 3, 1, NULL, '2025-10-29 09:30:00', 'Blanqueamiento', 'confirmada', 9, '2025-10-19 23:41:50'),
(3, 4, 1, NULL, '2026-02-18 09:30:00', 'Limpieza dental', 'cancelada', 10, '2026-02-16 04:26:42'),
(4, 4, 1, NULL, '2026-02-20 10:30:00', 'Limpieza dental', 'confirmada', 10, '2026-02-16 04:30:47'),
(5, 4, 1, NULL, '2026-02-18 10:00:00', 'Extracción', 'confirmada', 10, '2026-02-16 04:44:48'),
(6, 7, 1, NULL, '2026-06-18 09:00:00', 'Ortodoncia', 'confirmada', 13, '2026-06-14 01:21:22');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cita_tratamiento`
--

CREATE TABLE `cita_tratamiento` (
  `cita_id` int(11) NOT NULL,
  `tratamiento_id` int(11) NOT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_presupuesto`
--

CREATE TABLE `detalle_presupuesto` (
  `presupuesto_id` int(11) NOT NULL,
  `tratamiento_id` int(11) NOT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `familiares`
--

CREATE TABLE `familiares` (
  `id_familiar` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `cedula` varchar(8) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `parentesco` enum('padre','madre','abuelo','abuela','tutor','otro') DEFAULT NULL,
  `telefono` varchar(11) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_citas`
--

CREATE TABLE `historial_citas` (
  `id_historial_cita` int(11) NOT NULL,
  `cita_id` int(11) DEFAULT NULL,
  `estado_anterior` enum('pendiente','confirmada','en_progreso','completada','cancelada','no_asistio') DEFAULT NULL,
  `estado_nuevo` enum('pendiente','confirmada','en_progreso','completada','cancelada','no_asistio') DEFAULT NULL,
  `notas` text DEFAULT NULL,
  `actualizado_por` int(11) DEFAULT NULL,
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historial_citas`
--

INSERT INTO `historial_citas` (`id_historial_cita`, `cita_id`, `estado_anterior`, `estado_nuevo`, `notas`, `actualizado_por`, `actualizado_en`) VALUES
(1, 2, 'confirmada', 'confirmada', 'Confirmada por administrador', 7, '2025-10-23 04:42:32'),
(2, 4, 'confirmada', 'confirmada', 'Confirmada por administrador', 13, '2026-02-16 04:45:44'),
(3, 5, 'confirmada', 'confirmada', 'Confirmada por administrador', 13, '2026-02-16 04:45:48');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_medico`
--

CREATE TABLE `historial_medico` (
  `id_historial_medico` int(11) NOT NULL,
  `paciente_id` int(11) DEFAULT NULL,
  `cita_id` int(11) DEFAULT NULL,
  `doctor_id` int(11) DEFAULT NULL,
  `diagnostico` text DEFAULT NULL,
  `tratamiento` text DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horarios_doctores`
--

CREATE TABLE `horarios_doctores` (
  `id_horario` int(11) NOT NULL,
  `doctor_id` int(11) DEFAULT NULL,
  `dia_semana` enum('lunes','martes','miercoles','jueves','viernes','sabado','domingo') DEFAULT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_fin` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id_notificacion` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `cita_id` int(11) DEFAULT NULL,
  `tipo` enum('email','sms','sistema','push') DEFAULT NULL,
  `asunto` varchar(100) DEFAULT NULL,
  `mensaje` text DEFAULT NULL,
  `estado` enum('pendiente','enviado','entregado','fallido') DEFAULT NULL,
  `enviado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id_paciente` int(11) NOT NULL,
  `tipo` enum('adulto','menor') DEFAULT NULL,
  `id_origen` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id_paciente`, `tipo`, `id_origen`) VALUES
(3, 'adulto', 9),
(4, 'adulto', 10),
(5, 'adulto', 15),
(6, 'adulto', 17),
(7, 'adulto', 13),
(8, 'adulto', 18),
(9, 'adulto', 20);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id_pago` int(11) NOT NULL,
  `cita_id` int(11) DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  `metodo` enum('efectivo','tarjeta_credito','tarjeta_debito','transferencia','otro') DEFAULT NULL,
  `estado` enum('pendiente','completado','fallido','reembolsado') DEFAULT NULL,
  `fecha_pago` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `observaciones` text DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `presupuestos`
--

CREATE TABLE `presupuestos` (
  `id_presupuesto` int(11) NOT NULL,
  `paciente_id` int(11) DEFAULT NULL,
  `doctor_id` int(11) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `estado` enum('pendiente','aprobado','rechazado','cancelado') DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre` enum('administrador','doctor','recepcionista','paciente') DEFAULT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre`, `descripcion`) VALUES
(1, 'administrador', 'Administrador del sistema'),
(2, 'doctor', 'Personal médico'),
(3, 'recepcionista', 'Personal de recepción'),
(4, 'paciente', 'Pacientes del consultorio');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tratamientos`
--

CREATE TABLE `tratamientos` (
  `id_tratamiento` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `costo` decimal(10,2) DEFAULT NULL,
  `duracion_estimada` int(11) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tratamientos`
--

INSERT INTO `tratamientos` (`id_tratamiento`, `nombre`, `descripcion`, `costo`, `duracion_estimada`, `activo`, `creado_en`) VALUES
(1, 'Limpieza dental', 'Limpieza profesional de dientes y encías', 50.00, 30, 1, '2025-10-15 01:37:54'),
(2, 'Extracción dental', 'Extracción de pieza dental', 80.00, 45, 1, '2025-10-15 01:37:54'),
(3, 'Ortodoncia', 'Tratamiento de ortodoncia correctiva', 150.00, 60, 1, '2025-10-15 01:37:54'),
(4, 'Blanqueamiento', 'Blanqueamiento dental profesional', 120.00, 60, 1, '2025-10-15 01:37:54'),
(5, 'Consulta general', 'Consulta odontológica general', 30.00, 20, 1, '2025-10-15 01:37:54');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `cedula` varchar(8) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `telefono` varchar(11) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `es_menor` tinyint(1) DEFAULT NULL,
  `id_rol` int(11) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `telefono_familiar` varchar(11) DEFAULT NULL,
  `alergias` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `cedula`, `email`, `password`, `telefono`, `fecha_nacimiento`, `es_menor`, `id_rol`, `activo`, `creado_en`, `telefono_familiar`, `alergias`) VALUES
(1, 'Juan Echenque', '30829758', 'gonzalezjuanluis084@gmail.com', '$2y$10$JDHRPDYlpQTZLg9Okzy5hOwvXEabqYhp9P38qmfiVESDOItq51hBS', NULL, NULL, NULL, 2, 1, '2025-10-15 01:35:05', NULL, NULL),
(7, 'Admin', '1123456', 'admin@cr.com', '$2y$10$KSx27PJXSBX9d8IkiHqdf.DQeAAxFkjeoOGWUXD.OVP8/N2p6lh4m', NULL, NULL, NULL, 2, 1, '2025-10-19 14:57:54', NULL, NULL),
(9, 'user', '11144556', 'user@cr.com', '$2y$10$AXm7XQIglO.aLHRN4R0OeueSMat2A9PbAwmW2NqvHE1Lgo0G50paO', '04241234566', '2025-10-01', NULL, 4, 1, '2025-10-19 15:16:21', NULL, NULL),
(10, 'Jonathan', '12345678', 'Jonthan@gmail.com', '$2y$10$9lw4yMXHa1vRzzJ/Ly.LmOHV8HKVumnVTKT1Tjm4VcAX6lXgtKOya', '1234', '1994-07-20', NULL, 4, 1, '2026-02-07 14:10:02', NULL, NULL),
(13, 'Admin', '23456789', 'admin@correo.com', '$2y$10$irwKLNFuLgXZOkqkonHssur/wVveKz9tA5GHAcIpUbneVjk26O1za', NULL, '1995-01-04', NULL, 2, 1, '2026-02-07 14:13:53', NULL, 'Gluten'),
(15, 'Test Usuario', '11111111', 'test@test.com', '$2a$10$6wIgS6e9vnoQ5ZKMcXN80.nYqs9.S5VmwW0epmTCwkA2LrEg4s6z.', '04141111111', NULL, NULL, 4, 1, '2026-06-14 01:01:17', NULL, NULL),
(16, 'Admin Test', '22222222', 'admintest@test.com', '$2a$10$7c41I9tn1t6hpkzLbbi9ReHw6JzL9HZL4ELzE7WiS5vcpvhxkH276', '04142222222', NULL, NULL, 1, 1, '2026-06-14 01:01:44', NULL, NULL),
(17, 'Jonathan Alvarado', '12345899', 'correo1@correo.com', '$2a$10$mh4FTAXpTebirW7poo/2B.H7kQ4Jo6w3SYJTnCjIeECtcV3ljEiXS', '04141234556', '1995-08-17', NULL, 4, 1, '2026-06-14 01:06:08', '04241568355', 'Polvo, picadas'),
(18, 'Paciente Prueba', '87654321', 'paciente@paciente.com', '$2a$10$jAbiV0jXkAE.sg6/2H7riOzPNALhFxUDMPG.byoIuwig2v3hYnyUO', '04147654321', NULL, NULL, 4, 1, '2026-06-14 02:07:47', NULL, NULL),
(19, 'Administrador Prueba', '99999999', 'admin@admin.com', '$2a$10$3rBsIL2b25YBeablO7NkeO6MOBp9T1/eQRiel.B1TyoyctwJ6dKV.', '04141234567', NULL, NULL, 1, 1, '2026-06-14 02:08:00', NULL, NULL),
(20, 'Alexander vivas', '22745656', 'viva@correo.com', '$2a$10$0QLvexTq4zSHsLQoMcmAs.y/kq95itVeahF1jKqrywoWoBDfryFda', '04141235566', NULL, NULL, 4, 1, '2026-06-14 02:21:08', NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `adjuntos_pacientes`
--
ALTER TABLE `adjuntos_pacientes`
  ADD PRIMARY KEY (`id_adjunto`),
  ADD KEY `paciente_id` (`paciente_id`),
  ADD KEY `cita_id` (`cita_id`),
  ADD KEY `subido_por` (`subido_por`);

--
-- Indices de la tabla `agenda_horaria`
--
ALTER TABLE `agenda_horaria`
  ADD PRIMARY KEY (`id_agenda`),
  ADD KEY `doctor_id` (`doctor_id`);

--
-- Indices de la tabla `bloqueos_horarios`
--
ALTER TABLE `bloqueos_horarios`
  ADD PRIMARY KEY (`id_bloqueo`),
  ADD KEY `doctor_id` (`doctor_id`);

--
-- Indices de la tabla `citas`
--
ALTER TABLE `citas`
  ADD PRIMARY KEY (`id_cita`),
  ADD KEY `paciente_id` (`paciente_id`),
  ADD KEY `doctor_id` (`doctor_id`),
  ADD KEY `id_agenda` (`id_agenda`),
  ADD KEY `creado_por` (`creado_por`);

--
-- Indices de la tabla `cita_tratamiento`
--
ALTER TABLE `cita_tratamiento`
  ADD PRIMARY KEY (`cita_id`,`tratamiento_id`),
  ADD KEY `tratamiento_id` (`tratamiento_id`);

--
-- Indices de la tabla `detalle_presupuesto`
--
ALTER TABLE `detalle_presupuesto`
  ADD PRIMARY KEY (`presupuesto_id`,`tratamiento_id`),
  ADD KEY `tratamiento_id` (`tratamiento_id`);

--
-- Indices de la tabla `familiares`
--
ALTER TABLE `familiares`
  ADD PRIMARY KEY (`id_familiar`),
  ADD UNIQUE KEY `cedula` (`cedula`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `historial_citas`
--
ALTER TABLE `historial_citas`
  ADD PRIMARY KEY (`id_historial_cita`),
  ADD KEY `cita_id` (`cita_id`),
  ADD KEY `actualizado_por` (`actualizado_por`);

--
-- Indices de la tabla `historial_medico`
--
ALTER TABLE `historial_medico`
  ADD PRIMARY KEY (`id_historial_medico`),
  ADD KEY `paciente_id` (`paciente_id`),
  ADD KEY `cita_id` (`cita_id`),
  ADD KEY `doctor_id` (`doctor_id`);

--
-- Indices de la tabla `horarios_doctores`
--
ALTER TABLE `horarios_doctores`
  ADD PRIMARY KEY (`id_horario`),
  ADD KEY `doctor_id` (`doctor_id`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id_notificacion`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `cita_id` (`cita_id`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id_paciente`),
  ADD KEY `id_origen` (`id_origen`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id_pago`),
  ADD KEY `cita_id` (`cita_id`);

--
-- Indices de la tabla `presupuestos`
--
ALTER TABLE `presupuestos`
  ADD PRIMARY KEY (`id_presupuesto`),
  ADD KEY `paciente_id` (`paciente_id`),
  ADD KEY `doctor_id` (`doctor_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `tratamientos`
--
ALTER TABLE `tratamientos`
  ADD PRIMARY KEY (`id_tratamiento`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `cedula` (`cedula`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `id_rol` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `adjuntos_pacientes`
--
ALTER TABLE `adjuntos_pacientes`
  MODIFY `id_adjunto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `agenda_horaria`
--
ALTER TABLE `agenda_horaria`
  MODIFY `id_agenda` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `bloqueos_horarios`
--
ALTER TABLE `bloqueos_horarios`
  MODIFY `id_bloqueo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `citas`
--
ALTER TABLE `citas`
  MODIFY `id_cita` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `familiares`
--
ALTER TABLE `familiares`
  MODIFY `id_familiar` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `historial_citas`
--
ALTER TABLE `historial_citas`
  MODIFY `id_historial_cita` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `historial_medico`
--
ALTER TABLE `historial_medico`
  MODIFY `id_historial_medico` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `horarios_doctores`
--
ALTER TABLE `horarios_doctores`
  MODIFY `id_horario` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id_notificacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id_paciente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id_pago` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `presupuestos`
--
ALTER TABLE `presupuestos`
  MODIFY `id_presupuesto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tratamientos`
--
ALTER TABLE `tratamientos`
  MODIFY `id_tratamiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `adjuntos_pacientes`
--
ALTER TABLE `adjuntos_pacientes`
  ADD CONSTRAINT `adjuntos_pacientes_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id_paciente`),
  ADD CONSTRAINT `adjuntos_pacientes_ibfk_2` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id_cita`),
  ADD CONSTRAINT `adjuntos_pacientes_ibfk_3` FOREIGN KEY (`subido_por`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `adjuntos_pacientes_ibfk_4` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id_paciente`),
  ADD CONSTRAINT `adjuntos_pacientes_ibfk_5` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id_cita`),
  ADD CONSTRAINT `adjuntos_pacientes_ibfk_6` FOREIGN KEY (`subido_por`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `agenda_horaria`
--
ALTER TABLE `agenda_horaria`
  ADD CONSTRAINT `agenda_horaria_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `agenda_horaria_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `bloqueos_horarios`
--
ALTER TABLE `bloqueos_horarios`
  ADD CONSTRAINT `bloqueos_horarios_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `bloqueos_horarios_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `citas`
--
ALTER TABLE `citas`
  ADD CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id_paciente`),
  ADD CONSTRAINT `citas_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `citas_ibfk_3` FOREIGN KEY (`id_agenda`) REFERENCES `agenda_horaria` (`id_agenda`),
  ADD CONSTRAINT `citas_ibfk_4` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `citas_ibfk_5` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id_paciente`),
  ADD CONSTRAINT `citas_ibfk_6` FOREIGN KEY (`doctor_id`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `citas_ibfk_7` FOREIGN KEY (`id_agenda`) REFERENCES `agenda_horaria` (`id_agenda`),
  ADD CONSTRAINT `citas_ibfk_8` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `cita_tratamiento`
--
ALTER TABLE `cita_tratamiento`
  ADD CONSTRAINT `cita_tratamiento_ibfk_1` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id_cita`),
  ADD CONSTRAINT `cita_tratamiento_ibfk_2` FOREIGN KEY (`tratamiento_id`) REFERENCES `tratamientos` (`id_tratamiento`),
  ADD CONSTRAINT `cita_tratamiento_ibfk_3` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id_cita`),
  ADD CONSTRAINT `cita_tratamiento_ibfk_4` FOREIGN KEY (`tratamiento_id`) REFERENCES `tratamientos` (`id_tratamiento`);

--
-- Filtros para la tabla `detalle_presupuesto`
--
ALTER TABLE `detalle_presupuesto`
  ADD CONSTRAINT `detalle_presupuesto_ibfk_1` FOREIGN KEY (`presupuesto_id`) REFERENCES `presupuestos` (`id_presupuesto`),
  ADD CONSTRAINT `detalle_presupuesto_ibfk_2` FOREIGN KEY (`tratamiento_id`) REFERENCES `tratamientos` (`id_tratamiento`),
  ADD CONSTRAINT `detalle_presupuesto_ibfk_3` FOREIGN KEY (`presupuesto_id`) REFERENCES `presupuestos` (`id_presupuesto`),
  ADD CONSTRAINT `detalle_presupuesto_ibfk_4` FOREIGN KEY (`tratamiento_id`) REFERENCES `tratamientos` (`id_tratamiento`);

--
-- Filtros para la tabla `familiares`
--
ALTER TABLE `familiares`
  ADD CONSTRAINT `familiares_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `familiares_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `historial_citas`
--
ALTER TABLE `historial_citas`
  ADD CONSTRAINT `historial_citas_ibfk_1` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id_cita`),
  ADD CONSTRAINT `historial_citas_ibfk_2` FOREIGN KEY (`actualizado_por`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `historial_citas_ibfk_3` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id_cita`),
  ADD CONSTRAINT `historial_citas_ibfk_4` FOREIGN KEY (`actualizado_por`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `historial_medico`
--
ALTER TABLE `historial_medico`
  ADD CONSTRAINT `historial_medico_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id_paciente`),
  ADD CONSTRAINT `historial_medico_ibfk_2` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id_cita`),
  ADD CONSTRAINT `historial_medico_ibfk_3` FOREIGN KEY (`doctor_id`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `historial_medico_ibfk_4` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id_paciente`),
  ADD CONSTRAINT `historial_medico_ibfk_5` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id_cita`),
  ADD CONSTRAINT `historial_medico_ibfk_6` FOREIGN KEY (`doctor_id`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `horarios_doctores`
--
ALTER TABLE `horarios_doctores`
  ADD CONSTRAINT `horarios_doctores_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `horarios_doctores_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `notificaciones_ibfk_2` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id_cita`),
  ADD CONSTRAINT `notificaciones_ibfk_3` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `notificaciones_ibfk_4` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id_cita`);

--
-- Filtros para la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD CONSTRAINT `pacientes_ibfk_1` FOREIGN KEY (`id_origen`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id_cita`),
  ADD CONSTRAINT `pagos_ibfk_2` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id_cita`);

--
-- Filtros para la tabla `presupuestos`
--
ALTER TABLE `presupuestos`
  ADD CONSTRAINT `presupuestos_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id_paciente`),
  ADD CONSTRAINT `presupuestos_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `presupuestos_ibfk_3` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id_paciente`),
  ADD CONSTRAINT `presupuestos_ibfk_4` FOREIGN KEY (`doctor_id`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`),
  ADD CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
