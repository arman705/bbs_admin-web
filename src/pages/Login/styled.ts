import Styled, {css} from 'styled-components';
import { Color } from '../../theme';

export const LoginBg = Styled.div`
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  background-repeat: no-repeat;
  background-size: cover;
  ${ ( props: {bg: string}) => css`
    background-image: url(${ props.bg });
  ` }
`;

export const Title = Styled.h1`
  font-size: 50px;
  text-align: center;
  ${ ( props: { color: Color}) => css`
    color: ${props.color};
  ` }
`;

export const LoginFormWrap = Styled.div`
  margin-top: 200px;
`;

export const verifyImg = Styled.img`
  width: 50%;
  height: 40px;
  float: right;
`;