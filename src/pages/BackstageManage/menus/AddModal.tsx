import React, { useState, useRef, useEffect } from 'react'
import { Button, InputNumber, Radio, Form, Modal, message, Input, Popover } from 'antd';
import { addMenu, editMenu } from '../../../api/backstage'
import IconPopover from './IconPopover';
import MenuModal from './MenuModal'
import * as Icon from '@ant-design/icons/lib/icons';

export default function AddModal ({ type, data, visible, onCancel, onSubmitSuccess }) {
  const formRef = useRef(null)
  const [saveLoading, setSaveLoading] = useState(false)
  const [menuVisible, setMenuVisible] = useState(false)
  const [menuType, setMenuType] = useState(0)
  const [popVisible, setPopVisible] = useState(false)
  const [menu, setMenu] = useState({ text: '主目录', id: '0' })
  const [icon, setIcon] = useState('')
  const [perms, setPerms] = useState('')
  
  useEffect(() => {
    if (visible) {
      if (type === 'add' && data) {
        setMenu({ text: data.name, id: data.menuId })
      }
      if (type === 'edit') fillData()
    }
  }, [visible])
  useEffect(() => {
    if (!visible) {
      formRef?.current?.resetFields()
      setMenuType(0)
      setIcon('')
      setPerms('')
      setMenu({ text: '主目录', id: '0' })
    }
  }, [visible])
  async function fillData () {
    formRef?.current?.setFieldsValue({
      type: data.type,
      name: data.name,
      url: data.url,
      orderNum: data.orderNum,
      status: data.status,
      component: data.component
    })
    setPerms(data.perms)
    setMenuType(data.type)
    setMenu({ text: data.parentName, id: data.parentId })
    setIcon(data.icon || '')
  }
  async function onFinish (value) {
    try {
      let res
      value.icon = icon
      value.parentId = menu.id
      value.perms = perms
      setSaveLoading(true)
      if (type === 'add') {
        res = await addMenu(value)
      } else {
        res = await editMenu({ ...value, menuId: data.menuId })
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
  function getIcon () {
    if (icon && Icon[icon]) {
      const Component = Icon[icon]
      return <Component style={{ fontSize: 32 }} />
    }
    return null
  }
  return (
    <>
      <Modal
        width="80%"
        title={`${type === 'add' ? '新增' : '编辑' }菜单`}
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
          labelCol={{ span: 5 }}
          onFinish={onFinish}
          initialValues={{
            type: 0,
            status: 1,
            orderNum: 0
          }}>
          <Form.Item
            label="上级菜单">
            <Input
              placeholder="请选择上级菜单"
              readOnly
              value={menu ? menu.text : ''}
              onClick={() => setMenuVisible(true)}
            />
          </Form.Item>
          <Form.Item
            label="菜单类型"
            name="type">
            <Radio.Group
              options={[
                { label: '目录', value: 0 },
                { label: '菜单', value: 1 },
                { label: '按钮', value: 2 },
              ]}
              onChange={e => setMenuType(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="菜单名称"
            name="name"
            rules={[{ required: true, message: '请输入菜单名称' }]}>
            <Input maxLength={50} placeholder="请输入菜单名称" />
          </Form.Item>
          {
            menuType === 1 && <Form.Item
              label="请求地址"
              name="url"
              rules={[{ required: true, message: '请输入请求地址' }]}>
              <Input maxLength={50} placeholder="请输入请求地址" />
            </Form.Item>
          }
          {
            menuType === 1 && <Form.Item
              label="页面组件"
              name="component"
              rules={[{ required: true, message: '请输入页面组件' }]}>
              <Input maxLength={50} placeholder="请输入页面组件" />
            </Form.Item>
          }
          {
            menuType !== 0 && <Form.Item
              label="权限标识"
              name="perms">
              <Input
                value={perms}
                maxLength={50}
                placeholder="请输入权限标识"
                onChange={e => setPerms(e.target.value)} />
              <div style={{ color: '#AAA', fontSize: 12, marginTop: 4 }}>控制器中定义的权限标识，如：@RequiresPermissions("")</div>
            </Form.Item>
          }
          <Form.Item
            label="显示排序"
            name="orderNum"
            rules={[{ required: true, message: '请输入显示排序' }]}>
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              precision={0}
              placeholder="请输入排序" />
          </Form.Item>
          {
            menuType !== 2 && <Form.Item
              label="图标"
              name="icon">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                { getIcon() }
                
                {
                  !icon && (
                    <Popover
                      placement="bottom"
                      title="选择"
                      trigger="click"
                      visible={popVisible}
                      onVisibleChange={(visible) => setPopVisible(visible)}
                      content={() => {
                        return <IconPopover onSelect={value => {
                          setIcon(value)
                          setPopVisible(false)
                        }}/>
                      }}>
                      <Button type="link" style={{ padding: 0 }}>选择</Button>
                    </Popover>
                  )
                }
                {
                  icon && (
                    <Button
                      type="link"
                      style={{ padding: 0, marginLeft: 10 }}
                      onClick={() => setIcon('')}>
                      删除
                    </Button>
                  )
                }
              </div>
            </Form.Item>
          }
          {
            menuType !== 2 && <Form.Item
              label="菜单状态"
              name="status">
              <Radio.Group
                options={[
                  { label: '显示', value: 1 },
                  { label: '隐藏', value: 0 }
                ]}
              />
            </Form.Item>
          }
        </Form>
      </Modal>

      <MenuModal
        visible={menuVisible}
        addVisible={visible}
        onCancel={() => setMenuVisible(false)}
        onSelect={e => setMenu(e)}
      />
    </>
  )
}