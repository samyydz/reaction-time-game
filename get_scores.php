<?php
$host = 'mysql-natan.alwaysdata.net';
$dbname = 'natan_reactiongame';
$user = 'natan';
$pass = 'admin123456@@';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}

$stmt = $pdo->query("SELECT nom, temps_reaction, DATE_FORMAT(date_partie, '%d/%m/%Y') AS date FROM scores ORDER BY temps_reaction ASC LIMIT 10");
$scores = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($scores);
?>
