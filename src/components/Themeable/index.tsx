import React, { useContext } from 'react';
import {Link} from 'react-router-dom';
import { ThemeContext, useTheme } from '../../theme';
import {ContentWrapper, Dot as DotStyled} from '../../pages/styled';
import {Line as StyledLine} from '../styled';
import Styled, {css} from 'styled-components';
import { Row, Col} from 'antd';

const BorderWrapper = Styled.div<any>`
	border: 2px solid #d6d1d1;
	border-radius: 50%;
	position: relative;
	${ (props: any) =>  css`
		width: ${props.width}px;
		height: ${props.height}px;
	`}
`;

export function DotBlue(props: any) {
	const {theme} = useTheme();
	const {children, size = 'small', border = false} = props;

	const sizes:{[key:string]:number} = {
		small: 11,
		medium: 15,
		large: 20,
	};

	return <DotStyled {...props} width={ sizes[size] } height={ sizes[size] } color={theme.colors.bg1}>{children}</DotStyled>
}

export function DotAnyColor(props: any) {
	const {theme} = useTheme();
	const {children, size = 'small', border = false} = props;

	const sizes:{[key:string]:number} = {
		small: 11,
		medium: 15,
		large: 20,
	};

	return <DotStyled color={theme.colors.bg1} {...props} width={ sizes[size] } height={ sizes[size] } >{children}</DotStyled>
}

export function DotRed(props: any) {
	const {theme} = useTheme();

	const {children, border = false, size="small"} = props;

	const sizes:{[key:string]:number} = {
		small: 11,
		medium: 15,
		large: 20,
	};

	if (border) {
		return <BorderWrapper height={sizes[size]*1.8} width={ sizes[size]*1.8 } >
			<DotStyled style={ {top: '50%', left: '50%', position: 'absolute', transform: 'translate(-50%, -50%)' } } color={theme.colors.bg2} width={ sizes[size] } height={ sizes[size] }>{children}</DotStyled>
		</BorderWrapper>
	}

	return <DotStyled {...props} color={theme.colors.bg2} width={ sizes[size] } height={ sizes[size] }>{children}</DotStyled>
}

export function TextBlue({children}: any) {
	const {theme} = useTheme();

	return <span style={ {color: theme.colors.text4} } >{children}</span>
}

export function TextWhite({children}: any) {
	const {theme} = useTheme();

	return <span style={ {color: theme.colors.white} }>{children}</span>
}

export function TextPurple({children}: any) {
	const {theme} = useTheme();
	return <span style={ {color: theme.colors.bg1} }>{children}</span>
}

export function Line({children}: any) {
	const {theme} = useTheme();

	return <StyledLine color={theme.colors.text2}>{children}</StyledLine>
}

export function ContentInner({children, style}: any) {
	const {theme} = useTheme();
	return <div style={ {background: theme.colors.white, margin: '0 auto', padding: '27px 34px', width: '97%', height: '90%', ...style} }>
		{children}
	</div>
}

/*

export function ContentInner({children, style}: any) {
	const {theme} = useTheme();
	return <div style={ {background: theme.colors.white, margin: '0 auto', padding: '27px 34px', width: '97%', height: '90%', ...style} }>
		{children}
	</div>
}

*/

export function TableActionLink(props: any) {
	const {theme} = useTheme();
	const {to, children} = props;
	if (!to) {
		return <a href={undefined} {...props}>{children}</a>
	}
	return 	<Link {...props} style={ {color: theme.colors.bg1 } } to={to}>{children}</Link>
}

export function BorderedContainer(props: any) {
	const {theme} = useTheme();
	const {children} = props; 
	return <div style={ {padding: '5px' ,borderRadius: '5px', background: theme.colors.bg4, border: `1px solid ${theme.colors.bg1}`} }>
		{children}
	</div>
}

export const Center = ({children}: any ) => <Row justify="center">
	<Col>{children}</Col>
</Row>;

export {ContentWrapper};