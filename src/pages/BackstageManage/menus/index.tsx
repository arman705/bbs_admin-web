import React, { useState, useRef, useEffect } from 'react'
import Thumbnail from "../../../components/Thumbnail";
import { ContentInner, ContentWrapper } from '../../../components/Themeable';
import { Typography, Button, Select, Form, Modal, message, Input } from 'antd';
import Datatable from "../../../components/Datatable";
import { getMenus, deleteMenu } from '../../../api/backstage'
import AddModal from './AddModal'
import Permission from '../../../components/Permission';

export default function Menus () {
  const searchFormRef = useRef(null)
  const [recordSelected, setRecordSelected] = useState<any>({})
  const [queryInfo, setQueryInfo] = useState({
    // offset: 0,
    // limit: 10
  })
  const [type, setType] = useState('add')
  const [loading, setLoading] = useState(false)
  const [addVisible, setAddVisible] = useState(false)
  const [menus, setMenus] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [expandedRowKeys, setExpandedRowKeys] = useState([])
  const [expanded, setExpanded] = useState(false)
  const columns = [
    { title: '菜单名称', dataIndex: 'name', align: 'left', width: 150 },
    { title: '排序', dataIndex: 'orderNum', align: 'center', width: 80 },
    {
      title: '请求地址',
      dataIndex: 'url',
      align: 'center',
      width: 100,
      render: text => text || '-'
    },
    {
      title: '类型',
      dataIndex: 'type',
      align: 'center',
      width: 100,
      render: (text) => {
        switch (text) {
          case 0:
            return '目录'
          case 1:
            return '菜单'
          case 2:
            return '按钮'
        }
      }
    },
    {
      title: '可见',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      render: (text, record) => record.type === 2 ? '-' : text === 1 ? '显示' : '隐藏'
    },
    {
      title: '权限标识',
      dataIndex: 'perms',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: text => text || '-'
    },
    { 
      title: '操作',  
      align: 'center', 
      width: 130,
      render ( text: any, record: any, index: number ) {
        return (
          <>
            <Permission perms="sys:menu:add">
              <Button type="link" onClick={() => add(record)}>新增</Button>
            </Permission>
            <Permission perms="sys:menu:edit">
              <Button type="link" onClick={() => onEdit(record)}>编辑</Button>
            </Permission>
            <Permission perms="sys:menu:remove">
              <Button type="link" onClick={() => onDelete(record)}>删除</Button>
            </Permission>
          </>
        )
      }
    }
  ]
  useEffect(() => {
    fetchDataSource(queryInfo)
  }, [queryInfo])
  useEffect(() => {
    if (expanded) {
      setExpandedRowKeys(menus.map(item => item.menuId))
    } else {
      setExpandedRowKeys([])
    }
  }, [expanded])
  async function fetchDataSource (params) {
    try {
      setLoading(true)
      const res = await getMenus(params)
      if (res.code === 200) {
        const data = res.data || []
        setMenus(data)
        setDataSource(handleData(data))
      }
    } finally {
      setLoading(false)
    }
  }
  function handleData (data) {
    let result = []
		let map = {}
		data.forEach(item => {
			map[item.menuId] = item
		})
		data.forEach(item => {
			let parent = map[item.parentId]
			if (parent) {
        const children = parent.children || (parent.children = [])
				item.parentName = parent.name
        children.push(item)
			} else {
        if (item.parentId === 0) {
          item.parentName = '主目录'
          result.push(item)
        }
			}
		})
    console.log('---',result)
    result = handleSort(result)
		return result
  }
  function handleSort (data) {
    let result = []
    result = data.sort((a, b) => {
      if (a.children) a.children = handleSort(a.children)
      if (b.children) b.children = handleSort(b.children)
      return a.orderNum - b.orderNum
    })
    return result
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
          const res = await deleteMenu({ id: record.menuId })
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
  function add (record) {
    setType('add')
    setRecordSelected(record)
    setAddVisible(true)
  }
  function onSearchFormFinish (val) {
    setQueryInfo(pre => ({
      ...pre,
      ...val
    }))
  }
  function onExpandedRowsChange (expandedRowKeys) {
    setExpandedRowKeys(expandedRowKeys)
  }
  return (
    <>
      <ContentWrapper>
        <Thumbnail />
        <ContentInner>
          <Typography.Title level={5}>菜单管理</Typography.Title>
          <Form
            ref={searchFormRef}
            layout="inline"
            initialValues={{
              official: 0
            }}
            onFinish={onSearchFormFinish}>
            <Form.Item name="name" label="菜单名称">
              <Input maxLength={50} placeholder="请输入菜单名称" allowClear />
            </Form.Item>
            <Form.Item name="auditState" label="菜单状态">
              <Select
                allowClear
                placeholder="请选择菜单状态"
                options={[
                  { value: '', label: '所有' },
                  { value: 1, label: '显示' },
                  { value: 2, label: '隐藏' }
                ]}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={() => searchFormRef.current.submit()}>确定</Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" danger onClick={() => setExpanded(!expanded)}>展开/折叠</Button>
            </Form.Item>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
              <Form.Item>
                <Permission perms="sys:menu:add">
                  <Button type="primary" onClick={() => add(null)}>新增</Button>
                </Permission>
              </Form.Item>
              {/* <Form.Item style={{ marginRight: 0 }}>
                <Button type="primary" onClick={batchDelete}>批量删除</Button>
              </Form.Item> */}
            </div>
          </Form>
          <Datatable
            rowKey="menuId"
            size="small"
            title=""
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: 200 }}
            pagination={ false }
            expandable={{
              expandedRowKeys,
              onExpandedRowsChange
            }}/>
        </ContentInner>
      </ContentWrapper>
      <AddModal
        visible={addVisible}
        type={type}
        data={recordSelected}
        onCancel={() => setAddVisible(false)}
        onSubmitSuccess={() => {
          setQueryInfo(pre => ({ ...pre }))
          setAddVisible(false)
        }}
      />
    </>
  )
}