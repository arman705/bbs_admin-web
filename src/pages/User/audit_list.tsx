import React, { useState, useEffect } from 'react';

// api
import { user } from '../../api';

// Components
import Thumbnail from '../../components/Thumbnail';
import Datatable from '../../components/Datatable';
import { Typography, message, Input, Button, Modal, Tabs } from 'antd';
import { ContentWrapper, ContentInner } from '../../components/Themeable';
const {Title} = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface irefuseReasons {
	id: string | number;
	status: string;
	refuseReason: string;
}

const AuditList: React.FC = () => {

	const [ status, setStatus ] = useState<string>('');
	const [ page, setPage ] = useState({ pageNum: 1, pageSize: 10 });
	const [ total, setTotal ] = useState<string|number>(0);

	const [ infoList, setInfoList ] = useState<any>([]);
	const [ refuseReasons, setRefuseReasons ] = useState<irefuseReasons>({ id: '', status: '', refuseReason: ''});
	const [ rejectStatus, setRejectStatus ] = useState<boolean>( false );
	// const [ activeKey, setActiveKey ] = useState<string>('');
	/* -------------- API start -------------- */

	useEffect( () => {
		api_newInfoList();
	}, [ status, page.pageNum, page.pageSize ] );

	// 获取用户审核列表
	const api_newInfoList = () => {
		user.newInfoList({ status, ...page }).then( ( res: any ) => {
			let list = res.rows ? res.rows : [];
			setTotal( res.total );
			setInfoList( () => [ ...list ] );
		} );
	};

	// 审核拒绝 & 通过
	const api_newInfoUpdate = () => {
		user.newInfoUpdate( refuseReasons ).then( (res: any) => {
			if ( res.code === 0 ) {
				api_newInfoList();
				message.success("操作成功!");
			};
		} );
	};

	/* -------------- API end -------------- */






	/* -------------- Options start -------------- */
	// 填写拒绝理由
	const handleAudit = ( id: string | number, status: string ) => {
		if ( status === '1' ) {
			setRejectStatus( true );
			setRefuseReasons( { ...refuseReasons, id, status } );
		} else {
			setRefuseReasons( { ...refuseReasons, id, status } );
			api_newInfoUpdate();
		};
	};


	// table 配置项
	const columns = [
		{ title: 'ID', dataIndex: 'id' }, 
		{ title: '类型', render( type: string, record: any ) {
			return <span>{ record.type === "avatar" ? "头像" : record.type === "nickname" ? "昵称" : "音频" }</span>
		} }, 
		{ 
			title: '内容', 
			render( content: any, record: any ) {
				if ( record.type === "avatar" ) {
					return <img src={record.content } alt=""  style={{ width: '40px', height: '40px'}}/>
				} else if ( record.type === "nickname" ) {
					return <span>{ record.content }</span>
				} else {
					return <audio src={ record.content } controls ></audio>
				}
			}
		}, 
		{ 
			title: '状态',  
			render( status: any, record: any ) {
				return <span>{ record.status === 0 ? "审核通过" : record.status === 1 ? "审核拒绝" : "审核中" }</span>
			}
		}, 
		{ title: '拒绝理由', dataIndex: 'refuseReason' }, 
		{
			title: "操作",
			render( status: any, record: any ) {
				if ( record.status === 2 ) {
					return <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
						<Button type="primary" onClick={ () => handleAudit( record.id, '0' ) }>通过</Button>
						<Button type="primary" danger onClick={ () => handleAudit( record.id, '1' ) }>拒绝</Button>
						</div>
				}
			}
		}
	];

	/* -------------- Options end -------------- */

	// Table 切换
	const handleTabChange = (tab: any) => {
		console.log( "tab", tab )
		setStatus( tab );
		setPage({ pageNum: 1, pageSize: 10 });
	};

	// 提交拒绝请求
	const handleOk = () => {
		if ( !refuseReasons.refuseReason ) {
			message.warning('请填写拒绝理由!');
		} else {
			api_newInfoUpdate();
			setRejectStatus( false );
			setRefuseReasons({ id: '', status: '', refuseReason: '' });
		};
	};

	// 取消拒绝
	const handleCancel = () => {
		setRejectStatus( false );
		setRefuseReasons({ id: '', status: '', refuseReason: '' });
	};

	// 拒绝理由填写
	const handleTextArea = ( e: React.ChangeEvent<HTMLTextAreaElement> ) => {
		setRefuseReasons( { ...refuseReasons, refuseReason: e.target.value.trim() });
	};

	const pagination = {
		showSizeChanger: true,
		showQickJumper: false,
		showTotal: () => `共${total}条`,
		current: page.pageNum,
		pageSize: page.pageSize,
		total: total,
		onChange: (current: number, size: number) => setPage(() => ({ pageNum: current, pageSize: size }))
	};

	return (
	<ContentWrapper>
		<Thumbnail></Thumbnail>
		<ContentInner>
			<Title level={5}>用户审核信息</Title>
			<Tabs onChange={ handleTabChange } activeKey={ status }>
					<TabPane tab="全部" key="">
						{/* {userInformationManage} */}
					</TabPane>
					<TabPane tab="审核中" key="2">
						{/* {userInformationManage} */}
					</TabPane>
					<TabPane tab="已通过" key="0">
						{/* {userInformationManage} */}
					</TabPane>
					<TabPane tab="已拒绝" key="1" >
						{/* {userInformationManage} */}
					</TabPane>
				</Tabs>
			{/* <Form layout="inline" form={searchForm}  onFinish={onFinish}>
				<Form.Item name="username" label="查找用户"><Input placeholder="输入用户名称/电话/邮箱" /></Form.Item>
				<Form.Item name="id" label="查找用户ID"><Input placeholder="输入用户ID" /></Form.Item>
				<Form.Item ><Button type="primary" htmlType="submit">查询</Button></Form.Item>
				<Form.Item >
					<Button type="primary" danger onClick={ () => { searchForm.setFieldsValue( { id: '', username: '' } ) } }>
						清空
					</Button>
				</Form.Item>
			</Form> */}
			<Datatable title={''} columns={columns} dataSource={infoList} pagination={pagination}></Datatable>
		</ContentInner>
		<Modal title="审核拒绝" visible={rejectStatus} onOk={handleOk} onCancel={handleCancel} cancelText={"取消"} okText={"提交"} closable={ false } maskClosable={ false }>
		<TextArea value={ refuseReasons.refuseReason } style={{ height: "100%", resize: 'none' }} allowClear autoSize  onChange={ handleTextArea } placeholder={"请填写拒绝理由"}/>
		</Modal>
	</ContentWrapper>
	)
};

export default AuditList;