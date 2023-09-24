import React from 'react';
import {
	Table,
	Typography,
	Space
} from 'antd';
import Styled from 'styled-components';
import Dialog from './dialog';

export {Dialog}

const {
	Title
} = Typography;

export interface Props {
	title: string
	prefix?: React.ReactNode
	suffix?: React.ReactNode
	[key:string]: any
}

const DatatableWrapper = Styled.div`
	width: 100%; 
	box-sizing: border-box;
`;


export default function Datatable(props: Props = {title: '数据表格'}) {

	const {title, prefix, suffix} = props;

	const tableProps = {...props};
	tableProps.title = '';

	return <DatatableWrapper>
		<Space style={ {width: '100%'} } direction="vertical">
			<Title level={5}>{title}</Title>
			{prefix}
			<Table {...( tableProps as any )}></Table>
			{suffix}
		</Space>
	</DatatableWrapper>
}
