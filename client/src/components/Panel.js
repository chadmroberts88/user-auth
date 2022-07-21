import React from 'react'
import styled from 'styled-components'

const StyledPanel = styled.div`
  max-width: 80vw;
  min-width: 240px;
  max-height: 80vh;
  min-height: 240px;
  border: 1px solid black;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 5px 5px 18px 5px rgba(0,0,0,0.4);
  background-color: lightgrey;
  overflow: hidden auto;
`;

const Panel = (props) => {
  return (
    <StyledPanel {...props}>
      {props.children}
    </StyledPanel>
  )
}

export default Panel