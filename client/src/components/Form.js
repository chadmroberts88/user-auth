import React from 'react'
import styled from 'styled-components'

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 30vw;
  height: 30vw;
  border: 1px solid black;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 5px 5px 18px 5px rgba(0,0,0,0.4);
  background-color: lightgrey;
`;

const Form = (props) => {
  return (
    <StyledForm {...props}>
      {props.children}
    </StyledForm>
  )
}

export default Form