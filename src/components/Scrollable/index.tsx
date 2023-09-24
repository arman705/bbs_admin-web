import React, { useContext, useState, useEffect } from 'react';
import Styled, {css} from 'styled-components';
import {
	Row,
	Col,
} from 'antd';
import {
	LeftOutlined,
	RightOutlined
} from '@ant-design/icons';
import { GlobalContext } from '../../utils/global';
import { Color, ThemeContext } from '../../theme';

export interface Props{
	texts: string[]
	view?: number,
	onSelect?: (text:string) => void
}

export const initProps: Props = {
	texts: [],
};

const Wrapper = Styled.div`
	display: inline-block;
`;

const Selected = Styled.span`
	display: inline-block;
	position: relative;
	cursor: pointer;
	${ (props: {selected: boolean, color: Color} ) => {
		if (props.selected) {
			return css`
				&:before {
					content: " ";
					display: block;
					width: 100%;
					height: 2px;
					background: ${props.color};
					position: absolute;
					bottom: -5px;
					left: 0px;
				}
			`
		} else {
			return css``;
		}
	}}
`;

export default function Scrollable({texts, view = 5, onSelect = (text:string) => {}}: Props = initProps) {

	console.log( "texts", texts )

	
	const filterTexts = () => texts.filter( (_, index) => index < view  )

	const [viewTexts, updateViewTexts] = useState<string[]>([]);
	const [selected, updateSelected] = useState(viewTexts[0]);
	const {theme} = useContext( ThemeContext);

	useEffect( () => {
		updateViewTexts( filterTexts() )
	}, [ texts.length ] )
	
	
	const renderTexts = viewTexts.map( (text, index) => {
		return <Col onClick={ () => ( updateSelected(text), onSelect(text) ) } key={index}>
			<Selected selected={ text == selected } color={ theme.colors.bg1 }>{text}</Selected>
		</Col>
	} );

	const moveLeft = () => {
		let first = texts.shift();
		texts.push(first as string);
		updateViewTexts(filterTexts());
	}

	const moveRight = () => {
		let last = texts.pop();
		texts.unshift(last as string);
		updateViewTexts(filterTexts());
	}
	

	return <Wrapper>
		<Row gutter={20} justify="space-between">
			<Col onClick={moveLeft}><LeftOutlined /></Col>
			{renderTexts}
			<Col onClick={moveRight}><RightOutlined /></Col>
		</Row>
	</Wrapper>
	
}