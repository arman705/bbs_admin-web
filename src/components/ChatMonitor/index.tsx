import React, { useEffect, useState, useRef } from 'react'
import { Button } from 'antd'
import { Container } from './styled'
import {
  FullscreenOutlined,
  ReloadOutlined,
  FullscreenExitOutlined,
  CaretDownOutlined
} from '@ant-design/icons';
import { monitor } from '../../api';
import MessageList from './MessageList'

const ChatMonitor = () => {
  const [ messageList, setMessageList ] = useState<any[]>([])
  const [ isFullscreen, setIsFullscreen ] = useState(false)
  const [t, setT] = useState(Date.now())
  const [ messageCount, setMessageCount ] = useState(0)
  const contentRef = useRef(null)

  useEffect(() => {
		fetchChatMessages()
	}, [t])
  
  async function fetchChatMessages () {
		await monitor.getChatMessages().then(res => {
      if (res.code === 200) {
        const data = res.data || []
        setMessageList(data.reverse())
        // scrollToBottom()
        // if (isScroll()) {
        setMessageCount(data.length)
        // }
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
  function onMessage (data) {
    console.log('vvvvvv', data)
    if (data.messageSource === 'CHAT') {
      setMessageList(pre => ([data, ...pre]))
      setMessageCount(pre => pre + 1)
    }
  }
  // function onContentScroll (e) {
  //   const clientHeight = contentRef.current.clientHeight
  //   const scrollTop = contentRef.current.scrollTop
  //   const scrollHeight = contentRef.current.scrollHeight
  //   if (clientHeight + scrollTop === scrollHeight) {
  //     setMessageCount(0)
  //   }
  // }
  // function isScroll () {
  //   const clientHeight = contentRef.current.clientHeight
  //   const scrollHeight = contentRef.current.scrollHeight
  //   return scrollHeight > clientHeight;
  // }
  return (
    <Container className={isFullscreen ? 'fullscreen' : ''}>
      <div className="header">
        <div className="left">实时聊天监控</div>
        <div className="right">
          <Button icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />} type="link" onClick={() => setIsFullscreen(!isFullscreen)}>
            { isFullscreen ? '退出全屏' : '全屏' }
          </Button>
          <Button icon={<ReloadOutlined />} type="link" onClick={onRefresh}>刷新</Button>
        </div>
      </div>
      <div ref={contentRef} className="content">
        <MessageList
          openWs={true}
          dataSource={messageList}
          onMessage={onMessage} />
      </div>
      {/* <div className="footer">
        <Row gutter={10} align="middle">
          <Col><SmileOutlined style={{ fontSize: 20, cursor: 'pointer' }} /></Col>
          <Col flex={1}><Input placeholder="请输入内容" /></Col>
          <Col><Button type="primary">发送</Button></Col>
        </Row>
      </div> */}

      <div className="tips" onClick={scrollToBottom}>
        { messageCount } 条聊天
        <CaretDownOutlined />
      </div>
    </Container>
  )
}

export default ChatMonitor
