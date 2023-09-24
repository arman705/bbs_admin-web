import React, { useContext, useState } from 'react';

import { Layout, Menu, Row, Col, Avatar, Dropdown } from 'antd';
import { useRouteMatch, withRouter } from 'react-router-dom';
import { PageWrapper, ContentWrapper } from '../styled';
import { Color, ThemeContext } from '../../theme';
import styled, { css } from 'styled-components';
import { BarsOutlined, BellFilled, DownOutlined } from '@ant-design/icons';
import SiteMenus from '../../components/SiteMenus';
import avatar from '../../assets/images/avatar.png';
import { GlobalContext } from '../../utils/global';
import { logout } from '../../api/login';
import Routes from '../Routes';
import { setItem } from '../../utils/local';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;


const Title = styled.h1`
	height: 64px;
	font-size: 20px;
	line-height: 64px;
	text-align: center;
 	${(props: { [key: string]: Color }) => css`
		color: ${props.color};
	` }
	${(props: { [key: string]: Color }) => css`
		background: ${props.bg};
	` } 
	${(props) => {
		return (props && props.collapsed) ? css`
			font-size: 13px;
		`: ''
	}}
`;

export default withRouter(function Dashboard({ history }) {

	const { theme } = useContext(ThemeContext);
	const { global, updateGlobal } = useContext(GlobalContext);
	const [ menuWidth, setMenuWidth ] = useState(200);

	const toggleCollapsed = () => {
		const collapsed = global.collapsed
		updateGlobal({
			collapsed: !collapsed,
		} as any);
		setMenuWidth(collapsed ? 200 : 80)
	}

	const { path, url } = useRouteMatch();

	const logoutAction = () => {
		// logout().finally(() => {
			setItem('user-token', '');
			history.replace('/')
		// })
	}

	const userMenu = <Menu>
		<Menu.Item>
			{/* <Link to="/profile">个人信息</Link> */}
		</Menu.Item>
		<Menu.Item onClick={logoutAction}>
			<a>登出</a>
		</Menu.Item>
	</Menu>

	return <PageWrapper>
		<Layout className="dashboard-layout">
			<Sider
				style={{
					background: theme.colors.text1,
					overflow: 'auto',
					height: '100vh',
					position: 'fixed',
					left: 0,
					top: 0,
					bottom: 0
				}}
				collapsed={global.collapsed}
			>
				<Title collapsed={global.collapsed ? 'c' : ''} bg={theme.colors.bg1} color={theme.colors.text1}> BBS 系统</Title>
				<SiteMenus></SiteMenus>
			</Sider>

			<Content>
				<Layout style={{ marginLeft: menuWidth, transition: 'margin-left 0.2s' }} className="dashboard-content">
					<Header style={{ background: theme.colors.text1 }}>
						<Row justify="space-between">
							<Col span={1}><BarsOutlined onClick={toggleCollapsed} /></Col>
							<Col span={4} style={{ textAlign: 'center' }}>
								{/* <BellFilled style={{ color: theme.colors.bg1, marginRight: '14px' }} /> */}
								<Avatar size="small" src={avatar} style={{ marginRight: '7px' }}></Avatar>
								<Dropdown overlay={userMenu}>
									<a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
										<DownOutlined />
									</a>
								</Dropdown>
							</Col>
						</Row>
					</Header>

					<Content style={{ background: theme.colors.bg5 }}>
						<ContentWrapper>
							<Routes path={path} />
						</ContentWrapper>
					</Content>
				</Layout>
			</Content>
		</Layout>
	</PageWrapper>
})