import React, { useEffect, useState } from 'react'
import { Col, Modal, message, Pagination, Row, Spin } from 'antd'
import { getMedalList, medalLevelRemove } from '../../../../api/rankmedal'
import MedalCard from './MedalCard'
import AddButton from './AddButton'
import AddMedalModal from './AddMedalModal'
import Permission from '../../../../components/Permission'

const MedalList = ({ searchValue, type }: { searchValue: string, type: number }) => {
  const [oldSearchValue, setOldSearchValue] = useState('')
  const [listData, setListData] = useState([])
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recordData, setRecordData] = useState(null)
  const [queryInfo, setQueryInfo] = useState({
    offset: 0,
    limit: 8
  })
  const [total, setTotal] = useState(0)

  function fetchListData() {
    setLoading(true)
    getMedalList({
      medalType: type,
      medalTitle: searchValue,
      ...queryInfo
    }).then((res: any) => {
      if (res.code === 200) {
        setListData(res?.data?.list)
        setTotal(res?.data?.total)
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  function handleCancel() {
    setVisible(false)
  }
  function onSubmitSuccess() {
    handleCancel()
    fetchListData()
  }
  function handleDelete(id: number) {
    Modal.confirm({
      title: '提示',
      content: '确定要删除吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        medalLevelRemove(id).then((res: any) => {
          if (res.code === 200) {
            message.success('删除成功')
            fetchListData()
          } else {
            message.success(res.msg)
          }
        })
      }
    });
  }
  function handleEdit(recordData: any) {
    setRecordData(recordData)
    setVisible(true)
  }
  function handleAdd() {
    setRecordData(null)
    setVisible(true)
  }

  useEffect(() => {
    if (searchValue != oldSearchValue) {
      setQueryInfo(pre => ({
        ...pre,
        offset: 0
      }))
      setOldSearchValue(searchValue)
    }
  }, [searchValue])

  useEffect(() => {
    fetchListData()
  }, [queryInfo])

  return (
    <>
      <Spin spinning={loading}>
        <Row wrap={true} gutter={[21, 21]} justify="start" align="middle">
          {
            queryInfo.offset === 0 && <Permission perms="system:medalInfo:add">
              <AddButton type={type} onClick={handleAdd} />
            </Permission>
          }
          {
            listData.map((item: any) => {
              return (
                <Col key={item.id}>
                  <MedalCard
                    iconUrl={item.medalIcon}
                    title={item.medalTitle}
                    desc={item.medalDesc}
                    onDelete={() => handleDelete(item.id)}
                    onEdit={() => handleEdit(item)} />
                </Col>
              )
            })
          }
        </Row>
      </Spin>
      
      <div style={{ margin: '20px 0', textAlign: 'center' }}>
        <Pagination
          current={queryInfo.offset / queryInfo.limit + 1}
          pageSize={queryInfo.limit}
          total={total}
          showTotal={total => `共${total}条`}
          onChange={(current: number, size: number) => {
            setQueryInfo(pre => ({
              ...pre,
              offset: (current - 1) * size,
              limit: size
            }))
          }} />
      </div>
      <AddMedalModal
        onSubmitSuccess={onSubmitSuccess}
        type={type}
        recordData={recordData}
        visible={visible}
        onCancel={handleCancel} />
    </>
  )
}

export default MedalList
