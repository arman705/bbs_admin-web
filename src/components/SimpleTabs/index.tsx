import React, { useState } from "react";

import Styled, { css } from 'styled-components';
import { useTheme } from "../../theme";

export interface Tab {
	name: string,
	value:string
};

const defaultProps = {
	onChange(name: string) {

	},
	tabs: [] as Tab[],
};

const TableWrapper = Styled.table`
    border-collapse: collapse;
	${(props: any) => css`
		border: 1px solid ${props.color};
		color: ${props.color};
		border-radius: 5px;
	` }
`;

const TableCell = Styled.td<{ selected: boolean, color: string }>`
	font-size: 13px;
	padding: 5px 10px;
	cursor: pointer;
	${(props: any) => css`
		color: ${props.color};
		border: 1px solid ${props.color};
		${props.selected && css`
			background: ${props.color};
			color: #fff;
		` }
	`}
`;

export interface Props {
	onChange?: (name: string) => void,
	tabs?: Tab[],
};

export default function SimpleTabs({ tabs, onChange }: Props = defaultProps) {

	const [selected, updateSelected] = useState(tabs ? tabs[0].value : '');
	const { theme } = useTheme();

	const handleChange = (name: string) => {
		updateSelected(name);
		if (onChange) {
			onChange(name);
		}
	}

	return <TableWrapper color={theme.colors.bg1}>
		{
			tabs ? tabs.map((tab, id) => <TableCell
				onClick={() => handleChange(tab.value)}
				selected={selected == tab.value}
				color={theme.colors.bg1}
				key={id}>{tab.name}</TableCell>
			) : null
		}
	</TableWrapper>
}