import React, { Fragment, useCallback, useEffect, useRef, useState, } from 'react';
import { useParams,useLocation } from 'react-router-dom';
// Api
import { common, user } from '../../api';

// interpace
import { UploadFile } from 'antd/lib/upload/interface';
import { IuserList, IuserLevelList } from './interfaces';

// utils
import { getBase64 } from '../../utils/file';
import moment from 'moment'

// Components
import Topics from './topics';
import Comments from './comments';
import UserManage from './manage';
import UserAnalysis from './analysis';
import HistoryLogin from './history_login';
import HistoryWatch from './history_watch';
import HistoryChat from './history_message';
import UserStat from '../../components/UserStat';
import AuditList from './audit_list';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import Thumbnail from '../../components/Thumbnail';
import UserBanPanel from '../../components/UserBanPanel';
import Datatable, { Dialog } from '../../components/Datatable';
import { TableActionLink } from '../../components/Themeable';
import { ContentInner, ContentWrapper } from '../../components/Themeable';
import { Form, Input, Button, Select, Upload, Image, DatePicker, Radio, InputNumber } from 'antd';
import ViolationModal from '../../components/ViolationModal';
import env from '../../env'
import Permission from '../../components/Permission'
import { parseFileName } from '../../utils/uploadImage';

export { Comments, Topics, UserAnalysis, UserManage, HistoryLogin, HistoryWatch, HistoryChat, AuditList };

// 修改用户信息
interface IuserUpdate {
	id: string | number;
	nickName: string;
	avatar: string;
	userSex: number | string;
	accountBalance: number | string;
	status: number | string;
	vipId: number | string;
	signature: string,
	level: string,
	amount: string;
};


