import React from 'react';
import {
	Row,
	Col,
	Typography
} from 'antd';
import { useMenuCascade } from '../../utils/menu';
import { Link, useRouteMatch } from 'react-router-dom';

const {Text} = Typography;

export default function Thumbnail() {

	const pathes = useMenuCascade();
	const {path} = useRouteMatch();

	return <Row style={ {padding: '15px'} } justify="start" gutter={10}>
		{ path != '/dashboard' && <Col key={'/dashboard'}>
			<Link to={ '/dashboard' }> <Text>控制台	/ </Text></Link>
		</Col> }
		{ pathes.map( (menu, key) => (
			<Col key={key}>
				<Link to={menu.url as string || path }><Text>{key == 0 ? '': ' / '}{menu.name}</Text></Link>
			</Col>
		)  ) }	
	</Row>
}