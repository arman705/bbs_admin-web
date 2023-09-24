import React, { useEffect, useState, useRef } from 'react'
import Thumbnail from "../../components/Thumbnail";
import { Typography, Button, Form, Input, Modal, message } from 'antd';
import { ContentInner, ContentWrapper } from '../../components/Themeable';
import { getDicList, addDic, editDic, deleteDic } from '../../api/dictionary'
import Datatable from "../../components/Datatable";
import Permission from '../../components/Permission';

export default function Dictionary () {
  const formRef = useRef(null)
  const searchFormRef = useRef(null)
  const [type, setType] = useState('add')
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [recordSelected, setRecordSelected] = useState<any>({})
  const [queryInfo, setQueryInfo] = useState({
    offset: 0,
    limit: 10,
  })
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [addVisible, setAddVisible] = useState(false)
  const [total, setTotal] = useState(0)
  const [dicList, setDicList] = useState([])
  const columns = [
    { title: '编号', dataIndex: 'id', align: 'id', width: 200 },
    { title: '字典名称', dataIndex: 'name', align: 'name', width: 200 },
    { title: '数据值', dataIndex: 'value', align: 'value', width: 200 },
    { title: '排序', dataIndex: 'sort', align: 'sort', width: 200 },
    { title: '描述', dataIndex: 'description', align: 'description', width: 200 },
    { title: '类型', dataIndex: 'type', align: 'type', width: 200 },
    { title: '创建人', dataIndex: 'createBy', align: 'createBy', width: 150 },
    { title: '创建时间', dataIndex: 'createDate', align: 'createDate', width: 150 },
    {
      title: '更新人',
      dataIndex: 'updateBy',
      align: 'updateBy',
      width: 150,
      render: (text) => text || '-'
    },
    {
      title: '更新时间',
      dataIndex: 'updateDate',
      align: 'updateDate',
      width: 150,
      render: (text) => text || '-'
    },
    { title: '备注', dataIndex: 'remarks', align: 'remarks', width: 250 },
    { 
      title: '操作',  
      align: 'center', 
      width: 200,
      render ( text: any, record: any, index: number ) {
        return (
          <>
            <Permission perms="common:dict:edit">
              <Button type="link" onClick={() => onEdit(record)}>编辑</Button>
            </Permission>
            <Permission perms="common:dict:remove">
              <Button type="link" onClick={() => onDelete(record)}>删除</Button>
            </Permission>
          </>
        )
      }
    }
  ]
  const pagination = {
    showSizeChanger: true,
    showQickJumper: false,
    showTotal: () => `共${total}条`,
    defaultPageSize: 10,
    current: (queryInfo.offset / queryInfo.limit) + 1,
    pageSize: queryInfo.limit,
    total: total,
    onChange: (current: number, size: number) => {
      setQueryInfo(pre => ({
        ...pre,
        offset: (current - 1) * size,
        limit: size
      }))
    }
  }
  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys)
    }
  }

  useEffect(() => {
    fetchDicList(queryInfo)
  }, [queryInfo])

  useEffect(() => {
    if (!addVisible) {
      formRef?.current?.resetFields()
    } else {
      if (type === 'edit') {
        formRef?.current?.setFieldsValue({
          name: recordSelected.name,
          description: recordSelected.description,
          value: recordSelected.value,
          sort: recordSelected.sort,
          type: recordSelected.type,
          remarks: recordSelected.remarks
        })
      }
    }
  }, [addVisible])

  async function fetchDicList (params) {
    try {
      setLoading(true)
      const res = await getDicList(params)
      if (res.code === 200) {
        setTotal(res.data.total)
        setDicList(res.data.rows || [])
      }
    } finally {
      setLoading(false)
    }
  }
  function onSearchFormFinish (val) {
    setQueryInfo(pre => ({
      ...pre,
      ...val
    }))
  }
  function add () {
    setType('add')
    setAddVisible(true)
  }
  function onEdit (record) {
    setType('edit')
    setRecordSelected(record)
    setAddVisible(true)
  }
  function submit () {
    formRef?.current?.submit()
  }
  async function onFinish (value) {
    try {
      let res
      setSaveLoading(true)
      if (type === 'add') {
        res = await addDic(value)
      } else {
        res = await editDic({ ...value, id: recordSelected.id })
      }
      if (res.code === 200) {
        setQueryInfo(pre => ({ ...pre }))
        setAddVisible(false)
      } else {
        message.error(res.msg)
      }
    } finally {
      setSaveLoading(false)
    }
  }
  function onDelete ({ id }) {
    Modal.confirm({
      title: '提示',
      content: '确定要删除吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await deleteDic({ids: [id]})
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
  function batchDelete () {
    if (selectedRowKeys.length === 0) {
      message.warning('请至少选择一项')
      return
    }
    Modal.confirm({
      title: '提示',
      content: '确定要删除吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await deleteDic({ids: selectedRowKeys})
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

  return (
    <>
      <ContentWrapper>
        <Thumbnail />
        <ContentInner>
          <Typography.Title level={5}>字典管理</Typography.Title>
          <Form ref={searchFormRef} layout="inline" onFinish={onSearchFormFinish}>
            <Form.Item name="name" label="名称">
              <Input
                placeholder="请输入字典名称"
                allowClear
                onBlur={(e) => e.target.value && searchFormRef?.current?.submit()}
                onChange={(e) => !e.target.value && searchFormRef?.current?.submit()} />
            </Form.Item>
            <Form.Item name="sort" label="key">
              <Input
                placeholder="sort"
                allowClear
                onBlur={(e) => e.target.value && searchFormRef?.current?.submit()}
                onChange={(e) => !e.target.value && searchFormRef?.current?.submit()} />
            </Form.Item>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
              <Form.Item>
                <Permission perms="common:dict:add">
                  <Button type="primary" onClick={add}>新增参数</Button>
                </Permission>
              </Form.Item>
              <Form.Item style={{ marginRight: 0 }}>
                <Permission perms="common:dict:remove">
                  <Button type="primary" onClick={batchDelete}>批量删除</Button>
                </Permission>
              </Form.Item>
            </div>
          </Form>
          <Datatable
            rowKey="id"
            title=""
            rowSelection={rowSelection}
            loading={loading}
            columns={columns}
            dataSource={dicList}
            scroll={{ x: 200 }}
            pagination={pagination}/>
        </ContentInner>
      </ContentWrapper>
      <Modal
        width="500px"
        title={`${type === 'add' ? '新增' : '编辑' }字典`}
        visible={ addVisible }
        onCancel={() => setAddVisible(false)}
        footer={
          <>
            <Button onClick={() => setAddVisible(false)}>取消</Button>
            <Button type="primary" onClick={submit} loading={saveLoading}>确定</Button>
          </>
        }>
        <Form
          ref={formRef}
          labelCol={{ span: 5 }}
          onFinish={onFinish}
          initialValues={{
            name: '',
            description: '',
            sort: '',
            value: '',
            type: '',
            remarks: ''
          }}>
          <Form.Item
            label="字典名称"
            name="name"
            rules={[{ required: true, message: '请输入字典名称' }]}>
            <Input maxLength={50} placeholder="请输入字典名称" />
          </Form.Item>
          <Form.Item
            label="描述"
            name="description"
            rules={[{ required: true, message: '请输入描述' }]}>
            <Input maxLength={50} placeholder="请输入描述" />
          </Form.Item>
          <Form.Item
            label="类型"
            name="type"
            rules={[{ required: true, message: '请输入类型' }]}>
            <Input maxLength={50} placeholder="请输入类型" />
          </Form.Item>
          <Form.Item
            label="数据值"
            name="value"
            rules={[{ required: true, message: '请输入数据值' }]}>
            <Input maxLength={50} placeholder="请输入数据值" />
          </Form.Item>
          <Form.Item
            label="排序（升序）"
            name="sort"
            rules={[{ required: true, message: '请输入排序' }]}>
            <Input maxLength={50} placeholder="请输入排序" />
          </Form.Item>
          <Form.Item
            label="备注"
            name="remarks">
            <Input.TextArea maxLength={250} rows={4} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
   </>
  )
}
