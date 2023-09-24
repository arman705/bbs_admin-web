import Styled, {css} from 'styled-components';
import Datatable from "../../components/Datatable";

export const SpanClick = Styled.span<{cor: any, cur?: boolean, both?: boolean }>`
	${ (props: any) => css`
    color: ${ props.cor };
    cursor: ${ props.cur ? 'pointer' : 'default' };
    font-weight: ${ props.both ? '700' : '500' };
	` }
`;

export const SortWrap = Styled.div`
  width: 90%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const ModalContentWrap = Styled.div`
    width: 100%; 
    height: 200px; 
    overflow: hidden; 
    box-sizing: border-box; 
    border: 1px solid #ddd; 
    padding-left: 5px;
`;


export const UserEvaluate = Styled.span<{ cor: string, bg: string }>`
  padding: 0 10px;
  margin: 2px 0px;
  font-size: 12px;
  display: inline-block;
  border-radius: 2px;
  box-sizing: border-box;
  
  ${ ( props: any ) => css `
    color: ${ props.cor };
    background: ${ props.bg };
    border: 1px solid ${ props.cor };
    `}
`;

export const FeedbackTable = Styled(Datatable)`
  td {
    word-break: break-all;
  }
`

export const VideoWrap = Styled.div`
  display: inline-flex;
  position: relative;
  margin-right: 10px;
  width: 100px;
  height: 100px;
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .video-mask {
    background-color: rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    cursor: pointer;
    .anticon {
      color: #FFF;
      font-size: 30px;
    }
  }
`