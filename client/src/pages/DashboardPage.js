import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 40vw;
  height: 50vh;
  border: 1px solid black;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 5px 5px 18px 5px rgba(0,0,0,0.4);
  background-color: lightgrey;
`;

const JokeBox = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 30%;
  width: 90%;
`;

const Button = styled.button`
  margin: 10px;
  padding: 5px 12px;
  border: 1px solid black;
  height: 30px;
  border-radius: 4px;
  cursor: pointer;
`;

const DashboardPage = () => {

  const [dadJoke, setDadJoke] = useState('- - - - - -');
  const navigate = useNavigate();

  const getDadJoke = async () => {

    const response = await fetch('https://icanhazdadjoke.com/', {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    const jokeData = await response.json();

    setDadJoke(jokeData.joke);

  }

  return (
    <Container>
      <h1>Dashboard</h1>
      <Button onClick={getDadJoke}>
        Click for Dad Joke
      </Button>
      <JokeBox>
        {dadJoke}
      </JokeBox>
      <Button onClick={() => { navigate('/') }}>
        Logout
      </Button>
    </Container>
  )
}

export default DashboardPage