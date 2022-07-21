import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AccountContext } from '../context/AccountContext'
import { ProfileContext } from '../context/ProfileContext'
import { GameContext } from '../context/GameContext'
import styled from 'styled-components'

import Panel from '../components/Panel'
import Input from '../components/Input'
import FileInput from '../components/FileInput'
import Checkbox from '../components/Checkbox'
import Submit from '../components/Submit'

const Grid = styled.div`
  display: grid;
  grid-template-columns: 48% 48%;
  column-gap: 4%;
`;

const Column = styled.div`
  border: 1px solid black;
  border-radius: 10px;
  padding: 10px;
`;

const Label = styled.label`
  font-size: 0.8rem;
  margin-bottom: 4px;
`;

const Option = styled.div`
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  width: 100%;
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 5px 12px;
  border: 1px solid black;
  height: 30px;
  width: fit-content;
  border-radius: 4px;
  cursor: pointer;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

const Item = styled.div`
  margin-bottom: 10px;
  font-size: 0.8rem;
  word-wrap: break-word;
`;

const Photo = styled.img`
  border-radius: 50%;
  border: 1px solid black;
  width: 50px;
  height: 50px;
`;

const DashboardPage = () => {

  const {
    token,
    email,
    password,
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
    setUsername,
    setSoundOn,
    setDarkModeOn,
    setUseSwipeOn,
    setPhoto
  } = useContext(ProfileContext);

  const {
    score,
    multiplier,
    tileIds,
    tiles
  } = useContext(GameContext);

  const navigate = useNavigate();

  return (
    <Panel>
      <h1>Dashboard</h1>
      <Grid>
        <Column>
          <form>
            <h2>Profile</h2>
            <Section>
              <Photo />
            </Section>
            <FileInput
              onChange={(e) => setPhoto(e.target.files[0])}
              type='file'
              accept="image/jpg, image/jpeg, image/png, image/gif"
            />
            <Label htmlFor='username'>Username:</Label>
            <Input
              name='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type='text'
              placeholder='Username'
            />
            <Label htmlFor='email'>Email:</Label>
            <Input
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type='email'
              placeholder='Email Address'
            />
            <Label htmlFor='password'>Password:</Label>
            <Input
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type='password'
              placeholder='Password'
            />
            <Option>
              <Label htmlFor='soundOn'>Sound On:</Label>
              <Checkbox
                checked={soundOn}
                onChange={() => { setSoundOn(!soundOn) }}
                type='checkbox'
                name='soundOn'
              />
            </Option>
            <Option>
              <Label htmlFor='darkModeOn'>Dark Mode On:</Label>
              <Checkbox
                checked={darkModeOn}
                onChange={() => { setDarkModeOn(!darkModeOn) }}
                type='checkbox'
                name='darkModeOn'
              />
            </Option>
            <Option>
              <Label htmlFor='useSwipe'>Use Swipe On:</Label>
              <Checkbox
                checked={useSwipeOn}
                onChange={() => { setUseSwipeOn(!useSwipeOn) }}
                type='checkbox'
                name='useSwipe'
              />
            </Option>
            <Submit
              value='Save Changes'
              type='submit'
            />
          </form>
        </Column>
        <Column>
          <h2>Info</h2>
          <Section>
            <Item>Best: {best}</Item>
            <Item>Rank: {rank}</Item>
            <Item>Score: {score}</Item>
            <Item>Multiplier: {multiplier}</Item>
            <Item>Tile Ids: {tileIds}</Item>
            <Item>Tiles: {tiles}</Item>
            <Item>Token: {token}</Item>
          </Section>
        </Column>
      </Grid>
      <Button onClick={() => { navigate('/') }}>
        Logout
      </Button>
    </Panel>
  )
}

export default DashboardPage