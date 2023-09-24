import Styled, {css} from 'styled-components';
 
export const Container = Styled.div`
	padding: 20px 24px;
	${ (props: any) => css`
		background: ${props.color};
	` }
`;