import Styled, {css} from 'styled-components';

export const TabWrapper = Styled.div<any>`
	position: relative;
	padding: 7px 10px;
	cursor: pointer;
	${ (props: any) => css`
		color: ${props.color};
	` }
	${ (props: any) => props.selected && css`
		color: ${props.selectedColor};
		background: ${props.bg};
		&:before {
			content: " ";
			height: 4px;
			background: ${props.selectedColor};
			width: 100%;
			left: 0px;
			bottom: 0px;
			position: absolute;
		}
	`}
`;
