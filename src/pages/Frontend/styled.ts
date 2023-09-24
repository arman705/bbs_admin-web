import Styled, { css } from 'styled-components';

export const WordWrapper = Styled.div<{bg:any, color: any}>`
	border-radius: 3px;
	padding: 6px 10px;
	font-size: 13px;
	${ (props: any) => css`
		background: ${props.bg};
		color: ${props.color};
	` }
`;

export const SpanClick = Styled.span<{cor: any}>`
	
	fontSize: 14px; 
	cursor: pointer;
	${
		( props: any ) => css`
		color: ${ props.cor }	
		`}
`;