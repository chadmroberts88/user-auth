import React, { useState, useContext } from 'react'
import { AccountContext } from '../context/AccountContext'
import { ProfileContext } from '../context/ProfileContext'
import { GameContext } from '../context/GameContext'
import { useNavigate } from 'react-router-dom'

import Panel from '../components/Panel'
import Input from '../components/Input'
import Submit from '../components/Submit'

const RegistrationPage = () => {

  const {
    token,
    setEmail,
    setToken
  } = useContext(AccountContext);

  const {
    soundOn,
    darkModeOn,
    useSwipeOn,
    best,
    setUsername,
    setRank
  } = useContext(ProfileContext);

  const {
    score,
    multiplier,
    tileIds,
    tiles
  } = useContext(GameContext);

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const navigate = useNavigate();

  const registerUser = async (event) => {

    event.preventDefault();
    const formData = new FormData();
    formData.append('email', emailInput);
    formData.append('password', passwordInput);
    formData.append('soundOn', soundOn);
    formData.append('darkModeOn', darkModeOn);
    formData.append('useSwipeOn', useSwipeOn);
    formData.append('best', best);
    formData.append('score', score);
    formData.append('multiplier', multiplier);
    formData.append('tileIds', tileIds);
    formData.append('tiles', tiles);

    fetch('http://localhost:3000/api/account', {
      method: 'POST',
      body: formData
    })
      .then(async (response) => {
        if (response.status === 200) {
          const data = await response.json();
          console.log(data);
          setToken(response.headers.get('x-auth-token'));
          setEmail(data.account.email);
          setUsername(data.profile.username);
          setRank(data.profile.rank);
          navigate('/dashboard');
        } else {
          console.log(await response.json());
        }

      })
      .catch((error) => {
        console.log(error);
      })

  }


  return (
    <Panel>
      <h1>Register</h1>
      <form onSubmit={registerUser}>
        <Input
          onChange={(e) => setEmailInput(e.target.value)}
          type='email'
          placeholder='Email Address'
        />
        <Input
          onChange={(e) => setPasswordInput(e.target.value)}
          type='password'
          placeholder='Password'
        />
        <Submit
          value='Register'
          type='submit'
        />
      </form>
    </Panel>
  );
}

export default RegistrationPage