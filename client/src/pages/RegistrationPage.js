import React, { useContext } from 'react'
import { UserAuthContext } from '../context/UserAuthContext'
import { useNavigate } from 'react-router-dom'

import Form from '../components/Form'
import Input from '../components/Input'
import Submit from '../components/Submit'

const RegistrationPage = () => {

  const { name, setName, email, photo, setEmail, password, setPassword, setPhoto } = useContext(UserAuthContext);
  const navigate = useNavigate();

  const registerUser = async (event) => {

    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('photo', photo);

    // const response = await fetch('http://localhost:3000/api/register', {

    //   method: 'POST',

    //   headers: {
    //     'Content-Type': 'multipart/formdata'
    //   },

    //   body: formData

    // })

    // const recievedData = await response.json();

    // console.log("response:", recievedData);

    // if (recievedData.status === 'ok') {
    //   console.log("STATUS READ AS OK");
    //   navigate('/');
    // } else {
    //   alert('Nav error');
    // }

  }

  return (
    <Form onSubmit={registerUser}>
      <h1>Register</h1>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type='text'
        placeholder='Name'
      />
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
        onChange={(e) => setPhoto(e.target.files[0])}
        type='file'
      />
      <Submit
        value='Register'
        type='submit'
      />
    </Form>
  );
}

export default RegistrationPage