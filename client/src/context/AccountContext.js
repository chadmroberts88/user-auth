import { createContext, useState } from 'react'
export const AccountContext = createContext({})

const AccountProvider = ({ children }) => {

  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('none');
  const [password, setPassword] = useState('none');

  return (
    <AccountContext.Provider
      value={{
        token,
        email,
        password,
        setToken,
        setEmail,
        setPassword
      }}
    >
      {children}
    </AccountContext.Provider>
  )

}

export default AccountProvider