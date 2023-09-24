import Styled, {css} from 'styled-components';

export const Wrapper = Styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
`;

export const ScrollContainer = Styled.div`
	width: 100%;
	${ (props: {zoom: boolean, hideInput: boolean }) => {
		return props.zoom ? css`
			height: calc(100vh - 350px);
		`: (  props.hideInput ? css`
			height: calc(460px + 63px);
		`:  css`
			height: 462px;
		`)
	}}
	position: relative;
	overflow: hidden;
	flex: auto;
`;

export const Scrollable = Styled.div`
	width: 100%;
	height: 100%;
	position: absolute;
	overflow: auto;
	&::-webkit-scrollbar{
		width: 6px;
		height:6px;
	}
	&::-webkit-scrollbar-thumb{
		background: #bfbfbf;
		border-radius:10px;
	}
`;

export const ShowTime = Styled.div`
	height: 20px;
	padding: 0 20px;
	margin-bottom: 10px;
	border-radius: 10px;
	line-height: 20px;
	text-align: center;
	background: rgba(0, 0, 0, 0.12);
`;

export const AudioWrapper = Styled.div`
	cursor: pointer;
	border-radius: 9px;
	padding: 2px 0px;
	width: 100px;
	flex: none;
	${ (props: any) => css`
 		background: ${props.color}
	` }
`;

export const Botter = Styled.div`
	padding: 15px;
	${ (props: any) => css`
 		border-top: 1px solid ${props.borderColor}
	` }
	flex: none;
`;

export const UpcomingWrapper = Styled.div`
	display: inline-block;
	width: 88px;
	padding: 4px 0px;
	text-align: center;
	${ (props: any) => css`
		background: ${ props.bg ? props.bg: 'rgba(236, 236, 236, 1)' };
		color: ${ props.color ? props.color: 'rgba(81, 46, 222, 1)'};
	` }
	font-size: 12px;
	line-height: 150%;
	border-radius: 16px;
	position: absolute;
	right: 8px;
	bottom: 8px;
	z-index: 2;
	cursor: pointer;
`

export const EmojiWrapper = Styled.div`
	position: absolute;
	width: 450px;
	bottom: 0px;
	left: 0px;
	border-radius: 2px;
	z-index: 2;
`;

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
	color: #aaa;`