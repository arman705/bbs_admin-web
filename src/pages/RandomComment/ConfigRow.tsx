import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, InputNumber, Spin, message } from 'antd'
import Permission from '../../components/Permission'
import { getCommentConfig, configComment } from '../../api/randomComment'

export default function ConfigRow () {
  const formRef = useRef(null)
  const [ detailData, setDetailData ] = useState({})
  const [ loading, setLoading ] = useState(false)

  useEffect(() => {
    initData()
  }, [])

  async function initData () {
    try {
      setLoading(true)
      const res = await getCommentConfig()
      if (res.code === 200) {
        const data = res.data
        setDetailData(data)
        formRef?.current?.setFieldsValue({
          cronExpression: data.cronExpression,
          views: data.views
        })
      }
    } finally {
      setLoading(false)
    }
  }
  async function onSearchFormFinish (val) {
    try {
      setLoading(true)
      const res = await configComment({
        jobId: detailData.jobId,
        ...val
      })
      if (res.code === 200) {
        message.success('提交成功')
      } else {
        message.error(res.msg)
      }
    } finally {
      setLoading(false)
    }
  }
  function submit () {
    formRef?.current?.submit()
  }

  return (
    <Spin spinning={loading}>
      <Form
        ref={formRef}
        layout="inline"
        initialValues={{
          cronExpression: '',
          views: ''
        }}
        onFinish={onSearchFormFinish}>
        <Form.Item
          name="cronExpression"
          label="表达式"
          rules={[{ required: true, message: '请输入表达式' }]}>
          <Input maxLength={50} placeholder="表达式" allowClear />
        </Form.Item>
        <Form.Item
          name="views"
          label="浏览限制"
          rules={[{ required: true, message: '请输入浏览限制' }]}>
          <InputNumber
            style={{ width: 190 }}
            min={0}
            precision={0}
            placeholder="浏览限制" />
        </Form.Item>
        <Form.Item>
          <Permission perms="novel:randomComment:config">
            <Button type="primary" onClick={submit}>确定</Button>
          </Permission>
        </Form.Item>
      </Form>
    </Spin>
  )
}