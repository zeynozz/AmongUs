import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Router und Routes hinzugefügt
import App from './App.tsx';
import GamePage from './GamePage.tsx';

function Navigator() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/game" element={<GamePage />} />
            </Routes>
        </Router>
    );
}

export default Navigator;
