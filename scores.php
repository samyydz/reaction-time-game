<?php
$host = 'localhost';
$db = 'Scores'; 
$user = 'root';        
$pass = '';            

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->query("SELECT Nom, Temps, Date FROM Score ORDER BY Temps ASC LIMIT 20");
    $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'score' => $scores]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>