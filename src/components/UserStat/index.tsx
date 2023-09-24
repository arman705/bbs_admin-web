import React, { useEffect, useState } from 'react';
import moment from 'moment';
// API
import { user } from '../../api';
// Components
import { Tabs, Typography, Space, Row, Col } from 'antd';
import UserCharts from './charts';
const { Title } = Typography
const { TabPane } = Tabs;



interface IdateList {
	name: string;
	method: string;
	isDate: boolean
};
const dateList: IdateList[] = [ 
	{ name: '日', method: 'userDayTableSta', isDate: true },
	{ name: '月', method: 'userMonthTableSta', isDate: true },
	{ name: '年', method: 'userYearTableSta', isDate: false} 
];

export default function UserStat() {
	const [ chartsList, setChartsList ] = useState({});
	const [ chartsListIndex, setChartsListIndex ] = useState<string>( '0' )
	const [ name, setName ] = useState<string>('');
	useEffect( () => {
		getUserStatistics( chartsListIndex );
	}, [ chartsListIndex ] );

	// 获取时间
	const getDate = () => {
		let date = new Date();
		return `${ date.getFullYear()}-${complement( date.getMonth()+1 )}-${ complement( date.getDate() )}`
	};

	// 补位
	const complement = ( time: string | number ) => time < 10 ? `0${time}` : time;
	
	const getUserStatistics = ( key: string ) => {
		// setChartsListIndex( key );
		let { name, method, isDate } = dateList[ parseInt( key ) ];
		// Mock 假数据
		let mockTime = moment().format('YYYY-MM-DD');
		// 动态获取时间
		// getDate()
		interface Ires {
			CreateTableSta?: object;
			LoginTableSta?: object;
			msg?: string;
		}
		user[ method ]( isDate ? mockTime : '' ).then( (res: Ires ) => {
			
			let { CreateTableSta, LoginTableSta } = res;
			setChartsList( Object.assign( {}, { CreateTableSta: { ...CreateTableSta }, LoginTableSta: {...LoginTableSta}}) );
			setName( name );
			setTimeout( () => {
				console.log( "res-日-月", res,"chartsList", chartsList );
			}, 30)
			
		});
	}

	return <>
		<Space direction={'vertical'} style={ {width: '100%'} }>
			<Title level={5}>用户统计</Title>
			<Row justify="center">
				<Col>
					<Tabs onChange={ ( key: string ) => setChartsListIndex( key ) }>
						{
							dateList.map( ( item: any, index: number ) => (
								<TabPane tab={ item.name } key={ index }>
									{/* <p>{ item.name }</p> */}
								</TabPane>
							) )
						}
					</Tabs>
				</Col>	
			</Row>
			{/* 用户年月日-start */}	
			<UserCharts chartsList={ chartsList } name={ name }/>
			{/* 用户年月日-end */}	
		</Space>
	</>
}