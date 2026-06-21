-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-06-2026 a las 07:03:17
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
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Restricciones para tablas volcadas
--

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
