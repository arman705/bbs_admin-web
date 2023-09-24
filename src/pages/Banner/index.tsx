import React, { useState, useRef, useEffect } from 'react'
import Thumbnail from "../../components/Thumbnail";
import { ContentInner, ContentWrapper } from '../../components/Themeable';
import { Typography, Button, Image, Switch, Select, Form, Modal, message, Input } from 'antd';
import Datatable from "../../components/Datatable";
import { getBannerList, editBanner, deleteBanner } from '../../api/banner'
import AddModal from './AddModal';
import Permission from '../../components/Permission';
import { hasPermission } from '../../utils/utils';

export default function TaskPlatform () {
  const searchFormRef = useRef(null)
  const [recordSelected, setRecordSelected] = useState<any>({})
  const [queryInfo, setQueryInfo] = useState({
    offset: 0,
    limit: 10
  })
  const [type, setType] = useState('add')
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [addVisible, setAddVisible] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const columns = [
    { title: '名称', dataIndex: 'bannerName', align: 'center', width: 100 },
    { title: '描述', dataIndex: 'bannerDesc', align: 'center', width: 100 },
    {
      title: 'Banner图片',
      dataIndex: 'bannerUrl',
      align: 'center',
      width: 80,
      render: text => {
        return text ? <Image src={text} style={{ width: 80, height: 80, objectFit: 'cover' }} /> : '-'
      }
    },
    { title: 'Banner宽', dataIndex: 'bannerWidth', align: 'center', width: 80 },
    { title: 'Banner高', dataIndex: 'bannerHeight', align: 'center', width: 80 },
    { title: 'Banner类型', dataIndex: 'bannerType', align: 'center', width: 80 },
    {
      title: '是否激活',
      dataIndex: 'bannerActive',
      align: 'center',
      width: 100,
      render: (text, record) => {
        return (
          <Switch
            disabled={!hasPermission('system:banner:edit')}
            checked={text === 1}
            onChange={async (e) => {
              try {
                setLoading(true)
                record.bannerActive = record.bannerActive === 1 ? 0 : 1
                await editBanner({
                  id: record.id,
                  bannerActive: record.bannerActive
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
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 100,
      render: text => text || '-'
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      align: 'center',
      width: 100,
      render: text => text || '-'
    },
    { 
      title: '操作',  
      align: 'center', 
      width: 120,
      render ( text: any, record: any, index: number ) {
        return (
          <>
            <Permission perms="system:banner:edit">
              <Button type="link" onClick={() => onEdit(record)}>修改</Button>
            </Permission>
            <Permission perms="system:banner:remove">
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
      const res = await getBannerList(params)
      console.log(res)
      if (res.code === 200) {
        setTotal(res.data.total)
        setDataSource(res.data.list || [])
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
          const res = await deleteBanner(record.id)
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
          <Typography.Title level={5}>Banner管理</Typography.Title>
          <Form
            ref={searchFormRef}
            layout="inline"
            initialValues={{
              official: 0
            }}
            onFinish={onSearchFormFinish}>
            <Form.Item name="bannerName" label="名称">
              <Input maxLength={50} placeholder="请输入banner名称" allowClear />
            </Form.Item>
            <Form.Item name="bannerActive" label="是否激活">
              <Select
                allowClear
                placeholder="请选择是否激活"
                options={[
                  { value: 1, label: '激活' },
                  { value: 0, label: '未激活' }
                ]}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={() => searchFormRef.current.submit()}>确定</Button>
            </Form.Item>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
              <Form.Item>
                <Permission perms="system:banner:add">
                  <Button type="primary" onClick={add}>新增banner</Button>
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
            scroll={{ x: 200 }}
            pagination={pagination}/>
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