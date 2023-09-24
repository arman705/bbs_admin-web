import React, { useState, useEffect } from 'react';

// api
import { user } from '../../api';

// Components
import Thumbnail from '../../components/Thumbnail';
import Datatable from '../../components/Datatable';
import { Typography, Form, Input, Button, message } from 'antd';
import { ContentWrapper, ContentInner } from '../../components/Themeable';
const {Title} = Typography;




const WatchHistory: React.FC = () => {

	const [searchForm] = Form.useForm();

	const [ pars, setPars ] = useState<any>({ userId: '', keyword: '' });
	const [ logList, setLogList ] = useState<any>([]);
	const [ page, setPage ] = useState({ pageNum: 1, pageSize: 10 });
	const [ total, setTotal ] = useState<string|number>(0);

	const columns = [
		{ title: '记录ID', dataIndex: 'id' }, 
		{ title: '用户', dataIndex: 'nickname' }, 
		{ title: '用户ID', dataIndex: 'userId' }, 
		{ title: '所属板块', dataIndex: 'articleName' }, 
		{ title: '帖子标题', dataIndex: 'postsTitle' }, 
		{ title: '观看时间', dataIndex: 'createAt' }
	];

	const api_viewLog = () => {
		let params = { ...pars, ...page };
		user.viewLog( params ).then( ( res: any ) => {
			console.log( "res-聊天", res );
			setTotal( res.total );
			setPage( { pageNum: res.pageNum, pageSize: res.pageSize } );
			let _list = res.list === null ? [] : res.list;
			setLogList( () => [ ..._list ] );
			// searchForm.setFieldsValue( { } )
		} )
	}

	useEffect( () => {
		api_viewLog()
	}, [ pars.userId, pars.keyword ] );

	const onFinish = ( values: any ) => {
		let { username, id } = values;
		let params = {};
		if ( id || username ) {
			params = { userId: id ? id : '', keyword: username ? username : '' };
		}else{
			params = { userId: '', keyword: '' };
		};
		setPars( () => ({ ...params }) );
	}

	return <ContentWrapper>
		<Thumbnail></Thumbnail>
		<ContentInner>
			<Title level={5}>观看记录</Title>
			<Form layout="inline" form={searchForm} onFinish={onFinish}>
				<Form.Item name="username" label="查找用户">
					<Input placeholder="输入用户名称/电话/邮箱" ></Input>
				</Form.Item>
				<Form.Item name="id" label="查找用户ID">
					<Input placeholder="输入用户ID"></Input>
				</Form.Item>
				<Form.Item >
					<Button type="primary" htmlType="submit">
						查询
					</Button>
				</Form.Item>
				<Form.Item >
					<Button type="primary" danger onClick={ () => { searchForm.setFieldsValue( { id: '', username: '' } ) } }>
						清空
					</Button>
				</Form.Item>
			</Form>
			<Datatable title={''} columns={columns} dataSource={logList}></Datatable>
		</ContentInner>
	</ContentWrapper>
};

export default WatchHistory;