import React, { useState, useEffect } from 'react'
import { Form, Modal, Input, ModalProps, Select, Tooltip, message } from 'antd';
import { forumScoreConfigSave, forumScoreConfigUpdate } from '../../../../api/rankmedal';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface AddTaskModalProps extends ModalProps {
  onSubmitSuccess: () => void;
  recordData?: any;
  type?: number;
  taskType?: any[];
}

const AddTaskModal: React.FC<AddTaskModalProps> = (props) => {
  const { onSubmitSuccess, recordData, type, taskType, ...modalProps } = props

  console.log('asfsadf', taskType)
  const [loading, setLoading] = useState(false)
  const [formRef] = Form.useForm()
  const ActionLabel = (
    <>
      <span style={{ marginRight: 4 }}>选择任务</span>
      <Tooltip placement="top" title="已选择的任务不可重复选择">
        <QuestionCircleOutlined />
      </Tooltip>
    </>
  )
  const DescLabel = (
    <>
      <span style={{ marginRight: 4 }}>任务描述</span>
      <Tooltip placement="top" title="任务描述将在前端展示">
        <QuestionCircleOutlined />
      </Tooltip>
    </>
  )
  
  function onSave (values: any) {
    const requestApi = recordData ? forumScoreConfigUpdate : forumScoreConfigSave
    const data = values
    data.type = type
    recordData && (data.id = recordData.id)
    setLoading(true)
    requestApi(data).then((res: any) => {
      if (res.code === 200) {
        message.success('新增成功')
        onSubmitSuccess()
        onCancel(null as any)
      } else {
        message.error(res.msg)
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  function onCancel (e: React.MouseEvent<HTMLElement>) {
    formRef.resetFields()
    modalProps.onCancel && modalProps.onCancel(e)
  }

  useEffect(() => {
    if (modalProps.visible && recordData) {
      formRef.setFieldsValue(recordData)
    } else {
      formRef.resetFields()
    }
  }, [modalProps.visible])

  return (
    <Modal
      okText="确定"
      cancelText="取消"
      {...modalProps}
      onOk={formRef.submit}
      onCancel={onCancel}
      okButtonProps={{loading}}>
      <Form form={formRef} layout="horizontal" labelCol={ {span: 5} } onFinish={onSave}>
        <Form.Item name="actionName" label={ActionLabel} rules={[{ required: true, message: '请选择任务' }]}>
          <Select placeholder="请选择任务">
            {
              taskType?.map((item) => <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>)
            }
          </Select>
        </Form.Item>
        <Form.Item name="requireNum" label="任务要求" rules={[{ required: true, message: '请输入任务要求' }]}>
          <Input placeholder="请输入任务要求" addonAfter={<div>次</div>} />
        </Form.Item>
        <Form.Item name="actionDescription" label={DescLabel} rules={[{ required: true, message: '请输入任务描述' }]}>
          <Input.TextArea placeholder="请输入任务描述" />
        </Form.Item>
        <Form.Item name="amount" label="奖励影响力" rules={[{ required: true, message: '请输入奖励影响力' }]}>
          <Input placeholder="请输入奖励影响力" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddTaskModal
