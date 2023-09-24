import React, {useEffect, useState} from 'react';
import Thumbnail from '../../../components/Thumbnail';
import { ContentWrapper, ContentInner } from '../../../components/Themeable';
import { Typography, Button, Form, Modal, message } from 'antd';
import Datatable from "../../../components/Datatable";
import { levelConfigList, levelConfigRemove } from '../../../api/rankmedal'
import AddLevelModal from './components/AddLevelModal';
import Permission from '../../../components/Permission';

const { Title } = Typography;

interface ModalProps {
  visible?: boolean;
  recordData?: any;
  type?: String;
}

const Report: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState([])
  const [modalProps, setModalProps] = useState<ModalProps>({
    visible: false,
    recordData: null,
    type: 'add'
  })
  const [searchInfo, setSearchInfo] = useState({
		offset: 0,
		limit: 10,
	})
  const [total, setTotal] = useState(0)
  const colums = [
    {
      title: '等级ID',
      dataIndex: 'id',
      align: 'center'
    },
    {
      title: 'VIP等级',
      dataIndex: 'level',
      align: 'center'
    },
    {
      title: '奖励虎头币',
      dataIndex: 'rewardAmount',
      align: 'center'
    },
    {
      title: '下一级所需虎头币',
      dataIndex: 'needAmount',
      align: 'center'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      render: text => text || '_'
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      align: 'center',
      render: text => text || '_'
    },
    {
      title: '操作',
      dataIndex: 'op',
      align: 'center',
      render (text: string, record: any) {
        return (
          <>
            <Permission perms="novel:levelConfig:edit">
              <Button type="link" onClick={() => onEditor(record)}>编辑</Button>
            </Permission>
            <Permission perms="novel:levelConfig:remove">
              <Button type="link" onClick={() => onDelete(record)}>删除</Button>
            </Permission>
          </>
        )
      }
    }
  ]
  const pagination = {
		showSizeChanger: true,
		showQickJumper: false,
		showTotal: () => `共${ total }条`,
		current: (searchInfo.offset / searchInfo.limit) + 1,
		pageSize: searchInfo.limit,
		total: total,
		onChange: ( current: number, size: number ) => setSearchInfo((pre) => ({ ...pre, offset: (current - 1) * size, limit: size }))
	};

  function fetchTableData (params: any) {
    setLoading(true)
    levelConfigList(params).then((res: any) => {
      if (res.code === 200) {
        setTotal(res.data.total)
        setTableData(res.data.rows)
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  function onSubmitSuccess () {
    setModalProps(pre => ({...pre, visible: false}))
    setSearchInfo(pre => ({...pre}))
  }
  function onCancel () {
    setModalProps({ visible: false })
  }
  function onEditor (recordData: any) {
    setModalProps({ visible: true, recordData, type: 'edit' })
  }
  function onAdd () {
    setModalProps({ visible: true, recordData: null, type: 'add' })
  }
  function onDelete (record) {
    Modal.confirm({
      title: '提示',
      content: '确定要删除吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await levelConfigRemove({id: record.id })
          if (res.code === 200) {
            message.success('删除成功')
            setSearchInfo(pre => ({ ...pre }))
          } else {
            message.error(res.msg)
          }
        } catch (err) {
          console.log(err)
        }
      }
    });

  }

  useEffect(() => {
    fetchTableData(searchInfo)
  }, [searchInfo])
  return (
    <>
      <ContentWrapper>
        <Thumbnail></Thumbnail>
        <ContentInner>
          <Title level={ 5 }>论坛等级设置</Title>
          <Form
            layout="inline"
            initialValues={{
              official: 0
            }}>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
              <Form.Item>
                <Permission perms="novel:levelConfig:add">
                  <Button type="primary" onClick={onAdd}>新增</Button>
                </Permission>
              </Form.Item>
            </div>
          </Form>
          <Datatable
            title=""
            loading={loading}
            columns={colums}
            dataSource={tableData}
            pagination={pagination} />
        </ContentInner>
      </ContentWrapper>
      <AddLevelModal
        type={modalProps.type}
        visible={modalProps.visible}
        data={modalProps.recordData}
        onSubmitSuccess={onSubmitSuccess}
        onCancel={onCancel} />
    </>
  )
};

export default Report;