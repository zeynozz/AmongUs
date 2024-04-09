var stompClient;
var currentUserId;

document.addEventListener('DOMContentLoaded', function () {
    currentUserId = new URLSearchParams(window.location.search).get('username');
    connect();
});

function connect() {
    var socket = new SockJS('/socket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);

        stompClient.subscribe('/topic/positions', function (messageOutput) {
            var positions = JSON.parse(messageOutput.body);
            updatePlayerPositions(positions);
        });

        stompClient.subscribe('/topic/users', function (messageOutput) {
            var players = JSON.parse(messageOutput.body);
            Object.values(players).forEach(player => {
                spawnPlayer(player);
            });
        });

        stompClient.subscribe('/topic/public', function(messageOutput) {
            var message = JSON.parse(messageOutput.body);
            if (message.type === 'spawn_player') {
                spawnPlayer(message.player);
            } else if (message.type === 'update_position') {
                updatePlayerPosition(message.player.id, message.player.position);
            } else {
                showMessage(message);
            }
        });

        sendName();
    });
}

function sendName() {
    var player = {
        id: currentUserId,
        name: currentUserId,
        position: { x: (1600 / 2) - 25, y: (700 / 2) - 25 }
    };
    stompClient.send("/app/setName", {}, JSON.stringify(player));
}

function updatePlayerPositions(positions) {
    Object.entries(positions).forEach(([id, position]) => {
        var playerElement = document.getElementById(`player-${id}`);
        if (!playerElement) {
            spawnPlayer({ id: id, position: position });
        } else {
            playerElement.style.left = `${position.x}px`;
            playerElement.style.top = `${position.y}px`;
        }
    });
}

function getImageForUser(username) {
    const images = ['red.png', 'blue.png', 'pink.png', 'purple.png', 'white.png', 'yellow.png'];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % images.length;
    return `images/${images[index]}`;
}

function spawnPlayer(player) {
    var existingPlayerElement = document.getElementById(`player-${player.id}`);
    if (existingPlayerElement) {
        existingPlayerElement.style.left = `${player.position.x}px`;
        existingPlayerElement.style.top = `${player.position.y}px`;
    } else {
        var playerElement = document.createElement('div');
        playerElement.id = `player-${player.id}`;
        playerElement.classList.add('player');

        playerElement.style.position = 'absolute';
        playerElement.style.left = `${player.position.x}px`;
        playerElement.style.top = `${player.position.y}px`;

        // Setze die gewünschten Border-Radius-Eigenschaften für den Spieler
        playerElement.style.borderTopLeftRadius = '50% 30%';
        playerElement.style.borderTopRightRadius = '50% 30%';
        playerElement.style.borderBottomLeftRadius = '30% 50%';
        playerElement.style.borderBottomRightRadius = '30% 50%';

        const img = document.createElement('img');
        img.src = getImageForUser(player.name);
        img.alt = 'Player Image';
        img.style.width = '50px';
        img.style.height = '50px';
        playerElement.appendChild(img);

        const usernameElement = document.createElement('div');
        usernameElement.innerText = player.name;
        usernameElement.style.textAlign = 'center';
        usernameElement.style.width = '100%';
        usernameElement.style.position = 'absolute';
        usernameElement.style.left = '0';
        usernameElement.style.top = '50px';
        playerElement.appendChild(usernameElement);

        document.getElementById('gameContainer').appendChild(playerElement);
    }
}




document.addEventListener('keydown', function (event) {
    var speed = 10;
    var playerElement = document.getElementById(`player-${currentUserId}`);
    if (playerElement) {
        var x = parseInt(playerElement.style.left, 10) || 0;
        var y = parseInt(playerElement.style.top, 10) || 0;

        switch (event.key) {
            case 'ArrowUp':
                if (!checkCollision(x, y - speed) && checkBoundary(x, y - speed)) {
                    y = Math.max(0, y - speed);
                }
                break;
            case 'ArrowDown':
                if (!checkCollision(x, y + speed) && checkBoundary(x, y + speed)) {
                    y = Math.min(700 - 50, y + speed);
                }
                break;
            case 'ArrowLeft':
                if (!checkCollision(x - speed, y) && checkBoundary(x - speed, y)) {
                    x = Math.max(0, x - speed);
                }
                break;
            case 'ArrowRight':
                if (!checkCollision(x + speed, y) && checkBoundary(x + speed, y)) {
                    x = Math.min(1600 - 50, x + speed);
                }
                break;
            default: return;
        }

        playerElement.style.left = `${x}px`;
        playerElement.style.top = `${y}px`;
        stompClient.send("/app/move", {}, JSON.stringify({ id: currentUserId, position: { x: x, y: y } }));
    }
});




function sendMessage() {
    var messageContent = document.getElementById("messageInput").value.trim();
    if (messageContent && stompClient) {
        var chatMessage = {
            name: currentUserId,
            text: messageContent,
            type: 'chatMessage'
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        document.getElementById("messageInput").value = '';
    }
}

function showMessage(message) {
    var messages = document.querySelector('.messages');
    var messageElement = document.createElement("li");
    messageElement.innerText = message.name + ": " + message.text;
    messages.appendChild(messageElement);
}

function checkCollision(playerX, playerY) {
    var walls = document.querySelectorAll('#walls rect, #walls line');
    for (var i = 0; i < walls.length; i++) {
        var wall = walls[i];
        var rect = wall.getBoundingClientRect();
        if (playerX >= rect.left && playerX + 50 <= rect.right && playerY >= rect.top && playerY + 50 <= rect.bottom) {
            return true; // Kollision mit einer Wand
        }
    }
    return false; // Keine Kollision
}


function checkBoundary(x, y) {
    var gameContainer = document.getElementById('gameContainer');
    var containerRect = gameContainer.getBoundingClientRect();
    var containerLeft = containerRect.left;
    var containerTop = containerRect.top;
    var containerRight = containerLeft + gameContainer.offsetWidth;
    var containerBottom = containerTop + gameContainer.offsetHeight;

    // Überprüfen, ob der Spieler den Spielbereich verlässt
    if (x < containerLeft || y < containerTop || x > containerRight || y > containerBottom) {
        return false; // Kollision mit dem Spielbereichsrand
    }

    var walls = document.querySelectorAll('#walls rect, #walls line');
    for (var i = 0; i < walls.length; i++) {
        var wall = walls[i];
        var rect = wall.getBoundingClientRect();
        var wallX = parseFloat(wall.getAttribute('x'));
        var wallY = parseFloat(wall.getAttribute('y'));
        var wallWidth = parseFloat(wall.getAttribute('width'));
        var wallHeight = parseFloat(wall.getAttribute('height'));

        if (x >= wallX && x <= wallX + wallWidth && y >= wallY && y <= wallY + wallHeight) {
            return false; // Kollision mit einer Wand
        }
    }
    return true; // Keine Kollision
}







