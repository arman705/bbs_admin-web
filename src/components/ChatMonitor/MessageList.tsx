import React, { useState, useEffect } from 'react'
import { Modal, Button, message, Row, Col, Popover, Input } from 'antd'
import { getConfigList } from '../../api/config'
import { ModalContent, EmojiWrap } from './styled'
import MessageRow from './MessageRow';
import emojiList from './emojiList';
import ViolationModal from '../ViolationModal';
import CommonWordPanel from '../CommonWordPanel'
import {
  BarsOutlined,
  SmileOutlined
} from '@ant-design/icons';
import moment from 'moment';

const MessageList = (props) => {
  const [ ws, setWs ] = useState({})
  const [ saveLoading, setSaveLoading ] = useState(false)
  const [ modalVisible, setModalVisible ] = useState(false)
  const [ violationVisible, setViolationVisible ] = useState(false)
  const [ violationId, setViolationId ] = useState('')
  const [ currentItem, setCurrentItem ] = useState({})
  const [ replyContent, setReplyContent ] = useState('')
  const [ adminInfo, setAdminInfo ] = useState(null)
  const EmojiPanel = (
    <div style={{ width: 400 }}>
      {
        Object.entries(emojiList).map(([key, value]) => {
          return (
            <EmojiWrap onClick={() => onEmojiSelect(key)}>
              <img src={value} alt="" />
            </EmojiWrap>
          )
        })
      }
    </div>
  )

  useEffect(() => {
    if (props.openWs) {
      subscribeWs()
      return () => {
        unsubscribeWs()
      }
    }
  }, [])

  useEffect(() => {
    if (!props.hideReply) {
      fetchAdminInfo()
    }
  }, [])

  async function fetchAdminInfo () {
    try {
      const { code, data } = await getConfigList({ configKey: 'sys.adminReplyAcount' })
      if (code === 200) {
        if (Array.isArray(data?.rows) && data.rows.length > 0) {
          const target = data.rows[0]
          setAdminInfo(JSON.parse(target.configValue))
        }
      }
    } catch (error) {
    }
  }
  function subscribeWs () {
    const instance = new WebSocket('ws://23.225.197.18:8081/webSocket');
		instance.onopen = e => {
			console.log('open', e)
		}
		instance.onmessage = e => {
      try {
        const data = JSON.parse(e.data)
        props.onMessage && props.onMessage(data)
      } catch (error) {
      }
		}
		instance.onclose = e => {
			console.log('close', e)
		}
		instance.onerror = e => {
			console.log('error', e)
		}
		setWs(instance)
  }
  function unsubscribeWs () {
		ws.close && ws.close()
	}
  function onNameClick (id) {
    setViolationId(id)
    setViolationVisible(true)
  }
  function onEmojiSelect (val) {
    setReplyContent(pre => pre + val)
  }
  function onSelectCommon ({ reply }) {
    setReplyContent(reply)
  }
  function getMessageList () {
    return (props.dataSource || []).map((item: any, index) => {
      return (
        <MessageRow
          data={item}
          onReply={() => onReply(item)}
          onNameClick={onNameClick}
          hideReply={props.hideReply}
        />
      )
    })
  }
  function onReply (item) {
    if (adminInfo) {
      setCurrentItem(item)
      setModalVisible(true)
    } else {
      message.error('请先在参数管理中设置管理员回复账号')
    }
  }
  async function onReplyOk () {
    if (!replyContent) {
      message.warning('请输入回复内容')
      return
    }
    setSaveLoading(true)
    ws.send(
      JSON.stringify({
        messageSource: 'CHAT',
        messageType: 'TEXT',
        content: replyContent,
        sendNickName: adminInfo.sendNickName,
        sendTime: moment(new Date()).format('YYYY-MM-DD HH:MM:SS'),
        sendId: adminInfo.sendId,
        headImg: adminInfo.headImg,
        acceptId: currentItem.sendId,
        // acceptNickName: currentItem.sendNickName,
        accepNickName: currentItem.sendNickName,
        roomId: currentItem.roomId,
      })
    )
    onCancel()
  }
  function onCancel () {
    setReplyContent('')
    setSaveLoading(false)
    setModalVisible(false)
  }
  return (
    <>
      { getMessageList() }
      <Modal
        title="回复"
        width={600}
        visible={modalVisible}
        onCancel={onCancel}
        footer={
          <>
            <Button style={{ marginLeft: 10 }} onClick={onCancel}>取消</Button>
            <Button type="primary" loading={saveLoading} onClick={onReplyOk}>提交</Button>
          </>
        }>
        <ModalContent>
          <div className="modal-wrap">
            <MessageRow
              data={currentItem}
              hideReply={true}
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <Row gutter={10} align="middle">
              <Col flex={1}>
                <Input.TextArea
                  rows={3}
                  value={replyContent}
                  placeholder="请输入回复内容"
                  maxLength={250}
                  onChange={(e) => setReplyContent(e.target.value)} />
                </Col>
              <Col>
                <Popover
                  title="选择常用语"
                  placement="top"
                  content={<CommonWordPanel onSelect={onSelectCommon} />}
                  trigger="click">
                  <BarsOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
                </Popover>
              </Col>
              <Col>
                <Popover placement="top" content={EmojiPanel} trigger="click">
                  <SmileOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
                </Popover>
              </Col>
            </Row>
          </div>
        </ModalContent>
      </Modal>

      <ViolationModal
        id={violationId}
        visible={violationVisible}
        onCancel={() => setViolationVisible(false)} />
    </>
  )
}

export default MessageList
