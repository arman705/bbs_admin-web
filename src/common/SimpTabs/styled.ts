import Styled, {css} from 'styled-components';

export const TableWrapper = Styled.table`
    border-collapse: collapse;
	${ (props: any) => css`
		border: 1px solid ${props.color};
		color: ${props.color};
		border-radius: 5px;
	` }
`;

export const TableCell = Styled.td<{ selected:boolean, color: string}>`
	font-size: 13px;
	padding: 5px 10px;
	cursor: pointer;
	${ (props: any) => css`
		color: ${props.color};
		border: 1px solid ${props.color};
		${props.selected && css`
			background: ${props.color};
			color: #fff;
		` }
	`}
`;