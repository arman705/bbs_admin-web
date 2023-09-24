import React, { useState, useEffect } from 'react'
import { Form, Popover, Input, ModalProps, message, Button, List, Spin } from 'antd';
import { AlignCenterOutlined, MinusCircleFilled } from '@ant-design/icons';
import { QuickReasonHeader, QuickReasonContent } from './styled'
import { replyList, replySave, replyDel } from '../../api/user';

interface QuickReasonProps extends ModalProps {
  onSelect?: (value: string) => void;
}

const QuickReason: React.FC<QuickReasonProps> = (props) => {
  const { onSelect } = props
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [replyData, setReplyData] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [isDel, setIsDel] = useState(false)
  const [formRef] = Form.useForm()
  
  function onAdd (values: any) {
    setLoading(true)
    replySave(values).then((res: any) => {
      if (res.code === 200) {
        message.success('新增成功')
        fetchReplyList()
        setIsEdit(false)
        formRef.resetFields()
      } else {
        message.error(res.msg)
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  function onDel (id: string) {
    setLoading(true)
    replyDel(id).then((res:any) => {
      if (res.code === 200) {
        message.success('删除成功')
        fetchReplyList()
        setIsDel(false)
      } else {
        message.error(res.msg)
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    if (visible) {
      if (replyData.length === 0) fetchReplyList()
    } else {
      formRef.resetFields()
      setIsEdit(false)
    }
  }, [visible])

  function onVisibleChange (visible: boolean) {
    setVisible(visible)
  }
  function fetchReplyList () {
    setLoading(true)
    replyList().then((res: any) => {
      if (res.code === 200) {
        setReplyData(res.data)
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  const Title = (
    <QuickReasonHeader>
      <div className="title">快捷理由</div>
      <div><Button size="small" type="primary" shape="round" onClick={() => { setIsDel(!isDel) }}>{ !isDel ? '编辑' : '完成' }</Button></div>
    </QuickReasonHeader>
  )
  const Content = (
    <Spin spinning={loading}>
      <QuickReasonContent>
        <List
          locale={{ emptyText: '没有数据' }}
          dataSource={replyData}
          renderItem={(item: any) => (
            <List.Item>
              <div onClick={() => {setVisible(false); onSelect && onSelect(item.reply)}} className="text">{item.reply}</div>
              { isDel ? <MinusCircleFilled onClick={() => onDel(item.id)} /> : null }
            </List.Item>
          )}
        />
        <div style={{ marginTop: '10px' }}>
          {
            !isEdit ? (
              <div style={{ textAlign: 'center' }}><Button onClick={() => setIsEdit(true)}>常用语</Button></div>
            ) : (
              <Form form={formRef} layout="inline" onFinish={onAdd}>
                <Form.Item name="reply" rules={[{ required: true, message: '请输入内容' }]}>
                  <Input.TextArea placeholder="请输入内容" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    确定
                  </Button>
                </Form.Item>
              </Form>
            )
          }
        </div>
      </QuickReasonContent>
    </Spin>
  )

  return (
    <Popover
      content={Content}
      title={Title}
      trigger="click"
      visible={visible}
      onVisibleChange={onVisibleChange}
    >
      <Button icon={ <AlignCenterOutlined />}>快捷理由</Button>
    </Popover>
  )
}

export default QuickReason
