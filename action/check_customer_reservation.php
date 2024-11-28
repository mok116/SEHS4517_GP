<?php

require_once '../class/Movie.php';

// get customer reservation record
if($_SERVER['REQUEST_METHOD'] === "POST")
{
    if(isset($_POST['action']) && $_POST['action'] == 'customer_reservation')
    {
        // Start Session
        if(session_id() == '')  
        {
            session_start();
        }

        $movie = new Movie();

        $result = $movie->getReservationHistoryList($_SESSION["customer"]["id"]);

        // format data
        $data = array();
        
        foreach ($result["message"] as $row) 
        {
            // order_number as key
            if(!isset($data[$row["order_number"]]))
            {
                $data[$row["order_number"]] = array(
                    "order_number" => $row["order_number"],
                    "total_amount" => $row["total_amount"],
                    "created_at" => $row["created_at"],
                    "start_time" => date("F j, Y, g:i a", strtotime($row["start_time"])),
                    "movie_name" => $row["movie_name"],
                    "theatre_name" => $row["theatre_name"],
                );
            }

            // restructure the data
            $data[$row["order_number"]]["seats"][] = $row["line"].$row["column"];
        }

        $result["message"] = $data;

        echo json_encode($result);
    }
}