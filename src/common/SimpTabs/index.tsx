import React, { useState } from "react";
// hooks
import { useTheme } from "../../theme";

// Components
import { TableWrapper, TableCell } from './styled';

export interface Tab{
	name: string,
	id: string;
	type?: string;
};

const defaultProps = {
	tabs: [] as Tab[],
	onChange( item: Tab ){}
};

export interface Props  {
	onChange?: ( item: Tab ) => void,
	tabs?: Tab[],
	defaultSelected?: string
};

export default function SimpleTabs( { tabs, onChange, defaultSelected }: Props = defaultProps) {

	const [selected, updateSelected] = useState(defaultSelected || (tabs ? tabs[0].id: ''));
	const {theme} = useTheme();

	const handleChange = ( item: Tab ) => {
		updateSelected( item.id );
		onChange && onChange( item );
	}

	return <TableWrapper color={ theme.colors.bg1 }>
		{ 
			tabs ? tabs.map( ( item, index: number ) => <TableCell 
																				onClick={ () => handleChange( item ) } 
																				selected={ selected == item.id } 
																				color={ theme.colors.bg1 }  
																				key={ item.id }>{ item.name }</TableCell>
			 ): null 
		} 
	</TableWrapper>
}