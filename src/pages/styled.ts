import Styled, {css} from 'styled-components';
import { Color } from '../theme';

export const PageWrapper = Styled.div`
	width: 100%;
	min-height: 100vh;
`;

export const ContentWrapper = Styled.div`
	width: 100%;
	min-height: calc(100vh - 60px);
	position: relative;
`;

// margin-right: 5px
export const MR5 = Styled.div`
	display: inline-block;
	margin-right: 5px;
`;

// margin-left: 5px
export const ML5 = Styled.div`
	display: inline-block;
	margin-left: 5px;
`;

export const MV = Styled.div`
	padding: 10px 0px;
`;

// 点
export const Dot = Styled.div<{width?:number, height?: number, color: Color}>`
	border-radius: 100%;
	border: none;
	display: inline-block;
	${ (props: any) => css`
		background: ${props.color};
		width: ${props.width ? props.width: 11}px;
		height: ${props.height ? props.height: 11}px;
		text-align: center;
		line-height: ${props.height ? props.height: 11}px;
	` }
`;

export const BlockInline = Styled.div`
	display: inline-block;
`;

export const StreamWrapper = Styled.div`
width: 100%;
${ (props: {zoom: boolean}) => css`
	 position: absolute;
	width: 98%;
	height: 100%;
	left: 0px;
	top: 0px;
` }
.ant-card-body{
	padding:16px 8px 16px 20px;
}
`;