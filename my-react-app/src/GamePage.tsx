import React from 'react';
import './GamePage.module.css';

const GamePage: React.FC = () => {
    return (
        <div id="gameContainer">
            <div id="userContainer">
                <svg id="walls" width="1600" height="700" viewBox="0 0 1600 700">
                    {/* Define your walls using SVG elements */}
                    <rect x="100" y="100" width="100" height="400" fill="grey"/>
                    <rect x="300" y="300" width="400" height="50" fill="grey"/>
                    {/* Define the vertical wall */}
                    <line x1="700" y1="100" x2="700" y2="600" style={{stroke: 'grey', strokeWidth: 5}} className="wall" />
                </svg>
            </div>
            <div className="chat-container">
                <ul className="messages"></ul>
                <div className="message">
                    <input id="messageInput" type="text" placeholder="Type your message..." />
                    <button id="sendMessageButton" onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
}

// Diese Funktion ist angenommen, um Nachrichten zu senden
const sendMessage = () => {
    // Implementiere hier die Logik zum Senden von Nachrichten
}

export default GamePage;
