<?php
 //http://stackoverflow.com/questions/18382740/cors-not-working-php
 if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }
 
    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
 
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         
 
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
 
        exit(0);
    }
	
    include "../config/config.php";

    if(true)//if(isset($_POST["category"]) && is_array($_POST["category"]))
    {
     //   header("Content-type: application/json; charset=utf-8; Access-Control-Allow-Origin: *");
        $ids     = array("kosmitia");
        $inQuery = implode(',', array_fill(0, count($ids), '?'));

        $stmt = $connection->prepare(
            'SELECT *
            FROM announcements
            WHERE category IN(' . $inQuery . ')'
        );

        // bindvalue is 1-indexed, so $k+1
        foreach ($ids as $k => $id)
            $stmt->bindValue(($k+1), $id);

        $stmt->execute();
		
		/*
        while ($row = $stmt->fetch(PDO::FETCH_NUM, PDO::FETCH_ORI_NEXT)) {
            $data = $row[0] . "\t" . $row[1] . "\t" . $row[2] . "\n";
            print $data;
        }
		*/
		echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        $stmt = null;
    }
    //Forbidden request
    else 
    {
        var_dump(http_response_code(403));
    }


?>