import React, {useEffect, useState} from 'react';
import Thumbnail from '../../../components/Thumbnail';
import { ContentWrapper, ContentInner } from '../../../components/Themeable';
import { Typography, Button, Image, Switch, message, Modal } from 'antd';
import Datatable from "../../../components/Datatable";
import { avatarFrameList, avatarFrameUpdate, avatarFrameRemove } from '../../../api/rankmedal'
import { PlusOutlined } from '@ant-design/icons';
import AddFrameModal from './components/AddFrameModal';

const { Title } = Typography;

interface ModalProps {
  visible?: boolean;
  recordData?: any;
  title?: string;
}

const Report: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState([])
  const [modalProps, setModalProps] = useState<ModalProps>({
    visible: false,
    recordData: null
  })
  const [searchInfo, setSearchInfo] = useState({
		offset: 0,
		limit: 10,
	})
  const [total, setTotal] = useState(0)
  const colums = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center'
    },
    {
      title: '头像框名称',
      dataIndex: 'name',
      align: 'center'
    },
    {
      title: '头像框',
      dataIndex: 'imgRealUrl',
      align: 'center',
      render (text: string) {
        return <Image src={text} width={50} height={50} />
      }
    },
    {
      title: '状态', 
      dataIndex: 'status', 
      align: 'center',
      render (text: string, record: any) {
        return <Switch size="small" checked={record.status === 1} onChange={ () => onUpdate(record) }/>
      }
    },
    {
      title: '操作',
      dataIndex: 'op',
      align: 'center',
      render (text: string, record: any) {
        return (
          <>
            <Button type="link" onClick={() => onEditor(record)}>编辑</Button>
            <Button type="link" onClick={() => onDel(record.id)}>删除</Button>
          </>
        )
      }
    }
  ]
  const pagination = {
		showSizeChanger: true,
		showQickJumper: false,
		showTotal: () => `共${ total }条`,
		current: searchInfo.offset + 1,
		pageSize: searchInfo.limit,
		total: total,
		onChange: ( current: number, size: number ) => setSearchInfo((pre) => ({ ...pre, offset: current - 1, limit: size }))
	};

  function fetchTableData (params: any) {
    setLoading(true)
    avatarFrameList(params).then((res: any) => {
      if (res.code === 200) {
        setTotal(res.data.total)
        setTableData(res.data.rows)
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  function onSubmitSuccess () {
    setSearchInfo(pre => ({...pre}))
  }
  function onCancel () {
    setModalProps({ visible: false })
  }
  function onAdd () {
    setModalProps({ visible: true, recordData: null, title: '新增头像框' })
  }
  function onEditor (recordData: any) {
    setModalProps({ visible: true, recordData, title: '编辑头像框' })
  }
  function onDel (id: number) {
    Modal.confirm({
      title: '提示',
      content: '确定要删除吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        avatarFrameRemove(id).then(() => {
          message.success('删除成功')
          setSearchInfo(pre => ({...pre}))
        }).catch(() => {
          message.success('删除失败，请稍候再试')
        })
      }
    });
  }
  function onUpdate (recordData: any) {
    setLoading(true)
    const fd: any = new FormData()
    Object.entries({
      ...recordData,
      status: recordData.status === 0 ? 1 : 0
    }).forEach(([key, value]) => {
      fd.append(key, value as any)
    })
    avatarFrameUpdate(fd).then((res: any) => {
      if (res.code === 200) {
        message.success('更新成功')
        setSearchInfo(pre => ({...pre}))
      } else {
        message.error('更新失败，请稍候再试')
      }
    }).finally(() => {
      setLoading(false)
    })
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
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={onAdd}>
            新增头像框
          </Button>
          <Datatable
            title=""
            loading={loading}
            columns={colums}
            dataSource={tableData}
            pagination={pagination} />
        </ContentInner>
      </ContentWrapper>
      <AddFrameModal {...modalProps} onSubmitSuccess={onSubmitSuccess} onCancel={onCancel} />
    </>
  )
};

export default Report;