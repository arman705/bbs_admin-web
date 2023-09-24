import React, { useEffect, useState, useRef } from 'react'
import { Image, Button, Table, Modal, message, Form, Radio } from 'antd'
import Permission from '../../../../../components/Permission'
import { getMedalApplyList, removeApply } from '../../../../../api/rankmedal'
import AuditModal from './AuditModal'

export default function ApplyList () {
  const searchFormRef = useRef(null)
  const statusOptions = {
    '': '全部',
    WAIT: '待审核',
    PASS: '已通过',
    REJECT: '已拒绝'
  }
  const [queryInfo, setQueryInfo] = useState({
    offset: 0,
    limit: 10
  })
  const [recordSelected, setRecordSelected] = useState({})
  const [auditVisible, setAuditVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [auditType, setAuditType] = useState('')
  const [total, setTotal] = useState(0)
  const [dataSource, setDataSource] = useState([])
  const columns = [
    { title: 'ID', dataIndex: 'id', align: 'center', width: 100 },
    { title: '用户名', dataIndex: 'userName', align: 'center', width: 100 },
    { title: '申请勋章', dataIndex: 'medalTitle', align: 'center', width: 100 },
    {
      title: '勋章图标',
      dataIndex: 'medalIcon',
      align: 'center',
      width: 100,
      render: text => {
        return text ? <Image src={text} style={{ width: 50, height: 50 }} /> : '-'
      }
    },
    {
      title: '虎头币',
      dataIndex: 'salesPrice',
      align: 'center',
      width: 100
    },
    { title: '申请时间', dataIndex: 'createTime', align: 'center', width: 100 },
    {
      title: '状态',
      dataIndex: 'auditState',
      align: 'center',
      width: 100,
      render: (text) => {
        return statusOptions[text]
      }
    },
    { title: '审核时间', dataIndex: 'checkTime', align: 'center', width: 100 },
    { title: '拒绝理由', dataIndex: 'remark', align: 'center', width: 100 },
    { title: '审核人员', dataIndex: 'oprtUser', align: 'center', width: 100 },
    { 
      title: '操作',  
      align: 'center', 
      width: 110,
      render ( text: any, record: any, index: number ) {
        return (
          <>
            {
              record.auditState === 'WAIT' ? <Permission perms="system:medalApply:check">
                <Button type="link" onClick={() => onAudit(record)}>审核</Button>
              </Permission> : <Button type="link" onClick={() => onView(record)}>查看</Button>
            }
            <Permission perms="system:medalApply:remove">
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

  function onAudit (record) {
    setAuditType('audit')
    setRecordSelected(record)
    setAuditVisible(true)
  }
  function onView (record) {
    setAuditType('view')
    setRecordSelected(record)
    setAuditVisible(true)
  }
  function onDelete (record) {
    Modal.confirm({
      title: '提示',
      content: '确定要删除吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        removeApply({ id: record.id }).then((res: any) => {
          if (res.code === 200) {
            message.success('删除成功')
            setQueryInfo(pre => ({...pre}))
          } else {
            message.error(res.msg)
          }
        }).catch(() => {
          message.error('删除失败')
        })
      }
    });
  }
  function fetchDataSource () {
    setLoading(true)
    getMedalApplyList({
      // medalTitle: searchValue,
      ...queryInfo
    }).then((res: any) => {
      if (res.code === 200) {
        setDataSource(res?.data?.rows)
        setTotal(res?.data?.total)
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  function onSubmitSuccess () {
    setAuditVisible(false)
    setQueryInfo(pre => ({ ...pre }))
  }
  function onSearchFormFinish (val) {
    setQueryInfo(pre => ({
      ...pre,
      ...val,
      offset: 0
    }))
  }
  useEffect(() => {
    fetchDataSource()
  }, [queryInfo])

  return (
    <>
      <Form
        style={{ marginBottom: 20 }}
        ref={searchFormRef}
        layout="inline"
        initialValues={{
          auditState: ''
        }}
        onFinish={onSearchFormFinish}>
        <Form.Item name="auditState">
          <Radio.Group
            options={Object.keys(statusOptions).map(key => {
              return {
                label: statusOptions[key],
                value: key
              }
            })}
            onChange={() => searchFormRef?.current?.submit()}
            optionType="button"
            buttonStyle="solid"
          />
        </Form.Item>
      </Form>
      <Table
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 200 }}
        pagination={pagination}/>
      <AuditModal
        type={auditType}
        visible={auditVisible}
        data={recordSelected}
        onCancel={() => setAuditVisible(false)}
        onSubmitSuccess={onSubmitSuccess}
      />
    </>
  )
}