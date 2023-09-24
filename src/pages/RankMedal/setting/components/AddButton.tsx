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
  onClick?: () => void,
  type: number
}

const AddButton: React.FC<IAddButton> = (props) => {
  function getTitle () {
    switch (props.type) {
      case 1:
        return '+新增等级勋章'
      case 2:
        return '+新增活动勋章'
      case 3:
        return '+新增限定勋章'
    }
  }
  return (
    <Col>
      <Button onClick={props.onClick}>
        {getTitle()}
      </Button>
    </Col>
  )
}

export default AddButton
