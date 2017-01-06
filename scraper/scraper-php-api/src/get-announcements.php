<?php
    if(isset($_POST["category"]))
    {
        echo "ok";
    }
    else 
    {
        var_dump(http_response_code(404));
    }
    /*
    $ids     = array(1, 2, 3, 7, 8, 9);
    $inQuery = implode(',', array_fill(0, count($ids), '?'));

    $db = new PDO(...);
    $stmt = $db->prepare(
        'SELECT *
        FROM table
        WHERE id IN(' . $inQuery . ')'
    );

    // bindvalue is 1-indexed, so $k+1
    foreach ($ids as $k => $id)
        $stmt->bindValue(($k+1), $id);

    $stmt->execute();

    */

?>