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

if (isset($_POST['username']) && isset($_POST['score'])) {
    $nom = htmlspecialchars($_POST['username']);
    $temps_reaction = floatval($_POST['score']);

    $stmt = $pdo->prepare("INSERT INTO scores (nom, temps_reaction, date_partie) VALUES (?, ?, NOW())");
    $stmt->execute([$nom, $temps_reaction]);

    echo "Score enregistré avec succès !";
} else {
    echo "Paramètres manquants.";
}
?>
