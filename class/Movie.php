<?php

require_once 'Database.php';

class Movie extends Database
{
    /**
     * get movie list function
     * @return array   $result  movies data
     */
    public function getMovieList()
    {
        // preset result data
        $result = array(
            "success" => false,
            "message" => "",
        );

        // select all movie
        $sql = "SELECT * FROM movie WHERE 1";
        $dbData = parent::fetchAll($sql, array());

        // set data into $result
        $result["success"] = true;
        $result["message"] = $dbData;

        return $result;
    }

    /**
     * get timeslots list function
     * @return array   $result  timeslots data
     */
    public function getTheatreList()
    {
        // preset result data
        $result = array(
            "success" => false,
            "message" => "",
        );

        // select all movie data and timeslots data
        $sql = "SELECT m.*, t.name AS theatre_name, mt.id AS movie_theatre_id, mt.start_time 
        FROM movie_theatre mt 
        JOIN movie m ON m.id = mt.movie_id 
        JOIN theatre t ON t.id = mt.theatre_id
        WHERE 1
        ORDER BY mt.start_time ASC
        ";
        $dbData = parent::fetchAll($sql, array());

        // set data into $result
        $result["success"] = true;
        $result["message"] = $dbData;

        return $result;
    }

    /**
     * get all available seating plan by a certain timeslot
     * @param  array   $movieTheatreId   timeslot id
     * @return array   $result           message
     */
    public function getAvailableSeatList($movieTheatreId)
    {
        // preset result data
        $result = array(
            "success" => false,
            "message" => "",
        );

        // select all available seating plan data, include those seat which ordered before
        $sql = "SELECT mt.id AS movie_theatre_id, mt.start_time, s.id AS seat_id, s.line, s.column, r.id AS reservation_id 
        FROM seat s 
        JOIN movie_theatre mt ON mt.theatre_id = s.theatre_id
        LEFT JOIN reservation_item ri ON ri.seat_id = s.id 
        LEFT JOIN reservation r ON r.id = ri.reservation_id AND r.movie_theatre_id = mt.id
        WHERE mt.id = :id
        GROUP BY mt.id, mt.start_time, s.id, s.line, s.column
        ORDER BY s.id ASC
        ";
        $dbData = parent::fetchAll($sql, array("id" => $movieTheatreId));

        // set data into $result
        $result["success"] = true;
        $result["message"] = $dbData;

        return $result;
    }

    /**
     * customer reservation function
     * @param  array   $data    parameter data
     * @return array   $result  message
     */
    public function reservation($data)
    {
        // preset result data
        $result = array(
            "success" => false,
            "message" => "",
        );

        // add reservation record to table
        $sql = "INSERT INTO `reservation`(`customer_id`, `movie_theatre_id`, `total_amount`, `created_at`) VALUES (:customer_id, :movie_theatre_id, :total_amount, NOW())";

        // prepare data
        $totalAmount = $data["price"]*count($data["seat_id"]);
        $movieTheatreId = $data["movie_theatre_id"];
        $customerId = $data["customer_id"];

        // bind data to avoid sql injection
        $sqlBindData = array(
            "customer_id" => $customerId,
            "movie_theatre_id" => $movieTheatreId,
            "total_amount" => $totalAmount,
        );

        // get the last insert id to ready add ticket seating plan record
        $lastInsertId = parent::insertQuery($sql, $sqlBindData);

        // update order number
        $orderNumber = "ORDER".str_pad($lastInsertId, 7, "0", STR_PAD_LEFT);
        $sql = "UPDATE `reservation` SET order_number = :order_number WHERE id = :id";

        // bind data to avoid sql injection
        $sqlBindData = array(
            "order_number" => $orderNumber,
            "id" => $lastInsertId,
        );

        // update order number
        $rowCount = parent::updateQuery($sql, $sqlBindData);

        // add ticket seating plan record to table
        foreach ($data["seat_id"] as $seatId) 
        {
            $sql = "INSERT INTO `reservation_item`(`reservation_id`, `seat_id`) VALUES (:reservation_id, :seat_id)";

            // bind data to avoid sql injection
            $sqlBindData = array(
                "reservation_id" => $lastInsertId,
                "seat_id" => $seatId,
            );

            parent::insertQuery($sql, $sqlBindData);
        }

        // set data into $result
        $result["success"] = true;
        $result["message"] = "Reservation Success. You can enjoy the movie now.";

        // Start Session
        if(session_id() == '')  
        {
            session_start();
        }

        // prepare data for node.js
        $result["order"] = array(
            "customer_email_address" => $_SESSION["customer"]["email_address"],
            "customer_name" => $_SESSION["customer"]["first_name"]." ".$_SESSION["customer"]["last_name"],
            "order_number" => $orderNumber,
            "total_amount" => $totalAmount,
        );

        // select reservation data for node.js success page
        $sql = "SELECT mt.id AS movie_theatre_id, mt.start_time, s.id AS seat_id, s.line, s.column, ri.id AS reservation_item_id 
        FROM movie_theatre mt 
        JOIN seat s ON s.theatre_id = mt.theatre_id
        JOIN reservation r ON r.movie_theatre_id = mt.id
        JOIN reservation_item ri ON ri.seat_id = s.id AND ri.reservation_id = r.id
        WHERE mt.id = :movie_theatre_id
        AND r.id = :reservation_id
        ORDER BY s.id ASC
        ";
        $dbData = parent::fetchAll($sql, array("movie_theatre_id" => $movieTheatreId, "reservation_id" => $lastInsertId));

        $reservationItems = array();
        foreach ($dbData as $row) 
        {
            $result["order"]["start_time"] = date("F j, Y, g:i a", strtotime($row["start_time"]));
            $reservationItems[] = $row["line"].$row["column"];
        }

        // set data into $result
        $result["order"]["reservation_item"] = $reservationItems;

        return $result;
    }
}