import React, { useEffect, useState } from 'react'
import { Col, Modal, message } from 'antd'
import { medalActiveList, medalActiveRemove } from '../../../../api/rankmedal'
import MedalCard from './MedalCard'
import AddButton from './AddButton'
import AddActivityMedalModal from './AddActivityMedalModal'

const ActivityMedalList = ({ searchValue }: { searchValue: string }) => {
  const [listData, setListData] = useState([])
  const [visible, setVisible] = useState(false)
  const [recordData, setRecordData] = useState(null)

  function fetchListData() {
    medalActiveList(searchValue).then((res: any) => {
      if (res.code === 200) {
        setListData(res?.data?.rows)
      }
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
        medalActiveRemove(id).then((res: any) => {
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
    fetchListData()
  }, [searchValue])

  return (
    <>
      {
        listData.map((item: any) => {
          return (
            <Col key={item.id}>
              <MedalCard
                iconUrl={item.imgRealUrl}
                title={item.name}
                subTitle={item.description}
                desc="8474 人获赞"
                onDelete={() => handleDelete(item.id)}
                onEdit={() => handleEdit(item)} />
            </Col>
          )
        })
      }
      <AddButton onClick={handleAdd} />

      <AddActivityMedalModal onSubmitSuccess={onSubmitSuccess} recordData={recordData} visible={visible} onCancel={handleCancel} />
    </>
  )
}

export default ActivityMedalList
