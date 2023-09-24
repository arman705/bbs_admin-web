import React, { useState, useEffect } from 'react'
import { Form, Modal, Input, ModalProps, message, Select, Spin } from 'antd';
import { userSave, sysUserUpdate, getRoles, sysUserDetail } from '../../../api/backstage';

interface AddModalProps extends ModalProps {
  onSubmitSuccess: () => void;
  id?: any
}

const AddModal: React.FC<AddModalProps> = (props) => {
  const { onSubmitSuccess, id, ...modalProps } = props
  const [loading, setLoading] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailData, setDetailData] = useState({})
  const [roles, setRoles] = useState([])
  const [formRef] = Form.useForm()

  useEffect(() => {
    fetchRoles()
  }, [])

  async function fetchRoles () {
    const res = await getRoles({ roleStatus: 1 })
    if (res.code === 200) setRoles(res.data.map(item => ({ label: item.roleName, value: item.roleId })))
  }
  function onSave (values: any) {
    const requestApi = id ? sysUserUpdate : userSave
    const data = {...values}
    Reflect.deleteProperty(data, 'confirmPassword')
    if (id) {
      data.userId = id
      // 因为返回的密码是加了密的，如果编辑时没改密码，不要传
      if (detailData.password === data.password) {
        Reflect.deleteProperty(data, 'password')
      }
    }
    setLoading(true)
    requestApi(data).then((res: any) => {
      if (res.code === 200) {
        message.success(id ? '更新成功' : '新增成功')
        onSubmitSuccess()
        onCancel(null as any)
      } else {
        message.error(res.message)
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
    if (modalProps.visible && id) {
      setDetailLoading(true)
      sysUserDetail({ id }).then(res => {
        const data = res.data
        data.confirmPassword = data.password
        setDetailData(data)
        formRef.setFieldsValue(data)
      }).finally(() => {
        setDetailLoading(false)
      })
    } else {
      formRef.resetFields()
    }
  }, [modalProps.visible])

  return (
    <Modal
      title={id ? '编辑成员' : '新增成员'}
      okText="确定"
      cancelText="取消"
      {...modalProps}
      onOk={formRef.submit}
      onCancel={onCancel}
      okButtonProps={{loading}}>
      <Spin spinning={detailLoading}>
        <Form form={formRef} layout="horizontal" labelCol={ {span: 5} } onFinish={onSave}>
          <Form.Item name="name" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item name="username" label="账户" rules={[{ required: true, message: '请输入账户' }]}>
            <Input placeholder="请输入账户" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
            <Input placeholder="请输入密码" type="password" />
          </Form.Item>
          <Form.Item name="confirmPassword" label="确认密码" required rules={[{ validator: confirmPasswordValidator }]}>
            <Input placeholder="请输入确认密码" type="password" />
          </Form.Item>
          <Form.Item name="jobNumber" label="工号" rules={[{ required: true, message: '请输入工号' }]}>
            <Input placeholder="请输入工号" />
          </Form.Item>
          <Form.Item name="job" label="职务" rules={[{ required: true, message: '请输入职务' }]}>
            <Input placeholder="请输入职务" />
          </Form.Item>
          <Form.Item name="roleIds" label="角色">
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="请选择角色（可多选）"
              options={roles}
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  )
}

export default AddModal
