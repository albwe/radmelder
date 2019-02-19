-- Adminer 4.7.1 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';

DROP TABLE IF EXISTS `mails`;
CREATE TABLE `mails` (
  `fk_stelle_id` int(11) NOT NULL,
  `mail` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `mailing` varchar(5000) COLLATE utf8_bin DEFAULT NULL,
  `mailing_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`fk_stelle_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


DROP TABLE IF EXISTS `service`;
CREATE TABLE `service` (
  `fk_stelle` int(11) NOT NULL,
  `service_note` varchar(1000) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`fk_stelle`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


DROP TABLE IF EXISTS `stellen`;
CREATE TABLE `stellen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lat` decimal(11,8) DEFAULT NULL,
  `lng` decimal(11,8) DEFAULT NULL,
  `position_text` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `Titel` varchar(300) COLLATE utf8_bin NOT NULL,
  `Problem` varchar(2000) COLLATE utf8_bin DEFAULT NULL,
  `Loesung` varchar(2000) COLLATE utf8_bin DEFAULT NULL,
  `Bild` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `Kategorie` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `Bearbeitungsstatus` varchar(100) COLLATE utf8_bin DEFAULT 'Gemeldet',
  `published` int(11) NOT NULL DEFAULT '0',
  `declined` int(11) NOT NULL DEFAULT '0',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_stelle` int(11) NOT NULL,
  `tag_name` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `tag_value` varchar(100) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


DROP TABLE IF EXISTS `votes`;
CREATE TABLE `votes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_stelle` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


-- 2019-02-19 10:00:51
