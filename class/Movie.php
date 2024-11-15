<?php

require_once 'Database.php';

class Movie extends Database
{
    public function getMovieList()
    {
        $result = array(
            "success" => false,
            "message" => "",
        );

        // db connect
        $pdo = parent::getConnection();

        // check email address exist
        $sql = "SELECT * FROM movie WHERE 1";
        $dbData = parent::fetchAll($pdo, $sql, array());

        $result["success"] = true;
        $result["message"] = $dbData;

        return $result;
    }

    public function getTheatreList()
    {
        $result = array(
            "success" => false,
            "message" => "",
        );

        // db connect
        $pdo = parent::getConnection();

        $sql = "SELECT m.*, t.name AS theatre_name, mt.id AS movie_theatre_id, mt.start_time 
        FROM movie_theatre mt 
        JOIN movie m ON m.id = mt.movie_id 
        JOIN theatre t ON t.id = mt.theatre_id
        WHERE 1
        ORDER BY mt.start_time ASC
        ";
        $dbData = parent::fetchAll($pdo, $sql, array());

        $result["success"] = true;
        $result["message"] = $dbData;

        return $result;
    }

    public function getAvailableSeatList($movieTheatreId)
    {
        $result = array(
            "success" => false,
            "message" => "",
        );

        // db connect
        $pdo = parent::getConnection();
        $sql = "SELECT mt.id AS movie_theatre_id, mt.start_time, s.id AS seat_id, s.line, s.column, r.id AS reservation_id 
        FROM seat s 
        JOIN movie_theatre mt ON mt.theatre_id = s.theatre_id
        LEFT JOIN reservation_item ri ON ri.seat_id = s.id 
        LEFT JOIN reservation r ON r.id = ri.reservation_id AND r.movie_theatre_id = mt.id
        WHERE mt.id = :id
        ORDER BY s.id ASC
        ";
        $dbData = parent::fetchAll($pdo, $sql, array("id" => $movieTheatreId));

        $result["success"] = true;
        $result["message"] = $dbData;

        return $result;
    }

    public function reservation($data)
    {
        $result = array(
            "success" => false,
            "message" => "",
        );

        // db connect
        $pdo = parent::getConnection();

        // add record to table
        $sql = "INSERT INTO `reservation`(`customer_id`, `movie_theatre_id`, `total_amount`, `created_at`) VALUES (:customer_id, :movie_theatre_id, :total_amount, NOW())";

        $sqlBindData = array(
            "customer_id" => $data["customer_id"],
            "movie_theatre_id" => $data["movie_theatre_id"],
            "total_amount" => $data["price"]*count($data["seat_id"]),
        );

        $lastInsertId = parent::insertQuery($pdo, $sql, $sqlBindData);

        // update order number
        $orderNumber = "ORDER".str_pad($lastInsertId, 7, "0", STR_PAD_LEFT);
        $totalAmount = $sqlBindData["total_amount"];
        $movieTheatreId = $sqlBindData["movie_theatre_id"];
        $customerId = $sqlBindData["customer_id"];

        $sql = "UPDATE `reservation` SET order_number = :order_number WHERE id = :id";

        $sqlBindData = array(
            "order_number" => $orderNumber,
            "id" => $lastInsertId,
        );

        $rowCount = parent::updateQuery($pdo, $sql, $sqlBindData);

        // add ticket record to table
        foreach ($data["seat_id"] as $seatId) 
        {
            $sql = "INSERT INTO `reservation_item`(`reservation_id`, `seat_id`) VALUES (:reservation_id, :seat_id)";

            $sqlBindData = array(
                "reservation_id" => $lastInsertId,
                "seat_id" => $seatId,
            );

            parent::insertQuery($pdo, $sql, $sqlBindData);
        }

        $result["success"] = true;
        $result["message"] = "Reservation Success. You can enjoy the movie now.";

        // prepare data for node js
        // Start Session
        if(session_id() == '')  
        {
            session_start();
        }

        $result["order"] = array(
            "customer_email_address" => $_SESSION["customer"]["email_address"],
            "order_number" => $orderNumber,
            "total_amount" => $totalAmount,
        );

        $sql = "SELECT mt.id AS movie_theatre_id, mt.start_time, s.id AS seat_id, s.line, s.column, ri.id AS reservation_item_id 
        FROM movie_theatre mt 
        JOIN seat s ON s.theatre_id = mt.theatre_id
        JOIN reservation r ON r.movie_theatre_id = mt.id
        JOIN reservation_item ri ON ri.seat_id = s.id AND ri.reservation_id = r.id
        WHERE mt.id = :movie_theatre_id
        AND r.id = :reservation_id
        ORDER BY s.id ASC
        ";
        $dbData = parent::fetchAll($pdo, $sql, array("movie_theatre_id" => $movieTheatreId, "reservation_id" => $lastInsertId));

        $reservationItems = array();
        foreach ($dbData as $row) 
        {
            $result["order"]["start_time"] = date("F j, Y, g:i a", strtotime($row["start_time"]));
            $reservationItems[] = $row["line"].$row["column"];
        }

        $result["order"]["reservation_item"] = $reservationItems;

        return $result;
    }
}