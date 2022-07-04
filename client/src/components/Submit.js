import React from 'react'
import styled from 'styled-components'

const StyledSubmit = styled.input`
  margin: 10px;
  padding: 5px 12px;
  border: 1px solid black;
  height: 30px;
  border-radius: 4px;
  cursor: pointer;
`;

const Submit = (props) => {
  return (
    <StyledSubmit {...props} />
  )
}

export default Submit