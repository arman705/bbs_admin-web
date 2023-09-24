import React, { useEffect, useState, useRef } from 'react'
import { Button } from 'antd'
import { Container } from '../ChatMonitor/styled'
import {
  FullscreenOutlined,
  ReloadOutlined,
  FullscreenExitOutlined,
  CaretDownOutlined
} from '@ant-design/icons';
import { monitor } from '../../api';
import MessageList from '../ChatMonitor/MessageList'

const CommentMonitor = () => {
  const [ messageList, setMessageList ] = useState<any[]>([])
  const [ isFullscreen, setIsFullscreen ] = useState(false)
  const [t, setT] = useState(Date.now())
  const [ messageCount, setMessageCount ] = useState(0)
  const contentRef = useRef(null)
  
  useEffect(() => {
    fetchCommentMessages()
  }, [t])
  
  function onMessage (data) {
    if (data.messageSource === '"COMMENT"') {
      setMessageList(pre => ([...pre, data]))
      setMessageCount(pre => pre + 1)
    }
  }
  async function fetchCommentMessages () {
    await monitor.getCommentMessages().then(res => {
      if (res.code === 200) {
        const data = res.data || []
        setMessageList(data.reverse())
        setMessageCount(data.length)
        // scrollToBottom()
      }
    })
  }
  function scrollToBottom () {
    setTimeout(() => {
      contentRef?.current?.scrollTo(0, contentRef?.current?.scrollHeight || 9999)
    }, 0)
  }
  function onRefresh () {
    setT(Date.now())
  }
  
  return (
    <Container className={isFullscreen ? 'fullscreen' : ''}>
      <div className="header">
        <div className="left">实时评论监控</div>
        <div className="right">
          <Button icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />} type="link" onClick={() => setIsFullscreen(!isFullscreen)}>
            { isFullscreen ? '退出全屏' : '全屏' }
          </Button>
          <Button icon={<ReloadOutlined />} type="link" onClick={onRefresh}>刷新</Button>
        </div>
      </div>
      <div ref={contentRef} className="content">
        <MessageList
          hideReply={true}
          openWs={true}
          dataSource={messageList}
          onMessage={onMessage} />
      </div>
      <div className="tips" onClick={scrollToBottom}>
        { messageCount } 条评论
        <CaretDownOutlined />
      </div>
    </Container>
  )
}

export default CommentMonitor