import React from 'react'
import * as Icon from '@ant-design/icons/lib/icons';
import { IconWrap } from './styled';

export default function IconPopover ({ onSelect }) {
  const icons = Object.keys(Icon).filter(item => !item.includes('TwoTone')).map(key => {
    const Component = Icon[key]
    return (
      <IconWrap
        key={key}
        onClick={() => onSelect(key)}>
        <Component style={{ fontSize: 18 }} />
      </IconWrap>
    )
  })
  return (
    <div style={{
      width: 600,
      height: 400,
      overflowY: 'auto',
      display: 'flex',
      flexWrap: 'wrap'
    }}>
      { icons }
    </div>
  )
}