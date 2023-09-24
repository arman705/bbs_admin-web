import React, { useState, useRef, useEffect } from 'react'
import { Button, InputNumber, Form, Modal, message } from 'antd';
import { adoptComment } from '../../../api/task'

export default function AdoptModal ({ data, visible, onCancel, onSubmitSuccess }) {
  const formRef = useRef(null)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (!visible) {
      formRef?.current?.resetFields()
    }
  }, [visible])
  
  function submit () {
    formRef?.current?.submit()
  }
  async function onFinish (value) {
    try {
      setLoading(true)
      const res = await adoptComment({
        commentId: data.id,
        postsId: data.postsId,
        ...value
      })
      if (res.code === 200) {
        message.success('采纳成功')
        onSubmitSuccess()
      } else {
        message.error(res.msg)
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <Modal
      width="400px"
      title="采纳评论"
      visible={ visible }
      onCancel={ onCancel }
      footer={
        <>
          <Button onClick={ onCancel }>取消</Button>
          <Button type="primary" onClick={ submit } loading={ loading }>确定</Button>
        </>
      }>
      <Form
        ref={formRef}
        labelCol={{ span: 5 }}
        initialValues={{
          price: ''
        }}
        onFinish={ onFinish }>
        <Form.Item
          label="虎头币"
          name="price"
          rules={[{ required: true, message: '请输入虎头币' }]}>
          <InputNumber style={{ width: '100%' }} maxLength={6} placeholder="请输入虎头币" />
        </Form.Item>
      </Form>
    </Modal>
  )
}