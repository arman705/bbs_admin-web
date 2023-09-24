import Styled, {css} from 'styled-components';

export const MessageWrapper = Styled.div`
	display: block;
	padding: 3px 0px;
`;

export const Nickename = Styled.div`
	font-size: 10px;
	${ (props: any) => css`
		color: ${props.color}px;
	` }
	color: rgba(59, 154, 255, 1);
	line-height: 150%;
`;

export const Message = Styled.div`
	font-size: 11px;
	${ (props: any) => css`
		color: ${props.color}px;
	` }
	line-height: 150%;
`;

export const SendTime = Styled.div`
	font-size: 12px;
	color: #aaa;
`