import React from 'react';
import ReactDOM from 'react-dom/client'; // Gunakan ini untuk React 18 ke atas
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Buat root
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
