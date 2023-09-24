import React, { useEffect, useState, useRef } from 'react'
import Thumbnail from "../../components/Thumbnail";
import { Typography, Button, Form, Input, Modal, Upload, message, Image, Cascader } from 'antd';
import { ContentInner, ContentWrapper } from '../../components/Themeable';
import { getChatroomList, addChatroom, editChatroom, deleteChatroom } from '../../api/chatRoom'
import { articleTypeList, getScope } from '../../api/plate'
import Datatable from "../../components/Datatable";
import { PlusOutlined } from '@ant-design/icons';
import env from '../../env'
import Permission from '../../components/Permission';
import { parseFileName } from '../../utils/uploadImage';

export default function ChatRoom () {
  const formRef = useRef(null)
  const searchFormRef = useRef(null)
  const [type, setType] = useState('add')
  const [previewSrc, setPreviewSrc] = useState('add')
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [recordSelected, setRecordSelected] = useState<any>({})
  const [queryInfo, setQueryInfo] = useState({
    offset: 0,
    limit: 10,
    name: '',
    typeId: ''
  })
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [addVisible, setAddVisible] = useState(false)
  const [total, setTotal] = useState(0)
  const [scopeList, setScopeList] = useState([])
  const [chatRoomList, setChatRoomList] = useState([])
  const [cacheMap] = useState(new Map())
  const columns = [
    { title: '名称', dataIndex: 'name', align: 'center', width: 100 },
    { title: '简介', dataIndex: 'description', align: 'center', width: 100 },
    { title: '所属板块', dataIndex: 'typeName', align: 'center', width: 100 },
    {
      title: '背景图片',
      dataIndex: 'imgUrl',
      align: 'center',
      width: 100,
      render: text => {
        return text ? <Image src={text} style={{ width: 80, height: 80 }} /> : '-'
      }
    },
    {
      title: '图标',
      dataIndex: 'imgIcon',
      align: 'center',
      width: 100,
      render: text => {
        return text ? <Image src={text} style={{ width: 80, height: 80 }} /> : '-'
      }
    },
    { title: '创建时间', dataIndex: 'createAt', align: 'center', width: 100 },
    { title: '修改时间', dataIndex: 'updateAt', align: 'center', width: 100 },
    { 
      title: '操作',  
      align: 'center', 
      width: 110,
      render ( text: any, record: any, index: number ) {
        return (
          <>
            <Permission perms="novel:chatroom:update">
              <Button type="link" onClick={() => onEdit(record)}>编辑</Button>
            </Permission>
            <Permission perms="novel:chatroom:remove">
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
  const [imgUrlList, setImgUrlList] = useState<any>([])
  const [iconUrlList, setIconUrlList] = useState<any>([])
  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys)
    }
  }
  const uploadUrl = env.BASE_API_URL + '/common/sysFile/uploadImg';

  useEffect(() => {
    initData()
  }, [])

  useEffect(() => {
    fetchChatRoomList(queryInfo)
  }, [queryInfo])

  useEffect(() => {
    if (!addVisible) {
      setImgUrlList([])
      setIconUrlList([])
      formRef?.current?.resetFields()
    } else {
      if (type === 'edit') {
        initSelected()
        formRef?.current?.setFieldsValue({
          name: recordSelected.name,
          typeId: recordSelected.parentTypeId ?
            [recordSelected.parentTypeId, recordSelected.typeId] :
            recordSelected.typeId ?
            [recordSelected.typeId] :
            [],
          description: recordSelected.description,
        })
        if (recordSelected.imgUrl) {
          setImgUrlList([{
            uid: '1',
            name: parseFileName(recordSelected.imgUrl),
            status: 'done',
            url: recordSelected.imgUrl,
          }])
        }
        if (recordSelected.imgIcon) {
          setIconUrlList([{
            uid: '1',
            name: parseFileName(recordSelected.imgIcon),
            status: 'done',
            url: recordSelected.imgIcon,
          }])
        }
      }
    }
  }, [addVisible])

  async function fetchChatRoomList (params) {
    try {
      setLoading(true)
      const res = await getChatroomList(params)
      if (res.code === 200) {
        setTotal(res.data.total)
        setChatRoomList(res.data.rows || [])
      }
    } finally {
      setLoading(false)
    }
  }
  async function fetchScope () {
    try {
      const res = await getScope()
      res.forEach(item => item.isLeaf = false)
      return res
    } finally {
    }
  }
  async function fetchTypeList (params) {
    const cache = cacheMap.get(params.scope)
    if (cache) return cache
    try {
      const res = await articleTypeList(params)
      const data = res?.rows || []
      data.forEach(item => item.scope = item.name)
      cacheMap.set(params.scope, data)
      return data
    } finally {}
  }
  function onSearchFormFinish (val) {
    console.log(val)
    if (Array.isArray(val.typeId) && val.typeId.length > 0) {
      val.typeId = val.typeId[val.typeId.length - 1]
    }
    setQueryInfo(pre => ({
      ...pre,
      ...val
    }))
  }
  function initSelected () {
    if (recordSelected.parentTypeId && scopeList.length > 0) {
      const target = scopeList.find(item => item.id === recordSelected.parentTypeId)
      if (target) {
        fetchTypeList({ scope: target.scope }).then(data => {
          target.children = data
          setScopeList([...scopeList])
        })
      }
    }
  }
  async function initData () {
    const scope = await fetchScope()
    setScopeList(scope)
    initSelected()
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
    // console.log('asdf', formRef)
    formRef?.current?.submit()
  }
  function onImgUpload ({ fileList }) {
    setImgUrlList(fileList)
  }
  function onIconUpload ({ fileList }) {
    setIconUrlList(fileList)
  }
  function getFileName (val) {
    if (val) {
      const target = val[0]
      if (target?.response?.code === 200) return target?.response?.data?.fileName
      if (target?.name) return target.name
    }
    return ''
  }
  async function onFinish (value) {
    try {
      let res
      setSaveLoading(true)
      value.imgIcon = getFileName(iconUrlList)
      value.imgUrl = getFileName(imgUrlList)
      if (Array.isArray(value.typeId) && value.typeId.length > 0) {
        value.typeId = value.typeId[value.typeId.length - 1]
      } else {
        value.typeId = undefined
      }
      if (type === 'add') {
        res = await addChatroom(value)
      } else {
        res = await editChatroom({ ...value, id: recordSelected.id })
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
  function onDelete ({ id }) {
    Modal.confirm({
      title: '提示',
      content: '确定要删除吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await deleteChatroom({ids: id})
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
          const res = await deleteChatroom({ids: selectedRowKeys.join(',')})
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
  function showPreview (val) {
    console.log(val)
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
  async function loadData (selectedOptions) {
    const targetOption = selectedOptions[selectedOptions.length - 1]
    targetOption.loading = true
    const res = await fetchTypeList({ scope: targetOption.scope })
    targetOption.loading = false
    targetOption.children = res
    setScopeList([...scopeList])
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
          <Typography.Title level={5}>聊天室管理</Typography.Title>
          <Form ref={searchFormRef} layout="inline" onFinish={onSearchFormFinish}>
            <Form.Item name="name" label="名称">
              <Input
                placeholder="请输入名称"
                allowClear
                onBlur={(e) => e.target.value && searchFormRef?.current?.submit()}
                onChange={(e) => !e.target.value && searchFormRef?.current?.submit()} />
            </Form.Item>
            <Form.Item name="typeId" label="所属板块">
              <Cascader
                style={{ width: 180 }}
                fieldNames={{ label: 'scope', value: 'id' }}
                options={scopeList}
                onChange={() => searchFormRef?.current?.submit()}
                onClear={() => searchFormRef?.current?.resetFields(['typeId']) }
                changeOnSelect
                placeholder="请选择所属板块"
                loadData={loadData} />
            </Form.Item>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
              <Form.Item>
                <Permission perms="novel:chatroom:add">
                  <Button type="primary" onClick={add}>新增聊天室</Button>
                </Permission>
              </Form.Item>
              <Form.Item style={{ marginRight: 0 }}>
                <Permission perms="novel:chatroom:remove">
                  <Button type="primary" onClick={batchDelete}>批量删除</Button>
                </Permission>
              </Form.Item>
            </div>
          </Form>
          <Datatable
            rowKey="id"
            title=""
            rowSelection={rowSelection}
            loading={loading}
            columns={columns}
            dataSource={chatRoomList}
            scroll={{ x: 200 }}
            pagination={pagination}/>
        </ContentInner>
    </ContentWrapper>
    <Modal
      width="500px"
      title={`${type === 'add' ? '新增' : '编辑' }聊天室`}
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
          name: '',
          // typeId: '',
          description: '',
          imgUrl: '',
          imgIcon: ''
        }}>
        <Form.Item
          label="聊天室名称"
          name="name"
          rules={[{ required: true, message: '请输入聊天室名称' }]}>
          <Input maxLength={50} placeholder="请输入聊天室名称" />
        </Form.Item>
        <Form.Item
          label="所属板块"
          name="typeId">
          <Cascader
            fieldNames={{ label: 'scope', value: 'id' }}
            options={scopeList}
            changeOnSelect
            placeholder="请选择所属板块"
            loadData={loadData} />
        </Form.Item>
        <Form.Item
          label="背景图片"
          name="imgUrl">
          <Upload
            action={uploadUrl}
            fileList={imgUrlList}
            accept="image/*"
            listType="picture-card"
            onPreview={() => showPreview(imgUrlList)}
            onChange={onImgUpload}>
            {imgUrlList.length > 0 ? null : uploadButton}
          </Upload>
        </Form.Item>
        <Form.Item
          label="图标"
          name="imgIcon">
          <Upload
            action={uploadUrl}
            fileList={iconUrlList}
            accept="image/*"
            listType="picture-card"
            onPreview={() => showPreview(iconUrlList)}
            onChange={onIconUpload}>
            {iconUrlList.length > 0 ? null : uploadButton}
          </Upload>
        </Form.Item>
        <Form.Item
          label="聊天室简介"
          name="description">
          <Input.TextArea maxLength={250} rows={4} placeholder="请输入聊天室简介" />
        </Form.Item>
      </Form>
    </Modal>

    <Image
      className="preview-image"
      style={{ display: 'none' }}
      src={previewSrc}
    />
   </>
  )
}
