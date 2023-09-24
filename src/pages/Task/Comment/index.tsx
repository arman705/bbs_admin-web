import React, { useState, useRef, useEffect } from 'react'
import Thumbnail from "../../../components/Thumbnail";
import { ContentInner, ContentWrapper } from '../../../components/Themeable';
import { Typography, Button, Radio, Form, Image } from 'antd';
import Datatable from "../../../components/Datatable";
import { getCommentList } from '../../../api/task'
import AddModal from './AddModal';
import AdoptModal from './AdoptModal';
import { PlayCircleFilled } from '@ant-design/icons';
import Permission from '../../../components/Permission'

export default function TaskComment () {
  const searchFormRef = useRef(null)
  const [recordSelected, setRecordSelected] = useState<any>({})
  const [queryInfo, setQueryInfo] = useState({
    pageNum: 1,
    pageSize: 10,
    auditState: '',
    category: 'TASK'
  })
  const [type, setType] = useState('add')
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [addVisible, setAddVisible] = useState(false)
  const [adoptVisible, setAdoptVisible] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const typeOptions = [
    { label: '全部', value: '' },
    { label: '未审核', value: 'WAIT' },
    { label: '已通过', value: 'PASS' },
    { label: '已拒绝', value: 'REJECT' }
  ]
  const columns = [
    { title: '用户名', dataIndex: 'userName', align: 'center', width: 100 },
    {
      title: '评论内容',
      align: 'center',
      width: 100,
      render: (text, record) => getContent(record)
    },
    { title: '任务标题', dataIndex: 'postsTitle', align: 'center', width: 100 },
    { title: '发布时间', dataIndex: 'createAt', align: 'center', width: 100 },
    { title: '任务周期', dataIndex: 'countdown', align: 'center', width: 100 },
    {
      title: '状态',
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
    {
      title: '奖励虎头币',
      dataIndex: 'adoptGold',
      align: 'center',
      width: 80,
      render: text => text || '-'
    },
    {
      title: '审核时间',
      dataIndex: 'auditTime',
      align: 'center',
      width: 100,
      render: text => text || '-'
    },
    {
      title: '审核人员',
      dataIndex: 'auditName',
      align: 'center',
      width: 100,
      render: text => text || '-'
    },
    { 
      title: '操作',  
      align: 'center', 
      width: 100,
      fixed: 'right',
      render ( text: any, record: any, index: number ) {
        return (
          <>
            {
              record.auditState === 'WAIT' ?
                <Permission perms="system:comment:edit">
                  <Button style={{ padding: 4 }} type="link" onClick={() => onAudit(record)}>审核</Button>
                </Permission> : <Permission perms="system:comment:detail">
                    <Button style={{ padding: 4 }} type="link" onClick={() => onEdit(record)}>查看</Button>
                </Permission>
            }
            {
              (!record.replyId && record.auditState === 'PASS' && record.isAdopt === 0) && <Permission perms="system:comment:adopt">
                <Button style={{ padding: 4 }} type="link" onClick={() => onAdopt(record)}>采纳</Button>
              </Permission>
            }
            {
              (!record.replyId && record.auditState === 'PASS' && record.isAdopt === 1) && <Button disabled style={{ padding: 4 }} type="link">已采纳</Button>
            }
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
  function getContent (record) {
    const content = record.content
    try {
      const contentObj = JSON.parse(content)
      const text = contentObj.text
      const images = contentObj.imgUrl ? contentObj.imgUrl.split(',').map(item => ({ url: item, type: 'image' })) : []
      const videos = contentObj.videoUrl ? contentObj.videoUrl.split(',').map(item => ({ url: item, type: 'video' })) : []
      const medias = [...images, ...videos]
      return (
        <div>
          <div>{text}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {
              medias.map(item => {
                if (item.type === 'image') {
                  return (
                    <Image
                      preview={ false }
                      style={{
                        width: 40,
                        height: 40,
                        marginRight: 4,
                        marginBottom: 4,
                        objectFit: 'cover'
                      }}
                      src={item.url}/>
                  )
                }
                if (item.type === 'video') {
                  return (
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        marginRight: 4,
                        marginBottom: 4,
                        position: 'relative'
                      }}
                    >
                      <video
                        src={ item.url }
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <PlayCircleFilled style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: '#fff'
                      }} />
                    </div>
                  )
                }
              })
            }
          </div>
        </div>
      )
    } catch (e) {
      console.log(e)
      return content
    }
  }
  async function fetchDataSource (params) {
    try {
      setLoading(true)
      const res = await getCommentList(params)
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
  function onAdopt (record) {
    setRecordSelected(record)
    setAdoptVisible(true)
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
          <Typography.Title level={5}>评论审核</Typography.Title>
          <Form
            ref={searchFormRef}
            layout="inline"
            initialValues={{
              official: 0,
              auditState: ''
            }}
            onFinish={onSearchFormFinish}>
            <Form.Item name="auditState">
              <Radio.Group
                options={typeOptions}
                onChange={() => searchFormRef?.current?.submit()}
                optionType="button"
                buttonStyle="solid"
              />
            </Form.Item>
          </Form>
          <Datatable
            rowKey="id"
            title=""
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: 1400 }}
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
      <AdoptModal
        visible={adoptVisible}
        data={recordSelected}
        onCancel={() => setAdoptVisible(false)}
        onSubmitSuccess={() => {
          setQueryInfo(pre => ({ ...pre }))
          setAdoptVisible(false)
        }}
        ></AdoptModal>
    </>
  )
}