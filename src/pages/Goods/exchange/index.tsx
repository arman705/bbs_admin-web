import React, { useState, useRef, useEffect } from 'react'
import Thumbnail from "../../../components/Thumbnail";
import { ContentInner, ContentWrapper } from '../../../components/Themeable';
import { Typography, Button, Form, Modal, message, Input, Select, Radio } from 'antd';
import Datatable from "../../../components/Datatable";
import { getRecordList, deleteRecord } from '../../../api/goods'
import VerifyModal from './VerifyModal'
import Permission from '../../../components/Permission';

export default function GoodsExchange () {
  const searchFormRef = useRef(null)
  const [recordSelected, setRecordSelected] = useState<any>({})
  const [queryInfo, setQueryInfo] = useState({
    offset: 0,
    limit: 10,
    id: '',
    nickname: '',
    title: '',
    system: 0
  })
  const [type, setType] = useState('view')
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const typeOptions = [
    { label: '官方商品', value: 0 },
    { label: '用户商品', value: 1 }
  ]
  const columns = [
    { title: 'ID', dataIndex: 'id', align: 'center', width: 80 },
    { title: '用户名', dataIndex: 'nickname', align: 'center', width: 100 },
    { title: '兑换商品', dataIndex: 'title', align: 'center', width: 100 },
    {
      title: '商品发布方',
      dataIndex: 'system',
      align: 'center',
      width: 100,
      render: (text) => {
        const target = typeOptions.find(item => item.value === text)
        return target ? target.label : '-'
      }
    },
    { title: '虎头币', dataIndex: 'price', align: 'center', width: 100 },
    {
      title: '相关资料',
      dataIndex: 'account',
      align: 'center',
      width: 100,
      render: ( text: any ) => {
        return <>平台账号：{text}</>
      }
    },
    { title: '兑换时间', dataIndex: 'createAt', align: 'center', width: 100 },
    { title: '完成时间', dataIndex: 'updateAt', align: 'center', width: 100 },
    { title: '操作人', dataIndex: 'updateUser', align: 'center', width: 100 },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      render: text => getStatus(text)
    },
    { 
      title: '操作',  
      align: 'center', 
      width: 150,
      render ( text: any, record: any, index: number ) {
        return (
          <>
            <Button style={{ padding: '0 5px' }} type="link" onClick={() => showModal('view', record)}>查看</Button>
            { record.status === 0 && <Permission perms="novel:commodityRecord:audit">
                <Button style={{ padding: '0 5px' }} type="link" onClick={() => showModal('audit', record)}>审核</Button>
              </Permission>
            }
            <Permission perms="novel:commodityRecord:batchRemove">
              <Button style={{ padding: '0 5px' }} type="link" onClick={() => onDelete(record)}>删除</Button>
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
  useEffect(() => {
    fetchDataSource(queryInfo)
  }, [queryInfo])
  function getStatus (status) {
    switch (status) {
      case 0:
        return '待处理'
      case 1:
        return '已完成'
      case 2:
        return '已拒绝'
      case 3:
        return '已取消'
    }
  }
  async function fetchDataSource (params) {
    try {
      setLoading(true)
      const res = await getRecordList(params)
      if (res.code === 200) {
        setTotal(res.data.total)
        setDataSource(res.data.rows || [])
      }
    } finally {
      setLoading(false)
    }
  }
  function showModal (type, record) {
    setType(type)
    setRecordSelected({ ...record, account: `平台账号：${record.account}` })
    setModalVisible(true)
  }
  function onDelete (record) {
    Modal.confirm({
      title: '提示',
      content: '确定要删除吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await deleteRecord({ids: record.id})
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
  function onSearchFormFinish (val) {
    setQueryInfo(pre => ({
      ...pre,
      ...val,
      offset: 0
    }))
  }
  return (
    <>
      <ContentWrapper>
        <Thumbnail />
        <ContentInner>
          <Typography.Title level={5}>兑换记录</Typography.Title>
          <Form initialValues={{ status: '', system: 0 }} ref={searchFormRef} layout="inline" onFinish={onSearchFormFinish}>
            <Form.Item name="system">
              <Radio.Group
                options={typeOptions}
                onChange={() => searchFormRef?.current?.submit()}
                optionType="button"
                buttonStyle="solid"
              />
            </Form.Item>
            <Form.Item name="id" label="ID">
              <Input
                placeholder="请输入ID"
                allowClear
                onBlur={(e) => e.target.value && searchFormRef?.current?.submit()}
                onChange={(e) => !e.target.value && searchFormRef?.current?.submit()} />
            </Form.Item>
            <Form.Item name="nickname" label="用户名">
              <Input
                placeholder="请输入用户名"
                allowClear
                onBlur={(e) => e.target.value && searchFormRef?.current?.submit()}
                onChange={(e) => !e.target.value && searchFormRef?.current?.submit()} />
            </Form.Item>
            <Form.Item name="title" label="兑换商品">
              <Input
                placeholder="请输入商品标题"
                allowClear
                onBlur={(e) => e.target.value && searchFormRef?.current?.submit()}
                onChange={(e) => !e.target.value && searchFormRef?.current?.submit()} />
            </Form.Item>
            <Form.Item label="状态" name="status">
              <Select style={{ width: '120px' }} onChange={() => searchFormRef?.current?.submit()}>
                <Select.Option value="">全部</Select.Option>
                <Select.Option value={0}>待处理</Select.Option>
                <Select.Option value={1}>已完成</Select.Option>
                <Select.Option value={2}>已拒绝</Select.Option>
                <Select.Option value={3}>已取消</Select.Option>
              </Select>
            </Form.Item>
          </Form>
          <Datatable
            rowKey="id"
            title=""
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: 200 }}
            pagination={pagination}/>
        </ContentInner>
      </ContentWrapper>

      <VerifyModal
        type={type}
        visible={modalVisible}
        data={recordSelected}
        onSubmitSuccess={() => {
          setQueryInfo(pre => ({ ...pre }))
          setModalVisible(false)
        }}
        onCancel={() => setModalVisible(false)}
      />
    </>
  )
}