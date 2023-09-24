import React from 'react'
import { TextMessageContainer } from './styled'
import emojiList from './emojiList';

const TextMessage = (props) => {
  function formatContent (val) {
    return val.replace(/\[(.*?)\]/gm, match => {
      const target = emojiList[match]
      if (target) {
        return `<img style="width: 25px" src="${target}" />`
      }
    })
  }
  const content = formatContent(props.content)
  return (
    <TextMessageContainer>
      <div dangerouslySetInnerHTML={{__html: content}}></div>
    </TextMessageContainer>
  )
}

export default TextMessage
