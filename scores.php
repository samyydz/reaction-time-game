<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$host = 'localhost';
$db = 'Scores';
$user = 'root';
$pass = '';

header('Content-Type: application/json'); // Important !

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Récupère les 5 meilleurs scores (les plus petits temps) en ordre croissant
    $stmt = $pdo->query("SELECT Nom, Temps, Date FROM score ORDER BY Temps ASC LIMIT 5");
    $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'scores' => $scores]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
