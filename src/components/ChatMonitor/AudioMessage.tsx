import React, { useRef, useState } from 'react'
import { AudioMessageContainer } from './styled'
import { PlayCircleFilled } from '@ant-design/icons'

const AudioMessage = (props) => {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)

  function onPlay () {
    if (playing) {
      props.onPause && props.onPause()
      audioRef?.current?.pause()
    } else {
      props.onPlay && props.onPlay()
      audioRef?.current?.play()
    }
    setPlaying(!playing)
  }
  return (
    <AudioMessageContainer className={playing ? 'playing' : ''} onClick={onPlay}>
      <PlayCircleFilled style={{ fontSize: 16 }} />
      <span>{props.duration || 0}s</span>
      <audio
        ref={audioRef}
        src={props.url}
        style={{ display: 'none' }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}></audio>
    </AudioMessageContainer>
  )
}

export default AudioMessage
