-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-11-15 16:01:13
-- 伺服器版本： 10.4.21-MariaDB
-- PHP 版本： 7.3.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫: `sehs4517_102`
--
CREATE DATABASE IF NOT EXISTS `sehs4517_102` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `sehs4517_102`;

-- --------------------------------------------------------

--
-- 資料表結構 `customer`
--

CREATE TABLE `customer` (
  `id` int(10) UNSIGNED NOT NULL,
  `first_name` varchar(100) NOT NULL COMMENT 'First Name',
  `last_name` varchar(100) NOT NULL COMMENT 'Last Name',
  `email_address` varchar(100) NOT NULL COMMENT 'Email Address',
  `password` varchar(255) NOT NULL COMMENT 'Login Password',
  `mailing_address` text NOT NULL COMMENT 'Mailing Address',
  `phone_number` varchar(50) NOT NULL COMMENT 'Phone Number',
  `created_at` timestamp NULL DEFAULT NULL COMMENT 'Created At',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT 'Updated At',
  `last_login_at` timestamp NULL DEFAULT NULL COMMENT 'Last Login At',
  `is_active` tinyint(1) NOT NULL COMMENT 'Is Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- 資料表結構 `movie`
--

CREATE TABLE `movie` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL COMMENT 'Movie Name',
  `publish_date` date NOT NULL COMMENT 'Publish Date',
  `description` text NOT NULL COMMENT 'Description',
  `run_time` int(11) NOT NULL COMMENT 'Run Time',
  `language` varchar(100) NOT NULL COMMENT 'Language',
  `category` varchar(10) NOT NULL COMMENT 'Category',
  `cover_image_url` text NOT NULL COMMENT 'Cover Image URL',
  `price` decimal(12,2) NOT NULL COMMENT 'Price'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 傾印資料表的資料 `movie`
--

INSERT INTO `movie` (`id`, `name`, `publish_date`, `description`, `run_time`, `language`, `category`, `cover_image_url`, `price`) VALUES
(1, 'Transformers One', '2024-10-31', 'This long-awaited origin story of how the most iconic characters in the TRANSFORMERS universe, Orion Pax and D-16, went from brothers-in-arms to become sworn enemies, Optimus Prime and Megatron', 104, 'Cantonese\r\n(Sub: N/A)', 'I', 'public/images/index/tranformer.jpg', '100.00'),
(2, 'Venom: The Last Dance', '2024-11-02', 'In Venom: The Last Dance, Tom Hardy returns as Venom, one of Marvel’s greatest and most complex characters, for the final film in the trilogy. Eddie and Venom are on the run. Hunted by both of their worlds and with the net closing in, the duo are forced into a devastating decision that will bring the curtains down on Venom and Eddie\'s last dance.', 108, 'English\r\n(Sub: Chinese)', 'IIB', 'public/images/index/venom.jpg', '200.00'),
(3, 'White Bird: A Wonder Story', '2024-11-01', 'From the best-selling author of Wonder, the book that sparked a movement to “choose kind,” comes the inspirational next chapter. In White Bird: A Wonder Story, we follow Julian (Bryce Gheisar), who has struggled to belong ever since he was expelled from his former school for his treatment of Auggie Pullman. To transform his life, Julian’s grandmother (Helen Mirren) finally reveals to Julian her own story of courage — during her youth in Nazi-occupied France, a boy shelters her from mortal danger. ', 121, 'English\r\n(Sub: Chinese)', 'IIA', 'public/images/index/wonder.jpg', '300.00');

-- --------------------------------------------------------

--
-- 資料表結構 `movie_theatre`
--

CREATE TABLE `movie_theatre` (
  `id` int(10) UNSIGNED NOT NULL,
  `movie_id` int(10) UNSIGNED NOT NULL COMMENT 'Movie ID',
  `theatre_id` int(10) UNSIGNED NOT NULL COMMENT 'Theatre ID',
  `start_time` timestamp NULL DEFAULT NULL COMMENT 'Start Time'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 傾印資料表的資料 `movie_theatre`
--

INSERT INTO `movie_theatre` (`id`, `movie_id`, `theatre_id`, `start_time`) VALUES
(1, 1, 1, '2024-11-03 03:00:00'),
(2, 1, 2, '2024-11-03 06:00:00'),
(3, 1, 3, '2024-11-04 04:00:00'),
(4, 1, 1, '2024-11-04 10:00:00'),
(5, 2, 1, '2024-11-03 07:00:00'),
(6, 2, 2, '2024-11-03 11:00:00'),
(7, 2, 3, '2024-11-04 11:00:00'),
(8, 3, 1, '2024-11-03 13:00:00'),
(9, 3, 2, '2024-11-03 14:30:00'),
(10, 3, 3, '2024-11-04 15:00:00');

-- --------------------------------------------------------

--
-- 資料表結構 `reservation`
--

CREATE TABLE `reservation` (
  `id` int(10) UNSIGNED NOT NULL,
  `customer_id` int(10) UNSIGNED NOT NULL COMMENT 'Customer ID',
  `movie_theatre_id` int(10) UNSIGNED NOT NULL COMMENT 'Movie Theatre ID',
  `order_number` varchar(100) DEFAULT NULL COMMENT 'Order Number',
  `total_amount` decimal(12,2) NOT NULL COMMENT 'Total Amount',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Created At'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- 資料表結構 `reservation_item`
--

CREATE TABLE `reservation_item` (
  `id` int(10) UNSIGNED NOT NULL,
  `reservation_id` int(10) UNSIGNED NOT NULL COMMENT 'Reservation ID',
  `seat_id` int(10) UNSIGNED NOT NULL COMMENT 'Seat ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- 資料表結構 `seat`
--

CREATE TABLE `seat` (
  `id` int(11) UNSIGNED NOT NULL,
  `theatre_id` int(11) UNSIGNED NOT NULL COMMENT 'Threatre ID',
  `line` varchar(5) NOT NULL COMMENT 'Line',
  `column` int(10) UNSIGNED NOT NULL COMMENT 'Column'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 傾印資料表的資料 `seat`
--

INSERT INTO `seat` (`id`, `theatre_id`, `line`, `column`) VALUES
(1, 1, 'A', 1),
(2, 1, 'A', 2),
(3, 1, 'A', 3),
(4, 1, 'B', 1),
(5, 1, 'B', 2),
(6, 1, 'B', 3),
(7, 1, 'B', 4),
(8, 1, 'C', 1),
(9, 1, 'C', 2),
(10, 1, 'C', 3),
(11, 1, 'C', 4),
(12, 1, 'C', 5),
(13, 2, 'A', 1),
(14, 2, 'A', 2),
(15, 2, 'A', 3),
(16, 2, 'B', 1),
(17, 2, 'B', 2),
(18, 2, 'B', 3),
(19, 2, 'B', 4),
(20, 2, 'B', 5),
(21, 2, 'C', 1),
(22, 2, 'C', 2),
(23, 2, 'C', 3),
(24, 2, 'C', 4),
(25, 3, 'A', 1),
(26, 3, 'A', 2),
(27, 3, 'A', 3),
(28, 3, 'B', 1),
(29, 3, 'B', 2),
(30, 3, 'B', 3),
(31, 3, 'B', 4);

-- --------------------------------------------------------

--
-- 資料表結構 `theatre`
--

CREATE TABLE `theatre` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL COMMENT 'Theatre Name'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 傾印資料表的資料 `theatre`
--

INSERT INTO `theatre` (`id`, `name`) VALUES
(1, 'House 1'),
(2, 'House FX 2'),
(3, 'House FX 3');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- 資料表索引 `movie`
--
ALTER TABLE `movie`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `movie_theatre`
--
ALTER TABLE `movie_theatre`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_theatre_movie` (`movie_id`),
  ADD KEY `fk_theatre_theatre` (`theatre_id`);

--
-- 資料表索引 `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_customer` (`customer_id`),
  ADD KEY `fk_movie_theatre` (`movie_theatre_id`);

--
-- 資料表索引 `reservation_item`
--
ALTER TABLE `reservation_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_reservation` (`reservation_id`),
  ADD KEY `fk_seat` (`seat_id`);

--
-- 資料表索引 `seat`
--
ALTER TABLE `seat`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique` (`theatre_id`,`line`,`column`),
  ADD KEY `fk_theatre` (`theatre_id`);

--
-- 資料表索引 `theatre`
--
ALTER TABLE `theatre`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `customer`
--
ALTER TABLE `customer`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `movie`
--
ALTER TABLE `movie`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `movie_theatre`
--
ALTER TABLE `movie_theatre`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `reservation`
--
ALTER TABLE `reservation`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `reservation_item`
--
ALTER TABLE `reservation_item`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `seat`
--
ALTER TABLE `seat`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `theatre`
--
ALTER TABLE `theatre`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 已傾印資料表的限制式
--

--
-- 資料表的限制式 `movie_theatre`
--
ALTER TABLE `movie_theatre`
  ADD CONSTRAINT `fk_theatre_movie` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_theatre_theatre` FOREIGN KEY (`theatre_id`) REFERENCES `theatre` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 資料表的限制式 `seat`
--
ALTER TABLE `seat`
  ADD CONSTRAINT `fk_theatre` FOREIGN KEY (`theatre_id`) REFERENCES `theatre` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
