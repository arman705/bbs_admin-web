import React from 'react';

import { Form, Input, Select } from 'antd';
import UploadPreview from '../UploadPreview';
import ColorPicker from '../ColorPicker';

const { Item } = Form;
const { Option } = Select;

const ModuleCardEdit: React.FC = () => {

	const [editForm] = Form.useForm();

	return (
		<Form form={ editForm } name="module_edit" labelCol={ {span: 8} }  layout="horizontal">
			<Item label="背景图片" required rules={ [{required: true, message: '请上传板块背景图片'}] }>
				<UploadPreview></UploadPreview>
			</Item>
			<Item label="图标" required rules={ [{required: true, message: '请上传板块图标'}] }>
				<UploadPreview></UploadPreview>
			</Item>
			<Item label="板块名称" required rules={ [{required: true, message: '请填写板块名称'}] }>
				<Input placeholder="板块名称"></Input>
			</Item>
			<Item label="板块颜色" required rules={ [ {required: true, message: '请选择板块颜色'} ] }>
				<ColorPicker></ColorPicker>
			</Item>
			<Item label="用户等级限制" required tooltip={ '用户达到指定等级 才能访问板块内容' }>
				<Select defaultValue="">
					<Option value="">不限制</Option>
					<Option value="1">Level 1</Option>
				</Select>
			</Item>
			<Item label="板块副标题" required>
				<Input placeholder="请输入板块副标题"></Input>
			</Item>
		</Form>
	)
};

export default ModuleCardEdit;