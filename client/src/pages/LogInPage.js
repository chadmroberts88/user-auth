import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Form from '../components/Form'
import Input from '../components/Input'
import Submit from '../components/Submit'

const LogInPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const logInUser = async (event) => {
    event.preventDefault();
    const response = await fetch('http://localhost:3000/login', {

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

    if (recievedData.token) {
      localStorage.setItem('token', recievedData.token);
      alert('Login Successful');
      navigate('/dashboard');
    } else {
      alert('Please check username and password');
    }

  }

  return (
    <Form onSubmit={logInUser}>
      <h1>Log In</h1>
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
      <Submit
        value='Log In'
        type='submit'
      />
      <Link to='/register'>Register</Link>
    </Form>
  );
}

export default LogInPage