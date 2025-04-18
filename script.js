document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const homeLink = document.getElementById('home-link');
    const scoresLink = document.getElementById('scores-link');
    const homeSection = document.getElementById('home-section');
    const scoresSection = document.getElementById('scores-section');
    const nameForm = document.getElementById('name-form');
    const messageDiv = document.getElementById('message');
    const scoresBody = document.getElementById('scores-body');
    const refreshBtn = document.getElementById('refresh-btn');

    // Navigation
    homeLink.addEventListener('click', function(e) {
        e.preventDefault();
        showSection(homeSection, homeLink);
    });

    scoresLink.addEventListener('click', function(e) {
        e.preventDefault();
        showSection(scoresSection, scoresLink);
        loadScores();
    });

    // Form submission
    nameForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const nameInput = document.getElementById('name');
        const name = nameInput.value.trim();

        if (name) {
            registerName(name);
        }
    });

    // Refresh scores
    refreshBtn.addEventListener('click', loadScores);

    // Function to show a section and highlight its nav link
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

    // Function to register a name
    function registerName(name) {
        // Simulé, à remplacer par un fetch si besoin
        setTimeout(() => {
            showMessage('Enregistrement réussi ! ' + name + ' a été ajouté à la base de données.', 'success');
            document.getElementById('name').value = '';
        }, 500);
    }

    // Envoi du score (à appeler depuis ton jeu)
    function sendScore(username, score) {
        fetch('https://natan.alwaysdata.net/insert_score.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${encodeURIComponent(username)}&score=${encodeURIComponent(score)}`
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            showMessage(data.includes("succès") ? "Score envoyé avec succès !" : "Erreur : " + data, data.includes("succès") ? "success" : "error");
            loadScores();
        })
        .catch(error => {
            showMessage("Erreur de connexion : " + error.message, "error");
        });
    }

    // Récupération des scores
    function loadScores() {
        fetch('https://natan.alwaysdata.net/get_scores.php')
            .then(response => response.json())
            .then(scores => {
                displayScores(scores);
            })
            .catch(error => {
                showMessage("Erreur chargement scores : " + error.message, "error");
            });
    }

    // Affichage des scores
    function displayScores(scores) {
        scoresBody.innerHTML = '';

        // Tri par meilleur temps (plus rapide en haut)
        scores.sort((a, b) => a.temps_reaction - b.temps_reaction);

        scores.forEach((score, index) => {
            const row = document.createElement('tr');

            let rankDisplay = `${index + 1}`;
            if (index === 0) rankDisplay = `<span class="rank gold">1</span>`;
            else if (index === 1) rankDisplay = `<span class="rank silver">2</span>`;
            else if (index === 2) rankDisplay = `<span class="rank bronze">3</span>`;

            row.innerHTML = `
                <td>${rankDisplay}</td>
                <td>${score.nom}</td>
                <td>${score.temps_reaction} ms</td>
                <td>${score.date_partie}</td>
            `;
            scoresBody.appendChild(row);
        });

        // Styles des médailles
        if (!document.getElementById('rank-styles')) {
            const style = document.createElement('style');
            style.id = 'rank-styles';
            style.textContent = `
                .rank {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    color: white;
                    font-weight: 600;
                    font-size: 12px;
                }
                .gold {
                    background: linear-gradient(45deg, #FFD700, #FFC107);
                    box-shadow: 0 2px 8px rgba(255, 193, 7, 0.5);
                }
                .silver {
                    background: linear-gradient(45deg, #C0C0C0, #9E9E9E);
                    box-shadow: 0 2px 8px rgba(158, 158, 158, 0.5);
                }
                .bronze {
                    background: linear-gradient(45deg, #CD7F32, #BF6516);
                    box-shadow: 0 2px 8px rgba(205, 127, 50, 0.5);
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Affichage des messages (succès / erreur)
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = 'message ' + type;
        setTimeout(() => {
            messageDiv.className = 'message';
        }, 5000);
    }
});
