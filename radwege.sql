-- phpMyAdmin SQL Dump
-- version 4.0.10.15
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Erstellungszeit: 02. Okt 2018 um 22:56
-- Server Version: 5.1.73-log
-- PHP-Version: 5.5.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mails`
--

CREATE TABLE IF NOT EXISTS `mails` (
  `fk_stelle_id` int(11) NOT NULL,
  `mail` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `mailing` varchar(5000) COLLATE utf8_bin DEFAULT NULL,
  `mailing_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`fk_stelle_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `service`
--

CREATE TABLE IF NOT EXISTS `service` (
  `fk_stelle` int(11) NOT NULL,
  `service_note` varchar(1000) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`fk_stelle`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------


--
-- Tabellenstruktur für Tabelle `stellen`
--

CREATE TABLE IF NOT EXISTS `stellen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lat` decimal(11,8) DEFAULT NULL,
  `lng` decimal(11,8) DEFAULT NULL,
  `position_text` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `Titel` varchar(300) COLLATE utf8_bin NOT NULL,
  `Problem` varchar(2000) COLLATE utf8_bin DEFAULT NULL,
  `Loesung` varchar(2000) COLLATE utf8_bin DEFAULT NULL,
  `Bild` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `Status` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `published` int(11) NOT NULL DEFAULT '0',
  `declined` int(11) NOT NULL DEFAULT '0',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=547 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `tags`
--

CREATE TABLE IF NOT EXISTS `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_stelle` int(11) NOT NULL,
  `tag` varchar(100) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `votes`
--

CREATE TABLE IF NOT EXISTS `votes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_stelle` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=15995 ;

-- --------------------------------------------------------

--
-- Struktur des Views `status_anzahl`
--
DROP TABLE IF EXISTS `status_anzahl`;

CREATE ALGORITHM=UNDEFINED DEFINER=`kaktus`@`localhost` SQL SECURITY DEFINER VIEW `status_anzahl` AS select `stellen`.`Status` AS `Status`,count(`stellen`.`Status`) AS `Anzahl` from `stellen` where (`stellen`.`published` = 1) group by `stellen`.`Status` order by count(`stellen`.`Status`) desc;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
