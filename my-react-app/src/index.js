import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import GamePage from "./GamePage.tsx";

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/game" element={<GamePage />} />
        </Routes>
    </BrowserRouter>,
    document.getElementById('root')
);
