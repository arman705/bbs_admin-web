import React from 'react';

import { AliwangwangOutlined } from '@ant-design/icons';
import { Space, Typography, Divider, Row, Col } from 'antd';
import { DotRed, TableActionLink } from '../Themeable';

import sampleImg from '../../assets/images/chat-sample.png';
import { useTheme } from '../../theme';
import Styled from 'styled-components';
import Permission from '../Permission';

const { Title, Text } = Typography

const DescWrapper = Styled.div`
	padding: 0px 24px 0px 24px;
`;

const defaultProps = {
	onEdit() {

	},
	onDelete() {

	},
	imgurl: '',
	name: '',
	subTitle: '',
	imgIcon: ''
};

export type Props = {
	onEdit?: () => void,
	onDelete?: () => void, 
	imgurl: string;
	name: string;
	subTitle: string;
	imgIcon: string | null;
};

export default function ModuleCard({onEdit, onDelete, imgurl, name, subTitle, imgIcon }: Props = defaultProps) {

	// let {  }

	const {theme} = useTheme();

	return <Space direction="vertical"  style={ {background: theme.colors.white, width: '240px', height: '150px' } }>
		{/* <div style={ {height: '160px', width: 'calc( 100vh )', display: 'table-cell', verticalAlign: 'middle',textAlign: 'center'} }>
			<img style={ {height: '100%', width: '100%'} } src={ imgurl ? imgurl : sampleImg} alt="" />
		</div> */}
		
		<DescWrapper style={{height: '30px', marginTop: '25px'}}>
			<Row justify="start" align="middle" gutter={ [5, 10] }>
				<Col>
					{ 
						imgIcon ? 
						<img style={{ width: '16px', height: '16px', borderRadius: '8px' }} src={ imgIcon } alt="" /> : 
						<AliwangwangOutlined />
					}
				</Col>
				<Col><Title title={ name } style={ {marginBottom: '0px', cursor: 'pointer', maxWidth: '100px', overflow: 'hidden',textOverflow: 'ellipsis', whiteSpace: 'nowrap' } } level={5}>{ name }</Title></Col>
				<Col><DotRed border={true}></DotRed></Col>
			</Row>
		</DescWrapper>
		<DescWrapper style={{height: '30px'}}>
			<Text style={ {fontSize: '11px'} } type="secondary">{ subTitle || '暂无内容' }</Text>
		</DescWrapper>
		<div>
			<Divider type="horizontal" style={ {margin: '0px'} }></Divider>
			<Row justify="space-around" align="middle" style={ {height: '45px'} }>
				<Permission perms="novel:articleType:edit">
					<Col><TableActionLink onClick={ onEdit }>编辑</TableActionLink></Col>
				</Permission>
				<Permission perms="novel:articleType:remove">
					<Col><TableActionLink onClick={ onDelete } style={ {color: theme.colors.text2} }>删除</TableActionLink></Col>
				</Permission>
			</Row>
		</div>

	</Space>
}