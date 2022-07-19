import React from 'react'
import styled from 'styled-components'

const StyledFileInput = styled.input`
  margin-top: 10px;
  padding: 4px 0px;
  height: 30px;
  width: 100%;
`;

const FileInput = (props) => {
  return (
    <StyledFileInput {...props} />
  )
}

export default FileInput