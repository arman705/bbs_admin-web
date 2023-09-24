import React, { useState, useEffect } from 'react';

// api
import { user } from '../../api';

// Components
import Thumbnail from '../../components/Thumbnail';
import Datatable from '../../components/Datatable';
import { Typography, Form, Input, Button, Modal, Spin } from 'antd';
import ChatMessgeScroll from '../../components/ChatHistory';
import { ContentWrapper, ContentInner, TableActionLink } from '../../components/Themeable';
import { getChatDetail, userList } from '../../api/user';
import MessageList from '../../components/ChatMonitor/MessageList'
const {Title} = Typography;

export default function HistoryMessage() {
	const [searchForm] = Form.useForm();

	const [viewChatBox, setViewChatBox] = useState<boolean>(false);

	const [ pars, setPars ] = useState<any>({ userId: '', keyword: '' });
	const [ logList, setLogList ] = useState<any>([]);
	const [ page, setPage ] = useState({ pageNum: 1, pageSize: 10 });
	const [ total, setTotal ] = useState<string|number>(0);
	const [ msgLists,setMsgLists ] = useState([])
	const [ msgLoading, setMsgLoading ] = useState(false);

	const [ contentList, setContentList ] = useState<any>([]);

	const columns = [
		{ title: '记录ID', dataIndex: 'id' }, 
		{ title: '用户', dataIndex: 'sender' }, 
		{ title: '用户ID', dataIndex: 'sendUserId' }, 
		{ title: '发送内容', dataIndex: 'content' }, 
		{ title: '收信用户', dataIndex: 'receiver' }, 
		{ title: '发送时间', dataIndex: 'createAt' }, 
		{ title: '操作',
			render(text: any, record:any) {
				const handleViewChat = () => {
					setMsgLoading(true)
					setViewChatBox(true);
					// getChatDetail('1435533745812676608').then((res: any) => {
					getChatDetail(record.id).then((res: any) => {
						if (res.code === 200) {
							console.log("res-------", res)
							filterMsgLists( res.data );
							

							setMsgLists(res.data.map((item: any) => {
								return {
									...item,
									sendNickName: item.senderName,
									sendId: item.sender,
									sendTime: item.createAt,
									messageType: item.contentType,
									headImg: item.avatar,
									accepNickName: item.receiverName,
									acceptId: item.receiver
								}
							}))
						}
					}).finally(() => {
						setMsgLoading(false)
					})
					// getUserChat({ pageNum: 1, pageSize: 100, id: record.id, order: 1 })
				}
				return <TableActionLink onClick={ handleViewChat }>查看聊天</TableActionLink>
			},
		}
	];

	const filterMsgLists = ( list: [] ) => {
		if ( list.length > 0 ) {
			let dateList: any = [];
			let userList: any = [];
			list.map( (item: any ) => {
				let str = item.createAt.split( ' ' )[ 0 ];
				userList.push( item.senderName );
				dateList.push( str );
			} );
			test( list, dateList, userList );
		}
	};

	const test = ( list: [], dateList: [], userList: [] ) => {
		let result: string[] = []
		let _list: any = [];
      for(let i = 0; i < dateList.length; i++ ){
        if(result.indexOf( dateList[i] ) === -1){
          result.push(dateList[i]);
					_list.push({ time: dateList[i], contentList: list.filter( ( item: any ) => item.createAt.split( ' ' )[ 0 ] === dateList[ i ]) } );
        };
      };
			let resultName: string[] = [];
			let names: string[] = [];
			for ( let j = 0; j < userList.length; j++ ) {
				if ( resultName.indexOf( userList[ j ] ) === -1 ) {
					resultName.push( userList[ j ] );
					names.push( userList[ j ] );
				}
			};
			filterUser( _list, names );
	};

	const filterUser = ( list: any[], names: string[] ) => {
		for ( let j = 0; j < list.length; j++ ) {
			for( let k = 0; k < list[ j ][ "contentList"].length; k++ ) {
				if ( names.length === 2 ) {
					if ( list[ j ]["contentList"][ k ][ "senderName" ] === names[ 0 ]) {
						list[ j ]["contentList"][ k ] = { ...list[ j ]["contentList"][ k ], dir: 'left' };
					} else {
						list[ j ]["contentList"][ k ] = { ...list[ j ]["contentList"][ k ], dir: 'right' };
					};
				} else {
					list[ j ]["contentList"][ k ] = { ...list[ j ]["contentList"][ k ], dir: 'left' };
				};
			};
		};
		console.log("list", list );
		setContentList( () => list );
	}

	const pagination = {
    showSizeChanger: true,
    showQickJumper: false,
    showTotal: () => `共${total}条`,
    current: page.pageNum,
    pageSize: page.pageSize,
    total: total,
    onChange: (current: number, size: number) => {
			setPage({
				pageNum: current,
				pageSize: size
			})
		}
  };

	const api_chatLog = () => {
		let params = { ...pars, ...page };
		user.chatLog( params ).then( ( res: any ) => {
			setTotal( res.total );
			let _list = res.list === null ? [] : res.list;
			setLogList( () => [ ..._list ] );
		} );
	}

	useEffect( () => {
		api_chatLog()
	}, [ pars.userId, pars.keyword, page.pageNum, page.pageSize ] );

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
		<Modal width={500} onCancel={ () => setViewChatBox(false) } onOk={ () =>setViewChatBox(false) } visible={viewChatBox} title="聊天记录">
			<Spin spinning={msgLoading}>
				<div style={{ height: '400px', overflowY: 'auto' }}>
					<MessageList dataSource={msgLists} hideReply={true} />
					{/* {msgLists.length > 0 ? <ChatMessgeScroll hideInput={true} msgLists={msgLists} contentList={ contentList }></ChatMessgeScroll> : <div style={{textAlign: 'center', color: '#aaa'}}>没有数据</div>} */}
				</div>
			</Spin>
		</Modal>

		<Thumbnail></Thumbnail>

		<ContentInner>
			<Title level={5}>聊天记录</Title>
			<Form layout="inline" form={ searchForm } onFinish={ onFinish }>
				<Form.Item name="username" label="查找用户">
					<Input placeholder="输入用户名称/电话/邮箱" ></Input>
				</Form.Item>
				<Form.Item name="id" label="查找用户ID">
					<Input placeholder="输入用户ID"></Input>
				</Form.Item>
				<Form.Item >
					<Button type="primary" htmlType="submit">查询</Button>
				</Form.Item>
				<Form.Item >
					<Button type="primary" danger onClick={ () => { searchForm.setFieldsValue( { id: '', username: '' } ) } }>
						清空
					</Button>
				</Form.Item>
			</Form>
			<Datatable title={''}	columns={columns}	dataSource={logList} const pagination = {pagination} />
		</ContentInner>
	</ContentWrapper>
}