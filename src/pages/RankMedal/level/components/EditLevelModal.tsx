import React, { useState, useEffect } from 'react'
import { Form, Modal, Input, ModalProps, message, Radio, Select } from 'antd';
import { avatarFrameList, levelConfigUpdate } from '../../../../api/rankmedal';
import { emojiList } from '../../../../api/reception';
import UploadImg from '../../setting/components/UploadImg'

interface EditLevelModalProps extends ModalProps {
  onSubmitSuccess: () => void;
  recordData?: any
}

const EditLevelModal: React.FC<EditLevelModalProps> = (props) => {
  const { onSubmitSuccess, recordData, ...modalProps } = props
  const [loading, setLoading] = useState(false)
  const [frameData, setFrameData] = useState([])
  const [emojiData, setEmojiData] = useState([])
  const [rewardType, setRewardType] = useState(-1)
  const [formRef] = Form.useForm()
  
  function onSave (values: any) {
    const fd: any = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'img') {
        fd.append('imgUrl', (value as any).name)
      } else {
        fd.append(key, value)
      }
    })
    recordData && fd.append('id', recordData.id)
    const instance = formRef.getFieldInstance('rewardRelationId')
    if (instance) {
      const rewardRelationId = formRef.getFieldValue('rewardRelationId')
      const target = instance.props.children.find((item: any) => {
        return item.props.value === rewardRelationId
      })
      console.log(target.props)
      target && (fd.append('rewardRelationName', target.props.children))
    }
    setLoading(true)
    levelConfigUpdate(fd).then((res: any) => {
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
  function fetchFrameData () {
    avatarFrameList({offset: 0, limit: 999}).then((res: any) => {
      if (res.code === 200) {
        setFrameData(res.data.rows)
      }
    })
  }
  function fetchEmojiData () {
    emojiList({offset: 0, limit: 999}).then((res: any) => {
      if (res.code === 200) {
        setEmojiData(res.data.rows)
      }
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
      setRewardType(recordData.rewardType)
    }
  }, [modalProps.visible])

  useEffect(() => {
    if (modalProps.visible) {
      fetchFrameData()
      fetchEmojiData()
    }
  }, [modalProps.visible])


  const FrameItem = (
    <Form.Item name="rewardRelationId" label="头像框" rules={[{ required: true, message: '请选择头像框' }]}>
      <Select placeholder="请选择头像框">
        {frameData.map((item: any) => <Select.Option value={item.id}>{item.name}</Select.Option>)}
      </Select>
    </Form.Item>
  )

  const EmojiItem = (
    <Form.Item name="rewardRelationId" label="表情包" rules={[{ required: true, message: '请选择表情包' }]}>
      <Select placeholder="请选择表情包">
        {emojiData.map((item: any) => <Select.Option value={item.id}>{item.name}</Select.Option>)}
      </Select>
    </Form.Item>
  )

  return (
    <Modal
      title="编辑等级"
      okText="确定"
      cancelText="取消"
      {...modalProps}
      onOk={formRef.submit}
      onCancel={onCancel}
      okButtonProps={{loading}}>
      <Form form={formRef} layout="horizontal" labelCol={ {span: 5} } onFinish={onSave}>
        <Form.Item name="img" label="等级勋章" rules={[{ required: true, message: '请上传等级勋章' }]}>
          <UploadImg />
        </Form.Item>
        <Form.Item name="level" label="等级" rules={[{ required: true, message: '请输入等级' }]}>
          <Input placeholder="请输入等级" />
        </Form.Item>
        <Form.Item name="name" label="等级名称" rules={[{ required: true, message: '请输入等级名称' }]}>
          <Input placeholder="请输入等级名称" />
        </Form.Item>
        <Form.Item name="influenceAmount" label="要求影响力" rules={[{ required: true, message: '请输入要求影响力' }]}>
          <Input placeholder="请输入要求影响力" />
        </Form.Item>
        <Form.Item name="rewardType" label="等级奖励" rules={[{ required: true, message: '请选择等级奖励' }]}>
          <Radio.Group buttonStyle="solid" value={rewardType} onChange={(e) => setRewardType(Number(e.target.value))}>
            <Radio.Button value={1}>头像框</Radio.Button>
            <Radio.Button value={0}>发布功能</Radio.Button>
            <Radio.Button value={2}>表情包</Radio.Button>
          </Radio.Group>
        </Form.Item>
        { rewardType === 1 ? FrameItem : null }
        { rewardType === 2 ? EmojiItem : null}
        <Form.Item name="rewardDesc" label="奖励描述" rules={[{ required: true, message: '请输入奖励描述' }]}>
          <Input.TextArea placeholder="请输入奖励描述" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditLevelModal
