import Styled, {css} from 'styled-components';

export const SpanClick = Styled.span<{cor: any, cur: boolean, both?: boolean }>`
	${ (props: any) => css`
    color: ${ props.cor };
    cursor: ${ props.cur ? 'pointer' : 'default' };
    font-weight: ${ props.both ? '700' : '500' };
	` }
`;

export const ReportWrap = Styled.div`
    width: 100%; 
    height: 200px; 
    overflow: auto; 
    box-sizing: border-box; 
    border: 1px solid #ddd; 
    padding-left: 5px;
`;

export const SubReportWrpa = Styled.div`
    width: 100%;
    display: flex;
    box-sizing: border-box;
    padding: 20px;
    flex-direction: column;
    justify-just: space-between;
    align-items: center;
`;

export const SubReportBtn = Styled.div<{cor: string, bg: string, mt?: boolean }>`
    width: 50%;
    height: 30px;
    display: flex;
    cursor: pointer;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border-radius: 2px;
    ${ ( props: any ) => css `
        color: ${ props.cor };
        background: ${ props.bg };
        margin-top: ${ props.mt ? '10px' : '0' };
    `}
`;

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