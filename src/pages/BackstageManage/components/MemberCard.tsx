import React from 'react'
import Styled from 'styled-components'
import { Button, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons'
import Permission from '../../../components/Permission';

const MemberCardContainer = Styled.div`
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
    .body-name {
      font-weight: 700;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
    }
    .body-job, .body-number {
      font-size: 14px;
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

      &:not(:last-child) {
        border-right: 1px solid rgba(232, 232, 232, 1);
      }
    }
  }
`

interface IMemberCard {
  iconUrl: string;
  name: string;
  number: string;
  job: string;
  onDelete: () => void;
  onEdit: () => void;
  onPermission: () => void;
}

const MemberCard: React.FC<IMemberCard> = (props) => {
  return (
    <MemberCardContainer>
      <div className="body">
        <div className="body-left">
          <Avatar size={88} icon={<UserOutlined />} />
        </div>
        <div className="body-right">
          <div className="body-name">{props.name}</div>
          <div className="body-number">工号：{props.number}</div>
          <div className="body-job">职务：{props.job}</div>
        </div>
      </div>
      <div className="footer">
        <Permission perms="sys:user:edit">
          <Button type="link" onClick={props.onEdit}>编辑</Button>
        </Permission>
        {/* <Button type="link" onClick={props.onPermission}>权限</Button> */}
        <Permission perms="sys:user:remove">
          <Button type="link" onClick={props.onDelete}>删除</Button>
        </Permission>
      </div>
    </MemberCardContainer>
  )
}

export default MemberCard
