import React, { useState, useRef, useEffect } from 'react'
import { Button, Table, Form, Modal, Input, Image, message } from 'antd';
import { user } from '../../../api';
import { giveMedal } from '../../../api/rankmedal'

export default function GiveModal ({ id, visible, onCancel }) {
	const searchFormRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [queryInfo, setQueryInfo] = useState({
    pageNum: 1,
    pageSize: 10,
    keyword: '',
    id: ''
  })
  const [total, setTotal] = useState(0)
  const pagination = {
    showSizeChanger: true,
    showQickJumper: false,
    showTotal: () => `共${total}条`,
    defaultPageSize: 10,
    current: queryInfo.pageNum,
    pageSize: queryInfo.pageSize,
    total: total,
    onChange: (current: number, size: number) => {
      setQueryInfo(pre => ({
        ...pre,
        pageNum: current,
        pageSize: size
      }))
    }
  }
  useEffect(() => {
    fetchDataSource(queryInfo)
  }, [queryInfo])
  const columns = [
    { title: '用户ID', dataIndex: 'id', align: 'center' },
		{ title: '昵称', dataIndex: 'nickName', align: 'center' },
		{ title: '用户名', dataIndex: 'username', align: 'center' },
		{
      title: '头像',
      dataIndex: 'avatar',
      align: 'center',
      render: (text: any, record: any, index: number) => {
        return text ? <Image src={text} style={{ width: 30, height: 30, objectFit: 'cover' }} /> : '-'
      }
    },
    { 
      title: '操作',  
      align: 'center', 
      width: 130,
      fixed: 'right',
      render ( text: any, record: any, index: number ) {
        return (
          <>
            <Button type="link" onClick={() => onSelect(record)}>赠送</Button>
          </>
        )
      }
    }
  ]
  async function fetchDataSource (params) {
    try {
      setLoading(true)
      const res = await user.userList(queryInfo);
      setTotal(res.total)
      setDataSource(res.list || [])
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
  async function onSelect (record) {
    Modal.confirm({
      title: '提示',
      content: '确定要赠送吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await giveMedal({
            id: id,
            receiveUserId: record.id
          })
          if (res.code === 200) {
            message.success('赠送成功')
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
    <Modal
      width="60%"
      title="请选择用户"
      visible={ visible }
      onCancel={ onCancel }
      footer={ null }>
      <Form
        ref={searchFormRef}
        layout="inline"
        initialValues={{
          keyword: '',
          id: ''
        }}
        onFinish={onSearchFormFinish}>
        <Form.Item label="用户名" name="keyword" >
          <Input placeholder="用户名称/电话/邮箱" allowClear />
        </Form.Item>
        <Form.Item label="用户ID" name="id">
          <Input placeholder="用户ID" allowClear />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">确定</Button>
        </Form.Item>
      </Form>
      <Table
        style={{ marginTop: 20 }}
        size="small"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 200, y: 200 }}
        pagination={pagination}/>
    </Modal>
  )
}