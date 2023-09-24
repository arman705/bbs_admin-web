import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { getVersionDetail } from '../../api/backstage'

const Report: React.FC<any> = ({ match, history }) => {
  const [detail, setDetail] = useState<any>({});
  useEffect(() => {
    const id = match.params.id;
    if (id) {
      getVersionDetail(id).then((res) => {
        setDetail(res);
      })
    }
  }, [])
  return (
    <div style={{ background: '#fff', padding: 30 }}>
      <h1>{detail.name}</h1>
      <p dangerouslySetInnerHTML={{ __html: detail.description }} />
      <p style={{ textAlign: 'right' }}>
        更新时间：{detail.updateAt}
      </p>
      <div style={{ textAlign: 'right' }}>
        <Button type='primary' onClick={() => history.goBack()}>返回列表</Button>

      </div>
    </div>
  )
};

export default withRouter(Report);