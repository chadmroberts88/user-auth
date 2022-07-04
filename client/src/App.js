import React from 'react';
import { Routes, Route } from 'react-router-dom'
import styled from 'styled-components'

import LogInPage from './pages/LogInPage'
import RegistrationPage from './pages/RegistrationPage'
import DashboardPage from './pages/DashboardPage'

const StyledApp = styled.div`
  background-color: lightblue;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const App = () => {

  return (
    <StyledApp>
      <Routes>
        <Route path='/' element={<LogInPage />} />
        <Route path='/register' element={<RegistrationPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
      </Routes>
    </StyledApp>
  );
}

export default App
