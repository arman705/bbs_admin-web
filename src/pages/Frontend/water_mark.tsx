import React, { useState, useEffect } from "react";

// api
import { reception, common } from '../../api';

// utils
import { getBase64 } from '../../utils/file';

// others
import { UploadFile } from 'antd/lib/upload/interface';
import sampleJpg from '../../assets/images/login-bg.jpg';

// Components
import { grey } from '@ant-design/colors';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import Thumbnail from "../../components/Thumbnail";
import { ContentInner, ContentWrapper } from '../../components/Themeable';
import { Card, Typography, Row, Col, Space, Button, Form, Input, Modal, Image as Iamges, Upload, ModalProps, message } from 'antd';
import Permission from "../../components/Permission";
const { Meta } = Card;
const { Title, Text } = Typography;

interface Icommon {
	id: number;
	name: string;
	url: string;
	size: string;
	remark: string;
};

interface Ilist extends Icommon {
	createAt: string | null;
	updateAt: string | null;
};

interface EditModalProps extends ModalProps {
	onSubmitSuccess: () => void;
	recordData?: any
}

interface IModalProps {
	visible: boolean;
	recordData?: any;
}

interface IPreview {
	visible?: boolean;
	src?: string;
}
  
interface IUploadImg {
	value?: any[];
	onChange?: (val: any[]) => void;
}

const UploadImg: React.FC<IUploadImg> = ({ value, onChange }) => {
	const [preview, setPreview] = useState<IPreview>({
	  src: '',
	  visible: false
	})
  
	function handleChange ({ fileList }: any) {
	  if (Array.isArray(fileList)) {
			const ps = fileList.map((file: any) => {
				return new Promise((resolve) => {
					if (file.originFileObj && !file.url) {
						getBase64(file.originFileObj).then(url => resolve({
							url,
							...file
						}))
					} else if (file.url) {
						resolve(file)
					}
				})
			})
			Promise.all(ps).then((fileList: any) => {
				onChange?.(fileList)
				console.log('asdfasf', fileList)
			})
	  }
	}
	function handlePreview (file: any) {
	  setPreview({
			visible: true,
			src: file.url
	  })
	}
	return (
	  <>
			<Upload
				action={common.uploadImgUrl} 
				listType="picture-card"
				fileList={value}
				multiple
				onPreview={handlePreview}
				onChange={handleChange}
			>
				{ value && value.length < 1 ? <PlusOutlined /> : null }
			</Upload>
			{/* 用于预览 */}
			<Iamges style={{ display: 'none' }} preview={{
				...preview,
				onVisibleChange: (visible) => {
				if (!visible) setPreview({ visible })
				}
			}}/>
	  </>
	)
}

