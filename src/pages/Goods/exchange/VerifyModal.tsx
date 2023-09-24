import React, { useState, useRef, useEffect } from 'react'
import { Button, Form, Modal, message, Input } from 'antd';
import { auditRecord } from '../../../api/goods'

export default function VerifyModal ({ type, data, visible, onCancel, onSubmitSuccess }) {
  const formRef = useRef(null)
  
  useEffect(() => {
    fillData()
  }, [visible])
  useEffect(() => {
    if (!visible) {
      formRef?.current?.resetFields()
    }
  }, [visible])
  async function fillData () {
    formRef?.current?.setFieldsValue(data)
  }
  async function onSubmit (status) {
    Modal.confirm({
      title: '提示',
      content: status === 1 ? '您确定完成当前用户兑换商品，并发送到用户相关账号吗？' : '确定拒绝吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const res = await auditRecord({
          id: data.id,
          status: status
        })
        if (res.code === 200) {
          message.success('提交成功')
          onSubmitSuccess()
        } else {
          message.error(res.msg)
        }
      }
    });
  }
  return (
    <Modal
      width="400px"
      title={type === 'view' ? '查看' : '审核'}
      visible={ visible }
      onCancel={ onCancel }
      footer={
        type === 'view' ? null : <>
          <Button onClick={() => onSubmit(2)}>拒绝</Button>
          <Button type="primary" onClick={() => onSubmit(1)}>确定</Button>
        </>
      }>
      <Form
        ref={formRef}
        labelCol={{ span: 5 }}
        initialValues={{
          nickname: '',
          title: '',
          price: '',
          desc: ''
        }}>
        <Form.Item
          label="用户名"
          name="nickname">
          <Input maxLength={50} disabled />
        </Form.Item>
        <Form.Item
          label="兑换商品"
          name="title">
          <Input maxLength={50} disabled />
        </Form.Item>
        <Form.Item
          label="虎头币"
          name="price">
          <Input maxLength={50} disabled />
        </Form.Item>
        <Form.Item
          label="相关资料"
          name="account">
          <Input maxLength={50} disabled />
        </Form.Item>
      </Form>
    </Modal>
  )
}