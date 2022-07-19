import React from 'react'
import styled from 'styled-components'

const StyledCheckbox = styled.input`
  margin: 4px;
  padding: 4px;
  border: 1px solid black;
  border-radius: 4px;
`;

const Checkbox = (props) => {
  return (
    <StyledCheckbox {...props} />
  )
}

export default Checkbox