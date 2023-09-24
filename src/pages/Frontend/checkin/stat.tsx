import React, { useEffect, useRef, useState } from 'react';

import {
	ContentWrapper, ContentInner, DotAnyColor, Center,
} from '../../../components/Themeable';
import Thumbnail from '../../../components/Thumbnail';
import SimpleTabs from '../../../components/SimpleTabs';
import {
	Col, Row, Typography, DatePicker, message, Form
} from 'antd';
import Styled from 'styled-components';
import CurveLineCharts from '../../../components/Frontend/CurveLineCharts';
import ContrastLineCharts from '../../../components/Frontend/ContrastLineCharts';
import StatBarCharts from '../../../components/Frontend/StatBarCharts';
import { getSignInRecord, getSignContrastInRecord, getSignInContinuityRecord } from '../../../api/reception';
import moment from 'moment';
import { Button } from 'antd/lib/radio';


const { RangePicker } = DatePicker;
const { Title } = Typography;

const RangePickerWrapper = Styled.div`
	margin-top: 10px;
`;

const CompareChartWrapper = Styled.div`
	width: 80%;
	margin: 0 auto;
`;

export default function Stat() {

	const [signType, setSignType] = useState('DAY');
	const [continuityType, setContinuityType] = useState('DAY');
	const [signData, setsignData] = useState([]);
	const [continuityDate, setcontinuityDate] = useState([]);
	const [ContrastDate, setContrastDate] = useState<any>([]);
	const [form] = Form.useForm();

	useEffect(() => {
		Promise.all([getSignInRecord(signType), getSignInContinuityRecord(continuityType)]).then((res) => {
			setsignData(res[0].data.logs);
			setcontinuityDate(res[1].data.logs);
		})
	}, [signType, continuityType])

	useEffect(() => {
		form.setFieldsValue({
			firstTime: [moment(), moment()],
			secondTime: [moment(), moment()]
		})
		searchContrastRecord();
	}, [])

	const searchContrastRecord = async () => {
		const values = form.getFieldsValue();
		if (values.firstTime && values.secondTime) {
			const fisrtTime = {
				startTime: values.firstTime[0].format('YYYY-MM-DD'),
				endTime: values.firstTime[1].format('YYYY-MM-DD'),
				diffCount: values.firstTime[1].diff(values.firstTime[0], 'day')
			}
			const secondTime = {
				startTime: values.secondTime[0].format('YYYY-MM-DD'),
				endTime: values.secondTime[1].format('YYYY-MM-DD'),
				diffCount: values.secondTime[1].diff(values.secondTime[0], 'day')
			}
			console.log('value', fisrtTime);
			console.log('secondTime', secondTime);
			if (fisrtTime.diffCount !== secondTime.diffCount) {
				message.warn('签到对比的时间跨度必须一致');
				return;
			} else {
				const data = await getSignContrastInRecord({
					startTime: fisrtTime.startTime,
					endTime: fisrtTime.endTime,
					startTime2: secondTime.startTime,
					endTime2: secondTime.endTime
				});
				if (data.data) {
					const timeOneData = data.data.signInList || [];
					const timeTwoData = data.data.signInList2 || [];
					const charTimeData: any = [];
					const charDataOne: any = [];
					const charDataTwo: any = [];
					for (let i = 0; i < timeOneData.length; i++) {
						charTimeData.push(`${timeOneData[i].time}(${timeTwoData[i].time})`)
						charDataOne.push(timeOneData[i].num);
						charDataTwo.push(timeTwoData[i].num);
					}
					setContrastDate({
						charTimeData,
						charDataOne,
						charDataTwo,
					})
					console.log('data', data);
				}

			}
		}

	}

	const tabs: any = [{ name: '日', value: 'DAY' }, { name: '月', value: 'MONTH' }, { name: '年', value: 'YEAR' }];
	const tabsForContinues = [{ name: '日', value: 'DAY' }, { name: '月', value: 'MONTH' }, { name: '年', value: 'YEAR' }];

	return <ContentWrapper>
		<Thumbnail></Thumbnail>
		<Row wrap={false} gutter={[10, 10]} justify="space-between">
			<Col span={12}>
				<ContentInner>
					<Title level={5}>签到曲线图</Title>
					<Center>
						<SimpleTabs tabs={tabs} onChange={setSignType}></SimpleTabs>
					</Center>
					<CurveLineCharts data={signData} />
				</ContentInner>
			</Col>
			<Col span={12}>
				<ContentInner>
					<Title level={5}>签到对比图</Title>
					<CompareChartWrapper>
						<Form form={form}>
							<div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
								<DotAnyColor style={{ marginRight: '10px' }} color="rgba(42, 130, 228, 1)"/>
								<Form.Item name="firstTime" noStyle>
									<RangePicker style={{ width: '100%' }} allowClear={false} />
								</Form.Item>
							</div>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<DotAnyColor style={{ marginRight: '10px' }} color="rgba(121, 72, 234, 1)"/>
								<Form.Item name="secondTime" noStyle>
									<RangePicker style={{ width: '100%' }} allowClear={false} />
								</Form.Item>
							</div>
							<Form.Item style={{ marginTop: 20, textAlign: 'right' }}>
								<Button onClick={searchContrastRecord}>查询</Button>
							</Form.Item>
						</Form>
						<ContrastLineCharts data={ContrastDate} />
					</CompareChartWrapper>
				</ContentInner>
			</Col>
		</Row>
		<Row gutter={[0, 0]} justify="space-between">
			<Col span={24}>
				<ContentInner>
					<Title level={5}>连续签到统计</Title>
					<Center>
						<SimpleTabs tabs={tabsForContinues} onChange={setContinuityType}></SimpleTabs>
					</Center>
					<StatBarCharts data={continuityDate} />
				</ContentInner>
			</Col>
		</Row>

	</ContentWrapper>
}