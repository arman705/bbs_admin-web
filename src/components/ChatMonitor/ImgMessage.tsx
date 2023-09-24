import React from 'react'
import { ImgMessageContainer } from './styled'
import { Image } from 'antd'

const ImgMessage = (props) => {
  return (
    <ImgMessageContainer>
      <Image width="100%" src={props.url} />
    </ImgMessageContainer>
  )
}

export default ImgMessage
