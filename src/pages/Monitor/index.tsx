import React, { useContext, useState, useEffect } from 'react';

// Api
import { monitor, plate, newsflash } from '../../api';

// Utils
import { GlobalContext, useGlobal } from '../../utils/global';

// Components
import { MV } from '../styled';
import Scrollable from "./scrollable";
import WordCloud from 'react-wordcloud';
import StreamChat from '../../components/StreamChat';
import { Link, useRouteMatch } from 'react-router-dom';
import StreamComment from '../../components/StreamComment';
import MonitorStatSummary from '../../components/StatMini';
import QuickMessagePanel from '../../components/QuickMessagePanel';
import { DotBlue, TextBlue, TextWhite } from "../../components/Themeable";
import { QuestionCircleOutlined, AlignCenterOutlined } from '@ant-design/icons';
import { Row, Col, Card, Table, Modal, Form, Input, Space, Button, message } from 'antd';
import { useRef } from 'react';
import ChatMonitor from '../../components/ChatMonitor';
import CommentMonitor from '../../components/CommentMonitor';


// interface - 字符云
interface Iword {
	text: string;
	value: number;
};

interface UIHotSearchMiniProps {
	zoomView: string
	path: string
	wordList: any[]
}
// 热门搜索
const UIHotSearchMini: React.FC<UIHotSearchMiniProps> = React.memo((props) => {
	return props.zoomView !== '' ? null :  (
		<Card title="热门搜索" extra={<Link to={`${props.path}/search/stat`}>统计</Link>}>
			<WordCloud words={props.wordList} />
		</Card>
	);
})

