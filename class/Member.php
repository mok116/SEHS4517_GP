<?php

require_once 'Database.php';

class Member extends Database
{
    /**
     * customer register function
     * @param  array   $data    parameter data
     * @return array   $result  message
     */
    public function register($data)
    {
        // preset result data
        $result = array(
            "success" => false,
            "message" => "",
        );

        // check email address exist
        $sql = "SELECT * FROM customer WHERE email_address = :email_address";
        $dbData = parent::fetchAll($sql, array("email_address" => $data["email_address"]));

        if(count($dbData) > 0)
        {
            // email address already exist
            $result["message"] = "Email Address Already Exist.";
        }
        else
        {
            // add record to table
            $sql = "INSERT INTO `customer`(`first_name`, `last_name`, `email_address`, `password`, `mailing_address`, `phone_number`, `created_at`, `is_active`) VALUES (:first_name, :last_name, :email_address, :password, :mailing_address, :phone_number, NOW(), 1)";

            $sqlBindData = array(
                "first_name" => $data["first_name"],
                "last_name" => $data["last_name"],
                "email_address" => $data["email_address"],
                "password" => md5($data["password"]),
                "mailing_address" => $data["mailing_address"],
                "phone_number" => $data["phone_number"],
            );

            // get last insert id
            $lastInsertId = parent::insertQuery($sql, $sqlBindData);

            // customer success added
            $result["success"] = true;
            $result["message"] = "Member Register Success. You can login the account on Login Page.";
        }

        return $result;
    }

    /**
     * customer login function
     * @param  array   $data    parameter data
     * @return array   $result  message
     */
    public function login($data)
    {
        // preset result data
        $result = array(
            "success" => false,
            "message" => "",
        );

        // check email address exist
        $sql = "SELECT * FROM customer WHERE email_address = :email_address AND password = :password";
        $dbData = parent::fetchOne($sql, array("email_address" => $data["email_address"], "password" => md5($data["password"])));

        if($dbData)
        {
            // customer data exist
            $customer = $dbData;

            // Login Success
            $sql = "UPDATE `customer` SET last_login_at = NOW() WHERE id = :id;";

            // update customer last login time
            $rowCount = parent::updateQuery($sql, array("id" => $customer["id"]));
            
            // customer success login data and set customer data into $result
            $result["success"] = true;
            $result["customer"] = $customer;
            $result["message"] = "Login Success: Wait for 3 seconds to go to Reservation page.";
        }
        else
        {
            // customer data not exist
            $result["message"] = "Login Fail: Account Not Exist, you can go back to Home Page";
        }

        return $result;
    }
}