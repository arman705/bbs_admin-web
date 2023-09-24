import React, { useState, useEffect } from "react";

// Api
import { newsflash, posts } from '../../api';

// Components
import ReviewPost from './ReviewPost';
import Thumbnail from "../../components/Thumbnail";
import Datatable from "../../components/Datatable";
import { PlusOutlined, AlignCenterOutlined } from '@ant-design/icons';
import { Typography, Button, Space, Modal, Input, Form, message } from 'antd';
import { ContentInner, ContentWrapper, TableActionLink } from '../../components/Themeable';
import QuickReason from "./QuickReason";
import PostDialog from './PostDialog';
import Permission from "../../components/Permission";
const { Item } = Form;

const Express: React.FC = () => {

	const [ addForm ] = Form.useForm();

	const [ postList, setPostsList ] = useState([]); // 帖子列表
	const [ postsListIndex, setPostsListIndex ] = useState<number>( 0 ); // 帖子列表-索引
	const [ total, setTotal ] = useState<number>( 1 ); // 总条数
	const [ page, setPage ] = useState( { offset: 0, limit: 10, current: 1 } ); // 翻页
	const [ reasonValue, setReasonValue ] = useState<string>('');
	const [viewAddExpress, setViewAddExpress] = useState(false);
	const [viewPost, setViewPost] = useState(false);
	const [ postVisible, setPostVisible ] = useState(false)
	const [ postSelected, setPostSelected ] = useState({})

	/* ---------------- API start ---------------- */
	// 获取帖子列表
	useEffect( () => {
		api_getPostsList();
	}, [ page.offset, page.limit ] );
	const api_getPostsList = async () => {
		let params = { auditState: 'RECOMMEND', typeName: '', id: '', title: '', top: '' };
		await posts.getPostsList( { ...params, ...page  } ).then( ( res: { total: number, rows: [] }) => {
			let _res = res ? res : { total: 1, rows: [] };
			setPostsList( () => [ ..._res.rows ] );
			setTotal( _res.total );
		} );
	};


	// 新增实时快讯
	const api_recommend = async ( data: { id: string, recommendReason: string } ) => {
		await newsflash.recommend( data ).then( ( res: any ) => {
			if (res.code === 200) {
				message.success('新增成功')
				api_getPostsList()
			} else {
				message.error(res.msg)
			}
		} );
	};

	// 取消推荐
	const api_cancleRecommend = async ( id: string ) => {
		await newsflash.cancleRecommend( { id } ).then( res => {
			api_getPostsList();
		} );
	};

	/* ---------------- API end ---------------- */

	/* ---------------- Methods start ---------------- */
	// 新增实时快讯
	const addNews = () => {
		if ( !postSelected.id ) {
			message.warning('帖子ID必填!');
		} else{
			api_recommend( { id: postSelected.id, recommendReason: reasonValue } )
			setPostSelected({})
			setViewAddExpress( false );
			setReasonValue( '' );
		};
	};
	/* ---------------- Methods end ---------------- */



	/* ---------------- Options start ---------------- */	

	const pagination = {
		showSizeChanger: true,
		showQickJumper: false,
		showTotal: () => `共${ total }条`,
		defaultPageSize: 10,
		current: page.current,
		pageSize: page.limit,
		total: total,
		onChange: ( current: number, size: number ) => { console.log( current, size ); setPage( () => ({ offset: (current-1)*size, current, limit: size }))},
	};

	// table 配置项
	const columns = [
		{ title: '推荐ID', align: 'center', dataIndex: 'authorId' }, 
		{ title: '帖子ID', align: 'center', dataIndex: 'id' }, 
		{ title: '帖子标题', align: 'center', dataIndex: 'title' }, 
		{ title: '推荐理由', align: 'center', dataIndex: 'recommendReason' }, 
		{ title: '推荐时间', align: 'center', dataIndex: 'recommendTime' }, 
		{ title: '操作人员', align: 'center', dataIndex: 'oprtUserName' }, 
		{
			title: '操作',
			align: 'center',
			render( text: any, record: any, index: number ) {
				return <Space direction="horizontal">
					<TableActionLink onClick={ () => { setPostsListIndex( index ); setViewPost(true)} }>查看</TableActionLink>
					<Permission perms="novel:recommend:remove">
						<TableActionLink onClick={ () => api_cancleRecommend( record.id ) }>取消推荐</TableActionLink>
					</Permission>
				</Space>
			},
		}
	];

	/* ---------------- Options start ---------------- */


	return (
		<ContentWrapper>
			<Thumbnail />

			{/* table 表格 开始 */}
			<ContentInner>
				<Typography.Title level={5}>实时快讯</Typography.Title>
				<Permission perms="novel:recommend:edit">
					<Button onClick={ () => setViewAddExpress(true) } icon={ <PlusOutlined /> } type="primary">新增实时快讯</Button>
				</Permission>
				<Datatable bordered columns={columns} dataSource={ postList } pagination={ pagination } title=""></Datatable>
			</ContentInner>
			{/* table 表格 开始 */}

			{/* 查看帖子 开始 */}
			<Modal visible={ viewPost } onCancel={ () => setViewPost( false ) } title="查看帖子" footer={ [<Button type="primary" onClick={ () => setViewPost( false ) }>关闭</Button>] }>
				<ReviewPost { ...postList[ postsListIndex ]} />
			</Modal>
			{/* 查看帖子 结束 */}

			{/* 新增实时快讯内容 开始 */}
			<Modal title="新增实时快讯" okText="确定" cancelText="取消" visible={ viewAddExpress } centered={true} onOk={ () => addNews()  } onCancel={ () => { setPostSelected({}); setReasonValue( '' ); setViewAddExpress( false ) } }  >
				<Form layout="horizontal" labelCol={ {span: 6}} form={ addForm }>
					{/* <Item label="推荐ID" required name="inputvalue">
						<Input placeholder="请输入帖子ID"/>
					</Item> */}
					<Item label="推荐帖子" required>
						<Input value={postSelected.title} placeholder="点击选择帖子" readOnly style={{ cursor: 'pointer' }} onClick={() => setPostVisible(true)} />
					</Item>
					<Item label="推荐理由" style={ {position: 'relative'} }>
						<Space direction="horizontal">
							<Input value={ reasonValue } onChange={ ( ev: any ) => setReasonValue( ev.target.value ) }/>
							<QuickReason onSelect={(val) => {setReasonValue( val )}} />
						</Space>
					</Item>
				</Form>
			</Modal>
			{/* 新增实时快讯内容 结束 */}
			{/* 选择帖子弹窗 */}
			<PostDialog
				visible={postVisible}
				onCancel={() => setPostVisible(false)}
				onSelect={(value) => {
					setPostSelected(value)
				}}/>
		</ContentWrapper>
	)
};

export default Express;