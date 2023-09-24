import React, { useEffect, useState } from 'react'
import { Col, Modal, message, Typography, Row } from 'antd'
import { sysUserList, sysUserRemove } from '../../api/backstage'
import MemberCard from './components/MemberCard'
import AddButton from './components/AddButton'
import AddModal from './components/AddModal'
import Thumbnail from '../../components/Thumbnail';
import { ContentWrapper, ContentInner } from '../../components/Themeable';
import { useTheme } from '../../theme';
import { useHistory } from 'react-router-dom'
import Permission from '../../components/Permission'

const LevelMedalList = () => {
  const history = useHistory()
  const { theme } = useTheme()
  const [listData, setListData] = useState([])
  const [visible, setVisible] = useState(false)
  const [recordData, setRecordData] = useState(null)

  function fetchListData () {
    sysUserList().then((res: any) => {
      if (res.code === 200) {
        console.log(res)
        setListData(res?.data || [])
      }
    })
  }
  function handleCancel () {
    setVisible(false)
  }
  function onSubmitSuccess () {
    handleCancel()
    fetchListData()
  }
  function handleDelete (id: number) {
    Modal.confirm({
      title: '提示',
      content: '确定要删除吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        sysUserRemove(id).then((res: any) => {
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
  function handleEdit (recordData: any) {
    setRecordData(recordData)
    setVisible(true)
  }
  function handleAdd () {
    setRecordData(null)
    setVisible(true)
  }
  function onPermission (item: any) {
    history.push(`/dashboard/manager/permission/${item.userId}`)
  }

  useEffect(() => {
   fetchListData() 
  }, [])

  return (
    <ContentWrapper>
			<Thumbnail></Thumbnail>
      <ContentInner>
				<Typography.Title level={ 5 }>成员管理</Typography.Title>
        
      </ContentInner>

      <ContentInner style={ {marginTop: '20px', background:theme.colors.bg5, padding: '0px'} }>
				<Row wrap={true} gutter={ [21, 21] } justify="start" align="middle">
          <Permission perms="sys:user:add">
            <AddButton onClick={handleAdd}/>
          </Permission>
          {
            listData.map((item: any) => {
              return (
                <Col key={item.id}>
                  <MemberCard 
                    iconUrl="https://img.xiaopiu.com/userImages/img11156799f8280.png"
                    name={item.name}
                    number={item.jobNumber}
                    job={item.job}
                    onDelete={() => handleDelete(item.userId)} 
                    onEdit={() => handleEdit(item)}
                    onPermission={() => onPermission(item)} />
                </Col>
              )
            })
          }
				</Row>
			</ContentInner>

      <AddModal
        onSubmitSuccess={onSubmitSuccess}
        id={recordData?.userId}
        visible={visible}
        onCancel={handleCancel} />
    </ContentWrapper>
  )
}

export default LevelMedalList
