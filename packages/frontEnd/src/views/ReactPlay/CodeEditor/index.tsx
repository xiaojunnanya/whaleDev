import { memo } from 'react'
import { useReactPlay } from '@/stores/reactplay'
import FileNameList from './FileNameList'
import Editor from './Editor'
import { debounce } from 'lodash-es'

export default memo(() => {
  const { files, selectedFileName, setFiles } = useReactPlay()
  const file = files[selectedFileName]

  const onChange = (value?: string) => {
    file.value = value!
    files[selectedFileName] = file
    setFiles(files)
  }

  return (
    <>
      <FileNameList />
      <Editor onChange={debounce(onChange, 500)} file={file} />
    </>
  )
})