const EditModal: React.FC<EditModalProps> = (props) => {
	const { onSubmitSuccess, recordData, ...modalProps } = props
	const [formRef] = Form.useForm()
	const [loading, setLoading] = useState(false)
  
	function onSave (values: any) {
	  setLoading(true)
		const emoji = values.emoji[0]
	  let data: any = {
			...recordData,
			url: emoji.response ? emoji.response.data.fileName : emoji.name,
			size: values.size,
			remark: values.remark
	  }
	  reception.watermarkUpdate(data).then((res: any) => {
		if (res.code === 200) {
		  message.success('编辑成功')
		  onSubmitSuccess?.()
		} else {
		  message.error(res.msg)
		}
	  }).finally(() => {
			setLoading(false)
	  })
	}
	function onCancel (e: React.MouseEvent<HTMLElement>) {
	  formRef.resetFields()
	  modalProps.onCancel && modalProps.onCancel(e)
	}
	const getImgSize = (url: string | undefined): any => {
		if (!url) return;
		const img = new Image();
		img.src = url;
		return {width: img.width, height: img.height }
	};
	function onUploadChange (fileList: any[]) {
		if (fileList.length > 0) {
			const { width, height } = getImgSize(fileList[0].url)
			formRef.setFieldsValue({
				size: `${width}*${height}`
			})
		}
	}
  
	useEffect(() => {
	  if (modalProps.visible && recordData) {
			formRef.setFieldsValue({
				...recordData,
				emoji: [{name: recordData.imgName, url: recordData.url}]
			})
	  } else {
			formRef.resetFields()
	  }
	}, [modalProps.visible])

	return (
	  <Modal
			{...modalProps}
			title="编辑"
			okText="确定"
			cancelText="取消"
			onOk={formRef.submit}
			onCancel={onCancel}
			okButtonProps={{ loading }}>
			<Form form={formRef} layout="horizontal" labelCol={ {span: 5} } onFinish={onSave}>
				<Form.Item name="emoji" label={recordData ? recordData.name : '水印'} rules={[{ required: true, message: '请上传图片' }]}>
					<UploadImg onChange={onUploadChange} />
				</Form.Item>
				<Form.Item name="size" label="尺寸">
					<Input placeholder="上传图片后自动生成" disabled />
				</Form.Item>
				<Form.Item name="remark" label="备注">
					<Input placeholder="请输入备注" />
				</Form.Item>
			</Form>
	  </Modal>
	)
}


const WaterMark: React.FC = () => {

	const [editForm] = Form.useForm();
	const [waterList, setWaterList] = useState<Ilist[]>([]);	// 水印列表
	const [waterIndex, setWaterIndex] = useState<number>(0); // 索引
	const [total, setTotal] = useState<number>(1);					// 水印列表总条数
	const [viewEditForm, setViewEditForm] = useState(false); 		// 编辑水印 Modal 显示隐藏

	const [file, setFile] = useState<UploadFile>(null as any);// 上传
	const [imgSize, setImagSize] = useState({ width: 0, height: 0 });
	const [remarkText, setRemarkText] = useState<string>('');
	const [ modalProps, setModalProps ] = useState<IModalProps>({
		visible: false,
		recordData: null
	})



	/* -------------------- Api start -------------------- */
	// 获取水印列表
	useEffect(() => {
		api_watermarkList();
	}, []);
	const api_watermarkList = async () => {
		await reception.watermarkList().then((res: { total: number, rows: any[] }) => {
			let _res = res ? res : { total: 1, rows: [] };
			setTotal(_res.total);
			setWaterList(() => [..._res.rows]);
		});
	};
	/* -------------------- Api end -------------------- */


	/* -------------------- Methods start -------------------- */

	const onSubmitSuccess = () => {
		setModalProps({ visible: false })
		api_watermarkList()
	}

	/* -------------------- Methods end -------------------- */
	return (
		<ContentWrapper>
			<Thumbnail />

			{/* 水印列表 开始 */}
			<ContentInner>
				<Title level={5}>水印管理</Title>
				<Row wrap={true} gutter={[10, 10]}>
					{
						waterList.map((item, index) => (
							<Col key={index}>
								<Card hoverable style={{ width: 240 }} cover={<Iamges style={{ width: '240px', height: '240px' }} src={item.url} />}>
									<Meta title={item.name} description={
										<Space direction="vertical">
											<Text style={{ color: grey[3], fontSize: 12 }}>尺寸: {item.size} PX</Text>
											<Text style={{ color: grey[3], fontSize: 12 }}>备注： {item.remark}</Text>
											<Permission perms="novel:watermark:edit">
												<Button onClick={() => setModalProps({ visible: true, recordData: item })} type="primary">编辑</Button>
											</Permission>
										</Space>
									}></Meta>
								</Card>
							</Col>
						))
					}
				</Row>
			</ContentInner>
			{/* 水印列表 结束 */}

			<EditModal {...modalProps} onCancel={() => setModalProps({ visible: false })} onSubmitSuccess={onSubmitSuccess} />

		</ContentWrapper>
	)
};

export default WaterMark;
