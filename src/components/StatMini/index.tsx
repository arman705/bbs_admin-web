import React, { useContext, Fragment, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import { Typography, Space, Divider, } from 'antd';
import { ThemeContext } from '../../theme';
import { GlobalContext } from '../../utils/global';
import { Container } from './styled';

// API 
// import * as monitorApi from '../../api/monitor';
import { monitor } from '../../api';

const { Text, Title } = Typography;

interface IcommonTime {
	lastAuditTime?: string;
}

interface IwaitNum extends IcommonTime {
	waitNum?: number;
	releaseToday?: number
};

interface IfeedbackNum extends IcommonTime {
	feedbackNum?: number;
	submitToday?: number
}

interface InotApprovedNum extends IcommonTime {
	notApprovedNum?: number;
	submitToday?: number
}


export default function MonitorStatSummary() {
	const [oNovelPost, setOnovelPost] = useState<IwaitNum>({});
	const [oNovelUserFeedback, setOnovelUserFeedback] = useState<IfeedbackNum>({});
	const [oNovelUserFeedbackStatistics, setOnovelUserFeedbackStatistics] = useState<InotApprovedNum>({});
	const { theme } = useContext(ThemeContext);
	const { global } = useContext(GlobalContext);
	const history = useHistory()


	useEffect(() => {
		const { novelPost, novelUserFeedback, novelUserFeedbackStatistics } = monitor;
		novelPost().then(res => { console.log("res====++", res); setOnovelPost({ ...res }) });
		novelUserFeedback().then(res => setOnovelUserFeedback({ ...res }));
		novelUserFeedbackStatistics().then(res => setOnovelUserFeedbackStatistics({ ...res }));
		console.log("useEffect")
	}, []);

	function toPostReview () {
		history.push('/dashboard/post-review?auditState=WAIT')
	}
	function toUserManage () {
		history.push('/dashboard/user/manage?status=2')
	}
	function toFeedback () {
		history.push('/dashboard/feedback?status=0')
	}

	// 隐藏自己
	if (global.zoomView != '') return null;

	return (
		<Fragment>
			<Space direction="vertical" style={{ width: '100%' }}>
				<Container color={theme.colors.white}>
					<Text style={{ color: theme.colors.text3 }}>帖子未审核</Text>
					<Title style={{ cursor: 'pointer', color: 'blue' }} level={2} onClick={toPostReview}>{oNovelPost.waitNum}</Title>
					<Text style={{ color: theme.colors.text3 }}>今日发布量: {oNovelPost.releaseToday || 0}</Text>
					<div style={{ borderBottom: "1px solid " + theme.colors.text2, margin: "5px 0px" }}></div>
					<Text style={{ color: theme.colors.text3 }}>最后审核时间: {oNovelPost.lastAuditTime}</Text>
				</Container>

				<Container color={theme.colors.white}>
					<Text style={{ color: theme.colors.text3 }}>用户资料未审核</Text>
					<Title style={{ cursor: 'pointer', color: 'blue' }} level={2} onClick={toUserManage}>{oNovelUserFeedbackStatistics.notApprovedNum}</Title>
					<Text style={{ color: theme.colors.text3 }}>今日提交: {oNovelUserFeedbackStatistics.submitToday}</Text>
					<div style={{ borderBottom: "1px solid " + theme.colors.text2, margin: "5px 0px" }}></div>
					<Text style={{ color: theme.colors.text3 }}>最后审核时间: {oNovelUserFeedbackStatistics.lastAuditTime}</Text>
				</Container>

				<Container color={theme.colors.white}>
					<Text style={{ color: theme.colors.text3 }}>问题反馈</Text>
					<Title style={{ cursor: 'pointer', color: 'blue' }} level={2} onClick={toFeedback}>{oNovelUserFeedback.feedbackNum}</Title>
					<Text style={{ color: theme.colors.text3 }}>今日提交: {oNovelUserFeedback.submitToday}</Text>
					<div style={{ borderBottom: "1px solid " + theme.colors.text2, margin: "5px 0px" }}></div>
					<Text style={{ color: theme.colors.text3 }}>最后审核时间: {oNovelUserFeedback.lastAuditTime}</Text>
				</Container>
			</Space>
		</Fragment>
	)
}