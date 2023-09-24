import React, { useEffect, useState } from 'react';
// api
import { user } from '../../api';

// components
import { Row, Col, Divider } from 'antd';
import EChartsReact from 'echarts-for-react';
import Thumbnail from '../../components/Thumbnail';
import ViewTable from '../../components/ViewTable';
import { ContentWrapper, ContentInner } from '../../components/Themeable';

interface IuserSexAnalyze {
	value: number;
	name: string;
	avg?: string;
};

interface Ifilter {
	sex: string;
	num: number;
};

// 用户年龄 
const ageColumns = ['用户数', '年龄', '占比'];

// 用户性别 
const sexColumns = ['用户数', '性别', '占比'];

// 用户设备
const deviceColumns = ['用户数', '访问设备', '占比'];

const UserAnalysis: React.FC = () => {

	// 用户年龄
	const [ageList, setAgeList] = useState<any[]>([]);
	// 用户性别数据
	const [userSexAnalyzeList, setUserSexAnalyzeList] = useState<IuserSexAnalyze[]>([]);

	// 用户设备
	const [deviceList, setDeviceList] = useState<any[]>([]);


	/* ----------------- API start ----------------- */

	useEffect(() => {
		api_ageAnalyze();
		api_userSexAnalyze();
		api_deviceAnalyze();
	}, []);

	// 获取用户年龄
	const api_ageAnalyze = () => {
		user.ageAnalyze().then(res => {
			let arr = res ? res : [];
			let { list, total } = userSexFilter(arr, 'age');
			setAgeList(() => [...reudceList(list, total)]);
		});
	};

	// 获取用户性别
	const api_userSexAnalyze = () => {
		user.userSexAnalyze().then((res: [] | undefined) => {
			let arr = res ? res : [];
			let { list, total } = userSexFilter(arr, 'sex');
			setUserSexAnalyzeList(() => [...reudceList(list, total)]);
		});
	};

	// 获取用户设备数
	const api_deviceAnalyze = () => {
		user.deviceAnalyze().then(res => {
			let arr = res ? res : [];
			let { list, total } = userSexFilter(arr, 'dev');
			setDeviceList(() => [...reudceList(list, total)]);
		});
	};

	/* ----------------- API end ----------------- */


	/* ----------------- Options start ----------------- */
	// Options-用户年龄图表
	const ageChart = {
		tooltip: { trigger: 'item' },
		legend: { orient: 'horizontal', bottom: '0px' },
		series: [{ name: '年龄', type: 'pie', radius: '50%', label: { show: false, }, data: ageList }]
	};

	// Options-用户性别图表
	const sexChart = {
		tooltip: { trigger: 'item' },
		legend: { orient: 'horizontal', bottom: '0px' },
		series: [{ name: '性别', type: 'pie', radius: ['40%', '70%'], avoidLabelOverlap: false, data: userSexAnalyzeList, label: { show: false } }],
	};

	// Options-用户设备图表
	const deviceChart = {
		tooltip: { trigger: 'item' },
		legend: { orient: 'horizontal', bottom: '0px' },
		series: [{ name: '设备', type: 'pie', radius: ['40%', '70%'], avoidLabelOverlap: false, data: deviceList, label: { show: false } }]
	};

	/* ----------------- Options end ----------------- */


	/* ----------------- Mothes start ----------------- */

	// 百分比转换
	const sliceAvg = (str: string) => `${Math.round(parseFloat(str.slice(0, 5)) * 100)}%`;

	// 取百分比
	const reudceList = (list: IuserSexAnalyze[], total: any[]) => {
		if (list.length === 0 || total.length === 0) return 0;
		let _total = total.reduce((t, n) => t + n);
		let _arr: any = [];
		for (let i = 0; i < list.length; i++) {
			_arr.push(Object.assign({ ...list[i] }, { avg: sliceAvg(`${list[i]["value"] / _total}`) }));
		};
		return _arr;
	}

	// 转换 key
	const userSexFilter = (list: Ifilter[], type: string) => {
		let bool = list.length === 0 ? false : true;
		let _list = [];
		let _total = [];
		for (let i = 0; i < list.length; i++) {
			let { num } = list[i];
			_total.push(num);
			_list.push({ value: num, name: type === 'sex' ? list[i]["sex"] : list[i]["name"] });
		};
		return { list: bool ? _list : [], total: bool ? _total : [0] };
	};

	/* ----------------- Mothes end ----------------- */

	return (
		<ContentWrapper>
			<Thumbnail></Thumbnail>
			<ContentInner>
				<Row style={{ fontWeight: 'bold', fontSize: 18 }}>年龄分布</Row>
				<Row justify="space-between" wrap={false} align="middle">
					<Col style={{ width: '100%' }} flex="auto"><EChartsReact option={ageChart} /></Col>
					<Col><Divider style={{ height: '350px' }} type="vertical" /></Col>
					<Col style={{ width: '100%' }} flex="auto"><ViewTable columns={ageColumns} data={ageList} /></Col>
				</Row>
			</ContentInner>

			<ContentInner style={{ marginTop: '15px' }}>
				<Row style={{ fontWeight: 'bold', fontSize: 18 }}>性别分布</Row>
				<Row justify="space-between" wrap={false} align="middle">
					<Col style={{ width: '100%' }} flex="auto"><EChartsReact option={sexChart} /></Col>
					<Col><Divider style={{ height: '350px' }} type="vertical" /></Col>
					<Col style={{ width: '100%' }} flex="auto"><ViewTable columns={sexColumns} data={userSexAnalyzeList} /></Col>
				</Row>
			</ContentInner>

			<ContentInner style={{ marginTop: '15px' }}>
				<Row style={{ fontWeight: 'bold', fontSize: 18 }}>登陆设备分布</Row>
				<Row justify="space-between" wrap={false} align="middle">
					<Col style={{ width: '100%' }} flex="auto"><EChartsReact option={deviceChart} /></Col>
					<Col><Divider style={{ height: '350px' }} type="vertical" /></Col>
					<Col style={{ width: '100%' }} flex="auto"><ViewTable columns={deviceColumns} data={deviceList} /></Col>
				</Row>
			</ContentInner>
		</ContentWrapper>
	)
};

export default UserAnalysis;