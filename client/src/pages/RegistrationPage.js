import React, { useContext } from 'react'
import { AccountContext } from '../context/AccountContext'
import { ProfileContext } from '../context/ProfileContext'
import { GameContext } from '../context/GameContext'
import { useNavigate } from 'react-router-dom'

import Form from '../components/Form'
import Input from '../components/Input'
import FileInput from '../components/FileInput'
import Checkbox from '../components/Checkbox'
import Submit from '../components/Submit'
import styled from 'styled-components'

const Option = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  width: 100%;
`;

const RegistrationPage = () => {

  const {
    id,
    email,
    password,
    setId,
    setEmail,
    setPassword
  } = useContext(AccountContext);

  const {
    username,
    soundOn,
    darkModeOn,
    useSwipeOn,
    best,
    rank,
    fileName,
    photo,
    setUsername,
    setSoundOn,
    setDarkModeOn,
    setUseSwipeOn,
    setBest,
    setRank,
    setFileName,
    setPhoto } = useContext(ProfileContext);

  const {
    score,
    multiplier,
    tileIds,
    tiles,
    setScore,
    setMultiplier,
    setTileIds,
    setTiles
  } = useContext(GameContext);

  const navigate = useNavigate();

  const registerUser = async (event) => {

    event.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('username', username);
    formData.append('soundOn', soundOn);
    formData.append('darkModeOn', darkModeOn);
    formData.append('useSwipeOn', useSwipeOn);
    formData.append('best', best);
    formData.append('photo', photo);
    formData.append('score', score);
    formData.append('multiplier', multiplier);
    formData.append('tileIds', tileIds);
    formData.append('tiles', tiles);

    const response = await fetch('http://localhost:3000/api/account', {
      method: 'POST',
      body: formData
    });

    console.log("RESPONSE:", await response.json());

  }

  return (
    <Form onSubmit={registerUser}>
      <h1>Register</h1>
      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type='email'
        placeholder='Email Address'
      />
      <Input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type='password'
        placeholder='Password'
      />
      <Input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        type='text'
        placeholder='Username'
      />
      <FileInput
        onChange={(e) => setPhoto(e.target.files[0])}
        type='file'
        accept="image/jpg, image/jpeg, image/png, image/gif"
      />
      <Option>
        <label htmlFor='soundOn'>Sound On:</label>
        <Checkbox
          checked={soundOn}
          onChange={() => { setSoundOn(!soundOn) }}
          type='checkbox'
          name='oundOn'
        />
      </Option>
      <Option>
        <label htmlFor='darkModeOn'>Dark Mode On:</label>
        <Checkbox
          checked={darkModeOn}
          onChange={() => { setDarkModeOn(!darkModeOn) }}
          type='checkbox'
          name='darkModeOn'
        />
      </Option>
      <Option>
        <label htmlFor='useSwipe'>Use Swipe On:</label>
        <Checkbox
          checked={useSwipeOn}
          onChange={() => { setUseSwipeOn(!useSwipeOn) }}
          type='checkbox'
          name='useSwipe'
        />
      </Option>
      <Submit
        value='Register'
        type='submit'
      />
    </Form>
  );
}

export default RegistrationPage