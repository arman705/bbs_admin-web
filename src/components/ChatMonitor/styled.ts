import Styled from 'styled-components';

export const Container = Styled.div`
	background-color: #FFF;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  &.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
  }
  .header {
    padding: 16px 24px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    border-bottom: 1px solid #f0f0f0;
    .left {
      flex: 1;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      font-size: 16px;
      display: flex;
      align-items: center;
      ::before {
        content: '';
        display: inline-block;
        border-radius: 100%;
        background: rgba(67,207,124,1);
        width: 11px;
        height: 11px;
        margin-right: 5px;
      }
    }
    .right {
      .ant-btn {
        padding: 0;
        margin-left: 10px;
        .anticon
      }
    }
  }
  .content {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 50px;
  }
  .footer {
    flex-shrink: 0;
    padding: 12px;
    border-top: 1px solid #f0f0f0;
  }
  .tips {
    position: absolute;
    bottom: 10px;
    right: 20px;
    height: 30px;
    color: #2563EB;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    border-radius: 30px;
    background: #e6f7ff;
    cursor: pointer;
  }
`;

export const MessageContainer = Styled.div`
  display: flex;
  padding: 12px;
  box-sizing: border-box;
  .left {
    flex-shrink: 0;
    cursor: pointer;
    img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  .right {
    margin-left: 10px;
    font-size: 12px;
    color: #666;
    > span:nth-child(2) {
      margin-left: 10px;
    }
    .right-header {
      color: #000;
      span {
        margin-right: 6px;
      }
      .time {
        color: #666;
      }
    }
    .right-content {
      margin-top: 6px;
      display: flex;
      align-items: flex-end;
    }
    .right-content-btn {
      padding: 0;
      margin-left: 10px;
      line-height: 1;
      height: auto;
    }
  }
`
export const TextMessageContainer = Styled.div`
  display: inline-block;
  min-width: 80px;
  padding: 6px;
  word-break: break-all;
  background: #fff;
  font-size: 12px;
  color: #333;
  border: 1px solid #d1d1d1;
  border-radius: 4px;
`
export const ImgMessageContainer = Styled.div`
  width: 140px;
  display: flex;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5)
`
export const AudioMessageContainer = Styled.div`
  display: flex;
  align-items: center;
  width: 80px;
  padding: 6px;
  background: #fff;
  font-size: 12px;
  color: #333;
  border: 1px solid #d1d1d1;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  span:nth-child(2) {
    margin-left: 8px;
  }
  &.playing {
    border-color: #1890ff;
    span {
      color: #1890ff;
    }
  }
`
export const ShareMessageContainer = Styled.div`
  .wrap {
    background: #fff8d8;
    padding: 6px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    margin-top: 4px;
    cursor: pointer;
    span {
      color: blue;
    }
  }
`
export const ModalContent = Styled.div`
  .modal-wrap {
    background: #FFFBEB;
  }
`
export const EmojiWrap = Styled.div`
  width: 25px;
  height: 25px;
  padding: 5px;
  box-sizing: content-box;
  cursor: pointer;
  display: inline-flex;
  border-radius: 4px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  &:hover {
    background: #FDE68A;
  }
`

export const TaskMessageContainer = Styled.div`
  .media-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
  }
  .media-image {
    width: 80px;
    height: 80px;
    margin-right: 4px;
    margin-bottom: 4px;
    object-fit: cover;
  }
  .media-video {
    width: 80px;
    height: 80px;
    margin-right: 4px;
    margin-bottom: 4px;
    position: relative;
    cusor: pointer;
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .anticon-play-circle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      font-size: 20px;
    }
  }
`