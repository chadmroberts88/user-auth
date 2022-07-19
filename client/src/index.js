import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import AccountProvider from './context/AccountContext'
import ProfileProvider from './context/ProfileContext'
import GameProvider from './context/GameContext'

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <AccountProvider>
      <ProfileProvider>
        <GameProvider>
          <App />
        </GameProvider>
      </ProfileProvider>
    </AccountProvider>
  </BrowserRouter>
);
