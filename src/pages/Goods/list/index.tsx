import React, { useState, useRef, useEffect } from 'react'
import Thumbnail from "../../../components/Thumbnail";
import { ContentInner, ContentWrapper } from '../../../components/Themeable';
import { Typography, Image, Button, InputNumber, Switch, Form, Modal, Upload, message, Input, Radio } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Datatable from "../../../components/Datatable";
import env from '../../../env'
import { addGoods, editGoods, getGoodsList, deleteGoods } from '../../../api/goods'
import Permission from '../../../components/Permission';
import AuditModal from './AuditModal';
import { parseFileName } from '../../../utils/uploadImage';

export default function GoodsList () {
  const formRef = useRef(null)
  const searchFormRef = useRef(null)
  const [recordSelected, setRecordSelected] = useState<any>({})
  const [queryInfo, setQueryInfo] = useState({
    offset: 0,
    limit: 10,
    name: '',
    typeId: '',
    system: 0
  })
  const [type, setType] = useState('add')
  const [previewSrc, setPreviewSrc] = useState('add')
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [auditVisible, setAuditVisible] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [addVisible, setAddVisible] = useState(false)
  const [goodsList, setGoodsList] = useState([])
  const [imgUrlList, setImgUrlList] = useState<any>([])
  const uploadUrl = env.BASE_API_URL + '/common/sysFile/uploadImg';
  const categoryOptions = [
    { label: '实物', value: 0 },
    { label: '虚拟', value: 1 }
  ]
  const typeOptions = [
    { label: '官方商品', value: 0 },
    { label: '用户商品', value: 1 }
  ]
  const columns = [
    { title: 'ID', dataIndex: 'id', align: 'center', width: 80 },
    {
      title: '商品主图',
      dataIndex: 'headImg',
      align: 'center',
      width: 100,
      render: text => {
        return text ? <Image src={text} style={{ width: 80, height: 80, objectFit: 'cover' }} /> : '-'
      }
    },
    { title: '商品标题', dataIndex: 'title', align: 'center', width: 100 },
    {
      title: '商品类型',
      dataIndex: 'type',
      align: 'center',
      width: 100,
      render: (text) => {
        const target = categoryOptions.find(item => item.value === text)
        return target ? target.label : ''
      }
    },
    { title: '所需虎头币', dataIndex: 'price', align: 'center', width: 100 },
    { title: '商品说明', dataIndex: 'desc', align: 'center', width: 100 },
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
    { title: '时间', dataIndex: 'createAt', align: 'center', width: 100 },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      width: 100,
      render: (text, record) => {
        return (
          <InputNumber
            value={text}
            onChange={e => {
              record.sort = e
              setGoodsList(prev => ([ ...prev ]))
            }}
            onBlur={async (e) => {
              try {
                setLoading(true)
                await editGoods({
                  id: record.id,
                  sort: record.sort
                })
              } finally {
                setLoading(false)
              }
            }}
          />
        );
      }
    },
    {
      title: '状态',
      dataIndex: 'active',
      align: 'center',
      width: 100,
      render: (text, record) => {
        return (
          <Switch
            checked={text === 1}
            onChange={async (e) => {
              try {
                setLoading(true)
                record.active = record.active === 1 ? 0 : 1
                await editGoods({
                  id: record.id,
                  active: record.active
                })
                setGoodsList(prev => ([ ...prev ]))
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
      width: 110,
      render ( text: any, record: any, index: number ) {
        return (
          <>
            {
              (queryInfo.system === 1 && record.status === 0) && <Permission perms="novel:commodity:audit">
                <Button type="link" onClick={() => onAudit(record)}>审核</Button>
              </Permission>
            }
            <Permission perms="novel:commodity:edit">
              <Button type="link" onClick={() => onEdit(record)}>编辑</Button>
            </Permission>
            <Permission perms="novel:commodity:remove">
              <Button type="link" onClick={() => onDelete(record)}>删除</Button>
            </Permission>
          </>
        )
      }
    }
  ]
  if (queryInfo.system === 1) {
    columns.splice(10, 0, {
      title: '审核状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      render: (text) => {
        switch (text) {
          case 0:
            return '未审核'
          case 1:
            return '已通过'
          case 2:
            return '已拒绝'
          default:
            return ''
        }
      }
    })
  }
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
    fetchGoodsList(queryInfo)
  }, [queryInfo])
  useEffect(() => {
    if (!addVisible) {
      setImgUrlList([])
      formRef?.current?.resetFields()
    } else {
      if (type === 'edit') {
        formRef?.current?.setFieldsValue({
          title: recordSelected.title,
          price: recordSelected.price,
          sort: recordSelected.sort,
          type: recordSelected.type,
          desc: recordSelected.desc
        })
        if (recordSelected.imgs) {
          setImgUrlList(recordSelected.imgs.split(',').map((item, index) => {
            return {
              uid: index + 1,
              name: parseFileName(item),
              status: 'done',
              url: item
            }
          }))
        }
      }
    }
  }, [addVisible])
  async function fetchGoodsList (params) {
    try {
      setLoading(true)
      const res = await getGoodsList(params)
      if (res.code === 200) {
        setTotal(res.data.total)
        setGoodsList(res.data.rows || [])
      }
    } finally {
      setLoading(false)
    }
  }
  function onAudit (record) {
    setRecordSelected(record)
    setAuditVisible(true)
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
          const res = await deleteGoods({ids: record.id})
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
  function submit () {
    // console.log('asdf', formRef)
    formRef?.current?.submit()
  }
  async function onFinish (value) {
    try {
      let res
      setSaveLoading(true)
      const images = getFileNames(imgUrlList)
      value.headImg = images[0]
      value.imgs = images.join(',')
      if (type === 'add') {
        value.active = 1
        res = await addGoods(value)
      } else {
        res = await editGoods({ ...value, id: recordSelected.id })
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
  function getFileNames (val) {
    const res = []
    val.forEach(item => {
      if (item.status === 'done') {
        if (item?.response?.code === 200) {
          res.push(item?.response?.data?.fileName)
        } else if (item?.name) {
          res.push(item.name)
        }
      }
    })
    return res
  }
  function showPreview (val) {
    const target = val[0]
    if (target) {
      if (target.url) {
        setPreviewSrc(target.url)
      }
      if (target.thumbUrl) {
        setPreviewSrc(target.thumbUrl)
      }
      setTimeout(() => {
        document.querySelector('.preview-image')?.click()
      })
    }
    // setPreviewSrc()
    // document.querySelector('.preview-image')?.click()
  }
  function onImgUpload ({ fileList }) {
    setImgUrlList(fileList)
  }
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );
  return (
    <>
      <ContentWrapper>
        <Thumbnail />
        <ContentInner>
          <Typography.Title level={5}>商品管理</Typography.Title>
          <Form ref={searchFormRef} layout="inline" onFinish={onSearchFormFinish}>
            <Form.Item name="system" initialValue={0}>
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
            <Form.Item name="title" label="商品标题">
              <Input
                placeholder="请输入商品标题"
                allowClear
                onBlur={(e) => e.target.value && searchFormRef?.current?.submit()}
                onChange={(e) => !e.target.value && searchFormRef?.current?.submit()} />
            </Form.Item>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
              <Form.Item>
                <Permission perms="novel:commodity:add">
                  <Button type="primary" onClick={add}>新增商品</Button>
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
            dataSource={goodsList}
            scroll={{ x: 200 }}
            pagination={pagination}/>
        </ContentInner>
      </ContentWrapper>

      <Modal
        width="80%"
        title={`${type === 'add' ? '新增' : '编辑' }商品`}
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
            // imgs: [],
            title: '',
            type: 0,
            price: '',
            sort: 0,
            desc: ''
          }}>
          
          <Form.Item
            label="商品主图"
            name="imgs"
            required
            rules={[{
              validator(rule, value, callback) {
                const images = getFileNames(imgUrlList)
                images.length === 0 ? callback('请上传商品主图') : callback()
              }
            }]}>
            <Upload
              action={uploadUrl}
              fileList={imgUrlList}
              accept="image/*"
              listType="picture-card"
              onPreview={() => showPreview(imgUrlList)}
              onChange={onImgUpload}>
              {uploadButton}
            </Upload>
            <div style={{ color: '#aaa', fontSize: 12 }}>第一张图默认为封面图片</div>
          </Form.Item>
          <Form.Item
            label="商品类型"
            name="type">
            <Radio.Group
              options={categoryOptions}
              optionType="button"
              buttonStyle="solid"
            />
          </Form.Item>
          <Form.Item
            label="帖子标题"
            name="title"
            rules={[{ required: true, message: '请输入帖子标题' }]}>
            <Input maxLength={50} placeholder="请输入帖子标题" />
          </Form.Item>
          <Form.Item
            label="兑换商品所需虎头币"
            name="price"
            rules={[{ required: true, message: '请输入兑换商品所需虎头币' }]}>
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              placeholder="请输入兑换商品所需虎头币" />
          </Form.Item>
          <Form.Item
            label="排序"
            name="sort"
            rules={[{ required: true, message: '请输入排序' }]}>
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              precision={0}
              placeholder="请输入排序" />
          </Form.Item>
          <Form.Item
            label="说明"
            name="desc"
            rules={[{ required: true, message: '请输入说明' }]}>
            <Input.TextArea maxLength={250} rows={4} placeholder="请输入说明" />
          </Form.Item>
        </Form>
      </Modal>
      <Image
        className="preview-image"
        style={{ display: 'none' }}
        src={previewSrc}
      />
      <AuditModal
        visible={auditVisible}
        data={recordSelected}
        onCancel={() => setAuditVisible(false)}
        onSubmitSuccess={() => {
          setAuditVisible(false)
          setQueryInfo(pre => ({...pre}))
        }}
      />
    </>
  )
}