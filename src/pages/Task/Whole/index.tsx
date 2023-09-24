import React, { useState, useRef, useEffect } from 'react'
import Thumbnail from "../../../components/Thumbnail";
import { ContentInner, ContentWrapper } from '../../../components/Themeable';
import { Typography, Button, Radio, Switch, Select, Form, Modal, message, Input } from 'antd';
import Datatable from "../../../components/Datatable";
import { editPost, deletePosts, getPostsList, postTop } from '../../../api/task'
import AddModal from './AddModal';
import Permission from '../../../components/Permission';
import { hasPermission } from '../../../utils/utils'

export default function TaskPlatform () {
  const searchFormRef = useRef(null)
  const [recordSelected, setRecordSelected] = useState<any>({})
  const [queryInfo, setQueryInfo] = useState({
    offset: 0,
    limit: 10,
    category: 'TASK',
    official: 1
  })
  const [type, setType] = useState('add')
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [addVisible, setAddVisible] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const typeOptions = [
    { label: '用户任务', value: 0 },
    { label: '官方任务', value: 1 }
  ]
  const columns = [
    { title: '任务标题', dataIndex: 'title', align: 'center', width: 100 },
    { title: '作者', dataIndex: 'authorName', align: 'center', width: 100 },
    { title: '发布时间', dataIndex: 'createAt', align: 'center', width: 100 },
    { title: '任务周期', dataIndex: 'countdown', align: 'center', width: 100 },
    { title: '拒绝原因', dataIndex: 'rejectReason', align: 'center', width: 100 },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      align: 'center',
      width: 80,
      render: text => {
        if (text == 'REJECT') return '已拒绝'
        if (text == 'WAIT') return '待审核'
        if (text == 'DELETE') return '已删除'
        if (text == 'PASS') return '已通过'
      }
    },
    { title: '审核时间', dataIndex: 'auditTime', align: 'center', width: 100 },
    { title: '审核人员', dataIndex: 'oprtUserName', align: 'center', width: 100 },
    {
      title: '是否置顶',
      dataIndex: 'top',
      align: 'center',
      width: 100,
      render: (text, record) => {
        return (
          <Switch
            checked={text === 1}
            onChange={async (e) => {
              try {
                setLoading(true)
                record.top = record.top === 1 ? 0 : 1
                await postTop({
                  id: record.id,
                  top: record.top
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
    {
      title: '是否火帖',
      dataIndex: 'marrow',
      align: 'center',
      width: 100,
      render: (text, record) => {
        return (
          <Switch
            checked={text === 1}
            onChange={async (e) => {
              try {
                setLoading(true)
                record.marrow = record.marrow === 1 ? 0 : 1
                await editPost({
                  id: record.id,
                  marrow: record.marrow
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
    { 
      title: '操作',  
      align: 'center', 
      width: 130,
      fixed: 'right',
      render ( text: any, record: any, index: number ) {
        return (
          <>
            {
              record.auditState === 'WAIT' && hasPermission('novel:task:detail') ?
                <Button type="link" onClick={() => onAudit(record)}>审核</Button> :
                <Button type="link" onClick={() => onEdit(record)}>查看</Button>
            }
            <Permission perms="novel:task:remove">
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
  useEffect(() => {
    fetchDataSource(queryInfo)
  }, [queryInfo])
  async function fetchDataSource (params) {
    try {
      setLoading(true)
      const res = await getPostsList(params)
      if (res.code === 200) {
        setTotal(res.data.total)
        setDataSource(res.data.rows || [])
      }
    } finally {
      setLoading(false)
    }
  }
  function onAudit (record) {
    setType('audit')
    setRecordSelected(record)
    setAddVisible(true)
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
          const res = await deletePosts(record.id)
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
      ...val,
      offset: 0
    }))
  }
  return (
    <>
      <ContentWrapper>
        <Thumbnail />
        <ContentInner>
          <Typography.Title level={5}>全民任务</Typography.Title>
          <Form
            ref={searchFormRef}
            layout="inline"
            initialValues={{
              official: 0
            }}
            onFinish={onSearchFormFinish}>
            {/* <Form.Item name="official">
              <Radio.Group
                options={typeOptions}
                onChange={() => searchFormRef?.current?.submit()}
                optionType="button"
                buttonStyle="solid"
              />
            </Form.Item> */}
            <Form.Item name="title">
              <Input maxLength={50} placeholder="请输入帖子标题" allowClear />
            </Form.Item>
            <Form.Item name="authorName">
              <Input maxLength={50} placeholder="请输入作者" allowClear />
            </Form.Item>
            <Form.Item name="auditState">
              <Select
                allowClear
                placeholder="请选择状态"
                options={[
                  { value: 'WAIT', label: '待审核' },
                  { value: 'PASS', label: '已通过' },
                  { value: 'REJECT', label: '已拒绝' },
                  { value: 'DELETE', label: '已删除' }
                ]}
              />
            </Form.Item>
            <Form.Item name="marrow">
              <Select
                allowClear
                placeholder="是否火帖"
                options={[
                  { value: '1', label: '火帖' },
                  { value: '0', label: '非火帖' }
                ]}
              />
            </Form.Item>
            <Form.Item name="marrow">
              <Select
                allowClear
                placeholder="是否置顶"
                options={[
                  { value: '1', label: '置顶' },
                  { value: '0', label: '非置顶' }
                ]}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={() => searchFormRef.current.submit()}>确定</Button>
            </Form.Item>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
              <Form.Item>
                <Permission perms="novel:task:add">
                  <Button type="primary" onClick={add}>新增</Button>
                </Permission>
              </Form.Item>
              {/* <Form.Item style={{ marginRight: 0 }}>
                <Button type="primary" onClick={batchDelete}>批量删除</Button>
              </Form.Item> */}
            </div>
          </Form>
          <Datatable
            rowKey="id"
            title=""
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: 1800 }}
            pagination={pagination}/>
        </ContentInner>
      </ContentWrapper>
      <AddModal
        visible={addVisible}
        type={type}
        id={recordSelected.id}
        onCancel={() => setAddVisible(false)}
        onSubmitSuccess={() => {
          setQueryInfo(pre => ({ ...pre }))
          setAddVisible(false)
        }}
        ></AddModal>
    </>
  )
}