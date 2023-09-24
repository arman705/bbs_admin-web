import React from 'react'
import { ShareMessageContainer } from './styled'

const ShareMessage = (props) => {
  let type = ''
  let title = ''
  const match = props.content.match(/type=([^&]+).+title=([^&]+)/)
  if (match) {
    type = decodeURIComponent(match[1] || '')
    title = match[2]
  }
  return (
    <ShareMessageContainer onClick={() => props.onClick && props.onClick()}>
      <div>分享了</div>
      <div className="wrap">
        <span>【{type}】</span> {title}
      </div>
    </ShareMessageContainer>
  )
}

export default ShareMessage
