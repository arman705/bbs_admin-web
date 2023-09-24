import React, { useEffect, useRef, useState } from 'react';

// Api
import { plate, common } from '../../api';

// Hook
import { useTheme } from '../../theme';

// Utils
import { getBase64 } from '../../utils/file';
import { UploadFile } from 'antd/lib/upload/interface';

// Components
import { TabWrapper } from './styled';
import Thumbnail from '../../components/Thumbnail';
import ModuleCard from '../../components/ModuleCard';
import ColorPicker from '../../components/ColorPicker';
import { ContentWrapper, ContentInner } from '../../components/Themeable';
import { SmileOutlined, MinusCircleFilled, PlusOutlined, UploadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Typography, Row, Col, Form, Modal, Input, Select, Upload, Image, Popconfirm, message } from 'antd';
import Permission from '../../components/Permission'
import { hasPermission } from '../../utils/utils'

const { Title } = Typography;
const { Item } = Form;
const { Option } = Select;
const { confirm } = Modal;
interface IcolorRef {
	id?: string | number;
	scope?: string;
	imgUrl?: string;
	imgIcon?: string;
	name?: string;
	color?: string;
	userLevelId?: string | number;
	subTitle?: string;
};

const Module: React.FC = () => {
	const [catForm] = Form.useForm();
	const { theme } = useTheme();
	const platListRef = useRef<string[]>([]);
	const colorRef = useRef<IcolorRef>(null as any);
	const subType = useRef<string>('submit');
	const [editForm] = Form.useForm(); 		//一级form	
	const [editSecondForm] = Form.useForm();		//二级form															// 板块列表-表单
	const [platList, setPlatList] = useState<string[]>([]); 								// 板块分类列表
	const [articleTypeList, setArticleTypeList] = useState<any>([]);  			// 板块列表
	const [bgfile, setBgFile] = useState<string|undefined>('');						// 上传背景图片
	const [iconFile, setIconFile] = useState<string|undefined>(''); 		// 上传图标
	const [selectedCategory, setSelectedCategory] = useState<string>(''); // 分类
	const [viewCatForm, setViewCatForm] = useState(false);
	const [viewModuleEditForm, setViewModuleEditForm] = useState(false);
	const [viewSecondLayerEditForm, setViewSecondLayerEditForm] = useState(false);
	const [secondLayerTitle, setSecondLayerTitle] = useState("");
	const [firstLayerTitle, setFirstLayerTitle] = useState("");
	const [firstID, setFirstID] = useState("");
	const [secondID, setSecondID] = useState("");
	const [initialForm, setInitialFrom] = useState<any>([]);  


	/* -------------------- Api start -------------------- */

	useEffect(() => {
		setPlatList((prevState) => [...prevState])
	}, [platList.length]);

	useEffect(() => {
		if (viewModuleEditForm) {
			console.log('')
		}
	}, [viewModuleEditForm])


	// 板块分类
	useEffect(() => {
		api_getScope();
	}, []);
	const api_getScope = async () => {
		await plate.getScope().then((res: string[]) => {
			let list = res ? res : []
			let firstName = list[0].scope ? list[0].scope : 'NoData';
			platListRef.current = [...list];
			setPlatList(() => [...list]);
			setSelectedCategory(firstName);
			api_articleTypeList(firstName);
		});
	};

	// 板块列表
	const api_articleTypeList = async (scope: string) => {
		let params = { scope, limit: 1000 };
		await plate.articleTypeList(params).then((res: any) => {
			setArticleTypeList([...res?.rows])
		});
	};

	// 删除板块 api
	const api_articleTypeRemove = async (id: string | number, index: number) => {
		await plate.articleTypeRemove({ id }).then((res: any) => {
			let copy_articleTypeList = articleTypeList.slice();
			copy_articleTypeList.splice(index, 1);
			setArticleTypeList(() => [...copy_articleTypeList]);
		});
	};

	// 清除form数据
	const clearFormData = () => {
		editForm.setFieldsValue({imgIcon: '', scope: '', color: '', userLevelId: '', subTitle: '', sortScope: 0 });
		editForm.resetFields();
		editSecondForm.resetFields();
		// setBgFile('');
		setIconFile('');
	}

	// 修改板块列表 & 新增板块列表- 一级
	const api_updateorSave = async () => {
		let formData = editForm.getFieldsValue();
		let { current } = colorRef;
		let data = { ...formData, ...current }
		let updateData;
		// if ( subType.current === 'submit' ) {
		// 	await plate.articleTypeUpdate( data ).then( ( res: any ) => {} );
		// }else{
		if (initialForm.imgIcon !== data.imgIcon) {
			updateData= {...updateData, 'imgIcon': data.imgIcon }
		}
		if (initialForm.color !== data.color) {
			updateData= {...updateData, 'color': data.color }
		}
		if (initialForm.scope !== data.scope) {
			updateData= {...updateData, 'scope': data.scope }
		}
		if (initialForm.userLevelId !== data.userLevelId) {
			updateData= {...updateData, 'userLevelId': data.userLevelId }
		}
		if (initialForm.subTitle !== data.subTitle) {
			updateData= {...updateData, 'subTitle': data.subTitle }
		}
		if (initialForm.sortScope !== data.sortScope) {
			updateData= {...updateData, 'sortScope': data.sortScope }
		}
		updateData={ ...updateData,'oldScope': firstID}
		if (firstLayerTitle === '编辑分类') {
			await plate.articleScopeUpdate(updateData);

		} else {
			await plate.articleTypeSave({ ...data});
		}
		// };
		setBgFile(null as any);
		setIconFile(null as any);
		editForm.setFieldsValue({ imgIcon: '', scope: '', color: '', userLevelId: '', subTitle: '', sortScope: 0 });
		api_getScope()
	};

	// 修改板块列表 & 新增板块列表 二级
	const api_updateorSaveSecond = async () => {
		let formData = editSecondForm.getFieldsValue();
		let data = { ...formData }
		if (secondLayerTitle == '编辑') {
			await plate.articleTypeUpdate({ ...data, scope: selectedCategory, id: secondID  });
		} else {
			await plate.articleTypeSave({ ...data, scope: selectedCategory  });
		}
		editSecondForm.setFieldsValue({ name: '', sortName: 0 });
		// api_getScope()
		api_articleTypeList(selectedCategory)
	};

	const api_updateScope = async (data: { newScope: string, oldScope: string, imgIcon: string }) => {
		await plate.updateScope(data).then(res => {
			console.log("修改成功", res);
			api_getScope();
		});
	};

	/* -------------------- Api end -------------------- */


	/* -------------------- Methods start -------------------- */

	// 板块分类切换 & 板块列表数据更新
	const handleCategoryClick = (cat: string) => {
		api_articleTypeList(cat);
		setSelectedCategory(cat)
	};

	// 板块列表修改一级
	const handleEditModule = (index: number, item: any) => {
		console.log( "handleEditModule", item )
		let { current } = colorRef;
		colorRef.current = Object.assign({ ...current });
		editForm.setFieldsValue({
			imgIcon: item.imgIcon,
			scope: item.scope,
			color: item.color,
			userLevelId: item.userLevelId ? item.userLevelId : "",
			subTitle: item.subTitle,
			sortScope: item.sortScope || 0
		});
		setInitialFrom({
			imgIcon: item.imgIcon,
			scope: item.scope,
			color: item.color,
			userLevelId: item.userLevelId ? item.userLevelId : "",
			subTitle: item.subTitle,
		})
		setFirstID(item.scope)
		// setBgFile(item.imgUrl);
		setIconFile(item.imgIcon);
		// if (item.imgUrl) {
		// 	const path = item.imgUrl.substr(0, item.imgUrl.indexOf('?'))
		// 	const name = path.substr(path.lastIndexOf('/') + 1)
		// 	setBgFile({
		// 		uid: name,
		// 		preview: item.imgUrl,
		// 		fileName: name,
		// 		name
		// 	})
		// }
		// if (item.imgIcon) {
		// 	const path = item.imgIcon.substr(0, item.imgIcon.indexOf('?'))
		// 	const name = path.substr(path.lastIndexOf('/') + 1)
		// 	setIconFile({
		// 		uid: name,
		// 		preview: item.imgIcon,
		// 		fileName: name,
		// 		name
		// 	})
		// }
		setViewModuleEditForm(true);
		subType.current = 'submit';
	};

	// 编辑板块-弹窗提交
	const editConfrim = () => {
		console.log('vvvv----------')
		let formData = editForm.getFieldsValue();
		if (!formData.imgIcon) {
			message.warn('请上载图标');
			return
		}
		// if (!formData.imgUrl) {
		// 	message.warn('请上载背景图片');
		// 	return
		// }
		if(!formData.scope) {
			message.warn('请输入板块名称');
			return
		}
		if(!formData.subTitle) {
			message.warn('请输入板块副标题')
			return
		}
		api_updateorSave();
		setViewModuleEditForm(false);
		clearFormData();
	};

	const editConfrimSecond = () => {
		api_updateorSaveSecond();
		setViewSecondLayerEditForm(false)
		clearFormData();
	}

	// 编辑板块-获取颜色
	const getColor = (color: string) => {
		let { current } = colorRef;
		colorRef.current = Object.assign({ ...current, color });
		editForm.setFieldsValue({
			color: color,
		});
	};

	// 板块列表删除二级
	const handleDeleteModule = (id: string | number, index: number) => {
		confirm({
			title: '确定删除吗',
			okText: '确定',
			cancelText: '取消',
			onOk() {
				api_articleTypeRemove(id, index)
			},
			onCancel() {
			},
		});
	};

	// 板块列表修改二级
	const handleEditSecondModule = (index: number, item: any) => { 
		setSecondID(item.id)
		setViewSecondLayerEditForm(true);
		setSecondLayerTitle("编辑");
		editSecondForm.setFieldsValue({
			name: item.name,
			sortName: item.sortName || 0
		});
	}

	// 上传头像
	const onFileChange = async (file: UploadFile, type: string) => {
		if (file.status == 'removed') {
			if (type === 'bg') {
				setBgFile(null as any);
			} else if (type === 'icon') {
				setIconFile(null as any);
			}
			return;
		};
		file.preview = await getBase64(file.originFileObj as any) as any;
		type === 'bg' ? setBgFile(file.preview) : setIconFile(file.preview);
		let { current } = colorRef;
		let fileName = file.response ? file.response?.data?.fileName : '';
		editForm.setFieldsValue({
			imgIcon: fileName,
		});
		colorRef.current = Object.assign({ ...current, [type === 'bg' ? "imgUrl" : 'imgIcon']: fileName });
	};

	// 删除一级板块分类
	const deleteScope = async (scope: string, index: number) => {
		await plate.deleteScope({ scope }).then((res: any) => {
			api_getScope();
		});
	}

	// 新增一级
	const addPlate = async () => {
		setViewCatForm(false);
		setViewModuleEditForm(false);
	};

	// 取消一级
	const cancelPlate = () => {
		setViewCatForm(false);
		setViewModuleEditForm(false);
	};

	//刷新缓存
	const refresh = () => {
		plate.refreshScope().then((res: any) => {
			console.log(res)
			message.success('刷新成功');
		});
	}

	/* -------------------- Methods end -------------------- */


	/* -------------------- UI start -------------------- */
	// 上传图片组件
	const UploadPreview = (file: string | undefined, text: string, type: string) => (
		<div style={{ width: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
			{file && <Image width={100} src={file} />}
			<Upload action={common.uploadImgUrl} showUploadList={false} onChange={({ file, fileList }) => onFileChange(file, type)} >
				<Button  style={{ marginTop: '10px'}} icon={<UploadOutlined />}>{text}</Button>
			</Upload>
		</div>
	);
	/* -------------------- UI end -------------------- */


	/* -------------------- Options start -------------------- */
	const cssProps = {
		bg: theme.colors.bg4,
		color: theme.colors.black,
		selectedColor: theme.colors.bg1,
	};

	const newAddWrap: any = {
		background: '#fff',
		width: '240px',
		height: '150px',
		lineHeight: '150px',
		textAlign: 'center',
		cursor: 'pointer',
		margin: '0 10px',
		color: '#808080',
		fontSize: '18px'
	};
	/* -------------------- Options end -------------------- */

	const onSortScopeChange = async (item, e) => {
		await plate.articleScopeUpdate({
			oldScope: item.scope,
			sortScope: item.sortScope
		})
	}
	return (
		<ContentWrapper>
			<Thumbnail></Thumbnail>

			{/* 菜单板块分类编辑 开始 */}
			<Modal visible={viewCatForm}
				title="编辑分类"
				okText="确定"
				cancelText="取消"
				onOk={addPlate}
				onCancel={cancelPlate}>
					<Row>
						<Col flex="auto">名称</Col>
						<Col style={{ width: 100, margin: '0 10px' }}>排序</Col>
						<Col style={{ width: 40 }}>操作</Col>
					</Row>
					{
						platList.map((category : any, index: number) => (
							<Form.Item validateStatus="error" help="分类下包含板块，请先删除板块。" key={category.scope} name={`category_${index}`}>
								<Row style={{ width: '100%', cursor: 'pointer' }} wrap={false} justify="center" align="middle">
									<Col flex="auto"><Input defaultValue={category.scope} disabled></Input></Col>
									<Col style={{ width: 100, margin: '0 10px' }}>
										<Input
											value={category.sortScope || 0}
											type="number"
											disabled={!hasPermission('novel:articleTypeScope:edit')}
											onFocus={(e) => e.target.select()}
											onChange={(e) => {
												category.sortScope = Number(e.target.value)
												setPlatList([...platList])
											}}
											onBlur={(e) => onSortScopeChange(category, e)} />
									</Col>
									<Col style={{ width: 40 }}>
										<Permission perms="novel:articleTypeScope:edit">
											<EditOutlined style={{ marginRight: '10px', color: 'blue', cursor: 'pointer' }} onClick={() => { setFirstLayerTitle('编辑分类'); setViewModuleEditForm(true); handleEditModule(index, category); }} />
										</Permission>
										<Permission perms="novel:articleType:deleteScope">
											<Popconfirm title={`确定要删除${category.scope}吗？`} okText="确定" cancelText="取消" onConfirm={() => deleteScope(category.scope, index)}>
												<DeleteOutlined style={{ color: theme.colors.bg2 }} />
											</Popconfirm>
										</Permission>
									</Col>
								</Row>
							</Form.Item>

						))
					}

					<Modal visible={viewModuleEditForm} okText="确定" cancelText="取消" title={firstLayerTitle} onOk={() => { editConfrim() }} onCancel={() => { clearFormData(); setViewModuleEditForm(false) }}>
						<Form form={editForm} name="module_edit" labelCol={{ span: 8 }} layout="horizontal">
							{/* <Item label="背景图片" name="imgUrl" required rules={[{ required: true, message: '请上传板块背景图片' }]}>
								{UploadPreview(bgfile, '请上传背景图片', 'bg')}
							</Item> */}
							<Item label="图标" name="imgIcon" required rules={[{ required: true, message: '请上传板块图标' }]}>
								{UploadPreview(iconFile, '请上传图标', 'icon')}
							</Item>
							<Item label="板块名称" name="scope" required rules={[{ required: true, message: '请填写板块名称' }]}>
								<Input placeholder="板块名称"></Input>
							</Item>
							<Item label="板块颜色" name="color" required rules={[{ required: true, message: '请选择板块颜色' }]}>
								<ColorPicker getColor={getColor}></ColorPicker>
							</Item>
							<Item label="用户等级限制" name="userLevelId" required tooltip={'用户达到指定等级 才能访问板块内容'}>
								<Select defaultValue="">
									<Option value="">不限制</Option>
									<Option value="1">Level 1</Option>
								</Select>
							</Item>
							<Item label="板块副标题" name="subTitle" required>
								<Input placeholder="请输入板块副标题"></Input>
							</Item>
							<Item label="排序" name="sortScope" required>
								<Input placeholder="请输入排序" type="number" onBlur={(e) => editForm.setFieldsValue({ sortScope: Math.floor(e.target.value) })}></Input>
							</Item>
						</Form>
					</Modal>
					<Row justify="center">
						<Permission perms="novel:articleTypeScope:add">
							<Col><Button onClick={() => {setViewModuleEditForm(!viewModuleEditForm); setFirstLayerTitle('新增分类');}} icon={<PlusOutlined />} type="dashed">{!viewModuleEditForm ? `新增分类` : `取消新增`}</Button></Col>
						</Permission>
					</Row>
			</Modal>

			{/* 板块分类菜单 开始 */}
			<ContentInner>
				<Title level={5}>板块管理</Title>
				<Row justify="start" align="middle" style={{ marginTop: '25px' }}>
					{
						platList.map(category => (
							<TabWrapper
								key={category.scope}
								onClick={() => handleCategoryClick(category.scope)}
								{...cssProps}
								selected={selectedCategory == category.scope}
							>
								{category.scope}
							</TabWrapper>
						))
					}
					<Col offset={1}>
						<Button onClick={() => { setViewCatForm(true); console.log("编辑分类", platList) }} type="primary" icon={<SmileOutlined />}>编辑分类</Button> &nbsp;
						<Permission perms="novel:articleType:cache">
							<Button onClick={() => refresh() }type="primary">刷新缓存</Button>
						</Permission>
					</Col>
				</Row>
			</ContentInner>
			{/* 板块分类菜单 结束 */}


			{/* 编辑板块 Modal 开始 */}
			<Modal visible={viewSecondLayerEditForm} okText="确定" cancelText="取消" title={secondLayerTitle} onOk={() => { editConfrimSecond() }} onCancel={() => { clearFormData(); setViewSecondLayerEditForm(false) }}>
				<Form form={editSecondForm} name="module_edit" labelCol={{ span: 8 }} layout="horizontal">
					<Item label="板块名称" name="name" required rules={[{ required: true, message: '请填写板块名称' }]}>
						<Input placeholder="板块名称"></Input>
					</Item>
					<Item label="排序" name="sortName" required rules={[{ required: true, message: '请填写排序' }]}>
						<Input placeholder="请填写排序" type="number" onBlur={(e) => editSecondForm.setFieldsValue({ sortName: Math.floor(e.target.value) })}></Input>
					</Item>
				</Form>
			</Modal>
			{/* 编辑板块 Modal 结束 */}

			{/* 板块列表 开始 */}
			<ContentInner style={{ marginTop: '20px', background: theme.colors.bg5, padding: '0px' }}>
				<Row wrap={true} gutter={[21, 21]} justify="start" align="middle">
					{
						articleTypeList.map((item: any, index: number) => (
							<Col key={index}>
								<ModuleCard
									imgurl={item.imgUrl}
									imgIcon={item.imgIcon}
									name={item.name}
									subTitle={item.subTitle}
									onDelete={() => handleDeleteModule(item.id,index )}
									onEdit={() => handleEditSecondModule(index, item)}></ModuleCard>
							</Col>
						))
					}
					<Permission perms="novel:articleType:add">
						<Col style={newAddWrap} onClick={() => { subType.current = 'add'; setViewSecondLayerEditForm(true); setSecondLayerTitle("新增版块"); console.log(colorRef) }}>
							<span>+ 新增版块</span>
						</Col>
					</Permission>
				</Row>
			</ContentInner>
			{/* 板块列表 结束 */}

		</ContentWrapper >
	)
};

export default Module;