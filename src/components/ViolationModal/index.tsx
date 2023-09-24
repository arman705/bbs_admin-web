import React, { useEffect, useState } from 'react'
import { Modal, Row, Col, Spin, Table, Radio, Input, Popover, Button, message } from 'antd'
import { user, common } from '../../api';
import CommonWordPanel from '../CommonWordPanel'

const ViolationModal = (props) => {
  const [ loading, setLoading ] = useState(false)
  const [ submitLoading, setSubmitLoading ] = useState(false)
  const [ voilateLogs, setVoilateLogs ] = useState({})
  const [ banType, setBanType ] = useState('')
  const [ cause, setCause ] = useState('')
  const columns = [
    {
      key: 'banTime',
      dataIndex: 'banTime',
      title: '违规时间',
      width: 150
    },
    {
      key: 'banTypeName',
      dataIndex: 'banTypeName',
      title: '违规类型',
      width: 100
    },
    {
      key: 'banDec',
      dataIndex: 'banDec',
      title: '封禁原因',
      width: 100,
      render: text => text || '-'
    },
    {
      key: 'operator',
      dataIndex: 'operator',
      title: '操作人',
      width: 100
    }
  ]

  useEffect(() => {
    if (props.id && props.visible) {
      fetchViolateLogs(props.id)
    }
  }, [props.id, props.visible])

  async function fetchViolateLogs(id) {
    try {
      setLoading(true)
      const res = await user.violateLogs(id)
      if (res.code === 200) {
        setVoilateLogs(res.data)
        setBanType(res.data.banTypes[0].value)
      }
    } finally {
      setLoading(false)
    }
  }
  function onSelectCommon ({ reply }) {
    setCause(reply)
  }
  async function submit () {
    if (!cause) {
      message.warning('请输入封禁原因')
    } else {
      try {
        setSubmitLoading(true)
        await common.banUser({
          userId: voilateLogs.userId,
          banType,
          cause
        })
        onCancel()
        props.submitSuccess && props.submitSuccess()
      } finally {
        setSubmitLoading(false)
      }
    }
  }
  function onCancel () {
    setBanType(voilateLogs.banTypes[0].value)
    setCause('')
    props.onCancel()
  }
  async function cancelBan () {
    try {
      setLoading(true)
      await common.userLiftBan(voilateLogs.userId)
      setVoilateLogs(pre => ({
        ...pre,
        status: '正常'
      }))
    } finally {
      setLoading(false)
    }
  }
  return (
    <Modal
      title="封禁用户"
      width={800}
      visible={ props.visible }
      onCancel={ onCancel }
      footer={
        <>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" loading={submitLoading} onClick={submit}>确定</Button>
        </>
      }>
      <Spin spinning={ loading }>
        <div style={{ minHeight: 150 }}>
          <Row>
            <Col flex={1}>用户昵称：{ voilateLogs?.nickName || '-' }</Col>
            <Col flex={1}>用户ID：{ voilateLogs?.userId || '-' }</Col>
          </Row>
          <Row style={{ marginTop: 20 }}>
            <Col flex={1}>
              用户状态：{ voilateLogs?.status || '-' }
              { voilateLogs.status === '禁言' ? <Button style={{ height: 'auto', lineHeight: 1, padding: 0, marginLeft: 10 }} type="link" onClick={cancelBan}>解封</Button> : null }
            </Col>
            <Col flex={1}>违规次数：{ voilateLogs?.violateNum || 0 }</Col>
          </Row>

          { 
            voilateLogs?.violateLogs?.length > 0 ?
              <Table
                style={{ marginTop: 20 }}
                scroll={{ y: 150 }}
                columns={columns}
                bordered
                pagination={false}
                dataSource={voilateLogs.violateLogs} /> :
              null
          }
          <Radio.Group
            style={{ marginTop: 20}}
            value={banType}
            buttonStyle="solid"
            onChange={(e) => setBanType(e.target.value)}>
            {
              voilateLogs?.banTypes?.map(item => {
                return ( 
                  <>
                    <Radio.Button
                      key={item.value}
                      value={item.value}>
                      {item.name}
                    </Radio.Button>
                  </>
                )
              })
            }
          </Radio.Group>

          <Row style={{ marginTop: 20, width: '100%' }} gutter={10}>
            <Col flex={1}>
              <Input
                value={cause}
                placeholder="请输入封禁原因"
                onChange={e => setCause(e.target.value)} />
            </Col>
            <Col>
              <Popover
                title="选择常用语"
                placement="top"
                content={<CommonWordPanel onSelect={onSelectCommon} />}
                trigger="click">
                <Button type="primary">快捷原因</Button>
              </Popover>
            </Col>
          </Row>
        </div>
      </Spin>
    </Modal>
  )
}

export default ViolationModal
