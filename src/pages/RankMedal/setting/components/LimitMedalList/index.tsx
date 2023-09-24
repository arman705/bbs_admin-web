import React, { useState } from 'react'
import { Radio } from 'antd'
import MedalList from '../MedalList'
import ApplyList from './ApplyList'
import Permission from '../../../../../components/Permission'

const LimitMedalList = ({ searchValue }: { searchValue: string }) => {
  const type = 3
  const [currentSelect, setCurrentSelect] = useState(1)
  
  return (
    <>
      <Permission perms="system:medalApply:list">
        <div style={{ marginBottom: 20, textAlign: 'center' }}>
          <Radio.Group
            buttonStyle="solid"
            defaultValue={currentSelect}
            onChange={(e) => {
              const value = e.target.value
              setCurrentSelect(value)
            }}>
            <Radio.Button value={1}>勋章列表</Radio.Button>
            <Radio.Button value={2}>申请记录</Radio.Button>
          </Radio.Group>
        </div>
      </Permission>
      {
        currentSelect === 1 ? <MedalList searchValue={searchValue} type={type} /> : <ApplyList />
      }
    </>
  )
}

export default LimitMedalList
