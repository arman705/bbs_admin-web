import React, { useState, useEffect } from 'react';

// Api
import { helpfeedback } from '../../api';

// Components
import ReactQuill from 'react-quill';
import { PlusOutlined } from '@ant-design/icons';
import { SortWrap, UserEvaluate } from './styles';
import Thumbnail from "../../components/Thumbnail";
import Datatable from "../../components/Datatable";
import { ContentInner, ContentWrapper } from '../../components/Themeable';
import { Typography, Button, Modal, Row, Col, Form, Input, Switch, Popconfirm, message } from 'antd';
import Permission from '../../components/Permission'
import { hasPermission } from '../../utils/utils';

interface Iid {
  id: string | number;
};

interface Idata {
  title: string;
  solution: string;
  sort: string | number;
  status: string | number;
};

const Report: React.FC = () => {

  const [helpList, setHelpList] = useState<any[]>([]);              // 查询帮助中心列表
  const [helpIndex, setHeplIndex] = useState<number>(0);            // 列表索引
  const [newAddStatus, setNewAddStatus] = useState<boolean>(false); // Modal 显示隐藏
  const [page, setPage] = useState({ offset: 0, limit: 10 });       // 翻页
  const [total, setTotal] = useState<number>(1);                    // 总条数
  const [quillValue, setQuillValue] = useState<string>('');           // 富文本 value
  const [sortValue, setSortValue] = useState<string | number>('0');   // 排序
  const [titleVal, setTitleVal] = useState<string>('');             // 标题
  const [getTitle, setGetTitle] = useState<string>('');               // 查询标题

  const [isAddOrEditType, setIsAddOrEditType] = useState<string>('edit');

  /* ---------------- Api start ---------------- */

  // 查询帮助中心列表
  useEffect(() => {
    api_helpList();
  }, [page]);
  const api_helpList = async () => {
    await helpfeedback.helpList({ ...page, title: getTitle }).then((res: { total: number, rows: any[] }) => {
      console.log("liebiao", res)
      let _res = res ? res : { total: 1, rows: [] };
      setHelpList(() => [..._res.rows]);
      setTotal(_res.total);
    });
  };

  // 新增解决方案
  const api_helpSave = async (data: Idata) => {
    await helpfeedback.helpSave(data).then(res => {
      initData();
    });
  };

  // 编辑解决方案
  const api_helpUpdate = async (data: Idata & Iid) => {
    await helpfeedback.helpUpdate(data).then(res => {
      initData();
    });
  };

  // 删除解决方案
  const api_helpRemove = async (id: string | number) => {
    await helpfeedback.helpRemove(id).then(res => {
      initData();
    });
  };

  /* ---------------- Api end ---------------- */



  /* ---------------- Methods start ---------------- */
  // 查找方案
  const queryList = () => api_helpList();

  // 富文本
  const handleReactQuillChange = (value: any) => setQuillValue(value);

  // 获取列表值
  const getListValue = (key: string, index: number) => helpList[index] ? helpList[index][key] : '';

  // 接口请求成功初始化
  const initData = (send?: string) => {
    setHeplIndex(0);
    setQuillValue('');
    setTitleVal('');
    setSortValue('0');
    setIsAddOrEditType('');
    setGetTitle('');
    !send && api_helpList();
  };

  // switch 修改状态
  const handleChangeSwitch = (status: number, index: number, checked: boolean) => {
    let list: any[] = helpList.slice();
    list[index]["status"] = Number(checked);
    setHelpList(() => [...list]);
    let { id, title, sort, solution } = helpList[index];
    api_helpUpdate({ id, title, sort, solution, status: Number(checked) });
  };

  // 列表编辑 & 删除
  const listEditOrDelete = (type: string, index: number) => {
    setHeplIndex(index);
    if (type === 'edit') {
      setNewAddStatus(true);
      setSortValue(getListValue('sort', index));
      setIsAddOrEditType(type);
      setTitleVal(getListValue('title', index))
      setQuillValue(getListValue('solution', index));
    } else {
      api_helpRemove(getListValue('id', index));
    };
  };

  // 新增解决办法
  const addList = (type: string) => {
    setNewAddStatus(true);
    setIsAddOrEditType(type);
  };

  // 修改 Modal 排序
  const handleChangeSortValue = (value: string) => {
    if (value === '') {
      message.warning('排序值不能为空!');
      setSortValue(value);
    } else if (value && parseInt(value) == 0 || parseInt(value) == 1) {
      setSortValue(`${parseInt(value)}`);
    } else {
      message.warning('排序值只能是0或1');
      setSortValue('');
    };
  };

  // Modal 确定
  const modalConfrimOrCancel = (type: string) => {
    if (type === 'confrim') {
      let _id = { id: getListValue('id', helpIndex) };
      let data = { title: titleVal, solution: quillValue, sort: sortValue };
      if (!titleVal && !quillValue) {
        message.warning('内容不能为空!');
        return;
      };
      if (isAddOrEditType === 'edit') {
        api_helpUpdate({ ..._id, ...data, status: getListValue('status', helpIndex) });
      } else {
        api_helpSave({ ...data, status: 0 });
      };
    } else {
      initData('send');
    };
    setNewAddStatus(false);
  };

  /* ---------------- Methods end ---------------- */


  /* ---------------- Options start ---------------- */
  // 翻页配置项
  const pagination = {
    showSizeChanger: true,
    showQickJumper: false,
    showTotal: () => `共${total}条`,
    defaultPageSize: 5,
    current: page.offset + 1,
    pageSize: page.limit,
    total: total,
    onChange: (current: number, size: number) => setPage(() => ({ offset: (current - 1)*size, limit: size })),
    onShowSizeChange: (current: any, pageSize: any) => true
  };

  // Table 配置项
  const colums = [
    { title: '方案ID', align: 'center', dataIndex: 'id' },
    { title: '标题', align: 'center', dataIndex: 'title' },
    {
      title: '解决方案',
      align: 'center',
      dataIndex: 'solution',
      render(text: any, record: any, index: number) {
        return <div dangerouslySetInnerHTML={{ __html: record.solution ? record.solution : '' }}></div>
      }
    },
    {
      title: '用户评价',
      align: 'center',
      render(text: any, record: any, index: number) {
        return (
          <SortWrap>
            <UserEvaluate cor={'#c5e7d3'} bg={'#e4f8ed'}>有用 | {record.usefulNum === null ? 'NoData' : record.usefulNum}</UserEvaluate>
            <UserEvaluate cor={'#f5bcc9'} bg={'#fbe3e9'}>没用 | {record.uselessNum === null ? 'NoData' : record.uselessNum}</UserEvaluate>
          </SortWrap>
        )
      }
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render(text: any, record: any, index: number) {
        return <Switch disabled={!hasPermission('novel:help:edit')} checked={record.status} onChange={(checked: boolean) => handleChangeSwitch(record.status, index, checked)}></Switch>
      }
    },
    {
      title: '操作',
      align: 'center',
      render(text: any, record: any, index: number) {
        return (
          <Row justify='space-between'>
            <Permission perms="novel:help:edit">
              <Col style={{ color: 'blue', cursor: 'pointer' }} onClick={() => listEditOrDelete('edit', index)}>编辑</Col>
            </Permission>
            <Permission perms="novel:help:remove">
              <Col style={{ color: 'red', cursor: 'pointer' }}>
                <Popconfirm okText="确认" cancelText="取消" onConfirm={() => listEditOrDelete('delete', index)} title="确认删除当前方案？">
                  删除
                </Popconfirm>
              </Col>
            </Permission>
          </Row>
        )
      }
    }
  ];

  /* ---------------- Options end ---------------- */

  return (
    <ContentWrapper>
      <Thumbnail />
      <ContentInner>
        <Typography.Title level={5}>帮助中心</Typography.Title>
        <Row justify='space-between'>
          <Col span={15}>
            <Form layout="inline">
              <Form.Item label="查找方案" >
                <Input value={getTitle} onChange={(ev: any) => setGetTitle(ev.target.value)} placeholder='请输入方案标题' />
              </Form.Item>
              <Form.Item>
                <Button type='primary' onClick={queryList}>确定</Button>
              </Form.Item>
            </Form>
          </Col>
          <Col>
            <Permission perms="novel:help:add">
              <Button type='primary' icon={<PlusOutlined />} onClick={() => addList('add')}>新增解决方法</Button>
            </Permission>
          </Col>
        </Row>
        <Datatable bordered title="" columns={colums} dataSource={helpList} pagination={pagination} />
      </ContentInner>

      {/* 新增方案 & 编辑方案 开始 */}
      <Modal title={isAddOrEditType === 'edit' ? "编辑方案" : "新增方案"} visible={newAddStatus} okText="确定" cancelText="取消" onOk={() => modalConfrimOrCancel('confrim')} onCancel={() => modalConfrimOrCancel('cancel')}>
        <Form>
          <Form.Item label="排序" validateStatus="error" help="排序值只能是 0 或 1" required>
            <Input type="number" disabled={isAddOrEditType === 'edit' ? false : true} step="1" min="0" max="1" allowClear value={sortValue} onChange={(ev: any) => handleChangeSortValue(ev.target.value)} placeholder='请输入标题方案' />
          </Form.Item>
          <Form.Item label="标题" required>
            <Input value={titleVal} onChange={(ev: any) => setTitleVal(ev.target.value)} placeholder='请输入标题方案' />
          </Form.Item>
          <Form.Item label="解决方案" required>
            <ReactQuill style={{ height: '200px' }} value={quillValue} onChange={handleReactQuillChange}></ReactQuill>
          </Form.Item>
        </Form>
      </Modal>
      {/* 新增方案 & 编辑方案 开始 */}
    </ContentWrapper>
  )
};

export default Report;