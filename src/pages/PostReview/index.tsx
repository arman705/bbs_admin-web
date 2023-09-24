import React, { useEffect, useState } from 'react';
import { getQueryString, hasPermission } from '../../utils/utils'

// api
import { posts, plate, common } from '../../api';

// Components
import SimpTabs from '../../common/SimpTabs';
import Thumbnail from '../../components/Thumbnail';
import Datatable from '../../components/Datatable';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { ContentInner, ContentWrapper, TableActionLink } from '../../components/Themeable';
import { Space, Input, Button, Select, Form, Typography, Tooltip, Modal, Row, Col, message, Table, Cascader } from 'antd';
import VerifyModal from './VerifyModal'

import Express from './express';
import Permission from '../../components/Permission';
const {Title} = Typography;
const {Option} = Select;
export { Express };

const tabs = [
	{ name: '全部', type: 'auditState', id: '' }, 
	{ name:'未审核', type: 'auditState', id: 'WAIT' }, 
	{ name:'已审核', type: 'auditState', id: 'PASS' }, 
	{ name: '已置顶', type: 'top', id: '1' }, 
	{ name : '已屏蔽', type: 'auditState', id: 'BLOCK' },
];

const btn = { color: 'blue', cursor: 'pointer' };

const PostPreview: React.FC = () => {
	console.log()
	// WAIT: 未审核
	// PASS: 已通过
	// REJECT: 已拒绝
	// RECOMMEND: 已推荐到实时快讯
	// BLOCK: 已屏蔽
	const [ pars, setPars ] = useState( () => ( { auditState: getQueryString('auditState') || '', typeName: '', title: '', top: '', category: 'ARTICLE' } ) );										// 帖子列表请求参数
	const [ postsList, setPostsList ] = useState([]); 																// 帖子列表
	const [ postsListIndex, setPostsListIndex ] = useState<number>( 0 );							// 帖子列表-索引
	const [ plateNameList, serPlateNameList ] = useState<{ value: string; label: string; isLeaf: boolean }[]>([]);								// 板块列表
	const [ total, setTotal ] = useState<number>(1); 																	// 总页数
	const [ page, setPage ] = useState<any>({ offset: 0, limit: 10 }); 	 								// 拒绝原因
	
	const [ seePostsView, setSeePostsView ] = useState<boolean>( false );							// 查看帖子 Modal
	const [ seePostsDetail, setSeePostsDetail ] = useState<any>({});									// 查看帖子详情

	const [viewReviewPost, setViewReviewPost] = useState(false);
	const [viewStick, setViewStick] = useState(false);
	const [stickTo, setStickTo] = useState({ id: '', top: '' });
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [loading, setLoading] = useState(false)

	// 帖子查询 
	const [ confirmStaus, setConfirmStatus ] = useState<boolean>( false );


	/* ---------------- API start ---------------- */
	// 获取帖子列表
	useEffect( () => {
		api_getPostsList();
	}, [ page.offset, page.limit, pars.auditState, pars.top, pars.title, pars.typeName ] )

	const api_getPostsList = async () => {
		setLoading(true)
		let params = { ...page, ...pars };
		await posts.getPostsList( params ).then( ( res: { rows: [], total: number } ) => {
			let { rows, total } = res ? res : { rows: [], total: 1 };
			setPostsList( () => [ ...rows ] );
			setTotal( total );
			confirmStaus && setConfirmStatus( !confirmStaus );
			setLoading(false)
		} );
	};


	// 获取板块列表
	useEffect( () => {
		api_getScope();
	}, [] );
	const api_getScope = async () => {
		await plate.getScope().then( (res: string[]) => {
			md_getScopeName( res );
		} );
	}

	// 获取所属板块二级名称列表
	const api_articleTypeList = async ( item: { value: string; label: string; isLeaf: boolean; children: any[] } ) => {
		await plate.articleTypeList({ offset: 0, limit: 100000, scope: item.label }).then( res => {
			let { rows} = res ? res : { rows: [] };
			item.children = md_getPlateName( rows );
			serPlateNameList([...plateNameList]);
		} );
	};




	// 帖子置顶
	useEffect( () => {
		if ( stickTo.top === '0' ) {
			api_postsTop();
		};
	}, [ stickTo.top ] );
	const api_postsTop = async () => {
		await common.postsTop( stickTo ).then( res => {
			setStickTo( () => ( { id: '', top: '' } ) );
			api_getPostsList();
		} )
	};

	
	// 查看帖子
	const api_postsDetail = async ( id: string ) => {
		await common.postsDetail( { id } ).then( res => {
			let _res = res ? res : {};
			setSeePostsDetail( () => ( { ..._res } ) );
		} );
	};

	
	// 屏蔽帖子 ( BLOCK：屏蔽，PASS：恢复 )
	const api_postsBlock = async ( id: string, type: string ) => {
		let data = { id, auditState: type };
		await common.postsBlock( data ).then( res => {
			api_getPostsList();
		} );
	};

	const handleRemove = async (ids: string[]) => {
		const res = await posts.batchRemove({ ids })
		if (res.code === 200) {
			message.success('删除成功');
			api_postsTop()
		} else {
			message.error(res.msg);
		}
	}
	/* ---------------- API end ---------------- */

	

	/* ---------------- Methods start ---------------- */

	// table 切换查询 ( 全部、未审核、已置顶、已屏蔽 }
	const md_handleTabChange = ( item: { id: string, name: string, type?: string } ) => {
		let param = {};
		if ( item.type === 'top' ) {
			param = { auditState: '', top: item.id };
		} else {
			param = { top: '', auditState: item.id };
		};
		setPars( () => ( { ...pars, ...param } ) );
		setPage( () => ( { offset: 0, limit: 10 } ) );
	};

	// 所属板块下拉列表-typeName
	const md_getScopeName = ( list: string[] ) => {
		let _list: { value: string; label: string; isLeaf: boolean }[] = [];
		for( let i = 0; i < list.length; i++ ){
			_list.push( {  value: list[i].scope, label: list[ i ].scope, isLeaf: false } );
		};
		serPlateNameList( () => [ ..._list ] );
	};

	// 所属板块二级列表
	const md_getPlateName = ( list: any[] ) => {
		if ( list.length === 0 ) return [ { value: '', labal: '' } ];
		let _list:{ value: string; label: string }[] = [];
		for( let i = 0; i < list.length; i++ ) {
			_list.push( { value: list[i]["name"], label: list[i]["name"] });
		};
		return _list;
	}

	// 帖子列表审核状态筛选
	const md_filterAuditState = ( stateName: string ) => {
		switch( stateName ){
			case 'WAIT':
				return '未审核';
			case 'PASS':
				return '已通过';
			case 'REJECT':
				return '已拒绝';
			case 'RECOMMEND':
				return '已推荐到实时快讯';
			case 'BLOCK':
				return '已屏蔽';
			default:
				return '-';
		}
	};
	// 查找帖子-判断内容是文字还是id
	const md_queryVlue = ( values: any ) => {
		let param = {};
		let { inputValue } = values;
		if ( inputValue === '' || inputValue === undefined ) {
			param = { id: '', value: '' };
		}else{
			if ( isNaN( parseInt( inputValue ) )){
				param = { value: inputValue };
			}else{
				param = { id: inputValue };
			};
		};
		setPars( () => ( { ...pars, ...param } ) );
	};

	// 帖子审核-Modal
	const md_handleViewReview = ( index: number ) => {
		setViewReviewPost(true);
		setPostsListIndex( index );
	};


	// 帖子审核-拒绝原因输入框显示
	const md_handleStickCancel = () => setViewStick(false);
	

	// 帖子置顶
	const md_handleStickTo = () => {
		setViewStick(false);
		api_postsTop();
	};
	const delPost = (record) => {
		Modal.confirm({
			title: '提示',
			content: '确定删除吗',
			okText: '确认',
			cancelText: '取消',
			onOk: async () => {
				handleRemove([record.id])
			}
		});
	}
	const batchDelPost = () => {
		if (selectedRowKeys.length === 0) {
			message.warning('请至少选择一项')
			return
		}
		Modal.confirm({
			title: '提示',
			content: '确定删除吗',
			okText: '确认',
			cancelText: '取消',
			onOk: async () => {
				handleRemove(selectedRowKeys)
			}
		});
	}

	// 排序
	const md_handleSort = ( { auditState, top, id }: { auditState: string; top: number; id: string} ) => {
		if ( auditState !== 'WAIT' ) {
			if ( top === 1 || top === 2 ) {
				setStickTo( () => ({ id: id, top: '0'  }) );
			}else{
				setStickTo( prev => ({ ...prev, id  }) ); 
				setViewStick( true );
			};
		};
	};

	// 操作
	const md_handleOperation = ( record: any, index: number ) => {
		let result = <>-</>
		let { auditState } = record;
		if ( pars.auditState === '' && pars.top === '' ) {
			if ( auditState === 'WAIT' ) {
				result = <Permission perms="novel:posts:edit">
					<Button type="link" style={{ padding: 4 }} onClick={ () => md_handleViewReview( index ) }>审核</Button>
				</Permission>
			}else{
				result = ( 
					<>
						<Permission perms="novel:posts:detail">
							<Button type="link" style={{ padding: 4 }} onClick={ () => {  setSeePostsView( true ); api_postsDetail( record.id )} }>查看</Button>
						</Permission>
						{ (auditState === 'PASS' && hasPermission('novel:posts:block')) && <Button type="link" style={{ padding: 4 }} onClick={ () => api_postsBlock( record.id, 'BLOCK' ) }>屏蔽</Button> }
						{ (auditState === 'BLOCK' && hasPermission('novel:posts:block')) &&  <Button type="link" style={{ padding: 4 }} onClick={ () => api_postsBlock( record.id, 'PASS' ) }>恢复</Button> }
					</> 
				);
			};
		}else if ( pars.top !== '' ) {
			result = <>-</>
		}else if ( pars.auditState === 'BLOCK' ){
			result = (
				<Permission perms="novel:posts:block">
					<Button type="link" style={{ padding: 4 }} onClick={ () => api_postsBlock( record.id, 'PASS' ) }>恢复</Button>
				</Permission>
			);
		}else if( pars.auditState === 'WAIT' ){
			result = <Permission perms="novel:posts:edit">
				<Button type="link" style={{ padding: 4 }} onClick={ () => md_handleViewReview( index ) }>审核</Button>
			</Permission>;
		};
		return (
			<>
				{result}
				<Permission perms="novel:posts:remove">
					<Button type="link" style={{ padding: 4 }} onClick={ () => { delPost(record) }}>删除</Button>
				</Permission>
			</>
		)
	}

	// 级联选择器
	const LazyOptions = () => {
	
		const onChange = (value: any[], selectedOptions: any ) => {
			handleSearchTypeName( value )
		};
		const onCascaderClear = () => {
			setPars( prevState => ({ ...prevState, typeName: '' }) )
		}
	
		const loadData = (selectedOptions: any) => {
			const targetOption = selectedOptions[selectedOptions.length - 1];
			targetOption.loading = true;
	
			// load options lazily
			setTimeout(() => {
				targetOption.loading = false;
				api_articleTypeList( targetOption );
			}, 500);
		};
	
		return <Cascader options={plateNameList} loadData={loadData} onChange={onChange } changeOnSelect placeholder="请选择板块" onClear={onCascaderClear} />;
	};

	useEffect( () => {
		confirmStaus && api_getPostsList();
	} , [ confirmStaus ] )

	// 查找帖子
	const handleSearch = ( value: string ) => {
		let isNum = new RegExp("[0-9]+");
		let idOrTitle = { title: '', id: '' };
		if ( isNum.test( value ) ) {
			idOrTitle.id = value;
		}else{
			idOrTitle.title = value;
		};
		setPars( ( prevState ) => ({ ...prevState, ...idOrTitle }) );
	};

	const handleSearchTypeName = ( list: string[] ) => {
		if ( list.length > 1 ) {
			setPars( prevState => ({ ...prevState, typeName: list[ 1 ] }) )
		};
		
	};
	const onSelectChange = (newSelectedRowKeys) => {
		setSelectedRowKeys(newSelectedRowKeys);
	}


	/* ---------------- Methods end ---------------- */


	/* ---------------- Options start ---------------- */

	const pagination = {
		showSizeChanger: true,
		showQickJumper: false,
		showTotal: () => `共${ total }条`,
		defaultPageSize: 10,
		current: page.offset === 0 ? 1 : (page.offset / 10) + 1,
		pageSize: page.limit,
		total: total,
		onChange: ( current: number, size: number ) => setPage( () => ({ offset: (current-1)*size, limit: size })),
		onShowSizeChange: ( current: any, pageSize: any ) => true
	};

	// table 表格配置项
	const columns = [
		{ title: '帖子ID', align: 'center', dataIndex: 'id' }, 
		{ title: '帖子标题', align: 'center', dataIndex: 'title' }, 
		{ title: '所属板块', align: 'center', dataIndex: 'typeName', width: 100 }, 
		{ title: '发布时间', align: 'center', dataIndex: 'createAt' }, 
		{
			title: '转码状态',
			align: 'center',
			dataIndex: 'transcodingStatus',
			render (text) {
				switch (text) {
					case 0:
						return '待转码'
					case 1:
						return '转码中'
					case 2:
						return '转码成功'
					case 3:
						return '转码失败'
				}
			}
		}, 
		{ 
			title: '审核状态', 
			align: 'center',
			dataIndex: 'auditState',
			width: 100, 
			render( text: any, record: any, index: number ) {
				return <span>{ md_filterAuditState( record.auditState ) }</span>
			}
		},
		{
			title: '审核时间',
			align: 'center',
			dataIndex: 'auditTime',
			render: (text) => text || '-'
		}, 
		{
			title: '操作人员',
			align: 'center',
			dataIndex: 'oprtUserName',
			width: 100,
			render: (text) => {
				return text || '-'
			}
		},
		{
			title: '排序', align: 'center', dataIndex: 'order',
			render(text: any, record: any) {
				return <Permission perms="novel:posts:top">
					<TableActionLink onClick={ () => md_handleSort( record ) }>
						{ record.auditState === 'WAIT' || record.auditState === 'REJECT' ? '-' : record.top === 1 || record.top === 2 ? "取消置顶": "置顶" }
					</TableActionLink>
				</Permission>
			},
		}, 
		{
			title: <Tooltip title="已拒绝/已屏蔽的帖子，将在30天后自动删除。已推荐到实时快讯的帖子无法屏蔽，如需要屏蔽，请先到实时推荐管理取消推荐。">
				操作 <QuestionCircleOutlined/>
			</Tooltip>,
			align: 'center',
			render(text:any , record: any, index: number ) { return <>{ md_handleOperation( record, index ) }</> },
		}
	];

	/* ---------------- Options end ---------------- */

	return (
	<ContentWrapper>
		<Thumbnail />

		{/* 帖子审核 table start */}
		<ContentInner>
			<Title level={5}>帖子审核</Title>
			<SimpTabs defaultSelected={pars.auditState} onChange={ md_handleTabChange } tabs={tabs} />
			<Form layout="inline" onFinish={ md_queryVlue } style={{ margin: '10px 0' }}>
				<Form.Item label="查找帖子" name="inputValue"><Input placeholder="帖子标题或ID" onChange={ (ev: any ) => handleSearch( ev.target.value ) }/></Form.Item>
				<Form.Item label="所属板块">{ LazyOptions() }</Form.Item>
				<Form.Item><Button type="primary" htmlType="submit" onClick={ () => { setConfirmStatus( true ) } }>确定</Button></Form.Item>
				<div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
					<Form.Item>
						<Permission perms="novel:posts:remove">
							<Button type="primary" htmlType="submit" onClick={() => batchDelPost()}>批量删除</Button>
						</Permission>
					</Form.Item>
				</div>
			</Form>
			<Table
				rowKey="id"
				loading={loading}
				rowSelection={{
					selectedRowKeys,
					onChange: onSelectChange,
				}}
				scroll={{x: 200}}
				bordered
				pagination={ pagination }
				dataSource={postsList}
				columns={columns as any}></Table>
		</ContentInner>
		{/* 帖子审核 table end */}

		{/* 帖子审核 Modal 开始 */}
		<VerifyModal
			visible={viewReviewPost}
			data={postsList[postsListIndex]}
			onCancel={() => {
				setViewReviewPost( false );
				// textAreaValue.length > 0 && setTextAreaValue( '' );
				// setRejectReasonStatus( false )
			}}
			onSubmitSuccess={() => {
				api_getPostsList();
				setViewReviewPost( false );
			}}
		/>
		{/* 帖子审核 Modal 结束 */}

		{/* 帖子置顶 Modal 开始 */}
		<Modal visible={viewStick} title="置顶" okText="确定" cancelText="取消" onCancel={ md_handleStickCancel } onOk={ md_handleStickTo }>
			<Form layout="inline">
				<Form.Item label="指定板块">
					<Space>
						<Button onClick={ () => setStickTo( prev => ( { ...prev, top: '1' } ) ) } type={ stickTo.top == '1' ? 'primary': 'default' }>所属板块</Button>
						<Button onClick={ () => setStickTo( prev => ( { ...prev, top: '2' } ) ) } type={ stickTo.top == '2' ? 'primary': 'default' }>全部板块</Button>
					</Space>
				</Form.Item>
			</Form>
		</Modal>
		{/* 帖子置顶 Modal 开始 */}
		
		{/* 查看帖子 Modal 开始 */}
		<Modal visible={ seePostsView } title="查看" okText="关闭" closable={ false } footer={ [<Button type="primary" onClick={ () => setSeePostsView( false ) }>关闭</Button>] } centered={false}  >
		<Row><Col span={ 12 }>用 户 ID：<span style={{ fontWeight: 700 }}> { seePostsDetail.authorId || '-' }</span></Col></Row>
			<Row><Col span={ 24 }>用户昵称： <span style={{ fontWeight: 700 }}> { seePostsDetail.authorName || '-' }</span></Col></Row>
			
			<Row><Col span={ 12 }>帖子标题：<span style={{ fontWeight: 700 }}> { seePostsDetail.title || '-' }</span></Col></Row>
			<Row><Col span={ 12 }>所属板块：<span style={{ fontWeight: 700 }}> { seePostsDetail.typeName || '-' }</span></Col></Row>
			<Row><Col span={5}>帖子详情:</Col></Row>
			<Row>
				<Col span={ 24 }>
					<div dangerouslySetInnerHTML={ { __html: seePostsDetail.htmlContent || '-' } } style={{ width: '100%', height: '200px', overflow: 'auto', padding: '5px 0' }}></div>
				</Col>
			</Row>
		</Modal>
		{/* 查看帖子 Modal 开始 */}

	</ContentWrapper>
	)

};

export default PostPreview;