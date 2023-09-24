import React, { useEffect, useState } from 'react';
// Components
import Thumbnail from '../../components/Thumbnail';
import { ContentInner } from '../../components/Themeable';
import {Row, Col, Typography, Space, Table} from 'antd';
import {QuestionCircleOutlined,	CaretDownOutlined,} from '@ant-design/icons';
import {ContentWrapper} from '../styled';
import WaveCharts from '../../components/Echarts/wavecharts';
import { MV } from '../styled';
// Hooks
import { useTheme } from '../../theme';
// Api
import { byUser, byChart, byKeyword } from '../../api/monitor';

const { Text, Title } = Typography;

interface Isearch {
	searchesTodayNum?: number;
	searchesYesterdayNum?: number;
	todayUserNum?: number;
	yesterdayUserNum?: number;
};

interface Ilist {
	// index: number;
	keyword?: string; // 搜索关键字
	searchesLastWeekNum?: number; // 上周涨幅
	searchesTodayNum?: number; // 当日涨幅
	searchesWeekNum?: number;	 // 周涨幅
	searchesYesterdayNum?: number; // 昨天搜索数
	userNum?: number; // 用户数
}

const columns = [
	{ title: '排名', render: ( text: any,record: any, index: number ) => `${ index + 1 }`, }, 
	{ title: '搜素关键字', dataIndex: 'keyword', key: 'keyword' }, 
	{ title: '用户数', dataIndex: 'userNum', key: 'userNum' }, 
	{ title: '单日涨幅', dataIndex: 'searchesTodayNum', key: 'searchesTodayNum' }, 
	{ title: '周涨幅', dataIndex: 'searchesWeekNum',	key: 'searchesWeekNum' }
];

// 搜索统计
export default function SearchStat() {
	const [ oSearch, setOsearch ] = useState<Isearch>({});
	const [ list, setList ] = useState<Ilist[]>([]);

	const { theme } = useTheme();

	useEffect( () => {
		byUser().then( res => setOsearch( { ...res } ));
		byChart().then( res => { console.log( "byChart", res ) });
		byKeyword().then( res => {
			setList( [  ...res  ] );
		})
	}, [] );

	return <ContentWrapper> 
		<Thumbnail></Thumbnail>
		<ContentInner >
			<Title level={3}>搜索统计</Title>
			<Row gutter={10} justify="space-around">
				<Col>
					<Space direction="vertical" size="large">
						<Row justify="center" align="middle">
							<Col>
								<Space direction="vertical">
									<Text>搜索用户数 <QuestionCircleOutlined></QuestionCircleOutlined></Text>
									<Title level={5}>
										{ oSearch.searchesTodayNum }
										<Text style={ {fontSize: '11px', color: theme.colors.text2, padding: '0 10px'} }>
											{ oSearch.searchesYesterdayNum }
											<CaretDownOutlined/>
										</Text>
									</Title>
								</Space>
							</Col>
						</Row>
						<WaveCharts></WaveCharts>
					</Space>
				</Col>
				<Col>
					<Space direction="vertical" size="large">
						<Row justify="center" align="middle">
							<Col>
								<Space direction="vertical">
									<Text>人均搜索次数 <QuestionCircleOutlined/></Text>
									<Title level={5}>
										{ oSearch.todayUserNum }
										<Text style={ {fontSize: '11px', color: theme.colors.text2, padding: '0 10px'} }>
										{ oSearch.yesterdayUserNum }
											<CaretDownOutlined/>
										</Text>
									</Title>
								</Space>
							</Col>
						</Row>
						<WaveCharts></WaveCharts>
					</Space>
				</Col>
			</Row>
			<MV></MV>
			<Table scroll={{ y: 320 }} style={{marginTop: '100px' }} columns={columns} dataSource={list} pagination={false}></Table>
		</ContentInner>
	</ContentWrapper>

}