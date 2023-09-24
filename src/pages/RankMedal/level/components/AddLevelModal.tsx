import React, { useState, useRef, useEffect } from 'react'
import { Button, InputNumber, Form, Modal, message } from 'antd';
import { levelConfigAdd, levelConfigUpdate } from '../../../../api/rankmedal';

export default function AddLevelModal ({ type, data, visible, onCancel, onSubmitSuccess }) {
  const formRef = useRef(null)
  const [saveLoading, setSaveLoading] = useState(false)
  
  useEffect(() => {
    if (visible && (type === 'edit' || type === 'audit')) {
      fillData()
    }
  }, [visible])
  useEffect(() => {
    if (!visible) {
      formRef?.current?.resetFields()
    }
  }, [visible])
  async function fillData () {
    formRef?.current?.setFieldsValue({
      level: data.level,
      rewardAmount: data.rewardAmount,
      needAmount: data.needAmount
    })
  }
  async function onFinish (value) {
    try {
      let res
      setSaveLoading(true)
      if (type === 'add') {
        res = await levelConfigAdd(value)
      } else {
        res = await levelConfigUpdate({ ...value, id: data.id })
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
      width="600px"
      title={`${type === 'add' ? '新增' : '编辑' }等级`}
      visible={ visible }
      onCancel={ onCancel }
      footer={
        <>
          <Button onClick={ onCancel }>取消</Button>
          <Button type="primary" onClick={submit} loading={saveLoading}>确定</Button>
        </>
      }>
      <Form
        ref={formRef}
        labelCol={{ span: 6 }}
        onFinish={onFinish}
        initialValues={{
          level: '',
          rewardAmount: ''
        }}>
        <Form.Item
          label="VIP等级"
          name="level"
          rules={[{ required: true, message: '请输入VIP等级' }]}>
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            precision={0}
            maxLength={9}
            placeholder="请输入VIP等级" />
        </Form.Item>
        <Form.Item
          label="奖励虎头币"
          name="rewardAmount"
          rules={[{ required: true, message: '请输入奖励虎头币' }]}>
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            precision={0}
            maxLength={9}
            placeholder="请输入奖励虎头币" />
        </Form.Item>
        <Form.Item
          label="下一级所需虎头币"
          name="needAmount"
          rules={[{ required: true, message: '请输入下一级所需虎头币' }]}>
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            precision={0}
            maxLength={9}
            placeholder="请输入下一级所需虎头币" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
