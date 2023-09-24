import React, {useEffect, useState} from 'react';
import { getQueryString } from '../../utils/utils'
// api 
import { user } from '../../api';

// components
import { Typography, Row, Col, Button, Space, Modal, Input, message, Form, Select } from 'antd';
import DataTable from '../../components/Datatable';
import { ContentInner, ContentWrapper } from '../../components/Themeable';
import SimpTabs from '../../common/SimpTabs';
import Permission from '../../components/Permission'

const {Title} = Typography;


interface Ilist {	
	auditStatus: number;
	auditTime: string;
	createAt: string;
	id: string;
	nickname: string;	
	operator: string;
	rejectReason: string;
	updateBy: string;
	updateContent: string;	
	updateType: number;
	userId: string;
};


const UserManage: React.FC = () =>  {
	const [ total, setTotal ] = useState(1);
	const [searchInfo, setSearchInfo] = useState({
		offset: 0,
		limit: 10,
		status: getQueryString('status') || '',
		type: '',
		nickname: ''
	})
	const tabs = [
		{ name: '全部', id: '' }, 
		{ name:'未审核', id: '2' }, 
		{ name: '已通过', id: '0' }, 
		{ name : '已拒绝', id: '1' }
	];
	const typeData = [
		{ type: 'avatar', name: '头像' },
		{ type: 'nickname', name: '昵称' },
		{ type: 'signature', name: '简介' },
		{ type: 'sex', name: '性别' },
	]
	
	const [ userDataList, setUserDataList ] = useState<Ilist[]>(() => []);
	// const [ getUserDataListParams, setGetUserDataListParams ] = useState<IgetUserDataListParams>( { pageNum: 1, pageSize: 10, total:1 } )
	
	const filterTypes = ( type: string ) => {
		const target = typeData.find(item => item.type === type)
		return target ? target.name : '-'
	}

	const columns = [
		// { title: '记录ID', dataIndex: 'id' }, 
		{ title: '用户', dataIndex: 'nickname', render: text => text || '-' }, 
		{ 
			title: '审核状态', 
			width: 100,
			dataIndex: 'status', 
			render: ( text: any, recorder: any, index: number ) => {
				switch (text) {
					case 0:
						return '通过'
					case 1:
						return '拒绝'
					case 2:
						return '审核中'
					default:
						return '-'
				}
			}
		}, 
		{ 
			title: '修改类型', 
			width: 100,
			dataIndex: 'type',
			render: ( text: any, recorder: any, index: number ) => (
				<span>{ filterTypes( recorder.type ) }</span>
			)
		}, 
		{
			title: '修改内容',
			dataIndex: 'content',
			render: (text, record) => {
				switch (record.type) {
					case 'avatar':
						return <img style={{ width: '40px', height: '40px', objectFit: 'cover' }} src={text} alt="" />
					case 'sex':
						return text === '0' ? '男' : '女'
					default:
						return text
				}
			}
		}, 
		{ title: '拒绝理由', dataIndex: 'refuseReason', render: text => text || '-' }, 
		
		{ title: '申请时间', dataIndex: 'createAt', render: text => text || '-' }, 
		{ title: '审核时间', dataIndex: 'updateAt', render: text => text || '-' }, 
		{
			title: '审核人',
			width: 90,
			dataIndex: 'username',
			render: text => {
				return text || '-'
			}
		},
		{ 
			title: '操作', 
			dataIndex: '', 
			width: 140,
			key: 'action', 
			align: 'center',
			render: (text: any, recorder:any, index: number ) => {
				if (recorder.status === 2) {
					return (
						<>
							<Permission perms="novel:user:audit">
								<span style={{ color: 'blue', cursor: 'pointer', marginRight: '10px' }} onClick={ () => subExamine( 'pass', [ recorder.id ], index )}>通过</span>
							</Permission>
							<Permission perms="novel:user:audit">
								<span style={{ color: 'red', cursor: 'pointer' }} onClick={ () => subExamine( 'reject', recorder.id, index ) }>拒绝</span>
							</Permission>
						</>
					)
				}
			}
		}
	];
	// 表格标题配置
	// 复选框选中数据
	const [ selectList, setSelectList ] = useState([]);
	// 审核拒绝弹窗状态
	const [ rejectModalVisible, setRejectModalVisible ] = useState<boolean>( false );
	// 拒绝原因
	// const [ rejectReasonText, setRejectReasonText ] = useState<string>('');

	const [ rejects, setRejects ] = useState({ id: '', rejectReason: '', index: -1 });

	useEffect( () => {
		api_getUserDataList( searchInfo );
		setSelectList([])
	}, [searchInfo] );

	// Api
	const api_getUserDataList = async ( params ) => {
		await user.userDataList(params).then( (res: any ) => {
			console.log(res)
			if (res.code === 0) {
				setTotal(res.pageBean.total || 0)
				setUserDataList(res.pageBean.rows)
			}
		} );
	};

	// Table 切换
	const handleTabChange = (tab: any) => {
		setSearchInfo(pre => ({ ...pre, offset: 0, status: tab.id }))
	};

	const onChange = (selectedRowKeys: React.Key[],  selectedRows: any) => {
		setSelectList( selectedRows );
	}

	// table 复选框配置
	const rowSelection = {
		onChange,
		selectedRowKeys: selectList.map((item: any) => item.id),
		getCheckboxProps: (record) => ({
			disabled: record.status !== 2
		})
	};

	// 提交审核
	const subExamine = ( type: string, id: any, index: number ) => {
		if ( type === 'reject' ) {
			setRejects( Object.assign( {}, { ...rejects, id, index } ) );
			setRejectModalVisible( true );
		}else{
			Modal.confirm({
				title: '提示',
				content: '确定通过吗？',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					user.userDataPass({ id, status: 0 }).then( ( res: any ) => {
						if(res.code === 0) {
							setSearchInfo(pre => ({ ...pre }))
						} else {
							message.error(res.msg)
						}
					} );
				}
			});
		};
	}

	// modal 
	const handleRejectClick = ( type: string ) => {
		if ( type === 'ok' ) {
			if ( rejects.rejectReason.length === 0  ) {
				message.warning( '请填写拒绝原因' )
			}else{
				let data = { id: rejects.id, refuseReason: rejects.rejectReason, status: 1 };
				user.userDataPass( data ).then( (res: any) => {
					console.log( "拒绝", res );
					if (res.code === 0) {
						setSearchInfo(pre => ({...pre}))
					} else {
						message.error(res.msg)
					}
				})
				setRejectModalVisible( false );
			};
		}else{
			setRejects( { ...{ id: '', rejectReason: '', index: -1 } } );
			setRejectModalVisible( false );
		};
	}

	const batchPass = () => {
		if (selectList.length === 0) {
			message.warning('请至少选择一项')
			return
		}
		Modal.confirm({
			title: '提示',
			content: '确定批量通过吗？',
			okText: '确定',
			cancelText: '取消',
			onOk: () => {
				user.batchPass({ ids: selectList.map((item: any) => item.id) }).then((res: any) => {
					if (res.code === 0) {
						setSearchInfo(pre => ({ ...pre }))
					} else {
						message.error(res.msg)
					}
				})
			}
		});
	}

	const batchReject = () => {
		if (selectList.length === 0) {
			message.warning('请至少选择一项')
			return
		}
		Modal.confirm({
			title: '提示',
			content: '确定批量拒绝吗？',
			okText: '确定',
			cancelText: '取消',
			onOk: () => {
				user.batchRefuse({ ids: selectList.map((item: any) => item.id) }).then((res: any) => {
					if (res.code === 0) {
						setSearchInfo(pre => ({ ...pre }))
					} else {
						message.error(res.msg)
					}
				})
			}
		});
	}

	const filterForm = () => (
		<Form layout="inline">
			<Form.Item label="用户昵称">
				<Input
					placeholder="请输入用户昵称"
					allowClear
					onChange={e => {
						if (!e.target.value) setSearchInfo(pre => ({ ...pre, nickname: e.target.value, offset: 0 }))
					}}
					onPressEnter={(e: any) => {
						if (e.target.value) setSearchInfo(pre => ({ ...pre, nickname: e.target.value, offset: 0 }))
					}}
					onBlur={(e: any) => {
						if (e.target.value) setSearchInfo(pre => ({ ...pre, nickname: e.target.value, offset: 0 }))
					}} />
			</Form.Item>
			<Form.Item label="所属板块">
				<Select
					style={ {width: '150px'} }
					placeholder="请选择所属板块"
					onChange={ (type: string ) => setSearchInfo(pre => ({...pre, type, offset: 0})) }>
					<Select.Option value="">全部</Select.Option>
					{
						typeData.map(item => (
							<Select.Option
								value={ item.type }
								key={ item.type }>
								{ item.name }
							</Select.Option>
						))
					}
				</Select>
			</Form.Item>
			<div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
				<Form.Item>
					<Permission perms="novel:user:audit">
						<Button type="primary" onClick={() => batchPass()}>批量通过</Button>
					</Permission>
				</Form.Item>
				<Form.Item>
					<Permission perms="novel:user:audit">
						<Button type="primary" onClick={() => batchReject()}>批量拒绝</Button>
					</Permission>
				</Form.Item>
			</div>
		</Form>
	);

	const pagination = {
		showSizeChanger: true,
		showQickJumper: false,
		showTotal: () => `共${total}页`,
		current: (searchInfo.offset / searchInfo.limit) + 1,
		pageSize: searchInfo.limit,
		total: total,
		onChange: ( current: number, size: number ) => {
			const offset = (current - 1) * size
			setSearchInfo(pre => ({...pre, offset, limit: size }))
		},
		onShowSizeChange: ( current: any, pageSize: any ) => {
			console.log( "show-size-change", current, pageSize );
		}

	}

	const userInformationManage = (
		<Space direction="vertical" style={ {width: '100%'} } size="large">
			{/* <DataTable rowSelection={ getUserDataListParams.auditStatus === '2' ? rowSelection : undefined } rowKey={(record: any ) => record.id } onChange={ test } pagination={ true } title={''} prefix={prefix} columns={columnsList} dataSource={userDataList} /> */}
			<DataTable 
				rowSelection={ rowSelection } 
				scroll={{ x: 200 }} 
				rowKey={(record: any ) => record.id } 
				pagination={ pagination } 
				title={''} 
				columns={columns} 
				prefix={ filterForm() }
				dataSource={userDataList} 
			/>
		</Space>
	);

	

	// textarea 获取 value 
	const handleBlurValue = ( ev: any ) => {
		setRejects( { ...rejects, rejectReason: ev.target.value } );
		// setRejects( { ...{ rejects, rejectReasonText: ev.target.value } } );
	}

	return (
		<ContentWrapper>
			{/* 审核拒绝 开始 */}
			<Modal title="审核拒绝原因" cancelText="取消" okText="提交" visible={ rejectModalVisible } onOk={ () => handleRejectClick( 'ok' ) } onCancel={ () => handleRejectClick( 'cancel' ) }>
				<Row>
					<Col span={ 24 }>
						<Input.TextArea value={ rejects.rejectReason } onChange={ handleBlurValue } rows={4} placeholder='请输入拒绝原因...' style={{ resize: 'none'}} />
					</Col>
				</Row>
			</Modal>
			{/* 审核拒绝 结束 */}

			{/* 标签切换用户状态 开始 */}
			<ContentInner>
				<Title level={5}>用户资料管理</Title>
				{/* <Tabs onChange={ handleTabChange } activeKey={ activeKey }>
					<TabPane tab="全部" key="">
						{userInformationManage}
					</TabPane>
					<TabPane tab="未审核" key="2">
						{userInformationManage}
					</TabPane>
					<TabPane tab="已通过" key="0">
						{userInformationManage}
					</TabPane>
					<TabPane tab="已拒绝" key="1" >
						{userInformationManage}
					</TabPane>
				</Tabs> */}

				<SimpTabs defaultSelected={searchInfo.status} onChange={ handleTabChange } tabs={tabs} />
				{userInformationManage}
			</ContentInner>
			{/* 标签切换用户状态 结束 */}
	
		</ContentWrapper>
	)
};

export default UserManage;
