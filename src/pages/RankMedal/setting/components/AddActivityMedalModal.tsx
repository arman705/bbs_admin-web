import React, { useState, useEffect } from 'react'
import { Form, Modal, Input, Select, Tooltip, ModalProps, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { medalActiveUpdate, medalActiveSave } from '../../../../api/rankmedal';
import { articleTypeList } from '../../../../api/plate'
import UploadImg from './UploadImg'

interface AddActivityMedalModalProps extends ModalProps {
  onSubmitSuccess: () => void;
  recordData?: any
}

const AddActivityMedalModal: React.FC<AddActivityMedalModalProps> = (props) => {
  const { onSubmitSuccess, recordData, ...modalProps } = props
  const [loading, setLoading] = useState(false)
  const [moduleData, setModuleData] = useState([])
  const [formRef] = Form.useForm()
  
  const ModuleLabel = (
    <>
      <span style={{ marginRight: 4 }}>版块类别</span>
      <Tooltip placement="top" title="用户需在选择的版块中完成相关操作，才可以获得勋章">
        <QuestionCircleOutlined />
      </Tooltip>
    </>
  )
  const OperationLabel = (
    <>
      <span style={{ marginRight: 4 }}>用户操作</span>
      <Tooltip placement="top" title="用户在论坛中进行点赞、评论、转发等相关操作达到一定的次数">
        <QuestionCircleOutlined />
      </Tooltip>
    </>
  )
  
  function onSave (values: any) {
    const requestApi = recordData ? medalActiveUpdate : medalActiveSave
    const fd: any = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'img') {
        fd.append('imgUrl', (value as any).name)
      } else {
        fd.append(key, value)
      }
    })
    recordData && fd.append('id', recordData.id)
    setLoading(true)
    requestApi(fd).then((res: any) => {
      if (res.code === 200) {
        message.success('新增成功')
        onSubmitSuccess()
        onCancel(null as any)
      } else {
        message.error('新增失败')
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  function onCancel (e: React.MouseEvent<HTMLElement>) {
    formRef.resetFields()
    modalProps.onCancel && modalProps.onCancel(e)
  }
  function fetchModuleData () {
    articleTypeList({ offset: 0, limit: 999 }).then(res => {
      setModuleData(res.rows)
    })
  }

  useEffect(() => {
    if (modalProps.visible && recordData) {
      formRef.setFieldsValue({
        ...recordData,
        img: {
          name: recordData.imgUrl,
          url: recordData.imgRealUrl
        }
      })
    } else {
      formRef.resetFields()
    }
    if (modalProps.visible) {
      fetchModuleData()
    }
  }, [modalProps.visible])

  return (
    <Modal
      title={recordData ? '编辑活跃勋章' : '新增活跃勋章'}
      okText="确定"
      cancelText="取消"
      {...modalProps}
      onOk={formRef.submit}
      onCancel={onCancel}
      okButtonProps={{loading}}>
      <Form form={formRef} layout="horizontal" labelCol={ {span: 5} } onFinish={onSave}>
        <Form.Item name="img" label="勋章图片" rules={[{ required: true, message: '请上传勋章图片' }]}>
          <UploadImg />
        </Form.Item>
        <Form.Item name="name" label="勋章名称" rules={[{ required: true, message: '请输入勋章名称' }]}>
          <Input placeholder="请输入勋章名称" />
        </Form.Item>
        <Form.Item name="articleTypeId" label={ModuleLabel} rules={[{ required: true, message: '请选择版块类别' }]}>
          <Select placeholder="请选择版块类别">
            <Select.Option value={-1}>全部</Select.Option>
            {
              moduleData.map((item: any) => <Select.Option key={item.id} value={Number(item.id)}>{item.name}</Select.Option>)
            }
          </Select>
        </Form.Item>
        <Form.Item name="operateType" label={OperationLabel} rules={[{ required: true, message: '请选择用户操作' }]}>
          <Select placeholder="请选择用户操作">
            <Select.Option value={1}>点赞</Select.Option>
            <Select.Option value={2}>评论</Select.Option>
            <Select.Option value={3}>转发</Select.Option>
            <Select.Option value={4}>发贴</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="operateNum" label="操作次数" rules={[{ required: true, message: '请选择操作次数' }]}>
          <Select placeholder="请选择操作次数">
            <Select.Option value={1}>1</Select.Option>
            <Select.Option value={5}>5</Select.Option>
            <Select.Option value={10}>10</Select.Option>
            <Select.Option value={50}>50</Select.Option>
            <Select.Option value={100}>100</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="description" label="勋章描述" rules={[{ required: true, message: '请输入勋章描述' }]}>
          <Input.TextArea placeholder="请输入勋章描述" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddActivityMedalModal
