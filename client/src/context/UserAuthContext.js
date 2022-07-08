import { createContext, useState } from 'react'
export const UserAuthContext = createContext({})

const UserAuthProvider = ({ children }) => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <UserAuthContext.Provider
      value={{
        name,
        email,
        password,
        setName,
        setEmail,
        setPassword
      }}
    >
      {children}
    </UserAuthContext.Provider>
  )

}

export default UserAuthProvider