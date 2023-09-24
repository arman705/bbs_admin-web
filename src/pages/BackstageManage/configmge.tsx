import React, { useEffect, useState, useRef } from 'react'
import Thumbnail from "../../components/Thumbnail";
import { Typography, Button, Form, Input, Modal, message } from 'antd';
import { ContentInner, ContentWrapper } from '../../components/Themeable';
import { getConfigList, addConfig, editConfig, deleteConfig } from '../../api/config'
import Datatable from "../../components/Datatable";
import Permission from '../../components/Permission';

export default function Configmge () {
  const formRef = useRef(null)
  const searchFormRef = useRef(null)
  const [type, setType] = useState('add')
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [recordSelected, setRecordSelected] = useState<any>({})
  const [queryInfo, setQueryInfo] = useState({
    offset: 0,
    limit: 10,
    configName: '',
    configKey: ''
  })
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [addVisible, setAddVisible] = useState(false)
  const [total, setTotal] = useState(0)
  const [configList, setConfigList] = useState([])
  const columns = [
    { title: '名称', dataIndex: 'configName', align: 'configName', width: 200 },
    { title: '参数key', dataIndex: 'configKey', align: 'configKey', width: 200 },
    { title: '参数value', dataIndex: 'configValue', align: 'configValue', width: 200 },
    { title: '创建人', dataIndex: 'createBy', align: 'createBy', width: 150 },
    { title: '创建时间', dataIndex: 'createTime', align: 'createTime', width: 150 },
    {
      title: '更新人',
      dataIndex: 'updateBy',
      align: 'updateBy',
      width: 150,
      render: (text) => text || '-'
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      align: 'updateTime',
      width: 150,
      render: (text) => text || '-'
    },
    { title: '备注', dataIndex: 'remark', align: 'remark', width: 250 },
    { 
      title: '操作',  
      align: 'center', 
      width: 200,
      render ( text: any, record: any, index: number ) {
        return (
          <>
            <Permission perms="novel:config:edit">
              <Button type="link" onClick={() => onEdit(record)}>编辑</Button>
            </Permission>
            <Permission perms="novel:config:remove">
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
    fetchConfigList(queryInfo)
  }, [queryInfo])

  useEffect(() => {
    if (!addVisible) {
      formRef?.current?.resetFields()
    } else {
      if (type === 'edit') {
        formRef?.current?.setFieldsValue({
          configName: recordSelected.configName,
          configKey: recordSelected.configKey,
          remark: recordSelected.remark
        })
      }
    }
  }, [addVisible])

  async function fetchConfigList (params) {
    try {
      setLoading(true)
      const res = await getConfigList(params)
      if (res.code === 200) {
        setTotal(res.data.total)
        setConfigList(res.data.rows || [])
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
        res = await addConfig(value)
      } else {
        res = await editConfig({ ...value, configId: recordSelected.configId })
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
  function onDelete ({ configId }) {
    Modal.confirm({
      title: '提示',
      content: '确定要删除吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await deleteConfig({ids: [configId]})
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
          const res = await deleteConfig({ids: selectedRowKeys})
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
          <Typography.Title level={5}>参数管理</Typography.Title>
          <Form ref={searchFormRef} layout="inline" onFinish={onSearchFormFinish}>
            <Form.Item name="configName" label="名称">
              <Input
                placeholder="请输入参数名称"
                allowClear
                onBlur={(e) => e.target.value && searchFormRef?.current?.submit()}
                onChange={(e) => !e.target.value && searchFormRef?.current?.submit()} />
            </Form.Item>
            <Form.Item name="configKey" label="key">
              <Input
                placeholder="请输入参数key"
                allowClear
                onBlur={(e) => e.target.value && searchFormRef?.current?.submit()}
                onChange={(e) => !e.target.value && searchFormRef?.current?.submit()} />
            </Form.Item>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
              <Form.Item>
                <Permission perms="novel:config:add">
                  <Button type="primary" onClick={add}>新增参数</Button>
                </Permission>
              </Form.Item>
              <Form.Item style={{ marginRight: 0 }}>
                <Permission perms="novel:config:remove">
                  <Button type="primary" onClick={batchDelete}>批量删除</Button>
                </Permission>
              </Form.Item>
            </div>
          </Form>
          <Datatable
            rowKey="configId"
            title=""
            rowSelection={rowSelection}
            loading={loading}
            columns={columns}
            dataSource={configList}
            scroll={{ x: 200 }}
            pagination={pagination}/>
        </ContentInner>
      </ContentWrapper>
      <Modal
        width="500px"
        title={`${type === 'add' ? '新增' : '编辑' }参数`}
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
            configName: '',
            configKey: '',
            remark: ''
          }}>
          <Form.Item
            label="参数名称"
            name="configName"
            rules={[{ required: true, message: '请输入参数名称' }]}>
            <Input maxLength={50} placeholder="请输入参数名称" />
          </Form.Item>
          <Form.Item
            label="参数key"
            name="configKey"
            rules={[{ required: true, message: '请输入参数key' }]}>
            <Input maxLength={50} placeholder="请输入参数key" />
          </Form.Item>
          <Form.Item
            label="参数value"
            name="configValue"
            rules={[{ required: true, message: '请输入参数value' }]}>
            <Input maxLength={50} placeholder="请输入参数value" />
          </Form.Item>
          <Form.Item
            label="备注"
            name="remark">
            <Input.TextArea maxLength={250} rows={4} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
   </>
  )
}
