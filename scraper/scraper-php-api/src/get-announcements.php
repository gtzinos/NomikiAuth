<?php
    include "../config/config.php";
    
    $httpBody = file_get_contents('php://input');

    $parameters = json_decode($httpBody,true);
    
    if(isset($parameters["all"]))
    {
        header('Content-Type: application/json; charset=utf-8');

        $stmt = $connection->query(
            'SELECT *
            FROM announcements'
        );

		echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        $stmt = null;
    }
    //Select all categories
    else if(isset($parameters["category"]) && is_array($parameters["category"]))
    {
        header('Content-Type: application/json; charset=utf-8');
        $ids     = array("kosmitia");
        $inQuery = implode(',', array_fill(0, count($ids), '?'));

        $stmt = $connection->query(
            'SELECT *
            FROM announcements
            WHERE category IN(' . $inQuery . ')'
        );

        // bindvalue is 1-indexed, so $k+1
        foreach ($ids as $k => $id)
            $stmt->bindValue(($k+1), $id);

        $stmt->execute();
		
		
        while ($row = $stmt->fetch(PDO::FETCH_NUM, PDO::FETCH_ORI_NEXT)) {
            $data = $row[0] . "\t" . $row[1] . "\t" . $row[2] . "\n";
            print $data;
        }
		
		echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        $stmt = null;
    }
    //Forbidden request
    else 
    {
        var_dump(http_response_code(403));
    }


?>