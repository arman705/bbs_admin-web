import React from 'react';
import Styled, { css } from 'styled-components';
import {Row, Col} from 'antd';
import {SoundOutlined} from '@ant-design/icons';
import { useTheme } from '../../theme';

const AudioWrapper = Styled.div`
	border-radius: 9px;
	padding: 2px 2px;
	flex: none;
	width: 100px;
	${ (props: any) => css`
 		background: ${props.color}
	` }
`;

export interface AudioProps {
	audio: string
	second: number
}
export default function AudioPlayer({audio, second}: AudioProps) {

	const {theme} = useTheme();

	let playing = false;
	const playSound = () => {
		if (playing ) return ;
		playing = true;
		let obj = new Audio(audio);
		obj.play();
		obj.addEventListener('ended', () => {
			playing = false;
		}, false);
	}

	return <AudioWrapper onClick={ playSound } color={ theme.colors.bg4 }>
		<Row justify="space-between">
			<Col offset={1}>
				<SoundOutlined></SoundOutlined>
			</Col>
			<Col>
				<span>{second}s</span>
			</Col>
		</Row>
	</AudioWrapper>

}