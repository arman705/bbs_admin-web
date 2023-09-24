import React, { useEffect, useState } from 'react'
import { Spin, List, Row, Col, Typography, Input, Button } from 'antd'
import { user } from '../../api';
import { DeleteFilled } from '@ant-design/icons';

const CommonWordPanel = (props) => {
  const [ loading, setLoading ] = useState(false)
  const [ commonList, setCommonList ] = useState([])
  const [ commonWord, setCommonWord ] = useState('')
  const [ t, setT ] = useState(Date.now())

  useEffect(() => {
    fetchCommonList() 
  }, [t])

  async function fetchCommonList () {
    setLoading(true)
    try {
      const res = await user.replyList()
      if (res.code === 200) setCommonList(res.data)
    } finally {
      setLoading(false)
    }
  }
  async function addCommonWord () {
    try {
      setLoading(true)
      const res = await user.replySave({ reply: encodeURIComponent(commonWord) })
      if (res.code === 200) {
        setCommonWord('')
        setT(Date.now())
      }
    } finally {
      setLoading(false)
    }
  }
  async function onDelCommon (e, item) {
    e.stopPropagation()
    setLoading(true)
    try {
      const res = await user.replyDel(item.id)
      if (res.code === 200) setT(Date.now())
    } finally {
      setLoading(false)
    }
  }
  return (
    <Spin spinning={loading}>
      <div>
        <div style={{ width: 400, maxHeight: 150, overflowY: 'auto' }}>
          <List
            size="small"
            dataSource={commonList}
            renderItem={item => (
              <List.Item style={{ cursor: 'pointer' }} onClick={() => props.onSelect(item)}>
                <Row style={{ width: '100%' }}>
                  <Col flex={1}>
                    <Typography.Text>{ decodeURIComponent(item.reply) }</Typography.Text>
                  </Col>
                  <Col style={{ marginLeft: 10 }} onClick={(e) => onDelCommon(e, item)}>
                    <DeleteFilled style={{ color: 'red', fontSize: 16 }} />
                  </Col>
                </Row>
              </List.Item>
            )}
          />
        </div>
        <Row style={{ paddingTop: 16, width: '100%' }} gutter={ 10 }>
          <Col flex={1}>
            <Input
              value={commonWord}
              placeholder="请输入常用语"
              onChange={(e) => setCommonWord(e.target.value)} />
          </Col>
          <Col>
            <Button type="primary" onClick={ addCommonWord }>添加</Button>
          </Col>
        </Row>
      </div>
    </Spin>
  )
}

export default CommonWordPanel
