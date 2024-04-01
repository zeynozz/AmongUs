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
    var playerElement = document.createElement('div');
    playerElement.id = `player-${player.id}`;
    playerElement.style.position = 'absolute';
    playerElement.style.left = `${player.position.x}px`;
    playerElement.style.top = `${player.position.y}px`;

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

    document.body.appendChild(playerElement);
}


document.addEventListener('keydown', function (event) {
    var speed = 10;
    var playerElement = document.getElementById(`player-${currentUserId}`);
    if (playerElement) {
        var x = parseInt(playerElement.style.left, 10) || 0;
        var y = parseInt(playerElement.style.top, 10) || 0;

        switch (event.key) {
            case 'ArrowUp': y = Math.max(0, y - speed); break;
            case 'ArrowDown': y = Math.min(650 - 50, y + speed); break;
            case 'ArrowLeft': x = Math.max(0, x - speed); break;
            case 'ArrowRight': x = Math.min(1400 - 50, x + speed); break;
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
