import React, { useContext, useState } from 'react';

import { Colors, Theme } from './styled';

export type {Color} from './styled';

export const colors = function(dark: boolean): Colors {
	let colors: Colors = {
		white: '#fff',
		black: '#333',
		text1: '#fff',
		text2:'#C3C5CB',
		text3: 'rgba(0, 0, 0, 0.45)',
		text4: 'rgba(59, 154, 255, 1)',
		bg1: 'rgba(81, 46, 222, 1)',
		bg2: 'rgba(212, 48, 48, 1)',
		bg3: 'rgba(67, 207, 124, 1)',
		bg4: 'rgba(193, 197, 238, 1)',
		bg5: 'rgb(239 239 239)',
		bg6: 'rgba(255, 129, 102, 1)',
	} as any;

	if (dark) {
		colors = {
			white: '#fff',
			black: '#333',
			text1: '#fff',
			text2:'#C3C5CB',
			text3: 'rgba(0, 0, 0, 0.45)',
			text4: 'rgba(59, 154, 255, 1)',
			bg1: 'rgba(81, 46, 222, 1)',
			bg2: 'rgba(212, 48, 48, 1)',
			bg3: 'rgba(67, 207, 124, 1)',
			bg4: 'rgba(193, 197, 238, 1)',
			bg5: 'rgb(239 239 239)',
			bg6: 'rgba(255, 129, 102, 1)',
		} as any;
	}

	return colors
}

const themeConfig = {
	dark: {
		colors: colors(true),
	},
	light: {
		colors: colors(false)
	}
};

type ThemeConfig = typeof themeConfig.dark
type ThemeContext = { theme: ThemeConfig, toggleTheme: (theme: Theme) => void }

export const ThemeContext = React.createContext<ThemeContext>( {} as any );

export const ThemeProvider: React.FC = ({children}) => {
	const [theme, updateTheme] = useState(themeConfig.light);

	const toggleTheme = (theme: Theme) => {
		updateTheme( themeConfig[theme] );
	}

	return <ThemeContext.Provider value={ { theme , toggleTheme } }>
		{children}
	</ThemeContext.Provider>
}

export function useTheme() {
	return useContext(ThemeContext);
}