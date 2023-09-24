import React, { useState, useRef, useImperativeHandle } from 'react';

import {
	ContentInner, ContentWrapper, TableActionLink,
} from '../../components/Themeable';
import {
	Button,
	Input,
	DatePicker,
	Space,
	Typography,
	Form,
	Modal,
	Row,
	Col,
	message
} from 'antd';

import {
	LinkOutlined
} from '@ant-design/icons';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useTheme } from '../../theme';
import Styled, { css } from 'styled-components';
import { tracateString } from '../../utils/utils';
import Thumbnail from '../../components/Thumbnail';
import Datatable from '../../components/Datatable';
import { saveBatch, getMessageList, IMessageList } from '../../api/reception';
import { useEffect } from 'react';
import moment from 'moment';
import Permission from '../../components/Permission';

const {
	RangePicker
} = DatePicker;

const { Title } = Typography

const SelectedUserWrapper = Styled.div`
	padding: 5px 3px;
	font-size: 13px;
	${(props: any) => css`
		background: ${props.bg};
		color: ${props.color};
	` }
`

interface ITypeValue {
	systemType: number;
	receiver?: string;
}

interface ITypeTag {
	value?: ITypeValue;
	onChange?: (value: ITypeValue) => void;
}

interface IContentEditor {
	getRef: (el: any) => void;
	value?: string;
	onChange: () => void;
}

interface IFormContainer {
	submitSuccess: () => void
}

interface IListRef {
	initData: () => void
}

const TypeTag: React.FC<ITypeTag> = ({ value = {}, onChange }) => {
	const [formRef] = Form.useForm()
	const { theme } = useTheme();
	const [showSelectUser, setShowSelectUser] = useState(false);
	const triggerChange = (changedValue: ITypeValue) => {
		onChange?.(changedValue);
	};
	const selectedUser = value.systemType === -1 ? '' : value.systemType === 1 ? 'all' : 'appointment'
	const onTagChange = (tagType: string, receiver?: string) => {
		const systemType = tagType === '' ? -1 : tagType === 'all' ? 1 : 0;
		triggerChange({
			systemType,
			receiver
		})
	}
	const onOk = () => {
		onTagChange('appointment', formRef.getFieldValue('receiver'))
		setShowSelectUser(false)
	}
	useEffect(() => {
		formRef.setFieldsValue({
			receiver: value.receiver
		})
	}, [formRef, value.receiver])
	const selectedUserView = (
		<Space direction="horizontal">
			<LinkOutlined style={{ color: theme.colors.bg1 }}></LinkOutlined>
			<SelectedUserWrapper>
				<span>已选择{value.receiver && value.receiver.split("|").length}名用户:{tracateString(value.receiver || '', 15)} </span>
				<Space direction="horizontal">
					<TableActionLink onClick={() => setShowSelectUser(true)}>编辑</TableActionLink>
					<TableActionLink onClick={() => onTagChange('')}>删除</TableActionLink>
				</Space>
			</SelectedUserWrapper>
		</Space>
	);
	return (
		<>
			<Space direction="horizontal">
				<Button type={selectedUser === 'all' ? 'primary' : 'default'} onClick={() => onTagChange('all')}>全体用户</Button>
				<Button type={selectedUser === 'appointment' ? 'primary' : 'default'} onClick={() => setShowSelectUser(true)}>+部分或单一用户</Button>
				{selectedUser !== '' && selectedUser !== 'all' ? selectedUserView : null}
			</Space>
			<Modal onOk={onOk} onCancel={() => setShowSelectUser(false)} title="添加用户" visible={showSelectUser}>
				<Form form={formRef} layout="horizontal" labelCol={{ span: 6 }}>
					<Form.Item name="receiver" label="添加用户ID" rules={[{ required: true, message: '请添加用户ID' }]}>
						<Input placeholder="请输入用户ID, 以 | 分隔。"></Input>
					</Form.Item>
				</Form>
			</Modal>
		</>
	)
}

const ContentEditor: React.FC<IContentEditor> = ({ value, onChange, getRef }) => {
	return (
		<ReactQuill theme="snow" ref={(el) => getRef(el)} onChange={onChange}>
			<div style={{ height: '200px' }}></div>
		</ReactQuill>
	)
}

