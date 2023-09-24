import React, { useState, useEffect } from 'react'
import { Form, Modal, Input, ModalProps, message } from 'antd';
import { saveVersion, updateVersion } from '../../../api/backstage';
import ReactQuill from 'react-quill';

interface AddVersionModalProps extends ModalProps {
  onSubmitSuccess: () => void;
  recordData?: any
}

const AddVersionModal: React.FC<AddVersionModalProps> = (props) => {
  const { onSubmitSuccess, recordData, ...modalProps } = props
  const [loading, setLoading] = useState(false)
  const [formRef] = Form.useForm()
  
  function onSave (values: any) {
    const requestApi = recordData ? updateVersion : saveVersion
    const data = {...values}
    Reflect.deleteProperty(data, 'confirmPassword')
    recordData && (data.id = recordData.id)
    setLoading(true)
    requestApi(data).then((res: any) => {
      if (res.code === 200) {
        message.success(recordData ? '更新成功' : '新增成功')
        onSubmitSuccess()
        onCancel(null as any)
      } else {
        message.error(res.msg)
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  function onCancel (e: React.MouseEvent<HTMLElement>) {
    formRef.resetFields()
    modalProps.onCancel && modalProps.onCancel(e)
  }
  function confirmPasswordValidator (_: any, value: string) {
    if (formRef.getFieldValue('password') !== value) {
      return Promise.reject(new Error('密码不一致'));
    } else {
      return Promise.resolve(); 
    }
  }

  useEffect(() => {
    if (modalProps.visible && recordData) {
      recordData.confirmPassword = recordData.password
      formRef.setFieldsValue(recordData)
    } else {
      formRef.resetFields()
    }
  }, [modalProps.visible])

  return (
    <Modal
      title={recordData ? '编辑成员' : '新增成员'}
      okText="确定"
      cancelText="取消"
      {...modalProps}
      onOk={formRef.submit}
      onCancel={onCancel}
      okButtonProps={{loading}}>
      <Form form={formRef} layout="horizontal" labelCol={ {span: 5} } onFinish={onSave}>
        <Form.Item name="name" label="内容介绍" rules={[{ required: true, message: '请输入内容介绍' }]}>
          <Input placeholder="请输入内容介绍" />
        </Form.Item>
        <Form.Item name="version" label="版本号" rules={[{ required: true, message: '请输入版本号' }]}>
          <Input placeholder="请输入版本号" />
        </Form.Item>
        <Form.Item name="type" label="平台/设备" rules={[{ required: true, message: '请输入平台/设备' }]}>
          <Input placeholder="请输入平台/设备" />
        </Form.Item>
        <Form.Item name="description" label="" rules={[{ required: true, message: '请输入内容' }]}>
          <ReactQuill><div style={ {height: '200px'} }></div></ReactQuill>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddVersionModal
