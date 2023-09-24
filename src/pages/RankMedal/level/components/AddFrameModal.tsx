import React, { useState, useEffect } from 'react'
import { Form, Modal, Input, ModalProps, message } from 'antd';
import { avatarFrameSave, avatarFrameUpdate } from '../../../../api/rankmedal';
import UploadImg from '../../setting/components/UploadImg'

interface AddFrameModalProps extends ModalProps {
  onSubmitSuccess: () => void;
  recordData?: any
}

const AddFrameModal: React.FC<AddFrameModalProps> = (props) => {
  const { onSubmitSuccess, recordData, ...modalProps } = props
  const [loading, setLoading] = useState(false)
  const [formRef] = Form.useForm()
  
  function onSave (values: any) {
    const requestApi = recordData ? avatarFrameUpdate : avatarFrameSave
    const fd: any = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'img') {
        fd.append('headUrl', (value as any).name)
      } else {
        fd.append(key, value)
      }
    })
    recordData ? fd.append('id', recordData.id) : fd.append('status', 0)
    setLoading(true)
    requestApi(fd).then((res: any) => {
      if (res.code === 200) {
        message.success('新增成功')
        onSubmitSuccess()
        onCancel(null as any)
      } else {
        message.error('新增失败')
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  function onCancel (e: React.MouseEvent<HTMLElement>) {
    formRef.resetFields()
    modalProps.onCancel && modalProps.onCancel(e)
  }

  useEffect(() => {
    if (modalProps.visible && recordData) {
      formRef.setFieldsValue({
        ...recordData,
        img: {
          name: recordData.headUrl,
          url: recordData.imgRealUrl
        }
      })
    } else {
      formRef.resetFields()
    }
  }, [modalProps.visible])

  return (
    <Modal
      okText="确定"
      cancelText="取消"
      {...modalProps}
      onOk={formRef.submit}
      onCancel={onCancel}
      okButtonProps={{loading}}>
      <Form form={formRef} layout="horizontal" labelCol={ {span: 5} } onFinish={onSave}>
        <Form.Item name="img" label="头像框" rules={[{ required: true, message: '请上传头像框' }]}>
          <UploadImg />
        </Form.Item>
        <Form.Item name="name" label="头像框名称" rules={[{ required: true, message: '请输入头像框名称' }]}>
          <Input placeholder="请输入头像框名称" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddFrameModal
