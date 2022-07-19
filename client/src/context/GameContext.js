import { createContext, useState } from 'react'
export const GameContext = createContext({})

const GameProvider = ({ children }) => {

  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [tileIds, setTileIds] = useState(2);
  const [tiles, setTiles] = useState('[]');

  return (
    <GameContext.Provider
      value={{
        score,
        multiplier,
        tileIds,
        tiles,
        setScore,
        setMultiplier,
        setTileIds,
        setTiles
      }}
    >
      {children}
    </GameContext.Provider>
  )

}

export default GameProvider