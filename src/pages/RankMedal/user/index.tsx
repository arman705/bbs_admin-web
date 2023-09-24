import React, { useState, useRef, useEffect } from 'react'
import Thumbnail from "../../../components/Thumbnail";
import { ContentInner, ContentWrapper } from '../../../components/Themeable';
import { Typography, Button, Image, Select, Form, Input } from 'antd';
import Datatable from "../../../components/Datatable";
import { getUserMedal } from '../../../api/rankmedal'
import GiveModal from './GiveModal';
import Permission from '../../../components/Permission';

export default function UserMedal () {
  const searchFormRef = useRef(null)
  const [queryInfo, setQueryInfo] = useState({
    offset: 0,
    limit: 10
  })
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [record, setRecord] = useState({})
  const [dataSource, setDataSource] = useState([])
  const columns = [
    { title: '勋章名称', dataIndex: 'medalTitle', align: 'center', width: 100 },
    {
      title: '勋章图片',
      dataIndex: 'medalIcon',
      align: 'center',
      width: 100,
      render: text => {
        return text ? <Image src={text} style={{ width: 80, height: 80, objectFit: 'cover' }} /> : '-'
      }
    },
    {
      title: '勋章颜色',
      dataIndex: 'medalColor',
      align: 'center',
      width: 100,
      render: text => {
        return <div style={{ width: 40, height: 20, background: text, display: 'inline-block' }}></div>
      }
    },
    {
      title: '勋章类型',
      dataIndex: 'medalType',
      align: 'center',
      width: 80,
      render: (text) => {
        switch (text) {
          case 1:
            return '等级勋章'
          case 2:
            return '活动勋章'
          case 3:
            return '限定勋章'
        }
      }
    },
    { title: '等级', dataIndex: 'buyLevel', align: 'center', width: 80 },
    { title: '金额', dataIndex: 'salesPrice', align: 'center', width: 80 },
    { title: '描述', dataIndex: 'medalDesc', align: 'center', width: 80 },
    { title: '用户ID', dataIndex: 'userId', align: 'center', width: 80 },
    { title: '创建时间', dataIndex: 'createTime', align: 'center', width: 150 },
    { 
      title: '操作',  
      align: 'center', 
      width: 80,
      render ( text: any, record: any, index: number ) {
        return (
          <Permission perms="system:userMedal:edit">
            <Button type="link" onClick={() => give(record)}>赠送</Button>
          </Permission>
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
  async function fetchDataSource (params) {
    try {
      setLoading(true)
      const res = await getUserMedal(params)
      if (res.code === 200) {
        setTotal(res.data.total)
        setDataSource(res.data.list || [])
      }
    } finally {
      setLoading(false)
    }
  }
  function onSearchFormFinish (val) {
    setQueryInfo(pre => ({
      ...pre,
      ...val,
      offset: 0
    }))
  }
  function give (record) {
    setRecord(record)
    setModalVisible(true)
  }
  return (
    <>
      <ContentWrapper>
        <Thumbnail />
        <ContentInner>
          <Typography.Title level={5}>用户勋章</Typography.Title>
          <Form
            ref={searchFormRef}
            layout="inline"
            initialValues={{
              official: 0
            }}
            onFinish={onSearchFormFinish}>
            <Form.Item name="medalTitle">
              <Input maxLength={50} placeholder="请输入勋章名称" allowClear />
            </Form.Item>
            <Form.Item name="buyLevel">
              <Input maxLength={50} placeholder="请输入勋章等级" allowClear />
            </Form.Item>
            <Form.Item name="medalType">
              <Select
                allowClear
                placeholder="请选择勋章类型"
                options={[
                  { value: 1, label: '等级勋章' },
                  { value: 2, label: '活动勋章' },
                  { value: 3, label: '限定勋章' }
                ]}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={() => searchFormRef.current.submit()}>确定</Button>
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
      <GiveModal
        visible={modalVisible}
        id={record.id}
        onCancel={() => setModalVisible(false)}
      />
    </>
  )
}