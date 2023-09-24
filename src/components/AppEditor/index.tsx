import ReactQuill from 'react-quill'
import { uploadPicWater } from '../../api/common'

export default function AppEditor (props) {
  const modules = {
    toolbar: {
      container: [
        [
          { 'color': [] }, { 'background': [] }, 'bold', 'italic', 'underline', 'strike', 
          'blockquote', 'code-block',
          { 'list': 'ordered'}, { 'list': 'bullet' },
          { 'script': 'sub'}, { 'script': 'super' },
          { 'size': ['small', false, 'large', 'huge'] },
          { 'header': [1, 2, 3, 4, 5, 6, false] },
          { 'direction': 'rtl' },
          { 'indent': '-1'}, { 'indent': '+1' },
          { 'font': [] }, { 'align': [] }, 'clean', 'link', 'image', 'video'
        ]
      ],
      handlers: {
        'image': function (e) {
          const input = document.createElement('input')
          input.setAttribute('type', 'file')
          input.setAttribute('accept', 'image/*')
          input.click()
          input.onchange = () => {
            Array.from(input.files).forEach(async item => {
              const res = await uploadPicWater({
                file: item,
                fileType: 'img'
              })
              if (res.code === 200) {
                const quill = editorRef.current.getEditor();//获取到编辑器本身
                const cursorPosition = quill.getSelection().index;//获取当前光标位置
                quill.insertEmbed(cursorPosition, "image", res.data);//插入图片
                quill.setSelection(cursorPosition + 1);//光标位置加1
              }
            })
          }
        }
      }
    }
  }
  return (
    <ReactQuill
      theme="snow"
      modules={modules}
      {...props}>
      <div style={{ height: '200px' }}></div>
    </ReactQuill>
  )
}