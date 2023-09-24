import React, { useRef, useState, useEffect } from 'react';

// Api
import { user } from '../../api';

// Hooks
import { useTheme } from '../../theme';

// Components
import { DeleteOutlined } from '@ant-design/icons';
import { Typography, Button, Row, Col, Input, Popconfirm } from 'antd';
import { Wrapper, ListWrapper, EditArea, ListWrapperParent, ListItem, ListItemColTop } from './styled';
const { Text } = Typography;
const { TextArea } = Input;

interface Ireply {
	createAt: string;
	id: string;
	reply: string;
	updateAt: string;
	userId: string;
}

interface Iprops {
	quickMsg?: (reply: string) => void
	setSendValue?: any;
	setViewQuickMessage?: any;
};


const QuickMessagePanel: React.FC<any> = ({ quickMsg = (reply: string) => { }, setSendValue, setViewQuickMessage }: Iprops) => {
	const [textareaValue, setTextareaValue] = useState('');

	// 添加常用语-show || hidden
	const [viewEdit, setViewEdit] = useState(false);

	const { theme } = useTheme();

	// 用户快捷列表
	const [replyList, setReplyList] = useState([{ createAt: '', id: '', reply: '', updateAt: '', userId: '' }]);


	/* -------------------- Api start -------------------- */
	// 获取用户快捷列表
	useEffect(() => {
		api_getReplyList();
	}, []);
	const api_getReplyList = async () => {
		await user.replyList().then((res: any) => {
			console.log("用户快捷列表", res);
			if ( res.code === 200 ) {
				let _data = res.data ? res.data : [];
				setReplyList( _data);
			}
			
		})
	};

	// 新增快捷回复
	const api_replySave = async (params: { reply: string }) => {
		await user.replySave(params).then((res: any) => {
			api_getReplyList();
		});
	};
	/* -------------------- Api end -------------------- */



	/* -------------------- Method start -------------------- */
	// 添加常用语显示隐藏
	const toggleViewEdit = (e: any) => {
		setViewEdit(!viewEdit);
		if (textareaValue.length > 0) {
			api_replySave({ reply: textareaValue });
			setTextareaValue('');
		};
	};

	// textArea 获取内容
	const handleTextArea = (value: string) => setTextareaValue(value);

	// 删除快捷常用语
	const deleteItem = (index: number) => {
		let list = replyList.slice();
		user.replyDel(list[index].id).then(res => {
			api_getReplyList();
		});
	};

	const addQuickMsg = (msg: string) => {
		setSendValue && setSendValue((pre: any) => pre + msg)
		setViewQuickMessage && setViewQuickMessage(false);
	}
	/* -------------------- Method end -------------------- */

	return (
		<Wrapper bg={theme.colors.white} color={theme.colors.bg1}>

			{/* 编辑常用语-start */}
			<Row justify="space-between" align="middle" style={{ borderBottom: '1px solid #ccc', boxSizing: 'border-box' }}>
				<Col><Text style={{ fontSize: '16px', fontWeight: 'bold', lineHeight: '30px' }}>常用语</Text></Col>
				<Col><Text style={{ fontSize: viewEdit ? '16px' : '30px', lineHeight: '30px', color: viewEdit ? 'red' : '#1890ff', cursor: 'pointer' }} onClick={toggleViewEdit}>{viewEdit ? '取消' : '+'}</Text></Col>
				{/* <Col><Button size="small" type="primary" onClick={ handleEditClick }>编辑</Button></Col> */}
			</Row>
			{/* 编辑常用语-end */}

			{/* 常用语-start */}
			<ListWrapperParent>
				<ListWrapper>
					{
						replyList.map((item: any, index: number) => (
							<ListItem key={index}>
								<Row>
									<Col span={20} onClick={addQuickMsg.bind(null, item.reply)}><ListItemColTop title={item.reply} onClick={() => { quickMsg && quickMsg(item.reply) }}>{item.reply}</ListItemColTop></Col>
									<Col span={4} style={{ textAlign: 'center', color: 'red' }}>
										<Popconfirm
											title={'是否删除当前常用语？'}
											icon={<DeleteOutlined />}
											okText="确认"
											cancelText="取消"
											onConfirm={() => deleteItem(index)}
										>
											<Button type="primary" danger size="small" shape="circle" icon={<DeleteOutlined />} />
										</Popconfirm>
									</Col>
								</Row>
							</ListItem>
						))
					}
				</ListWrapper>
			</ListWrapperParent>
			{/* 常用语-end */}

			{/* 添加常用语-start */}
			<EditArea>
				<Row align="middle" justify="space-between" style={{ display: viewEdit ? 'flex' : 'none' }}>
					<Col span={20}>
						<TextArea
							style={{ resize: 'none' }}
							value={textareaValue}
							onChange={(ev: any) => handleTextArea(ev.target.value)}></TextArea>
					</Col>
					<Col span={4} style={{ textAlign: 'right' }}>
						<Button type="primary" style={{ height: '50px' }} onClick={toggleViewEdit}>确定</Button>
					</Col>
				</Row>
			</EditArea>
			{/* 添加常用语-end */}

		</Wrapper>
	)
};

export default QuickMessagePanel;