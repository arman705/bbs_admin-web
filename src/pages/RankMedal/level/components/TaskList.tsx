import React, {useEffect, useState} from 'react';
import { ContentInner } from '../../../../components/Themeable';
import { Typography, Image, InputNumber, Switch } from 'antd';
import Datatable from "../../../../components/Datatable";
import AddTaskModal from './AddTaskModal';
import { getTaskList } from '../../../../api/task'

const { Title } = Typography;

interface ModalProps {
  visible?: boolean;
  recordData?: any;
  title?: string;
}

interface TaskListProps {
  title: string;
  type: number;
  taskType: any[];
}

const TaskList: React.FC<TaskListProps> = (props) => {
  const { title, type, taskType } = props
  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState([])
  const [searchInfo, setSearchInfo] = useState({
		offset: 0,
		limit: 10,
    type: 1
	})
  const [total, setTotal] = useState(0)
  const [modalProps, setModalProps] = useState<ModalProps>({
    visible: false,
    recordData: null
  })
  const columns = [
    {
      title: '排序',
      dataIndex: 'id',
      align: 'center',
      width: 80,
      render: (text, record, index) => {
        return index + 1
      }
    },
    {
      title: '任务图标',
      dataIndex: 'icon',
      align: 'center',
      width: 100,
      render: text => {
        return text ? <Image src={text} style={{ width: 80, height: 80, objectFit: 'cover' }} /> : '-'
      }
    },
    { title: '任务名称', dataIndex: 'showName', align: 'center', width: 100 },
    { title: '任务编码', dataIndex: 'actionName', align: 'center', width: 100 },
    { title: '任务介绍', dataIndex: 'actionDescription', align: 'center', width: 100 },
    { title: '金币奖励', dataIndex: 'amount', align: 'center', width: 100 },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      width: 100,
      render: (text, record) => {
        return (
          <InputNumber
            disabled
            value={text}
          />
        );
      }
    },
    {
      title: '状态',
      dataIndex: 'isEnable',
      align: 'center',
      width: 100,
      render: (text, record) => {
        return (
          <Switch
            disabled
            checked={text === 0}
          />
        )
      }
    }
  ]
  const pagination = {
    showSizeChanger: true,
    showQickJumper: false,
    showTotal: () => `共${total}条`,
    defaultPageSize: 10,
    current: (searchInfo.offset / searchInfo.limit) + 1,
    pageSize: searchInfo.limit,
    total: total,
    onChange: (current: number, size: number) => {
      setSearchInfo(pre => ({
        ...pre,
        offset: (current - 1) * size,
        limit: size
      }))
    }
  }
  function fetchTableData (searchInfo: any) {
    setLoading(true)
    getTaskList({ ...searchInfo, type, sort: 'create_at', order: 'desc' }).then((res: any) => {
      if (res.code === 200) {
        setTotal(res.data.total)
        setTableData(res.data.rows)
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  function onCancel () {
    setModalProps({ visible: false })
  }
  function onSubmitSuccess () {
    onCancel()
    setSearchInfo(pre => ({...pre}))
  }
  
  useEffect(() => {
    fetchTableData(searchInfo)
  }, [searchInfo])

  return (
    <ContentInner style={{ marginBottom: '20px' }}>
      <Title level={ 5 }>{title}</Title>

      {/* <Button
        icon={<PlusOutlined />}
        type="primary"
        onClick={onAdd}>
        新增{title}
      </Button> */}

      <Datatable
        title=""
        loading={loading}
        columns={columns}
        dataSource={tableData}
        pagination={pagination} />

        <AddTaskModal {...modalProps} type={type} taskType={taskType} onSubmitSuccess={onSubmitSuccess} onCancel={onCancel}/>
    </ContentInner>
  )
};

export default TaskList;