import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from "react-router-dom";
import './styles/index.css';
import App from './pages/App';
import reportWebVitals from './utils/reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router> 
      <App />
    </Router>
  </React.StrictMode>
);

// 성능 측정 관련 코드 (필요하면 유지)
reportWebVitals();
