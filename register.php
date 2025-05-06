<?php

$host = 'localhost';
$db = 'Scores'; // à adapter
$user = 'root';        // à adapter
$pass = '';            // à adapter

// Activer l'affichage des erreurs pour déboguer
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Récupère les données envoyées en JSON
$data = json_decode(file_get_contents("php://input"), true);

// Vérifie que les données ont bien été envoyées
if (!isset($data['nom']) || !isset($data['score'])) {
    echo json_encode(['success' => false, 'error' => 'Champs manquants']);
    exit;
}

try {
    // Connexion à la base de données
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Prépare et exécute la requête pour insérer les scores
    $stmt = $pdo->prepare("INSERT INTO score (Nom, Temps, Date) VALUES (?, ?, NOW())");
    $stmt->execute([$data['nom'], $data['score']]);

    // Réponse JSON si l'insertion réussit
    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    // Réponse en cas d'erreur de connexion ou d'exécution de la requête
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
