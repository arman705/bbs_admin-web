import React, { useState, useRef, useEffect } from 'react'
import Thumbnail from "../../components/Thumbnail";
import { ContentInner, ContentWrapper } from '../../components/Themeable';
import { Typography, Button, Modal, message } from 'antd';
import Datatable from "../../components/Datatable";
import { getCommentList, deleteComment } from '../../api/randomComment'
import AddModal from './AddModal'
import Permission from '../../components/Permission'
import ConfigRow from './ConfigRow';

export default function Roles () {
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
    { title: '评论内容', dataIndex: 'content', align: 'center', width: 100 },
    { title: '创建时间', dataIndex: 'createTime', align: 'center', width: 100 },
    { 
      title: '操作',  
      align: 'center', 
      width: 130,
      render ( text: any, record: any, index: number ) {
        return (
          <>
            <Permission perms="novel:randomComment:update">
              <Button type="link" onClick={() => onEdit(record)}>修改</Button>
            </Permission>
            <Permission perms="novel:randomComment:delete">
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
      const res = await getCommentList(params)
      if (res.code === 200) {
        setTotal(res.data.total)
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
          const res = await deleteComment({ id: record.id })
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
  
  return (
    <>
      <ContentWrapper>
        <Thumbnail />
        <ContentInner>
          <Typography.Title level={5}>随机评论</Typography.Title>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <ConfigRow />
            </div>
            <Permission perms="novel:randomComment:add">
              <Button type="primary" onClick={add}>新增评论</Button>
            </Permission>
          </div>
          <Datatable
            rowKey="id"
            title=""
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: 200 }}
            pagination={false}/>
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