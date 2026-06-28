import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/App.css';
import './index.css';
import { AppProvider } from './state/AppContext.jsx';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);


