import React, { useState, useEffect } from 'react';

// Api
import { posts, common } from '../../api';

// router
import { useLocation } from 'react-router-dom';

// Components
import Thumbnail from '../../components/Thumbnail';
import { Typography, Space, Table, Tooltip, Modal, Row, Col, Button, Form, Input, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { ContentWrapper, ContentInner, TableActionLink } from '../../components/Themeable';
import VerifyModal from '../PostReview/VerifyModal'
const {Title, Text} = Typography;


const btn = { color: 'blue', cursor: 'pointer' };

interface Istate {
	state?: { id: string, name: string }  
};

const Topics: React.FC = () => {

	let { state }: Istate = useLocation();

	
	const [ detailList, setDetailList ] = useState<any[]>([]);
	const [ total, setTotal ] = useState<number>(1); 			
	const [ seePostsDetail, setSeePostsDetail ] = useState<any>({});
	const [ detailIndex, setDetailIndex ] = useState<number>( 0 );
	const [ seePostsView, setSeePostsView ] = useState<boolean>( false );							// 查看帖子 Modal														// 总页数
	const [stickTo, setStickTo] = useState({ id: '', top: '' });
	const [ page, setPage ] = useState<any>({ offset: 0, limit: 10 }); 	
	
	const [viewStick, setViewStick] = useState(false);
	const [viewReviewPost, setViewReviewPost] = useState(false);
	const [loading, setLoading] = useState(false)

	/* ------------------------ Api start ------------------------ */
	
	// 获取用户详情
	useEffect( () => {
		api_getPostsList();
	}, [ page.offset, page.limit ] );
	const api_getPostsList = async () => {
		setLoading(true)
		await posts.getPostsList( { authorId: state?.id, offset: page.offset, limit: page.limit } ).then( ( res: { rows: [], total: number } ) => {
			let { rows, total } = res ? res : { rows: [], total: 1 };
			setDetailList( () => [ ...rows ] );
			setTotal( total )
			setLoading(false)
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
		} );
	};

	// 查看帖子
	const api_postsDetail = async ( id: string ) => {
		await common.postsDetail( { id } ).then( res => {
			let _res = res ? res : {};
			setSeePostsDetail( () => ( { ..._res } ) );
		} );
	};
	/* ------------------------ Api end ------------------------ */



	/* ------------------------ Method start ------------------------ */
	// 帖子列表审核状态筛选
	const filterAuditState = ( stateName: string ) => {
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

	// 帖子审核-拒绝原因输入框显示
	const handleStickCancel = () => setViewStick(false);

	// 帖子置顶
	const handleStickTo = () => {
		setViewStick(false);
		api_postsTop();
	};

	// 屏蔽帖子 ( BLOCK：屏蔽，PASS：恢复 )
	const api_postsBlock = async ( id: string, type: string ) => {
		let data = { id, auditState: type };
		await common.postsBlock( data ).then( res => {
			api_getPostsList();
		} );
	};
	/* ------------------------ Method end ------------------------ */




	/* ------------------------ Ui end ------------------------ */
	// 置顶-所属板块选择
	const ui_stickToTop = () => (
		<Form layout="inline">
			<Form.Item label="指定板块">
				<Space>
					<Button onClick={ () => setStickTo( prev => ( { ...prev, top: '1' } ) ) } type={ stickTo.top == '1' ? 'primary': 'default' }>所属板块</Button>
					<Button onClick={ () => setStickTo( prev => ( { ...prev, top: '2' } ) ) } type={ stickTo.top == '2' ? 'primary': 'default' }>全部板块</Button>
				</Space>
			</Form.Item>
		</Form>
	);
	/* ------------------------ Ui end ------------------------ */


	/* ------------------------ Options start ------------------------ */

	const pagination = {
		showSizeChanger: true,
		showQickJumper: false,
		showTotal: () => `共${ total }条`,
		defaultPageSize: 10,
		current: page.offset === 0 ? 1 : (page.offset / 10) + 1,
		pageSize: page.limit,
		total: total,
		onChange: ( current: number, size: number ) => setPage( () => ({ offset: (current -1 )*size, limit: size })),
		onShowSizeChange: ( current: any, pageSize: any ) => true
	};

	

	const columns = [
		{ title: '帖子ID', dataIndex: 'id', }, 
		{ title: '帖子标题', dataIndex: 'title', }, 
		{ title: '所属板块', dataIndex: 'typeName', },
		{ title: '发布时间', dataIndex: 'createAt' }, 
		{ 
			title: '审核状态', 
			dataIndex: 'auditState', 
			render( text: any, record: any, index: number ) {
				return <span>{ filterAuditState( record.auditState ) }</span>
			}
		},
		{ title: '审核时间', dataIndex: 'updateAt' }, 
		{ title: '操作人员', dataIndex: 'oprtUserName' }, 
		{
			title: '排序',
			dataIndex: 'order',
			render(text: any, record: any) {
				return <TableActionLink 
				onClick={ () => {  
						if ( record.top === 1 || record.top === 2 ) {
							setStickTo( () => ({ id: record.id, top: '0'  }) );
						}else{
							setStickTo( prev => ({ ...prev, id: record.id  }) ); 
							setViewStick( true );
						};
					} 
				}>
					{ record.top === 1 || record.top === 2 ? "取消置顶": "置顶" }
				</TableActionLink>
			},
		},
		// { 
		// 	title: <Text>操作 <Tooltip title="已屏蔽的评论将在30天后清除"><QuestionCircleOutlined /></Tooltip> </Text>,
		// 	render(text:any, record: any) {
		// 		return <TableActionLink>屏蔽</TableActionLink>
		// 	},
		// }
		{
			title: <Tooltip title="已拒绝/已屏蔽的帖子，将在30天后自动删除。已推荐到实时快讯的帖子无法屏蔽，如需要屏蔽，请先到实时推荐管理取消推荐。">
				操作 <QuestionCircleOutlined></QuestionCircleOutlined>
			</Tooltip>,
			render(text:any , record: any, index: number ) {
				let { auditState } = record;

				if ( auditState === 'WAIT' ) {
					return <TableActionLink onClick={ () => {
						setDetailIndex(index)
						setViewReviewPost(true)
					}}>审核</TableActionLink>;
				} 

				switch( auditState ) {
					case 'WAIT':
						return ( <TableActionLink onClick={ () => {
							setDetailIndex(index)
							setViewReviewPost(true) 
						}}>审核</TableActionLink> );
					case 'PASS':
						return (
							<Row justify='space-between'>
								<Col onClick={ () => {  setSeePostsView( true ); api_postsDetail( record.id )} } style={ btn }>查看</Col>
								<Col onClick={ () => api_postsBlock( record.id, 'BLOCK' ) } style={ btn }>屏蔽</Col>
							</Row>
						);
					case 'REJECT':
						return (
							<Row justify='space-between'>
								<Col onClick={ () => {  setSeePostsView( true ); api_postsDetail( record.id )} } style={ btn }>查看</Col>
							</Row>
						); 
					case 'BLOCK':
						return (
							<Row justify='space-between'>
								<Col onClick={ () => {  setSeePostsView( true ); api_postsDetail( record.id )} } style={ btn }>查看</Col>
								<Col onClick={ () => api_postsBlock( record.id, 'PASS' ) } style={ btn }>恢复</Col>
							</Row>
						);
					default:
						return (
							<Row justify='space-between'>
								<Col onClick={ () => {  setSeePostsView( true ); api_postsDetail( record.id )} } style={ btn }>查看</Col>
							</Row>
						);
				}
			},
		}
	];
	/* ------------------------ Options end ------------------------ */

	return (
		<ContentWrapper>
			<Thumbnail></Thumbnail>
			<ContentInner>
				<Title level={5}>用户帖子管理</Title>
				<Space direction={ 'horizontal' } size="large">
					<Text>用户: <span style={ {color: '#1890ff' } }>{ state?.name }</span></Text>
					<Text>用户ID: <span style={ {color: '#1890ff' } }>{ state?.id }</span></Text>
					<Text>共计发布 <Text style={ {color: '#1890ff' } }>{ total }</Text> 条帖子</Text>
				</Space>
				<Table loading={loading} style={ {marginTop: '35px'} } pagination={ pagination } columns={columns} dataSource={ detailList }></Table>
			</ContentInner>


			{/* 帖子置顶 Modal 开始 */}
			<Modal visible={viewStick} title="置顶" okText="确定" cancelText="取消" onCancel={ handleStickCancel } onOk={ handleStickTo }>
				{ ui_stickToTop() }
			</Modal>
			{/* 帖子置顶 Modal 开始 */}


			{/* 查看帖子 Modal 开始 */}
			<Modal visible={ seePostsView } title="查看" okText="关闭" closable={ false } footer={ [<Button type="primary" onClick={ () => setSeePostsView( false ) }>关闭</Button>] } centered={false}  >
				<Row>
					<Col span={ 12 }>用户昵称: <span style={{ fontWeight: 700 }}> { seePostsDetail.authorName || '-' }</span></Col>
					<Col span={ 12 }>用户ID: <span style={{ fontWeight: 700 }}> { seePostsDetail.authorId || '-' }</span></Col>
				</Row>
				<Row>
					<Col span={ 12 }>帖子标题: <span style={{ fontWeight: 700 }}> { seePostsDetail.title || '-' }</span></Col>
					<Col span={ 12 }>所属板块: <span style={{ fontWeight: 700 }}> { seePostsDetail.typeName || '-' }</span></Col>
				</Row>
				<Row><Col span={5}>帖子详情:</Col></Row>
				<Row>
					<Col span={ 24 }>
						<div dangerouslySetInnerHTML={ { __html: seePostsDetail.htmlContent || '-' } } style={{ width: '100%', height: '200px', overflow: 'auto', padding: '5px 0' }}></div>
					</Col>
				</Row>
			</Modal>
			{/* 查看帖子 Modal 开始 */}

			<VerifyModal
				visible={viewReviewPost}
				data={detailList[ detailIndex ]}
				onCancel={() => {
					setViewReviewPost( false );
					// textAreaValue.length > 0 && setTextAreaValue( '' );
					// setRejectReasonStatus( false )
					console.log(detailList[ detailIndex ])
				}}
				onSubmitSuccess={() => {
					api_getPostsList();
					setViewReviewPost( false );
				}}
			/>
		</ContentWrapper>

		
	)
};

export default Topics;