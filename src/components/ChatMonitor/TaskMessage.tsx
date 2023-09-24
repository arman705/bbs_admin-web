import React, { useState } from 'react'
import { TaskMessageContainer } from './styled'
import { Image, Modal } from 'antd';
import { PlayCircleFilled } from '@ant-design/icons';
import { TextMessageContainer } from './styled'

const TaskMessage = (props) => {
  const [visible, setVisible] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const data = props.data
  const images = data.imgUrl ? data.imgUrl.split(',').map(item => ({ url: item, type: 'image' })) : []
  const videos = data.videoUrl ? data.videoUrl.split(',').map(item => ({ url: item, type: 'video' })) : []
  const medias = [...images, ...videos]
  function onClick (url) {
    setCurrentUrl(url)
    setVisible(true)
  }
  return (
    <TaskMessageContainer>
      { data.text && <TextMessageContainer>{ data.text }</TextMessageContainer> }
      <div className="media-list">
        {
          medias.map(item => {
            if (item.type === 'image') {
              return <Image className="media-image" src={ item.url }/>
            }
            if (item.type === 'video') {
              return (
                <div className="media-video" onClick={ () => onClick(item.url) }>
                  <video src={ item.url } />
                  <PlayCircleFilled />
                </div>
              )
            }
          })
        }
      </div>

      <Modal
        title="视频预览"
        visible={visible}
        footer={null}
        onCancel={() => setVisible(false)}>
          <div
            style={{
              width: '100%',
              height: 300,
              backgroundColor: '#000',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <video controls style={{ width: '100%', height: '100%' }} src={currentUrl} />
          </div>
      </Modal>
    </TaskMessageContainer>
  )
}

export default TaskMessage
