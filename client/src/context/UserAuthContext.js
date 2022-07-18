import { createContext, useState } from 'react'
export const UserAuthContext = createContext({})

const UserAuthProvider = ({ children }) => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(new File([], ''));

  return (
    <UserAuthContext.Provider
      value={{
        name,
        email,
        password,
        photo,
        setName,
        setEmail,
        setPassword,
        setPhoto
      }}
    >
      {children}
    </UserAuthContext.Provider>
  )

}

export default UserAuthProvider