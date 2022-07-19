import { createContext, useState } from 'react'
export const AccountContext = createContext({})

const AccountProvider = ({ children }) => {

  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AccountContext.Provider
      value={{
        id,
        email,
        password,
        setId,
        setEmail,
        setPassword
      }}
    >
      {children}
    </AccountContext.Provider>
  )

}

export default AccountProvider