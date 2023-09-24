import React, {useEffect, useState} from 'react';

import {
	Row,
	Col,
	Input,	
	Modal,
} from 'antd';
import Styled, {css} from 'styled-components';
import {
	LinkOutlined
} from '@ant-design/icons';

import { SketchPicker } from 'react-color';

const PickerWrapper = Styled.div`
	border-radius: 5px;
	border: 1px solid #eee;
	padding: 5px;
	position: relative;
`;

const ColorViewer = Styled.div<any>`
	${ (props: any) => css`
		background: ${props.bg};
	width: 78px;
	height: 22px;
	`}
`;

const PickerPosition = Styled.div`
	position: absolute;
	background: #fff;
	z-index: 2;
`;




type Props = {
	getColor?: ( color: string ) => void
};

const ColorPicker = ( { getColor }: Props ) => {

	const [color, setColor] = useState<string>('#eee');
	const [viewPicker, setViewPicker] = useState(false);
 
	useEffect( () => {
		getColor && getColor( color );
	}, [] );

	useEffect(() => {
		if (viewPicker) {
			document.addEventListener('click', clickEvent)
		}
		return () => {
			document.removeEventListener('click', clickEvent)
		}
	}, [viewPicker])

	const handleColorClick = () => {
		setViewPicker(!viewPicker);
		getColor && getColor( color )
	}

	function clickEvent (e: Event) {
		if (findParentNodeByDataset(e.target!, 'name')?.dataset?.name !== 'picker-position') {
			setViewPicker(!viewPicker);
		}
	}

	function findParentNodeByDataset (target: Node | EventTarget, key: string): HTMLElement | null {
		let ele = target as HTMLElement
		while (ele && ele.dataset && !ele.dataset[key]) {
			// console.log(ele)
			const parentNode = (ele as Node).parentNode
			ele = (parentNode as HTMLElement) || null
		}
		return ele
	}

	return <Row gutter={ [0, 5] } align="middle">
		<Col>
			<PickerWrapper >
				<ColorViewer onClick={ handleColorClick } bg={color}></ColorViewer>
				{ viewPicker && <PickerPosition data-name="picker-position"><SketchPicker color={color} onChangeComplete={ (color) => { setColor(color.hex); }  }></SketchPicker></PickerPosition> }
			</PickerWrapper>
		</Col>
		<Col><LinkOutlined></LinkOutlined></Col>
		<Col><Input value={color}></Input></Col>
	</Row>
};

export default ColorPicker;