function checkAndRedirect() {
    var username = document.getElementById('username').value;
    var data = { "name": username };

    fetch('/addPlayer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error('Dieser Benutzername wird bereits verwendet. Bitte wählen Sie einen anderen.');
                } else {
                    throw new Error('Network response was not ok. Status: ' + response.status + ' ' + response.statusText);
                }
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                redirectToGame(username);
            } else {
                showUsernameTakenAlert();
            }
        })
        .catch(error => {
            console.error('There was an error!', error.message);
            alert(error.message);
        });
}

function showUsernameTakenAlert() {
    alert('Dieser Benutzername wird bereits verwendet. Bitte wählen Sie einen anderen.');
}

function redirectToGame(username) {
    window.location.href = `index.html?username=${encodeURIComponent(username)}`;
}


function showUsernameTakenAlert() {
    alert('Dieser Benutzername wird bereits verwendet. Bitte wählen Sie einen anderen.');
}

function redirectToGame(username) {
    window.location.href = `index.html?username=${encodeURIComponent(username)}`;
}