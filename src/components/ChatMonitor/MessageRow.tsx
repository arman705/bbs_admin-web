import React from 'react'
import { MessageContainer } from './styled'
import { Button } from 'antd'
import TextMessage from './TextMessage';
import ImgMessage from './ImgMessage';
import AudioMessage from './AudioMessage';
import ShareMessage from './ShareMessage';
import TaskMessage from './TaskMessage';
import DefaultAvatar from '../../assets/images/default-avatar.png';

const MessageRow = (props) => {
  const onNameClick = props.onNameClick || (() => {})
  const data = props.data || {}

  function onShared (val) {
    window.open(val)
  }
  function getContent () {
    let message
    switch (data.messageType) {
      case 'TEXT':
        message = <TextMessage content={data.content} />
        break
      case 'IMG':
        message = <ImgMessage url={data.content} />
        break
      case 'AUDIO':
        message = (
          <AudioMessage
            url={data.content}
            duration={data.duration}
            onPlay={() => {
              const audios = document.querySelectorAll('audio')
              if (audios) {
                audios.forEach(item => {
                  item.pause()
                })
              }
            }} />
        )
        break
      case 'SHARE':
        message = <ShareMessage content={data.content} onClick={() => onShared(data.content)} />
        break
      default:
        try {
          const content = JSON.parse(data.content)
          return <TaskMessage data={content} />
        } catch (error) {
          message = <TextMessage content={data.content} />
        }
    }
    return message
  }
  return (
    <MessageContainer>
      <div className="left" onClick={() => onNameClick(data.sendId)}>
        {
          data.headImg ? <img src={data.headImg} alt="" /> : <img src={DefaultAvatar} alt="" />
        }
      </div>
      <div className="right">
        <div className="right-header">
          <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => onNameClick(data.sendId)}>{data.sendNickName}</span>
          {
            data.accepNickName ?
              <>
                <span>回复</span>
                <span
                  style={{
                    color: '#1890ff',
                    cursor: 'pointer'
                  }}
                  onClick={() => onNameClick(data.acceptId)}>
                  {data.accepNickName}
                </span>
              </> : null
          }
          <span className="time">{data.sendTime || '-'}</span>
        </div>
        <div className="right-content">
          <div className="right-content-wrap">
            {getContent()}
          </div>
          {
            data.messageType !== 'SHARE' && !props.hideReply ?
              <Button 
                className="right-content-btn"
                type="link"
                onClick={() => props.onReply && props.onReply()}>
                回复
              </Button> : null
          }
        </div>
      </div>
    </MessageContainer>
  )
}

export default MessageRow
