import React, { useState, useRef, useEffect } from 'react'
import { Button, InputNumber, Form, Modal, message, Input, Image, Spin } from 'antd';
import { auditComment, getCommentDetail } from '../../../api/task'

export default function AddModal ({ type, id, visible, onCancel, onSubmitSuccess }) {
  const formRef = useRef(null)
  const [detailData, setDetailData] = useState({})
  const [loading, setLoading] = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [rejectLoading, setRejectLoading] = useState(false)
  const [contentComponent, setContentComponent] = useState(null)
  
  useEffect(() => {
    if (visible && (type === 'edit' || type === 'audit')) {
      fillData()
    }
  }, [visible])
  useEffect(() => {
    if (!visible) {
      formRef?.current?.resetFields()
      setContentComponent(null)
    }
  }, [visible])
  async function fillData () {
    try {
      setLoading(true)
      const res = await getCommentDetail({ id })
      if (res.code === 200) {
        const data = res.data
        setDetailData(data)
        setContentComponent(getContent(data))
        formRef?.current?.setFieldsValue({
          userName: data.userName,
          postsTitle: data.postsTitle,
          price: data.price,
          adoptGold: data.adoptGold
        })
      }
    } finally {
      setLoading(false)
    }
  }
  function getContent (record) {
    const content = record.content
    try {
      const contentObj = JSON.parse(content)
      const text = contentObj.text
      const images = contentObj.imgUrl ? contentObj.imgUrl.split(',') : []
      const videos = contentObj.videoUrl ? contentObj.videoUrl.split(',') : []
      return (
        <div>
          <div>{text}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {
              images.map(item => {
                return (
                  <Image
                    style={{
                      width: 200,
                      height: 200,
                      marginRight: 4,
                      marginBottom: 4,
                      objectFit: 'cover'
                    }}
                    src={ item }/>
                )
              })
            }
          </div>
          <div style={{ marginTop: 10 }}>
            {
              videos.map(item => {
                return (
                  <div
                    style={{
                      width: 200,
                      height: 200,
                      marginRight: 4,
                      marginBottom: 4,
                      position: 'relative',
                      background: '#000'
                    }}
                  >
                    <video
                      controls
                      src={ item }
                      style={{
                        width: '100%',
                        height: '100%'
                      }}
                    />
                  </div>
                )
              })
            }
          </div>
        </div>
      )
    } catch (e) {
      return content
    }
  }
  async function onPass () {
    setPassLoading(true)
    try {
      const res = await auditComment({
        id,
        auditState: 'PASS',
      })
      if (res.code === 200) {
        message.success('审核成功')
        onSubmitSuccess()
      }
    } finally {
      setPassLoading(false)
    }
  }
  async function onReject () {
    setRejectLoading(true)
    try {
      const res = await auditComment({
        id,
        auditState: 'REJECT'
      })
      if (res.code === 200) {
        message.success('拒绝成功')
        onSubmitSuccess()
      }
    } finally {
      setRejectLoading(false)
    }
  }
  return (
    <Modal
      width="80%"
      title={`${type === 'add' ? '查看' : '审核' }评论`}
      visible={ visible }
      onCancel={ onCancel }
      footer={
        type === 'audit' ? <>
          <Button type="primary" disabled={loading} onClick={ onPass } loading={ passLoading }>通过</Button>
          <Button type="primary" disabled={loading} onClick={ onReject } loading={ rejectLoading }>拒绝</Button>
        </> : null
      }>
      <Spin spinning={ loading }>
        <Form
          ref={formRef}
          labelCol={{ span: 5 }}
          initialValues={{
          }}>
          <Form.Item
            label="用户名"
            name="userName">
            <Input maxLength={50}  disabled />
          </Form.Item>
          <Form.Item
            label="任务标题"
            name="postsTitle">
            <Input maxLength={50}  disabled />
          </Form.Item>
          {
            detailData.isAdopt === 1 && <Form.Item
              label="采纳虎头币"
              name="adoptGold">
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={0}
                disabled />
            </Form.Item>
          }
          <Form.Item label="任务内容">
            {contentComponent}
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  )
}