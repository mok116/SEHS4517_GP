<?php

require_once '../class/Movie.php';

// get timeslots list
if($_SERVER['REQUEST_METHOD'] === "POST")
{
    if(isset($_POST['action']) && $_POST['action'] == 'theatre_list')
    {
        $movie = new Movie();

        $result = $movie->getTheatreList();

        // format data
        $data = array();
        
        foreach ($result["message"] as $row) 
        {
            // movie id as key
            if(!isset($data[$row["id"]]))
            {
                $data[$row["id"]] = array(
                    "id" => $row["id"],
                    "name" => $row["name"],
                    "price" => $row["price"],
                );
            }

            // restructure the data
            $data[$row["id"]]["timeslot"][] = array(
                "movie_theatre_id" => $row["movie_theatre_id"],
                "start_time" => $row["start_time"],
                "theatre_name" => $row["theatre_name"],
            );
        }

        $result["message"] = $data;

        echo json_encode($result);
    }
}