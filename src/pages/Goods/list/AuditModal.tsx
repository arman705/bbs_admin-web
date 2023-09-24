import React, { useState, useRef, useEffect } from 'react'
import { Button, InputNumber, Form, Modal, Image, Input, message } from 'antd';
import { auditGoods } from '../../../api/goods';

export default function AuditModal ({ data, visible, onCancel, onSubmitSuccess }) {
  const formRef = useRef(null)
  const [saveLoading, setSaveLoading] = useState(false)
  
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
      createUserName: data.createUserName,
      title: data.title,
      price: data.price,
      sort: data.sort,
      desc: data.desc
    })
  }
  function changeStatus(status) {
    Modal.confirm({
      title: '提示',
      content: status === 1 ? '确定通过审核吗？' : '确定拒绝审核吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const res = await auditGoods({
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
      width="80%"
      title="审核商品"
      visible={ visible }
      onCancel={ onCancel }
      footer={
        <>
          <Button onClick={() => changeStatus(2)}>拒绝</Button>
          <Button type="primary" onClick={() => changeStatus(1)} loading={saveLoading}>通过</Button>
        </>
      }>
      <Form
        ref={formRef}
        labelCol={{ span: 5 }}>
        <Form.Item
          label="用户名"
          name="createUserName">
          <Input maxLength={50} disabled />
        </Form.Item>
        <Form.Item
          label="商品主图"
          name="imgs">
          {
            (data.imgs || '').split(',').map(item => {
              return <Image src={item} style={{ width: 100, height: 100, marginRight: 10, objectFit: 'cover' }} />
            })
          }
          <div style={{ color: '#aaa', fontSize: 12 }}>第一张图默认为封面图片</div>
        </Form.Item>
        <Form.Item
          label="帖子标题"
          name="title">
          <Input maxLength={50} disabled />
        </Form.Item>
        <Form.Item
          label="兑换商品所需虎头币"
          name="price">
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            disabled />
        </Form.Item>
        <Form.Item
          label="排序"
          name="sort">
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            precision={0}
            disabled />
        </Form.Item>
        <Form.Item
          label="说明"
          name="desc">
          <Input.TextArea maxLength={250} rows={4} disabled />
        </Form.Item>
      </Form>
    </Modal>
  )
}
