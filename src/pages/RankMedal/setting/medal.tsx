import React, { useState } from 'react';
import Thumbnail from '../../../components/Thumbnail';
import { ContentWrapper, ContentInner } from '../../../components/Themeable';
import { Menu, Typography, Form, Input } from 'antd';
import Styled from 'styled-components';
import { useTheme } from '../../../theme';
import MedalList from './components/MedalList';
import LimitMedalList from './components/LimitMedalList';

const { Title } = Typography;

const HeaderWrapper = Styled.div`
  display: flex;
  padding: 0 14px;
  .ant-menu {
    flex-shrink: 0;
  }
`
const HeaderWrapperRight = Styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`

const Report: React.FC = () => {
  const { theme } = useTheme()
  const [selectedKeys, setSelectedKeys] = useState(['level'])
  const [searchValue, setSearchValue] = useState('');
  const [form] = Form.useForm();
  let list = null
  console.log('====')
  switch (selectedKeys[0]) {
    case 'level':
      list = <MedalList key={1} searchValue={searchValue} type={1} />
      break

    case 'activity':
      list = <MedalList key={2} searchValue={searchValue} type={2} />
      break

    case 'limit':
      list = <LimitMedalList key={3} searchValue={searchValue} />
      break
  }
  const selectKeyChange = (e: any) => {
    setSelectedKeys([e.key]);
    setSearchValue('');
    form.setFieldsValue({ keyword: '' })
  }
  return (
    <ContentWrapper>
      <Thumbnail></Thumbnail>
      <ContentInner style={{ padding: '27px 0 0 0' }}>
        <Title style={{ padding: '0 34px' }} level={5}>勋章设置</Title>
        <HeaderWrapper>
          <div style={{ width: 320, flexShrink: 0 }}>
            <Menu
              mode="horizontal"
              selectedKeys={selectedKeys}
              onClick={selectKeyChange}>
              <Menu.Item key="level">
                等级勋章
              </Menu.Item>
              <Menu.Item key="activity">
                活跃勋章
              </Menu.Item>
              <Menu.Item key="limit">
                限定勋章
              </Menu.Item>
            </Menu>
          </div>
          <HeaderWrapperRight>
            <Form layout="inline" form={form}>
              <Form.Item name="keyword">
                <Input.Search style={{ width: 300 }} placeholder="搜索勋章" enterButton="搜索" onSearch={setSearchValue} />
              </Form.Item>
            </Form>
          </HeaderWrapperRight>
        </HeaderWrapper>
      </ContentInner>

      <ContentInner style={{ margin: '20px', background: theme.colors.bg5, padding: '0px' }}>
        {list}
      </ContentInner>
    </ContentWrapper>
  )
};

export default Report;