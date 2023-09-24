import Styled, {css} from 'styled-components';
import { Color } from '../../theme';

export const Wrapper = Styled.div`
	display: inline-block;
`;

export const Selected = Styled.span`
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