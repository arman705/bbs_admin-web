import React from 'react'
import Styled from 'styled-components'
import { Button, Image } from 'antd';
import Permission from '../../../../components/Permission'

const MedalCardContainer = Styled.div`
  display: flex;
  flex-direction: column;
  width: 365px;
  border: 1px solid rgba(233, 233, 233, 1);

  .body {
    background-color: #fff;
    display: flex;
    padding: 20px;
    border-bottom: 1px solid rgba(233, 233, 233, 1);
    .body-left {
      flex-shrink: 0;
      font-size: 0;
    }
    .body-right {
      flex: 1;
      margin-left: 20px;
      display: flex;
      flex-direction: column;
    }
    .body-title {
      font-size: 16px;
      font-weight: 700;
      color: rgba(0, 0, 0, 0.85);
    }
    .body-subtitle {
      font-size: 14px;
      color: rgba(56, 56, 56, 1);
    }
    .body-desc {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
  .footer {
    background-color: rgba(247, 249, 250, 1);
    display: flex;
    height: 48px;
    align-items: center;
    .ant-btn {
      flex: 1;

      &:nth-child(1) {
        border-right: 1px solid rgba(232, 232, 232, 1);
      }
    }
  }
`

interface IMedalCard {
  iconUrl: string;
  title: string;
  desc: string;
  onDelete: () => void;
  onEdit: () => void;
}

const MedalCard: React.FC<IMedalCard> = (props) => {
  return (
    <MedalCardContainer>
      <div className="body">
        <div className="body-left">
          <Image
            style={{ objectFit: 'cover' }}
            src={props.iconUrl}
            width={88}
            height={88}
            preview={false} />
        </div>
        <div className="body-right">
          <div className="body-title">{props.title}</div>
          <div className="body-desc">{props.desc}</div>
        </div>
      </div>
      <div className="footer">
        <Permission perms="system:medalInfo:edit">
          <Button type="link" onClick={props.onEdit}>编辑</Button>
        </Permission>
        <Permission perms="system:medalInfo:remove">
          <Button type="link" onClick={props.onDelete}>删除</Button>
        </Permission>
      </div>
    </MedalCardContainer>
  )
}

export default MedalCard
