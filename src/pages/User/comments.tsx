import React, {useState, useEffect } from 'react';

// api
import { user } from '../../api';

// router
import { useLocation } from 'react-router-dom';

// components
import Thumbnail from '../../components/Thumbnail';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Typography, Table, Space, Tooltip, Tabs, Row, Col, Button } from 'antd';
import { ContentWrapper, ContentInner } from '../../components/Themeable';
import Permission from '../../components/Permission';


const { Text } = Typography;
const { TabPane } = Tabs;

interface Ipage {
	pageNum: number;
	pageSize: number;
};

interface Istate {
	state?: { userId: string, name: string }  
};

export default function Comments() {
	let { state }: Istate = useLocation();
	const [ activeKey, setActiveKey ] = useState<string>('1'); 								// table activeKey	
	const [ systemList, setSystemList ] = useState<any>([]); 									// 获取用户评论列表
	const [ userId, setUserId ] = useState<string|number>(''); 								// 用户ID
	const [ nickName, setNickName ] = useState<string>('');										// 用户名
	const [ isDelete, setIsDelete ] = useState<string|number>(''); 						// 是否屏蔽（0：否，1：是）
	const [ page, setPage ] = useState<Ipage>({ pageNum: 1, pageSize: 10 }); 	// 分页
	const [ total, setTotal ] = useState<number>( 1 ); 												//总页码
	const [ selectedRows, setSelectedRows ] = useState<any>([]); 							// table 全选
	const [ rowKeys, setRowKeys ] = useState<React.Key[]>( [] );							// table 显示勾选的索引	
	const [ status, setStatus ] = useState<number>(-1);												// 标记屏蔽和恢复

	const columns = [
		{ title: '记录id', dataIndex: 'id' }, 
		{ title: '用户', dataIndex: 'userName' }, 
		{ title: '评论内容', dataIndex: 'content' }, 
		// { title: '评论图片', dataIndex: 'img',
		// 	render( text:any, record: any ) {
		// 		return record.img ? <img style={ {height: '50px'} } src={record.img} alt="" /> : 'NoImg'
		// 	},
		// }, 
		// {
		// 	title: '评论类型',
		// 	dataIndex: 'audio',
		// 	render( text: any, record: any) {
		// 		switch( record.audio ) {
		// 			case 'TEXT':
		// 				return '文本';
		// 			case 'IMG':
		// 				return '图片';
		// 			case 'AUDIO':
		// 				return '语音';
		// 			default:
		// 				return 'NoType';
		// 		}
		// 	},
		// }, 
		{ title: '发布时间', dataIndex: 'createAt' }, 
		{ title: '操作人员', dataIndex: 'operator' }, 
		{ title: <Text>操作 <Tooltip title="已屏蔽的评论将在30天后清除"><QuestionCircleOutlined /></Tooltip> </Text>,
			render(text:any, record: any) {
				return <span onClick={ () => {  api_batchBlockOrbatchRecover(  [ record.id ], record.isDelete) } } style={{ color:  record.isDelete === 0 ? 'red' : '#1890ff', cursor: 'pointer'}}>{ record.isDelete === 0 ? '屏蔽' : '恢复'}</span>
			},
		}
	];

	// api 获取用户评论列表
	useEffect( () => {
		api_getCommentList();
	}, [ isDelete, page.pageNum, page.pageSize, state ] );

	const api_getCommentList = async () => {
		let { userId, name } = !state ? { userId: '', name: '' } : state;
		let params = { isDelete, ...page, userId };
		setUserId( userId );
		setNickName( name );
		await user.commentList( params ).then( ( res: any ) => {
			let list: any[] = res ? res : [];
			setTotal( res.total );
			setPage( { pageNum: res.pageNum, pageSize: res.pageSize } );
			setSystemList( [ ...res.list ] );
		} );
	}

	const api_batchBlockOrbatchRecover = async ( data: React.Key[] | string[], type: number ) => {
		if ( type === 0 ) {
			await user.batchBlock( data ).then( res => {
				api_getCommentList();
			} );
		}else{
			await user.batchRecover( data ).then( res => {
				api_getCommentList();
			} )
		};
		setSelectedRows( () => [] );
		setRowKeys( () => [] );
		setStatus( -1 );
	}

	// table activeKey 切换
	useEffect( () => {
		setStatus( -1 );
		setSelectedRows( () => [] );
		setRowKeys( () => [] );
	}, [ activeKey ])

	const changeAtiveKey = ( tab: string ) => {
		let isDel = tab === '1' ? '' : 1
		setActiveKey( tab );
		setIsDelete( isDel );
	}

	const pagination = {
		showSizeChanger: true,
		showQickJumper: false,
		showTotal: () => `共${ total }条`,
		defaultPageSize: 10,
		current: page.pageNum,
		pageSize: page.pageSize,
		total: total,
		onChange: ( current: number, size: number | undefined ) => { console.log( current, size ); setPage( () => ({ pageNum: current, pageSize: size } as Ipage))},
		onShowSizeChange: ( current: any, pageSize: any ) => true
	}
	const rowSelection = {
		selectedRowKeys: rowKeys,
		onChange: (selectedRowKeys: React.Key[],  selectedRows: any) => {
			setSelectedRows( () => [ ...selectedRows ] );
			setRowKeys( () => [ ...selectedRowKeys ] );
			setStatus( -1 );
		},
		onSelectAll( bool: boolean ){},
	}


	useEffect( () => {
		if ( status === -1 ) { return ; };
		filterSelectData( rowKeys, selectedRows, status );
		let timer = setTimeout( () => {
			api_batchBlockOrbatchRecover( rowKeys, status )
		}, 20 );
		return () => { clearTimeout( timer ) }
	}, [ status ] );

	const filterSelectData = ( keysList: React.Key[], selectsList: [], status: number ) => {
		let _rowKeys: React.Key[] = [];
		let _selectedRows: any = [];
		for( let i = 0; i < selectsList.length; i++ ) {
			if ( selectsList[ i ][ "isDelete" ] === status ) {
				_selectedRows.push( selectsList[ i ] );
				_rowKeys.push( keysList[ i ] );
			};
		};
		setSelectedRows( () => [ ..._selectedRows ] );
		setRowKeys( () => [ ..._rowKeys ] );
	} 
	return <ContentWrapper>
		<Thumbnail/>
		<ContentInner>
			{/* <Title level={5}>用户评论管理</Title> */}
				<Row align="middle" justify='space-between'>
					<Col style={{ fontWeight: 900}}>用户资料管理</Col>
					{
						selectedRows.length > 1 ?	<Col>
							<Button type="primary" size="small" style={{ margin: '0 5px'}} onClick={ () => { setStatus( -1 ); setSelectedRows( () => [] );setRowKeys( () => [] );}  }>取消</Button>
							{ 
								(status === 0 || status === -1) && isDelete === '' ? <Permission perms="system:comment:batchBlock">
									<Button type="primary" danger size="small" style={{ margin: '0 5px'}} onClick={ () => setStatus( 0 ) }>屏蔽</Button>
								</Permission> : null 
							}
							{ status === 1 || status === -1 ? <Permission perms="system:comment:batchRecover">
									<Button type="primary" size="small" style={{ margin: '0 5px'}} onClick={ () => setStatus( 1 ) }>恢复</Button>
								</Permission> : null
							}
						</Col> : null
					}
				</Row>
			{ 
				userId && 
				<Space direction={ 'horizontal' } size="large">
					<Text>用户: <Text>{ nickName }</Text></Text>
					<Text>用户ID: <Text>{ userId }</Text></Text>
					<Text>共计发布 <Text style={ {color: "#666"} }>{ total }</Text> 条评论</Text>
				</Space>
			}
			<Tabs activeKey={ activeKey } onChange={ changeAtiveKey }>
				<TabPane tab="全部" key="1">
					<Table style={ {marginTop: '35px'} } columns={ columns } dataSource={ systemList } pagination={ pagination } rowSelection={rowSelection} rowKey={(record: any ) => record.id }/>
				</TabPane>
				<TabPane tab="已屏蔽" key="2">
					<Table style={ {marginTop: '35px'} } columns={ columns } dataSource={ systemList } pagination={ pagination } rowSelection={ rowSelection } rowKey={(record: any ) => record.id }/>
				</TabPane>
			</Tabs>
		</ContentInner>
	</ContentWrapper>
}