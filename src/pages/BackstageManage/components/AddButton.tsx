import React from 'react'
import { Col } from 'antd'
import Styled from 'styled-components'

const Button = Styled.div`
  font-size: 16px;
  color: rgba(128, 128, 128, 1);
  width: 365px;
  height: 179px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid rgba(233; 233; 233; 1);
  cursor: pointer;
`

interface IAddButton {
  onClick?: () => void
}

const AddButton: React.FC<IAddButton> = (props) => {
  return (
    <Col>
      <Button onClick={props.onClick}>
        +新增成员
      </Button>
    </Col>
  )
}

export default AddButton