const FormContainer: React.FC<IFormContainer> = (props) => {
	const [loading, setLoading] = useState(false)
	const [showError, setShowError] = useState(false);
	const [formRef] = Form.useForm()
	const editorRef: any = useRef();
	const typeValidator = (_: any, value: ITypeValue) => {
		if (value.systemType === -1) {
			return Promise.reject(new Error('请选择发送对象'));
		}
		return Promise.resolve();
	}
	const editorChange = () => {
		setShowError(false);
	}
	const onSend = () => {
		const editor = editorRef.current.getEditor();
		const unprivilegedEditor = editorRef.current.makeUnprivilegedEditor(editor);
		const text = unprivilegedEditor.getText();
		const content = unprivilegedEditor.getHTML();

		if (text.trim() === '') {
			setShowError(true)
		}
		formRef.validateFields().then((values) => {
			if (text.trim() !== '') {
				setLoading(true)
				saveBatch({
					title: '系统消息标题',
					content: content,
					...values.tag
				}).then(() => {
					message.success('发送成功');
					editorRef.current.setEditorContents(editor, '')
					formRef.setFieldsValue({
						tag: {
							systemType: -1,
							receiver: ''
						},
					})
					props.submitSuccess();
				}).finally(() => {
					setLoading(false)
				});
			}
		})



		setLoading(false)

	}
	const getRef = (el: any) => {
		editorRef.current = el;
	}
	return (
		<>
			<Title level={5}>群发消息</Title>
			<Form
				form={formRef}
				initialValues={{
					tag: {
						systemType: -1,
						receiver: ''
					},
					content: ''
				}}
			>
				<Form.Item name="tag" rules={[{ validator: typeValidator }]}><TypeTag /></Form.Item>
				<ContentEditor getRef={getRef} onChange={editorChange} />
				{showError && (<span style={{ fontSize: 14, color: '#ff4d4f' }}>请输入内容</span >)}
				<Permission perms="system:message:add">
					<Form.Item style={{ marginTop: 20 }}>
						<Row justify="center">
							<Col><Button onClick={onSend} loading={loading} style={{ width: '200px' }} type="primary" htmlType="submit">发送</Button></Col>
						</Row>
					</Form.Item>
				</Permission>
			</Form>
		</>
	)
}

const ListContainer = React.forwardRef<IListRef>((props, ref) => {
	const [loading, setLoading] = useState(false)
	const [tableData, setTableData] = useState([])
	const [total, setTotal] = useState(0)
	const [formRef] = Form.useForm();
	const [searchInfo, setSearchInfo] = useState({
		offset: 0,
		limit: 10,
	})
	const columns = [{
		title: '记录ID',
		dataIndex: 'id',
		align: 'center',
		width: 200
	}, {
		title: '接受用户',
		dataIndex: 'receiver',
		align: 'center',
		ellipsis: true,
		width: 150
	}, {
		title: '消息内容',
		dataIndex: 'content',
		align: 'center',
		render: (text: string) => (<div dangerouslySetInnerHTML={{ __html: text }} />)
	}, {
		title: '发送时间',
		dataIndex: 'createAt',
		align: 'center',
		width: 180
	}, {
		title: '消息状态',
		dataIndex: 'status',
		align: 'center',
		width: 100
	}, {
		title: '操作人',
		dataIndex: 'senderName',
		align: 'center',
		width: 100
	}, {
		title: '操作',
		width: 100,
		align: 'center',
		render(text: string, record: any) {
			return <Permission perms="system:message:add">
				<TableActionLink onClick={() => reSend(record)}>重新发送</TableActionLink>
			</Permission>
		},
	}];
	const pagination = {
		showSizeChanger: true,
		showQickJumper: false,
		showTotal: () => `共${total}条`,
		current: searchInfo.offset + 1,
		pageSize: searchInfo.limit,
		total: total,
		onChange: (current: number, size: number) => setSearchInfo((pre) => ({ ...pre, offset: current - 1, limit: size }))
	};
	const getTableData = (params: IMessageList) => {
		setLoading(true)
		getMessageList(params).then(data => {
			const rows = data ? data.rows : []
			setTableData(rows)
			setTotal(data ? data.total : 0)
		}).finally(() => {
			setLoading(false)
		})
	}
	const reSend = (data: any) => {
		setLoading(true)
		saveBatch({
			title: '系统消息标题',
			content: data.content,
			systemType: data.systemType,
			receiver: data.systemType === 0 ? data.receiver : undefined
		}).then(() => {
			message.success('发送成功');
			setSearchInfo((pre) => ({ ...pre }))
		}).finally(() => {
			setLoading(false)
		});
	}
	const onSearch = (values: any) => {
		// todo 等后端确认参数
		const param: any = {
			content: undefined,
			startTime: undefined,
			endTime: undefined,
		};
		if (values.content) param.content = values.content;
		if (values.date) {
			param.startTime = values.date[0].format('YYYY-MM-DD');
			param.endTime = values.date[1].format('YYYY-MM-DD');
		}

		setSearchInfo((pre) => ({ ...pre, ...param, offset: 0 }))
	}
	useImperativeHandle(ref, () => ({
		initData: () => {
			setSearchInfo((pre) => ({ ...pre, offset: 0 }))
		}
	}))
	const filterForm = (
		<Form form={formRef} layout="inline" onFinish={onSearch}>
			<Form.Item label="查找消息" name="content">
				<Input placeholder="输入消息内容"></Input>
			</Form.Item>
			<Form.Item>
				<Button type="primary" onClick={formRef.submit}>确定</Button>
			</Form.Item>
			<Form.Item name="date">
				<RangePicker onChange={formRef.submit}></RangePicker>
			</Form.Item>
		</Form>
	)
	useEffect(() => {
		getTableData({ ...searchInfo, offset: searchInfo.offset * 10 })
	}, [searchInfo])
	return <Datatable title="" loading={loading} prefix={filterForm} dataSource={tableData} columns={columns} pagination={pagination}></Datatable>
})

export default function Broadcase() {
	const listRef = useRef<IListRef>(null)
	const submitSuccess = () => {
		listRef?.current?.initData()
	}
	return <ContentWrapper>
		<Thumbnail></Thumbnail>
		<ContentInner>
			<FormContainer submitSuccess={submitSuccess} />
		</ContentInner>
		<ContentInner style={{ marginTop: '20px' }}>
			<ListContainer ref={listRef} />
		</ContentInner>
	</ContentWrapper>
}