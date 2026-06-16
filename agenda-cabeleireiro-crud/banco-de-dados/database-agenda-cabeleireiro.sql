SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "-03:00";

CREATE DATABASE IF NOT EXISTS `agenda_cabeleireiro`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE `agenda_cabeleireiro`;

CREATE TABLE IF NOT EXISTS `Agendamentos` (
  `idAgendamento` int unsigned NOT NULL AUTO_INCREMENT,
  `NomeSolicitante` varchar(254) NOT NULL,
  `TelefoneSolicitante` varchar(15) NOT NULL,
  `DataHoraAgendamento` datetime NOT NULL,
  `NomeProfissional` varchar(254) NOT NULL,
  `DataHoraAtendimento` datetime DEFAULT NULL,
  `DataHoraCancelamento` datetime DEFAULT NULL,
  `Servico` varchar(100) NOT NULL,
  `Observacoes` text DEFAULT NULL,
  PRIMARY KEY (`idAgendamento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `Agendamentos`
  (`NomeSolicitante`, `TelefoneSolicitante`, `DataHoraAgendamento`, `NomeProfissional`, `DataHoraAtendimento`, `DataHoraCancelamento`, `Servico`, `Observacoes`)
VALUES
  ('Mariana Alves', '11988887777', '2026-06-16 09:00:00', 'Camila Rocha', NULL, NULL, 'Corte masculino', 'Cliente chegou recomendada pelo namorado.'),
  ('Joao Pedro', '11977776666', '2026-06-14 10:30:00', 'Renata Silva', '2026-06-14 11:15:00', NULL, 'Escova', 'Finalizar com protetor termico.'),
  ('Carla Mendes', '11966665555', '2026-06-13 14:00:00', 'Patricia Lima', NULL, '2026-06-13 12:20:00', 'Barba', 'Cancelado por motivo de viagem.'),
  ('Beatriz Souza', '11955554444', '2026-06-17 15:00:00', 'Camila Rocha', NULL, NULL, 'Hidratacao', 'Usar mascara de reconstrucao.'),
  ('Fernando Costa', '11944443333', '2026-06-12 17:00:00', 'Renata Silva', '2026-06-12 17:55:00', NULL, 'Coloracao', 'Tom castanho claro.');

COMMIT;
