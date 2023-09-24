import React, { useEffect, useState } from 'react';
import { sysUserList, sysLogList } from '../../api/backstage'
import { Typography, Form, Radio, DatePicker } from 'antd';
import Thumbnail from "../../components/Thumbnail";
import { ContentInner, ContentWrapper } from '../../components/Themeable';
import Styled from 'styled-components'
import Datatable from "../../components/Datatable";

const CustomForm = Styled(Form)`
  flex-direction: column;

  .ant-form-item {
    padding: 20px 0;
    border-bottom: 1px dashed #eee;
  }
`

const Report: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [memberData, setMemberData] = useState<any>([])
  const [tableData, setTableData] = useState<any>([])
  const [total, setTotal] = useState(0)
  const [searchInfo, setSearchInfo] = useState({
    offset: 0,
    limit: 10,
    type: 0,
  })

  useEffect(() => {
    getLogList();
  }, [JSON.stringify(searchInfo)])

  const getLogList = async () => {
    setLoading(true);
    const list = await sysLogList({ ...searchInfo, offset: searchInfo.offset * searchInfo.limit });
    setTableData(list.rows || []);
    setTotal(list.total || 0)
    setLoading(false);
  }


  const pagination = {
    showSizeChanger: true,
    showQickJumper: false,
    showTotal: () => `共${total}条`,
    current: searchInfo.offset + 1,
    pageSize: searchInfo.limit,
    total: total,
    onChange: (current: number, size: number) => setSearchInfo((pre) => ({ ...pre, offset: current - 1, limit: size }))
  };
  const colums = [
    {
      title: '记录ID',
      dataIndex: 'id',
      align: 'center'
    },
    {
      title: '成员/工号',
      dataIndex: 'username',
      align: 'center'
    },
    {
      title: '操作内容',
      dataIndex: 'operation',
      align: 'center'
    },
    {
      title: '操作时间',
      dataIndex: 'gmtCreate',
      align: 'center'
    }
  ]

  useEffect(() => {
    fetchMemberData()
  }, [])

  function fetchMemberData() {
    sysUserList().then((res: any) => {
      if (res.code === 200) {
        const data = [{ username: '全部成员', userId: '' }, ...(res.data || [])]
        setMemberData(data)
      }
    })
  }
  const changeSearchInfo = (obj: any) => {
    setSearchInfo((pre) => {
      const newSearchInfo = { ...pre };
      for (let key in obj) {
        newSearchInfo[key] = obj[key];

      }
      return newSearchInfo;
    })
  }

  const dateChange = (val: any) => {
    if (val) {
      const startTime = val[0].format('YYYY-MM-DD');
      const endTime = val[1].format('YYYY-MM-DD');
      changeSearchInfo({ startTime, endTime });
    } else {
      changeSearchInfo({ startTime: undefined, endTime: undefined });

    }
    console.log('val', val);
  }

  return (
    <ContentWrapper>
      <Thumbnail />
      <ContentInner>
        <Typography.Title level={5}>操作日志</Typography.Title>
        <CustomForm layout="inline">
          <Form.Item label="所有成员">
            <Radio.Group
              buttonStyle="solid"
              defaultValue={'全部成员'}
              onChange={(e) => {
                const username = e.target.value
                changeSearchInfo({ username: username === '全部成员' ? '' : username })
              }}>
              {memberData.map((item: any) => {
                return <Radio.Button value={item.username}>{item.username}</Radio.Button>
              })}
            </Radio.Group>
          </Form.Item>
          <Form.Item label="操作日期">
            <DatePicker.RangePicker onChange={dateChange} />
          </Form.Item>
          <Form.Item label="操作类型">
            <Radio.Group buttonStyle="solid" defaultValue={0} onChange={(e) => changeSearchInfo({ type: e.target.value })}>
              <Radio.Button value={0}>其他</Radio.Button>
              <Radio.Button value={1}>审核帖子</Radio.Button>
              <Radio.Button value={2}>封禁/解锁用户</Radio.Button>
              <Radio.Button value={3}>评论</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </CustomForm>
      </ContentInner>

      <ContentInner style={{ marginTop: '20px' }}>
        <Typography.Title level={5}>日志记录</Typography.Title>
        <Datatable
          title=""
          loading={loading}
          columns={colums}
          dataSource={tableData}
          pagination={pagination} />
      </ContentInner>
    </ContentWrapper>
  )
};

export default Report;