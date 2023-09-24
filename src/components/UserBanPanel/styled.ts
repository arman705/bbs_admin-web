import Styled, {css} from 'styled-components';
import { Color } from '../../theme';

export const DialogWrapper = Styled.div`
	position: relative;
`;

export const QuickMessagePanelWrapper = Styled.div`
	width: 100%;
	height: 235px;
	position: absolute;
	bottom: 46px;
	z-index: 11111;

`;

export const ListWrapper = Styled.div`
	${ (props: { bg: Color, color: Color }) => css`
		background: ${props.bg};
		color: ${props.color};
	` }
	font-size: 13px;
	line-height: 150%;
	padding: 5px;
	overflow-y: scroll;
	height: 100px;
`;

export const ActionWrapper = Styled.div`
	margin-top: 10px;
`;