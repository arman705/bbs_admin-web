import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import Thumbnail from '../../components/Thumbnail';
import { ContentWrapper, ContentInner } from '../../components/Themeable';
import { Typography, Button, message, Modal } from 'antd';
import Datatable from "../../components/Datatable";
import { sysVersionList, deleteVersion } from '../../api/backstage'
import { PlusOutlined } from '@ant-design/icons';
import AddVersionModal from './components/AddVersionModal';
import Permission from '../../components/Permission';

const { Title } = Typography;

interface ModalProps {
  visible?: boolean;
  recordData?: any;
  title?: string;
}

const Report: React.FC<any> = ({ history }) => {
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

  useEffect(() => {
    getVersionList();
  }, [searchInfo])

  const getVersionList = async () => {
    setLoading(true);
    const list = await sysVersionList({ ...searchInfo, offset: searchInfo.offset * 10 });
    setTableData(list.rows || []);
    setTotal(list.total || 0)
    setLoading(false);
  }
  const goDetail = (id: string) => {
    history.push(`/dashboard/manager/detail/${id}`)
  }
  const colums = [
    {
      title: '版本号',
      dataIndex: 'id',
      align: 'center',
      render: (text: string, record: any) => (
        <div style={{ color: '#1890ff', cursor: 'pointer' }} onClick={goDetail.bind(null, record.id)}>{text}</div>
      )
    },
    {
      title: '平台/设备',
      dataIndex: 'name',
      align: 'center'
    },
    {
      title: '详情',
      dataIndex: 'description',
      align: 'center',
      render: (text: string) => (<div dangerouslySetInnerHTML={{ __html: text }}></div>)
    },
    {
      title: '更新时间',
      dataIndex: 'updateAt',
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'op',
      align: 'center',
      render(text: string, record: any) {
        return (
          <>
            <Permission perms="sys:version:edit">
              <Button type="link" onClick={() => onEditor(record)}>编辑</Button>
            </Permission>
            <Permission perms="sys:version:remove">
              <Button type="link" onClick={() => onDel(record.id)}>删除</Button>
            </Permission>
          </>
        )
      }
    }
  ]
  const pagination = {
    showSizeChanger: true,
    showQickJumper: false,
    showTotal: () => `共${total}条`,
    current: searchInfo.offset + 1,
    pageSize: searchInfo.limit,
    total: total,
    onChange: (current: number, size: number) => setSearchInfo((pre) => ({ ...pre, offset: current - 1, limit: size }))
  };

  function onSubmitSuccess() {
    setSearchInfo(pre => ({ ...pre }))
  }
  function onCancel() {
    setModalProps((pre) => {
      const newProps = { ...pre };
      newProps.visible = false;
      return newProps;
    })
  }
  function onAdd() {
    setModalProps({ visible: true, recordData: null, title: '新增更新' })
  }
  function onEditor(recordData: any) {
    setModalProps({ visible: true, recordData, title: '编辑头像框' })
  }
  function onDel(id: number) {
    Modal.confirm({
      title: '提示',
      content: '确定要删除吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        deleteVersion(id).then((res: any) => {
          if (res.code === 200) {
            message.success('删除成功')
            setSearchInfo(pre => ({...pre}))
          } else {
            message.error(res.msg)
          }
        }).catch(() => {
          message.error('删除失败')
        })
      }
    });
  }
  return (
    <>
      <ContentWrapper>
        <Thumbnail></Thumbnail>
        <ContentInner>
          <Title level={5}>版本更新记录</Title>
          <Permission perms="sys:version:add">
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={onAdd}>
              新增更新
            </Button>
          </Permission>
          <Datatable
            title=""
            loading={loading}
            columns={colums}
            dataSource={tableData}
            pagination={pagination} />
        </ContentInner>
      </ContentWrapper>
      <AddVersionModal {...modalProps} onSubmitSuccess={onSubmitSuccess} onCancel={onCancel} />
    </>
  )
};

export default withRouter(Report);