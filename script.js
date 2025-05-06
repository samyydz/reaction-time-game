document.addEventListener('DOMContentLoaded', function () {
    const homeLink = document.getElementById('home-link');
    const scoresLink = document.getElementById('scores-link');
    const homeSection = document.getElementById('home-section');
    const scoresSection = document.getElementById('scores-section');
    const nameForm = document.getElementById('name-form');
    const nameInput = document.getElementById('name');
    const messageDiv = document.getElementById('message');
    const scoresBody = document.getElementById('scores-body');
    const refreshBtn = document.getElementById('refresh-btn');
    const timerDisplay = document.getElementById('timer-display');
    const stopBtn = document.getElementById('stop-timer-btn');

    let startTime = null;
    let timerInterval = null;

    // Confetti
    function createConfetti() {
        const confettiCount = 80;
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            const size = Math.random() * 10 + 5;
            const colors = ['#FF5F9E', '#4FACFE', '#B465DA', '#00F5A0', '#FFC300'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.cssText = `width: ${size}px; height: ${size}px; background: ${color};
                                      position: fixed; top: -10px; left: ${Math.random() * 100}vw;
                                      opacity: ${Math.random() + 0.5}; border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                                      z-index: 1000; pointer-events: none; animation: confetti-fall ${Math.random() * 3 + 2}s ease-in forwards;`;
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 4000);
        }
    }

    const style = document.createElement('style');
    style.textContent = `@keyframes confetti-fall { 0% { transform: translateY(0) rotate(0deg); } 100% { transform: translateY(100vh) rotate(720deg); } }`;
    document.head.appendChild(style);

    // Navigation
    homeLink.addEventListener('click', e => {
        e.preventDefault();
        showSection(homeSection, homeLink);
    });

    scoresLink.addEventListener('click', e => {
        e.preventDefault();
        showSection(scoresSection, scoresLink);
        loadScores();
    });

    refreshBtn.addEventListener('click', function () {
        loadScores();
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 300);
    });

    // Formulaire pour démarrer le chrono
    nameForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = nameInput.value.trim();
        if (name === "") {
            showMessage("Entre ton nom pour commencer !", "error");
            return;
        }

        showMessage(`C’est parti ${name} ! Appuie sur "Arrêter le chrono" quand tu veux.`, "success");

        startTime = Date.now();
        stopBtn.style.display = "inline-block";
        timerDisplay.textContent = "Temps : 0.000s";

        // Mettre à jour le temps toutes les 50ms
        timerInterval = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;
            timerDisplay.textContent = `Temps : ${elapsed.toFixed(3)}s`;
        }, 50);
    });

    // Arrêter le chrono et enregistrer le score
    stopBtn.addEventListener('click', function () {
        if (!startTime) return;

        clearInterval(timerInterval);
        const finalTime = Date.now() - startTime;
        timerDisplay.textContent = `Temps final : ${(finalTime / 1000).toFixed(3)}s`;

        showMessage("Chrono arrêté ! Score en cours d’enregistrement...", "success");
        stopBtn.style.display = "none";

        const name = nameInput.value.trim();
        envoyerScore(name, finalTime); // temps en millisecondes
    });

    // Afficher les sections
    function showSection(section, link) {
        document.querySelectorAll('.section, .active-section').forEach(s => {
            s.classList.remove('active-section');
            s.classList.add('section');
        });
        section.classList.remove('section');
        section.classList.add('active-section');
        document.querySelectorAll('.nav-btn').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
    }

    // Enregistrer le score dans la BDD
    function envoyerScore(nom, score) {
        fetch('register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nom: nom, score: score })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessage(`${nom} a été enregistré avec ${score} ms ! 🎉`, 'success');
                nameInput.value = '';
                createConfetti();
            } else {
                showMessage("Erreur : " + data.error, 'error');
            }
        })
        .catch(error => {
            showMessage("Erreur réseau : " + error.message, 'error');
        });
    }

    // Charger les scores
    function loadScores() {
        fetch('scores.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayScores(data.scores);
                } else {
                    showMessage("Impossible de charger les scores : " + data.error, 'error');
                }
            })
            .catch(error => {
                showMessage("Erreur réseau : " + error.message, 'error');
            });
    }
    
    function displayScores(scores) {
        scoresBody.innerHTML = '';  // Vide le tableau avant d'afficher les nouveaux scores
    
        if (scores.length === 0) {
            scoresBody.innerHTML = '<tr><td colspan="4">Aucun score disponible</td></tr>';
            return;
        }
    
        scores.forEach((score, index) => {
            const row = document.createElement('tr');
            const rank = index + 1;
            const emoji = rank === 1 ? '👑' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
    
            row.innerHTML = `
                <td>${rank}</td>
                <td>${score.Nom} ${emoji}</td>
                <td>${score.Temps} ms</td>
                <td>${score.Date}</td>
            `;
            scoresBody.appendChild(row);
        });
    }
    

    // Afficher un message de succès ou d'erreur
    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = type;
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 4000);
    }
});
