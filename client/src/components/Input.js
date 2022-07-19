import React from 'react'
import styled from 'styled-components'

const StyledInput = styled.input`
  margin-top: 10px;
  padding: 4px;
  border: 1px solid black;
  height: 30px;
  width: 100%;
  border-radius: 4px;
`;

const Input = (props) => {
  return (
    <StyledInput {...props} />
  )
}

export default Input