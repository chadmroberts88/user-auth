import { createContext, useState } from 'react'
export const ProfileContext = createContext({})

const ProfileProvider = ({ children }) => {

  const [username, setUsername] = useState('');
  const [soundOn, setSoundOn] = useState(true);
  const [darkModeOn, setDarkModeOn] = useState(false);
  const [useSwipeOn, setUseSwipeOn] = useState(false);
  const [best, setBest] = useState(0);
  const [rank, setRank] = useState(0);
  const [fileName, setFileName] = useState('');
  const [photo, setPhoto] = useState(new File([], ''));

  return (
    <ProfileContext.Provider
      value={{
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
        setPhoto
      }}
    >
      {children}
    </ProfileContext.Provider>
  )

}

export default ProfileProvider