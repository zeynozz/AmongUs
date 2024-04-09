import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate für die Weiterleitung
import styles from './index.module.css'; // Stil importieren

const App: React.FC = () => {
    const navigate = useNavigate(); // Verwenden Sie useNavigate, um die Weiterleitung zu steuern

    const handlePlayClick = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Check and redirect logic here');
        navigate('/game');
    };

    return (
        <div className={styles.root}>
            <div className={styles['centered-input']}>
                <form onSubmit={handlePlayClick}>
                    <label>
                        <input type="text" id="username" maxLength={10} placeholder="username" />
                    </label>
                    <button type="submit">PLAY</button>
                </form>
            </div>
        </div>
    );
}

export default App;
