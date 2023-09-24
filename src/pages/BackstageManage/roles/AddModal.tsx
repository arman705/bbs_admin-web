import React, { useState, useRef, useEffect } from 'react'
import { Button, InputNumber, Select, Form, Modal, message, Input, Spin } from 'antd';
import { addRole, editRole, getRole, getTreeMenusById } from '../../../api/backstage'
import MenuItem from './MenuItem'

export default function AddModal ({ type, id, visible, onCancel, onSubmitSuccess }) {
  const formRef = useRef(null)
  const menuItemRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [detailData, setDetailData] = useState({})
  const [roleSign, setRoleSign] = useState('')
  const [menuIds, setMenuIds] = useState([])
  
  useEffect(() => {
    if (visible && (type === 'edit')) {
      fillData()
    }
  }, [visible])
  useEffect(() => {
    if (!visible) {
      formRef?.current?.resetFields()
      menuItemRef.current?.reset()
      setMenuIds([])
      setRoleSign('')
    }
  }, [visible])
  async function fillData () {
    try {
      setLoading(true)
      const res = await Promise.all([getRole({ id }), getTreeMenusById(id)])
      const detailData_ = res[0].data || {}
      setDetailData(detailData_)
      formRef?.current?.setFieldsValue({
        roleName: detailData_.roleName,
        roleOrder: detailData_.roleOrder,
        roleStatus: detailData_.roleStatus,
        remark: detailData_.remark
      })
      setRoleSign(detailData_.roleSign)
      setMenuIds(getMenuIds(res[1].children))
    } finally {
      setLoading(false)
    }
  }
  function getMenuIds (data) {
    const res = []
    data.forEach(item => {
      const id = item.id
      const children = item.children
      if (item.state.selected) res.push(id)
      if (children && children.length > 0) res.push(...getMenuIds(children))
    })
    return res
  }
  async function onFinish (value) {
    try {
      let res
      value.menuIds = menuIds
      value.roleSign = roleSign
      setSaveLoading(true)
      if (type === 'add') {
        res = await addRole(value)
      } else {
        res = await editRole({ ...value, roleId: id })
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
      title={`${type === 'add' ? '新增' : '编辑' }角色`}
      visible={ visible }
      onCancel={ onCancel }
      footer={
        <>
          <Button disabled={loading} onClick={ onCancel }>取消</Button>
          <Button disabled={loading} type="primary" onClick={submit} loading={saveLoading}>确定</Button>
        </>
      }>
      <Spin spinning={loading}>
        <div style={{ height: '70vh', overflowY: 'auto' }}>
          <Form
            ref={formRef}
            labelCol={{ span: 5 }}
            onFinish={onFinish}
            initialValues={{
              roleName: '',
              roleSign: '',
              roleOrder: '',
              remark: ''
            }}>
            <Form.Item
              label="角色名称"
              name="roleName"
              rules={[{ required: true, message: '请输入角色名称' }]}>
              <Input maxLength={50} placeholder="请输入角色名称" />
            </Form.Item>
            <Form.Item
              label="权限字符"
              name="roleSign"
              required
              rules={[
                {
                  validator: (rule, value, callback) => {
                    return String(roleSign).trim() === '' ? callback('请输入权限字符') : callback() 
                  }
                }
              ]}>
              <Input
                maxLength={50}
                value={roleSign}
                placeholder="请输入权限字符"
                onChange={e => setRoleSign(e.target.value)}
              />
              <div style={{ color: '#AAA', fontSize: 12, marginTop: 4 }}>控制器中定义的权限标识，如：@RequiresRoles("")</div>
            </Form.Item>
            <Form.Item
              label="显示顺序"
              name="roleOrder"
              rules={[{ required: true, message: '请输入显示顺序' }]}>
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={0}
                placeholder="请输入显示顺序" />
            </Form.Item>
            <Form.Item
              label="状态"
              name="roleStatus"
              rules={[{ required: true, message: '请选择状态' }]}>
              <Select
                placeholder="请选择状态"
                options={[
                  { value: 1, label: '正常' },
                  { value: 0, label: '停用' }
                ]}
              />
            </Form.Item>
            <Form.Item
              label="备注"
              name="remark">
              <Input maxLength={50} placeholder="请输入备注" />
            </Form.Item>
            <Form.Item label="菜单权限">
              <MenuItem
                ref={menuItemRef}
                value={menuIds}
                onChange={value => setMenuIds(value)}
              />
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </Modal>
  )
}