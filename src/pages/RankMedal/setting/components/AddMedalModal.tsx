import React, { useEffect, useState } from 'react'
import { Form, Modal, Input, ModalProps, message, InputNumber, Radio } from 'antd';
import { editMedal, addMedal } from '../../../../api/rankmedal';
import UploadImg from './UploadImg'
import { Colorpicker } from 'antd-colorpicker'
import Styled from 'styled-components';
import { parseFileName } from '../../../../utils/uploadImage';

const CustomItem = Styled(Form.Item)`
  .ant-form-item-control-input-content {
    display: flex
  }
`

interface AddLevelMedalModalProps extends ModalProps {
  onSubmitSuccess: () => void;
  recordData?: any
  type: number
}

const AddMedalModal: React.FC<AddLevelMedalModalProps> = (props) => {
  const { onSubmitSuccess, recordData, ...modalProps } = props
  const [loading, setLoading] = useState(false)
  const [formRef] = Form.useForm()
  
  function onSave (values: any) {
    let requestApi
    if (recordData) {
      requestApi = editMedal
      values.id = recordData.id
    } else {
      requestApi = addMedal
    }
    values.medalIcon = values.medalIcon.name
    values.medalColor = values.medalColor.hex
    values.medalType = props.type
    setLoading(true)
    requestApi(values).then((res: any) => {
      if (res.code === 200) {
        message.success(recordData ? '修改成功' : '新增成功')
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
      formRef.setFieldsValue({
        ...recordData,
        medalColor: {
          hex: recordData.medalColor
        },
        medalIcon: {
          name: parseFileName(recordData.medalIcon),
          url: recordData.medalIcon
        }
      })
    } else {
      formRef.resetFields()
    }
  }, [modalProps.visible])
  function getTitle () {
    let title = recordData ? '编辑' : '新增'
    switch (props.type) {
      case 1:
        return `${title}等级勋章`
      case 2:
        return `${title}活动勋章`
      case 3:
        return `${title}限定勋章`
    }
  }
  return (
    <Modal
      title={getTitle()}
      okText="确定"
      cancelText="取消"
      width={800}
      {...modalProps}
      onOk={formRef.submit}
      onCancel={onCancel}
      okButtonProps={{loading}}>
      <Form form={formRef} layout="horizontal" labelCol={ {span: 5} } onFinish={onSave}>
        <Form.Item name="medalIcon" label="勋章图片" rules={[{ required: true, message: '请上传勋章图片' }]}>
          <UploadImg />
        </Form.Item>
        <Form.Item name="medalTitle" label="勋章名称" rules={[{ required: true, message: '请输入勋章名称' }]}>
          <Input placeholder="请输入勋章名称" />
        </Form.Item>
        <Form.Item name="buyLevel" label="等级" rules={[{ required: true, message: '请选择等级' }]}>
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            precision={0}
            placeholder="请输入等级" />
        </Form.Item>
        <CustomItem
          name="medalColor"
          label="勋章颜色"
          rules={[{ required: true, message: '请选择勋章颜色' }]}>
          <Colorpicker popup />
        </CustomItem>
        <Form.Item name="salesPrice" label="金额" rules={[{ required: true, message: '请输入勋章描述' }]}>
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            precision={0}
            placeholder="请输入金额" />
        </Form.Item>
        {
          props.type === 2 && <Form.Item name="condition" label="解锁对应次数" rules={[{ required: true, message: '请输入解锁对应次数' }]}>
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              precision={0}
              placeholder="请输入解锁对应次数" />
          </Form.Item>
        }
        {
          props.type === 2 && <Form.Item name="activityType" initialValue={0} label="活动类型" rules={[{ required: true, message: '请选择活动类型' }]}>
            <Radio.Group
              options={[
                { label: '发贴', value: 0 },
                { label: '分享', value: 1 },
                { label: '评论', value: 2 },
              ]}
            />
          </Form.Item>
        }
        
        <Form.Item name="medalDesc" label="勋章描述" rules={[{ required: true, message: '请输入勋章描述' }]}>
          <Input.TextArea placeholder="请输入勋章描述" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddMedalModal
