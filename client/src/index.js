import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

// Создаем корневой элемент React
const root = ReactDOM.createRoot(document.getElementById('root'));

// Рендерим приложение
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);