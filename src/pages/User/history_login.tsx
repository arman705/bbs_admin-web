import React, { useState, useEffect } from 'react';

// api
import { user } from '../../api';

// Components
import Thumbnail from '../../components/Thumbnail';
import Datatable from '../../components/Datatable';
import { Typography, Form, Input, Button, message } from 'antd';
import { ContentWrapper, ContentInner } from '../../components/Themeable';
const {Title} = Typography;


const LoginHistory: React.FC = () => {

	const [searchForm] = Form.useForm();
	const [ pars, setPars ] = useState<any>({ userId: '', keyword: '' });
	const [ logList, setLogList ] = useState<any>([]);
	const [ page, setPage ] = useState({ pageNum: 1, pageSize: 10 });
	const [ total, setTotal ] = useState<string|number>(0);

	/* -------------- API start -------------- */

	// 获取用户登录记录
	useEffect( () => {
		api_loginLog()
	}, [ pars.userId, pars.keyword ] );
	const api_loginLog = () => {
		let params = { ...pars, ...page };
		user.loginLog( params ).then( ( res: any ) => {
			setTotal( res.total );
			setPage( { pageNum: res.pageNum, pageSize: res.pageSize } );
			let list = res.list === null ? [] : res.list
			setLogList( () => [ ...list ] );
		} );
	};

	/* -------------- API end -------------- */

	
	/* -------------- Methods start -------------- */
	// 表单提交
	const onFinish = ( values: any ) => {
		let { username, id } = values;
		let params = {};
		if ( id || username ) {
			params = { userId: id ? id : '', keyword: username ? username : '' };
		}else{
			params = { userId: '', keyword: '' };
		};
		setPars( () => ({ ...params }) );
	};

	/* -------------- Methods end -------------- */




	/* -------------- Options start -------------- */

	// table 配置项
	const columns = [
		{ title: '记录ID', dataIndex: 'id' }, 
		{ title: '用户', dataIndex: 'nickname' }, 
		{ title: '用户ID', dataIndex: 'userId' }, 
		{ title: 'IP地址', dataIndex: 'ipaddr' }, 
		{ title: '登录设备/平台', dataIndex: 'os' }, 
		{ title: '浏览器', dataIndex: 'browser' }, 
		{ title: '观看时间', dataIndex: 'createAt' }
	];

	/* -------------- Options end -------------- */

	return (
	<ContentWrapper>
		<Thumbnail></Thumbnail>
		<ContentInner>
			<Title level={5}>登录记录</Title>
			<Form layout="inline" form={searchForm}  onFinish={onFinish}>
				<Form.Item name="username" label="查找用户"><Input placeholder="输入用户名称/电话/邮箱" /></Form.Item>
				<Form.Item name="id" label="查找用户ID"><Input placeholder="输入用户ID" /></Form.Item>
				<Form.Item ><Button type="primary" htmlType="submit">查询</Button></Form.Item>
				<Form.Item >
					<Button type="primary" danger onClick={ () => { searchForm.setFieldsValue( { id: '', username: '' } ) } }>
						清空
					</Button>
				</Form.Item>
			</Form>
			<Datatable title={''} columns={columns} dataSource={logList}></Datatable>
		</ContentInner>
	</ContentWrapper>
	)
};

export default LoginHistory;