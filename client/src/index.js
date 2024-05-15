import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CookiesProvider } from 'react-cookie';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <CookiesProvider defaultSetOptions={{sameSite: 'None',secure: true,}} >
      <App/>
    </CookiesProvider>
  </React.StrictMode>
);

