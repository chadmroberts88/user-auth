import React, { useContext } from 'react'
import { AccountContext } from '../context/AccountContext'
import { Link, useNavigate } from 'react-router-dom'

import Panel from '../components/Panel'
import Input from '../components/Input'
import Submit from '../components/Submit'

const LogInPage = () => {

  const { email, setEmail, password, setPassword } = useContext(AccountContext);
  const navigate = useNavigate();

  const logInUser = async (event) => {
    event.preventDefault();
    const response = await fetch('http://localhost:3000/api/login', {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        email: email,
        password: password
      })

    })

    const recievedData = await response.json();
    console.log(recievedData);

    if (recievedData.status !== 'error') {
      alert('Login Successful');
      navigate('/dashboard');
    } else {
      alert('Please check username and password');
    }

  }

  return (
    <Panel >
      <h1>Log In</h1>
      <form onSubmit={logInUser}>
        <Input
          onChange={(e) => setEmail(e.target.value)}
          type='email'
          placeholder='Email Address'
        />
        <Input
          onChange={(e) => setPassword(e.target.value)}
          type='password'
          placeholder='Password'
        />
        <Submit
          value='Log In'
          type='submit'
        />
      </form>
      <Link to='/register'>Register</Link>
    </Panel>
  );
}

export default LogInPage