import { useComponetsStore } from '@/stores/components'
import { memo, useEffect, useState } from 'react'
import { SourceCodeStyled } from './style'
import * as monaco from 'monaco-editor'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import Editor, { loader } from '@monaco-editor/react'

export default memo(() => {
  const { components } = useComponetsStore()
  const [editorValue, setEditorValue] = useState('')
  
  // 解决CDN问题
  self.MonacoEnvironment = {
    getWorker() {
      return new jsonWorker()
    },
  };

  loader.config({ monaco })

  useEffect(() => {
    setEditorValue(JSON.stringify(components, null, 2))
  }, [components])



  return (
    <SourceCodeStyled>
      <Editor
        height="100%"
        defaultLanguage="json"
        value={editorValue}
        options={{
          readOnly: true, // 禁用编辑
          domReadOnly: true, // 禁用DOM只读
        }}
      />
    </SourceCodeStyled>
  )
})