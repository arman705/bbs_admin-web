import Styled, {css} from 'styled-components'; 
import { Color, useTheme } from '../../theme';

export const Wrapper = Styled.div`
	${ (props: {color: Color, bg: Color}) => css`
	
		border-radius: 2px;
		background: ${props.bg};
	` }
	box-sizing: border-box;
	padding: 0 10px 10px 10px;
	box-shadow: 0 0 5px #000;
`;

// 编辑按钮样式
export const editBtnCss = {
	position: 'absolute',
	right: '3px',
	top: '50%',
	transform: 'translateY(-50%)',
};

export const ListWrapperParent = Styled.div`
  width: 100%; 
  overflow: hidden;
`;

export const ListWrapper = Styled.ul`
	width: calc(100% + 17px);
	height: 150px; 
	listStyle: none; 
	margin: 0; 
	padding: 0; 
	overflow-y: scroll;
	border: none;
`;

export const ListItem = Styled.li`
  width: 100%; 
  height: 30px;
  boxSizing: border-box;
  padding: 2px 5px; 
  border-bottom: 1px solid #eaeaea33; 
  cursor: pointer;
`;

export const ListItemColTop = Styled.div`
  width: 100%; 
  height: 100%; 
  color: #666;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; 
  boxSizing: border-box; 
`;

export const EditArea = Styled.div`
	margin-top: 5px;
	height: 50px;
`;