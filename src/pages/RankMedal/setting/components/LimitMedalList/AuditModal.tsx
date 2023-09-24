import React, { useState, useRef, useEffect } from 'react'
import { Button, Popconfirm, Form, Modal, Image, Input, message } from 'antd';
import { checkApply } from '../../../../../api/rankmedal'

export default function AuditModal ({ data, visible, type, onCancel, onSubmitSuccess }) {
  const formRef = useRef(null)
  const reasonRef = useRef(null)
  
  useEffect(() => {
    fillData()
  }, [visible])
  useEffect(() => {
    if (!visible) {
      formRef?.current?.resetFields()
    }
  }, [visible])
  async function fillData () {
    formRef?.current?.setFieldsValue({
      userName: data.userName,
      medalTitle: data.medalTitle,
      salesPrice: data.salesPrice
    })
  }
  function changeStatus(auditState) {
    Modal.confirm({
      title: '提示',
      content: auditState === 'PASS' ? '确定通过审核吗？' : '确定拒绝审核吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const params = {
          id: data.id,
          medalId: data.medalId,
          userId: data.userId,
          auditState: auditState
        }
        if (auditState === 'REJECT') {
          const reason = reasonRef.current.resizableTextArea.textArea.value
          if (!reason) {
            message.warning('请输入拒绝理由')
            return
          }
          params.remark = reason
        }
        const res = await checkApply(params)
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
      width="600px"
      title="审核商品"
      visible={ visible }
      onCancel={ onCancel }
      footer={
        type === 'audit' ? <>
          <Popconfirm
            icon={null}
            okText="确定"
            cancelText="取消"
            title={
              <Input.TextArea
                ref={reasonRef}
                style={{ width: 240 }}
                maxLength={100}
                placeholder="请输入拒绝理由"
              />
            }
            onConfirm={() => changeStatus('REJECT')}>
            <Button>拒绝</Button>
          </Popconfirm>
          <Button type="primary" onClick={() => changeStatus('PASS')}>通过</Button>
        </> : null
      }>
      <Form
        ref={formRef}
        labelCol={{ span: 5 }}>
        <Form.Item
          label="用户名"
          name="userName">
          <Input maxLength={50} disabled />
        </Form.Item>
        <Form.Item
          label="申请勋章"
          name="medalTitle">
          <Input maxLength={50} disabled />
        </Form.Item>
        <Form.Item
          label="勋章图标"
          name="medalIcon">
          <Image
            src={data.medalIcon}
            style={{ width: 60, height: 60, marginRight: 10, objectFit: 'cover' }} />
        </Form.Item>
        <Form.Item
          label="虎头币"
          name="salesPrice">
          <Input maxLength={50} disabled />
        </Form.Item>
      </Form>
    </Modal>
  )
}
