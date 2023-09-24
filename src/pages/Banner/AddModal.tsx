import React, { useState, useRef, useEffect } from 'react'
import { Button, InputNumber, Select, Form, Modal, Upload, message, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { addBanner, editBanner } from '../../api/banner'
import env from '../../env'
import { parseFileName } from '../../utils/uploadImage';

export default function AddModal ({ type, data, visible, onCancel, onSubmitSuccess }) {
  const formRef = useRef(null)
  const [saveLoading, setSaveLoading] = useState(false)
  const [imgUrlList, setImgUrlList] = useState<any>([])
  const uploadUrl = env.BASE_API_URL + '/common/sysFile/uploadImg';
  
  useEffect(() => {
    if (visible && (type === 'edit')) {
      fillData()
    }
  }, [visible])
  useEffect(() => {
    if (!visible) {
      setImgUrlList([])
      formRef?.current?.resetFields()
    }
  }, [visible])
  async function fillData () {
    formRef?.current?.setFieldsValue({
      bannerName: data.bannerName,
      bannerDesc: data.bannerDesc,
      bannerWidth: data.bannerWidth,
      bannerHeight: data.bannerHeight,
      bannerActive: data.bannerActive,
      bannerType: data.bannerType,
      bannerAddress: data.bannerAddress
    })
    if (data.bannerUrl) {
      setImgUrlList([{
        uid: 0,
        name: parseFileName(data.bannerUrl),
        status: 'done',
        url: data.bannerUrl
      }])
    }
  }
  async function onFinish (value) {
    try {
      let res
      setSaveLoading(true)
      value.bannerUrl = getFileNames(imgUrlList)[0]
      if (type === 'add') {
        res = await addBanner(value)
      } else {
        res = await editBanner({ ...value, id: data.id })
      }
      if (res.code === 200) {
        message.success(type === 'add' ? '新增成功' : '修改成功')
        onSubmitSuccess()
      } else {
        message.error(res.msg)
      }
    } finally {
      setSaveLoading(false)
    }
  }
  function submit () {
    formRef?.current?.submit()
  }
  function onImgUpload ({ fileList }) {
    setImgUrlList(fileList)
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
  const UploadButton = ({ title = '上传图片' }) => (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{ title }</div>
    </div>
  );
  return (
    <Modal
      width="80%"
      title={`${type === 'add' ? '新增' : '编辑' }任务`}
      visible={ visible }
      onCancel={ onCancel }
      footer={
        <>
          <Button onClick={ onCancel }>取消</Button>
          <Button type="primary" onClick={submit} loading={saveLoading}>确定</Button>
        </>
      }>
      <Form
        ref={formRef}
        labelCol={{ span: 5 }}
        onFinish={onFinish}
        initialValues={{
          bannerName: '',
          bannerDesc: '',
          bannerWidth: '',
          bannerHeight: '',
          // bannerActive: '',
          bannerType: '',
          bannerAddress: ''
        }}>
        <Form.Item
          label="名称"
          name="bannerName"
          rules={[{ required: true, message: '请输入名称' }]}>
          <Input maxLength={50} placeholder="请输入名称" />
        </Form.Item>
        <Form.Item
          label="描述"
          name="bannerDesc"
          rules={[{ required: true, message: '请输入描述' }]}>
          <Input maxLength={50} placeholder="请输入描述" />
        </Form.Item>
        <Form.Item
          label="横幅宽"
          name="bannerWidth"
          rules={[{ required: true, message: '请输入横幅宽' }]}>
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            precision={0}
            placeholder="请输入横幅宽" />
        </Form.Item>
        <Form.Item
          label="横幅高"
          name="bannerHeight"
          rules={[{ required: true, message: '请输入横幅高' }]}>
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            precision={0}
            placeholder="请输入横幅高" />
        </Form.Item>
        <Form.Item
          name="bannerActive"
          label="是否激活"
          rules={[{ required: true, message: '请选择是否激活' }]}>
          <Select
            allowClear
            placeholder="请选择是否激活"
            options={[
              { value: 1, label: '激活' },
              { value: 0, label: '未激活' }
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Banner类型"
          name="bannerType"
          rules={[{ required: true, message: '请输入Banner类型' }]}>
          <Input maxLength={50} placeholder="请输入Banner类型" />
        </Form.Item>
        <Form.Item
          label="Banner跳转地址"
          name="bannerAddress"
          rules={[{ required: true, message: '请输入Banner跳转地址' }]}>
          <Input maxLength={100} placeholder="请输入Banner跳转地址" />
        </Form.Item>
        <Form.Item
          label="Banner图片"
          name="bannerUrl"
          required
          rules={[{
            validator(rule, value, callback) {
              const images = getFileNames(imgUrlList)
              images.length === 0 ? callback('请上传Banner图片') : callback()
            }
          }]}>
          <Upload
            action={uploadUrl}
            fileList={imgUrlList}
            accept="image/*"
            listType="picture-card"
            showUploadList={{showPreviewIcon: false}}
            onChange={onImgUpload}>
            {imgUrlList.length > 0 ? null : <UploadButton />}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}