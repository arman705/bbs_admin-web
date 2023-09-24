import React, { useState, useRef, useEffect } from 'react'
import Thumbnail from "../../../components/Thumbnail";
import { ContentInner, ContentWrapper } from '../../../components/Themeable';
import { Typography, Button, DatePicker, Switch, Select, Form, Modal, message, Input } from 'antd';
import Datatable from "../../../components/Datatable";
import { getRoles, editRole, removeRole } from '../../../api/backstage'
import AddModal from './AddModal'
import Permission from '../../../components/Permission'
import { hasPermission } from '../../../utils/utils'

export default function Roles () {
  const searchFormRef = useRef(null)
  const [recordSelected, setRecordSelected] = useState<any>({})
  const [queryInfo, setQueryInfo] = useState({
    // offset: 0,
    // limit: 10
  })
  const [type, setType] = useState('add')
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [addVisible, setAddVisible] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const columns = [
    { title: '角色编号', dataIndex: 'roleId', align: 'center', width: 100 },
    { title: '角色名称', dataIndex: 'roleName', align: 'center', width: 100 },
    { title: '权限字符', dataIndex: 'roleSign', align: 'center', width: 100 },
    { title: '显示顺序', dataIndex: 'roleSign', align: 'center', width: 100 },
    {
      title: '角色状态',
      dataIndex: 'roleStatus',
      align: 'center',
      width: 100,
      render: (text, record) => {
        return (
          <Switch
            disabled={!hasPermission('sys:role:edit')}
            checked={text === 1}
            onChange={async (e) => {
              try {
                setLoading(true)
                record.roleStatus = record.roleStatus === 1 ? 0 : 1
                await editRole({
                  roleId: record.roleId,
                  roleStatus: record.roleStatus
                })
                setDataSource(prev => ([ ...prev ]))
              } finally {
                setLoading(false)
              }
            }}
          />
        )
      }
    },
    { title: '创建时间', dataIndex: 'gmtCreate', align: 'center', width: 100 },
    { 
      title: '操作',  
      align: 'center', 
      width: 130,
      render ( text: any, record: any, index: number ) {
        return (
          <>
            <Permission perms="sys:role:edit">
              <Button type="link" onClick={() => onEdit(record)}>编辑</Button>
            </Permission>
            <Permission perms="sys:role:remove">
              <Button type="link" onClick={() => onDelete(record)}>删除</Button>
            </Permission>
          </>
        )
      }
    }
  ]
  // const pagination = {
  //   showSizeChanger: true,
  //   showQickJumper: false,
  //   showTotal: () => `共${total}条`,
  //   defaultPageSize: 10,
  //   current: (queryInfo.offset / queryInfo.limit) + 1,
  //   pageSize: queryInfo.limit,
  //   total: total,
  //   onChange: (current: number, size: number) => {
  //     setQueryInfo(pre => ({
  //       ...pre,
  //       offset: (current - 1) * size,
  //       limit: size
  //     }))
  //   }
  // }
  useEffect(() => {
    fetchDataSource(queryInfo)
  }, [queryInfo])
  async function fetchDataSource (params) {
    try {
      setLoading(true)
      const res = await getRoles(params)
      if (res.code === 200) {
        // setTotal(res.data.total)
        // setDataSource(res.data.rows || [])
        setDataSource(res.data)
      }
    } finally {
      setLoading(false)
    }
  }
  function onEdit (record) {
    setType('edit')
    setRecordSelected(record)
    setAddVisible(true)
  }
  function onDelete (record) {
    Modal.confirm({
      title: '提示',
      content: '确定要删除吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await removeRole({ id: record.roleId })
          if (res.code === 200) {
            message.success('删除成功')
            setQueryInfo(pre => ({ ...pre }))
          } else {
            message.error(res.msg)
          }
        } catch (err) {
          console.log(err)
        }
      }
    });
  }
  function add () {
    setType('add')
    setAddVisible(true)
  }
  function onSearchFormFinish (val) {
    setQueryInfo(pre => ({
      ...pre,
      ...val
    }))
  }
  return (
    <>
      <ContentWrapper>
        <Thumbnail />
        <ContentInner>
          <Typography.Title level={5}>角色管理</Typography.Title>
          <Form
            ref={searchFormRef}
            layout="inline"
            initialValues={{
              official: 0
            }}
            onFinish={onSearchFormFinish}>
            <Form.Item name="roleName" label="角色名称">
              <Input maxLength={50} placeholder="角色名称" allowClear />
            </Form.Item>
            <Form.Item name="roleSign" label="权限字符">
              <Input maxLength={50} placeholder="权限字符" allowClear />
            </Form.Item>
            <Form.Item name="roleStatus" label="状态">
              <Select
                allowClear
                placeholder="请选择角色状态"
                options={[
                  { value: '', label: '所有' },
                  { value: 1, label: '正常' },
                  { value: 0, label: '停用' }
                ]}
              />
            </Form.Item>
            {/* <Form.Item name="auditState">
              <DatePicker.RangePicker
                placeholder={['创建时间-开始', '创建时间-结束']}
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
              />
            </Form.Item> */}
            <Form.Item>
              <Button type="primary" onClick={() => searchFormRef.current.submit()}>确定</Button>
            </Form.Item>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
              <Form.Item>
                <Permission perms="sys:role:add">
                  <Button type="primary" onClick={add}>新增</Button>
                </Permission>
              </Form.Item>
            </div>
          </Form>
          <Datatable
            rowKey="id"
            title=""
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: 200 }}
            pagination={null}/>
        </ContentInner>
      </ContentWrapper>
      <AddModal
        visible={addVisible}
        type={type}
        id={recordSelected.roleId}
        onCancel={() => setAddVisible(false)}
        onSubmitSuccess={() => {
          setQueryInfo(pre => ({ ...pre }))
          setAddVisible(false)
        }}
        ></AddModal>
    </>
  )
}