export default function User() {
	const [form] = Form.useForm();
	const [editFormRef] = Form.useForm();
	const { Option } = Select;
	const [viewEditForm, setViewEditForm] = useState(false);
	const [searchInfo, setSearchInfo] = useState({
		pageNum: 1,
		pageSize: 10,
	})
	const [total, setTotal] = useState(0)
	const [viewUserBanPanel, setViewUserBanPanel] = useState(false);
	const [file, setFile] = useState<UploadFile>(null as any);
	const [dateTime, setDateTime] = useState(null as any);
	const [userLevelList, setUserLevelList] = useState<IuserLevelList[]>([]);

	const [userList, setUserList] = useState<IuserList[]>([]);
	const [userId, setUserId] = useState<string | number>('');
	const [avatorUrl, setAvatorUrl] = useState<string[]>([]);
	const param: any = useParams();
	const location: any = useLocation();
	const uploadUrl = env.BASE_API_URL + '/common/sysFile/uploadImg';
	const [imgUrlList, setImgUrlList] = useState<any>([])
	const [previewSrc, setPreviewSrc] = useState('add')


	/* -------------------- Api start -------------------- */
	// init
	// useEffect(() => {
	// 	api_levelConfigAll();
	// }, []);

	useEffect(() => {
		if (location.state&&location.state.nickname) {
			form.setFieldsValue({
				keyword: location.state.nickname
			})
		}
		api_getUserList();
	}, [searchInfo])

	// 获取用户列表
	const api_getUserList = async () => {
		const values = form.getFieldsValue();
		await user.userList({ ...values, ...searchInfo }).then((res: any) => {
			console.log("用户列表", res);
			let list = res ? res.list : []
			setUserList([...list]);
			setTotal(res.total || 0)
		});
	};

	// 获取用户等级列表
	const api_levelConfigAll = async () => {
		await user.levelConfigAll().then((res: []) => {
			let _res = res ? res : [];
			setUserLevelList(() => [..._res]);
		})
	};

	// 用户列表-编辑 头像上传 
	const onFileChange = async (file: UploadFile) => {
		console.log("file", file)
		if (file.status == 'removed') {
			setFile(null as any);
			return
		}
		file.preview = await getBase64(file.originFileObj as any) as any;
		setFile(file);
	};

	// 修改用户信息
	const api_userUpdate = async (data: IuserUpdate) => {
		await user.userUpdate(data).then(res => {
			console.log("修改用户信息成功");
			setSearchInfo((pre) => {
				return {
					...pre,
					pageNum: 1
				};
			})
		});
	};

	// 解封用户
	const api_userLiftBan = async (id: string | number) => {
		common.userLiftBan(id).then(res => {
			setSearchInfo((pre) => {
				return {
					...pre,
					pageNum: 1
				};
			})
		})
	};

	/* -------------------- Api end -------------------- */



	/* -------------------- Method start -------------------- */
	// Modal - 编辑
	const handleEdit = (event: any, record: any) => {
		editFormRef.setFieldsValue(Object.assign({}, { ...record }, { birthday: record.birthday ? moment(record.birthday) : '', isVirtualAccount: record.isVirtualAccount || 0 }));
		setUserId(record.id);
		setViewEditForm(true);
		if (record.avatar) {
			setImgUrlList([{
				uid: '1',
				name: parseFileName(record.avatar),
				status: 'done',
				url: record.avatar,
			}])
		}
		return false;
	};
	// Modal - 封禁
	const handleBan = (event: any, record: any, index: number) => {
		event.preventDefault();
		let { id, status } = record;
		if (status === 0) {
			setUserId(id);
			setViewUserBanPanel(true);
		} else {
			console.log("解封");
			api_userLiftBan(id);
		};
		return false;
	};

	// 用户列表-编辑 提交
	const handleEditConfirm = () => {
		let fileName = getFileName(imgUrlList)
		let data = { ...editFormRef.getFieldsValue(), id: userId, avatar: fileName, birthday: dateTime };
		api_userUpdate(data);
		setViewEditForm(false);
	};
	function getFileName (val) {
    if (val) {
      const target = val[0]
      if (target?.response?.code === 200) return target?.response?.data?.fileName
      if (target?.name) return target.name
    }
    return ''
  }
	// 用户列表-筛选用户状态
	const filterUserStatus = (status: number) => {
		switch (status) {
			case 0:
				return '正常';
			case 1:
				return '永久封禁';
			case 2:
				return '禁言';
		};
	};

	// 用户列表-搜索 表查询
	const confirmOnFinish = () => {
		setSearchInfo((pre) => {
			return {
				...pre,
				pageNum: 1
			};
		})
	};

	// 用户列表-编辑 获取出生日期
	const getBirthday = (date: any, dateString: string) => setDateTime(dateString)

	// 封禁 - 更新用户列表
	const updateUserList = (bool: boolean) => {
		console.log("更新用户列表", bool);
		bool && setSearchInfo((pre) => {
			return {
				...pre,
				pageNum: 1
			};
		})
	};

	function showPreview (val) {
    const target = val[0]
    if (target) {
      if (target.url) {
        setPreviewSrc(target.url)
      }
      if (target.thumbUrl) {
        setPreviewSrc(target.thumbUrl)
      }
      setTimeout(() => {
        document.querySelector('.preview-image')?.click()
      })
    }
  }
	function onImgUpload ({ fileList }) {
    setImgUrlList(fileList)
  }
	const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );
	/* -------------------- Method end -------------------- */




	/* -------------------- Ui start -------------------- */
	// 用户列表-搜索
	const ui_searchForm = () => (
		<Form layout="inline" form={form} onFinish={confirmOnFinish} initialValues={{ keyword: '', id: '', level: '', status: '' }}>
			<Form.Item label="查找用户名" name="keyword" >
				<Input placeholder="请输入用户名称/电话/邮箱" />
			</Form.Item>
			<Form.Item label="查找用户ID" name="id">
				<Input placeholder="输入用户ID" />
			</Form.Item>
			<Form.Item label="论坛等级" name="vipId">
				<Input placeholder="输入论坛等级" />
			</Form.Item>
			<Form.Item label="用户状态" name="status">
				<Select style={{ width: '150px' }}>
					<Option value="">全部</Option>
					<Option value="0">正常</Option>
					<Option value="1">永久封禁</Option>
					<Option value="2">禁言</Option>
				</Select>
			</Form.Item>
			<Form.Item label="官方账号" name="isVirtualAccount">
				<Select placeholder="官方账号" style={{ width: '120px' }} allowClear>
					<Option value={1}>是</Option> 
					<Option value={0}>否</Option>
				</Select>
			</Form.Item>
			<Form.Item>
				<Button type="primary" htmlType="submit">确定</Button>
			</Form.Item>
		</Form>
	);
	/* -------------------- Ui end -------------------- */



	/* -------------------- Options start -------------------- */
	// 用户列表-title展示
	const columns = [
		{ title: '用户ID', dataIndex: 'id', key: 'id', align: 'center' },
		{ title: '昵称', dataIndex: 'nickName', key: 'nickName', align: 'center' },
		{ title: '用户名', dataIndex: 'username', key: 'username', align: 'center' },
		{ title: '官方账号', dataIndex: 'isVirtualAccount', key: 'isVirtualAccount', align: 'center', render: text => text === 1 ? '是' : '否' },
		{ title: '头像', dataIndex: 'avatar', key: 'avatar', align: 'center', render: (avatar: any, record: any, index: number) => <img style={{ width: '40px', height: '40px', borderRadius: '20px' }} src={record.avatar} alt="" /> },
		{ title: '论坛等级', dataIndex: 'vipId', key: 'vipId', align: 'center' },
		{ title: '关注/粉丝', key: 'follow', align: 'center', render: (text: any, record: any) => `${record.follow}` },
		{ title: '注册时间', key: 'createTime', align: 'center', dataIndex: 'createTime' },
		{ title: '用户状态', dataIndex: 'status', align: 'center', key: 'status', render: (avatar: any, record: any) => filterUserStatus(record.status) },
		{
			title: '操作', key: 'action', align: 'center',
			render: (text: any, record: any, index: number) => (
				<>
					<Permission perms="novel:user:edit">
						<TableActionLink onClick={(event: any) => handleEdit(event, record)} to={''}>编辑 | </TableActionLink>
					</Permission>
					<TableActionLink to={{ pathname: '/dashboard/user/topics', state: { id: record.id, name: record.nickName } }}>帖子 | </TableActionLink>
					<TableActionLink to={{ pathname: '/dashboard/user/comments', state: { userId: record.id, name: record.nickName } }}>评论 | </TableActionLink>
					<Permission perms="novel:user:banUser">
						<TableActionLink to={''} onClick={(event: any) => handleBan(event, record, index)} >{record.status === 0 ? '封禁' : '解封'}</TableActionLink>
					</Permission>
				</>
			)
		}
	];
	/* -------------------- Options end -------------------- */
	const pagination = {
		showSizeChanger: true,
		showQickJumper: false,
		showTotal: () => `共${total}条`,
		current: searchInfo.pageNum,
		pageSize: searchInfo.pageSize,
		total: total,
		onChange: (current: number, size: number) => setSearchInfo((pre) => ({ ...pre, pageNum: current, pageSize: size }))
	};


	return (
		<ContentWrapper>

			{/* 编辑-start */}
			<Dialog title="编辑用户" okText="提交" cancelText="取消" onOk={handleEditConfirm} onCancel={() => setViewEditForm(false)} visible={viewEditForm} >
				<Form labelCol={{ span: 5 }} layout="horizontal" form={editFormRef}>
					<Form.Item label="用户头像" name="avatar">
						<Upload
							action={uploadUrl}
							fileList={imgUrlList}
							accept="image/*"
							listType="picture-card"
							onPreview={() => showPreview(imgUrlList)}
							onChange={onImgUpload}>
							{imgUrlList.length > 0 ? null : uploadButton}
						</Upload>
					</Form.Item>
					<Form.Item label="昵称" name="nickName"><Input /></Form.Item>
					<Form.Item label="官方账号" name="isVirtualAccount">
						<Radio.Group
							options={[
								{ label: '是', value: 1 },
    						{ label: '否', value: 0 }
							]}
						/>
					</Form.Item>
					<Form.Item label="手机号" name="phone"><Input /></Form.Item>
					<Form.Item label="出生日期" name="birthday"><DatePicker onChange={getBirthday} format="YYYY-MM-DD" placeholder="选择日期" /></Form.Item>
					<Form.Item label="性别" name="userSex">
						<Select >
							<Option value="0">男</Option>
							<Option value="1">女</Option>
						</Select>
					</Form.Item>
					<Form.Item label="用户等级" name="vipId">
						<InputNumber
							style={{ width: '100%' }}
							min={1}
							precision={0}
							placeholder="请输入用户等级" />
					</Form.Item>
					<Form.Item label="用户经验" name="amount"><Input /></Form.Item>
					<Form.Item label="简介" name="signature"><Input.TextArea /></Form.Item>
				</Form>
			</Dialog>
			{/* 编辑-end */}

			{/* 封禁 开始 */}
			<ViolationModal
				visible={viewUserBanPanel}
				id={userId}
				onCancel={() => setViewUserBanPanel(false)}
				submitSuccess={() => updateUserList(true)} />
			{/* <UserBanPanel show={viewUserBanPanel} onOk={() => setViewUserBanPanel(false)} onCancel={() => setViewUserBanPanel(false)} id={userId} updade={updateUserList} /> */}
			{/* 封禁 结束 */}

			<Thumbnail />

			<ContentInner>
				<UserStat />
			</ContentInner>

			<ContentInner style={{ marginTop: '15px' }} >
				<Datatable prefix={ui_searchForm()} title="用户列表" columns={columns} dataSource={userList} pagination={pagination} />
			</ContentInner>
			<Image
				className="preview-image"
				style={{ display: 'none' }}
				src={previewSrc}
			/>
		</ContentWrapper>
	);
}