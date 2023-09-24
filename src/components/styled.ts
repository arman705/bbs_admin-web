import Styled, {css} from 'styled-components';

export const Line = Styled.div`
	display: block;
	height: 1px;
	border: none;
	${ (props:any) => css`
		background: ${props.color ? props.color: '#C3C5CB'}
	` }

`