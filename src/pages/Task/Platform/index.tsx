import React, { useState, useRef, useEffect } from 'react'
import Thumbnail from "../../../components/Thumbnail";
import { ContentInner, ContentWrapper } from '../../../components/Themeable';
import { Typography, Image, Button, InputNumber, Radio, Switch, Select, Form, Modal, Upload, message, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Datatable from "../../../components/Datatable";
import env from '../../../env'
import { editTask, getTaskList, addTask, deleteTask } from '../../../api/task'
import Permission from '../../../components/Permission'
import { hasPermission } from '../../../utils/utils'
import { parseFileName } from '../../../utils/uploadImage';

export default function TaskPlatform () {
  const formRef = useRef(null)
  const searchFormRef = useRef(null)
  const [recordSelected, setRecordSelected] = useState<any>({})
  const [queryInfo, setQueryInfo] = useState({
    offset: 0,
    limit: 10,
    type: 0
  })
  const [type, setType] = useState('add')
  const [previewSrc, setPreviewSrc] = useState('add')
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [addVisible, setAddVisible] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [imgUrlList, setImgUrlList] = useState<any>([])
  const [addType, setAddType] = useState(0)
  const uploadUrl = env.BASE_API_URL + '/common/sysFile/uploadImg';
  const typeOptions = [
    { label: '签到', value: 0 },
    { label: '每日任务', value: 1 },
    { label: '官方任务', value: 5 }
  ]
  const columns = [
    {
      title: '排序',
      dataIndex: 'id',
      align: 'center',
      width: 80,
      render: (text, record, index) => {
        return index + 1
      }
    },
    {
      title: '任务图标',
      dataIndex: 'icon',
      align: 'center',
      width: 100,
      render: text => {
        return text ? <Image src={text} style={{ width: 80, height: 80, objectFit: 'cover' }} /> : '-'
      }
    },
    { title: '任务名称', dataIndex: 'showName', align: 'center', width: 100 },
    { title: '任务编码', dataIndex: 'actionName', align: 'center', width: 100 },
    { title: '任务介绍', dataIndex: 'actionDescription', align: 'center', width: 100 },
    { title: '金币奖励', dataIndex: 'amount', align: 'center', width: 100 },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      width: 100,
      render: (text, record) => {
        return (
          <InputNumber
            disabled={!hasPermission('system:scoreConfig:edit')}
            value={text}
            onChange={e => {
              record.sort = e
              setDataSource(prev => ([ ...prev ]))
            }}
            onBlur={async (e) => {
              try {
                setLoading(true)
                await editTask({
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
      dataIndex: 'isEnable',
      align: 'center',
      width: 100,
      render: (text, record) => {
        return (
          <Switch
            disabled={!hasPermission('system:scoreConfig:edit')}
            checked={text === 0}
            onChange={async (e) => {
              try {
                setLoading(true)
                record.isEnable = record.isEnable === 0 ? 1 : 0
                await editTask({
                  id: record.id,
                  isEnable: record.isEnable
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
      width: 110,
      render ( text: any, record: any, index: number ) {
        return (
          <>
            <Permission perms="system:scoreConfig:edit">
              <Button type="link" onClick={() => onEdit(record)}>编辑</Button>
            </Permission>
            <Permission perms="system:scoreConfig:remove">
              <Button type="link" onClick={() => onDelete(record)}>删除</Button>
            </Permission>
          </>
        )
      }
    }
  ]
  if (queryInfo.type === 5) {
    columns.splice(3, 0, {
      title: '任务地址',
      dataIndex: 'url',
      align: 'center',
      width: 100
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
    fetchDataSource(queryInfo)
  }, [queryInfo])
  useEffect(() => {
    if (!addVisible) {
      setImgUrlList([])
      formRef?.current?.resetFields()
    } else {
      if (type === 'add') {
        formRef?.current?.setFieldsValue({
          type: queryInfo.type
        })
        setAddType(queryInfo.type)
      }
      if (type === 'edit') {
        formRef?.current?.setFieldsValue({
          type: recordSelected.type,
          cycle: recordSelected.cycle,
          actionName: recordSelected.actionName,
          showName: recordSelected.showName,
          actionDescription: recordSelected.actionDescription,
          amount: recordSelected.amount,
          url: recordSelected.url,
          isEnable: recordSelected.isEnable
        })
        setAddType(recordSelected.type)
        if (recordSelected.icon) {
          setImgUrlList([{
            uid: 0,
            name: parseFileName(recordSelected.icon),
            status: 'done',
            url: recordSelected.icon
          }])
        }
      }
    }
  }, [addVisible])
  async function fetchDataSource (params) {
    try {
      setLoading(true)
      const res = await getTaskList(params)
      if (res.code === 200) {
        setTotal(res.data.total)
        setDataSource(res.data.rows || [])
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
          const res = await deleteTask(record.id)
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
      value.icon = images[0]
      if (type === 'add') {
        value.sort = 0
        value.cycleLimit = 1
        res = await addTask(value)
      } else {
        res = await editTask({ ...value, id: recordSelected.id })
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
          <Typography.Title level={5}>平台任务</Typography.Title>
          <Form
            ref={searchFormRef}
            layout="inline"
            initialValues={{
              type: 0
            }}
            onFinish={onSearchFormFinish}>
            <Form.Item name="type">
              <Radio.Group
                options={typeOptions}
                onChange={() => searchFormRef?.current?.submit()}
                optionType="button"
                buttonStyle="solid"
              />
            </Form.Item>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
              <Form.Item>
                <Permission perms="system:scoreConfig:add">
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
            scroll={{ x: 200 }}
            pagination={pagination}/>
        </ContentInner>
      </ContentWrapper>

      <Modal
        width="500px"
        title={`${type === 'add' ? '新增' : '编辑' }任务`}
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
            type: 0,
            icon: '',
            cycle: 'day',
            actionName: '',
            actionDescription: '',
            amount: 0,
            isEnable: 1
          }}>
          <Form.Item
            label="类型"
            name="type"
            rules={[{ required: true, message: '请选择类型' }]}>
            <Radio.Group
              options={typeOptions}
              onChange={(e) => setAddType(e.target.value)}
              optionType="button"
              buttonStyle="solid"
            />
          </Form.Item>
          <Form.Item name="isEnable" label="状态" required>
            <Select
              allowClear
              placeholder="请选择是否激活"
              options={[
                { value: 1, label: '未激活' },
                { value: 0, label: '激活' }
              ]}
            />
          </Form.Item>
          <Form.Item
            label="任务图标"
            name="icon"
            required
            rules={[{
              validator(rule, value, callback) {
                const images = getFileNames(imgUrlList)
                images.length === 0 ? callback('请上传任务图标') : callback()
              }
            }]}>
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
            label="周期范围"
            name="cycle"
            rules={[{ required: true, message: '请选择周期范围' }]}>
            <Select
              placeholder="请选择周期范围"
              options={[
                { value: 'day', label: '每天' },
                { value: 'single', label: '一次性' },
                { value: 'infinite', label: '不限周期' }
              ]}
            />
          </Form.Item>
          <Form.Item
            label="任务名称"
            name="showName"
            rules={[{ required: true, message: '请输入任务名称' }]}>
            <Input maxLength={50} placeholder="请输入任务名称" />
          </Form.Item>
          <Form.Item
            label="任务编码"
            name="actionName"
            rules={[{ required: true, message: '请输入任务编码' }]}>
            <Input maxLength={50} placeholder="请输入任务编码" />
          </Form.Item>
          <Form.Item
            label="任务介绍"
            name="actionDescription"
            rules={[{ required: true, message: '请输入任务介绍' }]}>
            <Input maxLength={250} placeholder="请输入任务介绍" />
          </Form.Item>
          {
            addType === 5 && <Form.Item
              label="跳转外链"
              name="url">
              <Input maxLength={250} placeholder="请输入跳转外链" />
            </Form.Item>
          }
          <Form.Item
            label="金币奖励"
            name="amount"
            rules={[{ required: true, message: '请输入金币奖励' }]}>
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              precision={0}
              placeholder="请输入金币奖励" />
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