import React, { useState, useRef, useEffect } from 'react'
import { Button, Form, Modal, message, Spin, Input } from 'antd';
import { updateComment, addComment, getCommentDetail } from '../../api/randomComment'

export default function AddModal ({ type, id, visible, onCancel, onSubmitSuccess }) {
  const formRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  
  useEffect(() => {
    if (visible && (type === 'edit')) {
      fillData()
    }
  }, [visible])
  useEffect(() => {
    if (!visible) {
      formRef?.current?.resetFields()
    }
  }, [visible])
  async function fillData () {
    try {
      setLoading(true)
      const res = await getCommentDetail({ id })
      const data = res.data || {}
      formRef?.current?.setFieldsValue({
        content: data.content
      })
    } finally {
      setLoading(false)
    }
  }
  async function onFinish (value) {
    try {
      let res
      setSaveLoading(true)
      if (type === 'add') {
        res = await addComment(value)
      } else {
        res = await updateComment({ ...value, id: id })
      }
      if (res.code === 200) {
        message.success(type === 'add' ? '新增成功' : '修改成功')
        onSubmitSuccess()
      } else {
        message.error(res.msg)
      }
    } finally {
      setSaveLoading(false)
    }
  }
  function submit () {
    formRef?.current?.submit()
  }
  return (
    <Modal
      width="80%"
      title="新增随机评论"
      visible={ visible }
      onCancel={ onCancel }
      footer={
        <>
          <Button disabled={loading} onClick={ onCancel }>取消</Button>
          <Button disabled={loading} type="primary" onClick={submit} loading={saveLoading}>确定</Button>
        </>
      }>
      <Spin spinning={loading}>
        <Form
          ref={formRef}
          labelCol={{ span: 3 }}
          onFinish={onFinish}
          initialValues={{
            content: ''
          }}>
          <Form.Item
            label="评论内容"
            name="content"
            rules={[{ required: true, message: '请输入评论内容' }]}>
            <Input.TextArea
              rows={3}
              placeholder="请输入评论内容" />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  )
}