// 监控台
const Monitor: React.FC = () => {

	const [addForm] = Form.useForm();
	const { global } = useContext(GlobalContext);
	const HotTopicMini = useGlobal();
	const { path } = useRouteMatch();

	const [id, setId] = useState<string>(''); 						 // 热帖前三 Table id
	const [reason, setReason] = useState<string>(''); 		 // 推荐理由
	const [hotList, setHotList] = useState<any[]>([]);	 // 热帖列表
	const [wordList, setWordList] = useState<Iword[]>([]); // 字符云数据
	const [plateList, setPlateList] = useState<any[]>([]); // 板块列表
	const [msgVisible, setMsgVisible] = useState<boolean>(false); 				// 快捷理由显示隐藏
	const [recommendId, setRecommendId] = useState<string | number>(''); 			// 实时快讯 id
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // 实时快讯弹窗 Modal 显示隐藏

	/* -------------------- Api start -------------------- */
	// 获取热搜数据列表
	useEffect(() => {
		api_hotKeyword();
	}, []);
	const api_hotKeyword = async () => {
		await monitor.hotKeyword().then(res => {
			let _res = res ? res : [];
			changeData(_res);
		});
	};

	// 获取板块列表
	useEffect(() => {
		api_articleTypeList();
	}, []);
	const api_articleTypeList = async () => {
		await plate.articleTypeList({ offset: 0, limit: 100 }).then(res => {
			console.log("板块列表", res);
			let _res = res ? res : { total: 1, rows: [] };
			setPlateList(() => [..._res.rows]);
			let id = _res.rows[0] ? _res.rows[0]["id"] : '';
			setId(id);
		});
	};

	// 板块前三热帖
	useEffect(() => {
		console.log('asdfadf')
		api_hotPosts(id);
	}, [id]);
	const api_hotPosts = async (id: string | number) => {
		await monitor.hotPosts(id).then(res => {
			console.log("板块前三热帖", res )
			let _res = res ? res : [];
			setHotList(() => [..._res]);
		});
	};

	// 新增实时快讯
	const api_recommend = async (data: { id: string | number, recommendReason: string }) => {
		await newsflash.recommend(data).then(res => {
			setReason('');
			setRecommendId('');
			api_articleTypeList();
		});
	};
	/* -------------------- Api end -------------------- */



	/* -------------------- Methods start -------------------- */
	// 字符云改变数据结构
	const changeData = (list: string[]) => {
		if (list.length === 0) return [];
		let _list: Iword[] = [];
		for (let i = 0; i < list.length; i++) {
			_list.push({ text: list[i], value: i + 10 });
		};
		setWordList(() => [..._list]);
	};

	// Modal 确认
	const handleModalClick = () => {
		setIsModalVisible(false);
		if (reason === '') {
			message.warning('推荐理由不能为空!');
			return false;
		} else {
			api_recommend({ id: recommendId, recommendReason: reason });
		};
	};
	/* -------------------- Methods end -------------------- */



	/* -------------------- Ui end -------------------- */
	
		

	// 实时热帖排行
	const ui_HotTopicMini = (plateList: any[]) => {
		const extra = <Scrollable texts={plateList} view={plateList.length} onSelect={(id: string) => { console.log("id", id); setId(id) }} />
		return HotTopicMini.global.zoomView != '' ? null :
			(
				<Card title="实时热贴排行" extra={extra} style={{ height: '100%' }}>
					<Table pagination={false} columns={columns} dataSource={hotList} />
				</Card>
			)
	};

	// 快捷列表
	const ui_QuickMessagePanel = () => msgVisible && <QuickMessagePanel quickMsg={(reply: string) => { setReason(reply); }} />;

	/* -------------------- Ui end -------------------- */



	/* -------------------- Options start -------------------- */
	const columns = [
		{
			title: '排行',
			align: 'center',
			render: (_any: any, record: any, index: number) => <DotBlue size={'large'} style={{ fontSize: '10px' }}> <TextWhite>{index + 1}</TextWhite></DotBlue>
		},
		{
			title: <span>热度 <QuestionCircleOutlined></QuestionCircleOutlined> </span>,
			dataIndex: 'heat',
			align: 'center',
			render: (heat: number) => <TextBlue>{heat}</TextBlue>
		},
		{
			title: '帖子标题',
			dataIndex: 'title',
			align: 'center',
			render: (title: string) => <span>{title}</span>
		},
		{
			title: '所属板块',
			dataIndex: 'typeName',
			align: 'center',
			render: (typeName: string) => <span>{typeName}</span>
		},
		{
			title: '发布时间',
			dataIndex: 'createAt',
			align: 'createAt',
			render: (createAt: string) => <span>{createAt}</span>
		},
		{
			title: '操作',
			align: 'center',
			render: (_: any, record: any) => <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => { setIsModalVisible(true); setRecommendId(record.id); console.log("快讯", record) }}>+实时快讯</span>
		}] as any;
	/* -------------------- Options end -------------------- */

	return (
		<div style={{ padding: '10px' }}>
			<Row justify="space-between" style={{ height: 641 }} gutter={10} >
				<Col span="9" style={{ height: '100%', overflow: 'hidden' }}><ChatMonitor /></Col>
				<Col span="9" style={{ height: '100%', overflow: 'hidden' }}><CommentMonitor /></Col>
				{/* 帖子-start */}
				<Col span="6"><MonitorStatSummary /></Col>
				{/* 帖子-end */}
			</Row>

			<MV></MV>

			<Row justify="space-between" gutter={10}>
				<Col span="9"><UIHotSearchMini zoomView={global.zoomView} path={path} wordList={wordList} /></Col>
				<Col span="15">{ui_HotTopicMini(plateList)}</Col>
			</Row>

			{/* 实时快讯 Modal 开始 */}
			<Modal title="新增实时快讯" okText="确定" cancelText="取消" visible={isModalVisible} centered={true} onOk={handleModalClick} onCancel={() => { setIsModalVisible(false); setReason(''); setRecommendId(''); }}  >
				<Row><Col span={12} style={{ marginBottom: '10px' }}>{ui_QuickMessagePanel()}</Col></Row>
				<Row>
					<Form layout="horizontal" labelCol={{ span: 6 }} form={addForm} initialValues={{ inputvalue: '' }}>
						<Form.Item label="推荐理由" required style={{ position: 'relative' }}>
							<Space direction="horizontal">
								<Input value={reason} onChange={(ev: any) => { setReason(ev.target.value) }} />
								<Button onClick={() => setMsgVisible(!msgVisible)} icon={<AlignCenterOutlined />}>快捷理由</Button>
							</Space>
						</Form.Item>
					</Form>
				</Row>
			</Modal>
			{/* 实时快讯 Modal 结束 */}

		</div>
	)
};

export default Monitor;