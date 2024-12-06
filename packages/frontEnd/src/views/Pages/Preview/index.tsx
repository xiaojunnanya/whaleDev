import Container from '@/components/Container'
import { getPageJsonByPageId } from '@/service/request/page_json'
import { useComponentMapStore } from '@/stores/componentMap'
import { Component, initComponents } from '@/stores/components'
import { createElement, memo, ReactNode, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default memo(() => {
  const params = useParams()
  const { page_id = '' } = params
  const { componentMap } = useComponentMapStore()
  const [pageJson, setPageJson] = useState<Component[]>([] as Component[])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getPageJson()
  }, [page_id])

  const getPageJson = async () => {
    setLoading(true)
    // 获取页面信息
    const { data } = await getPageJsonByPageId(page_id)
    let pageJson = data?.page_json
    if (!pageJson || pageJson === JSON.stringify(initComponents))
      pageJson = JSON.stringify([])

    setPageJson(JSON.parse(pageJson))
    setLoading(false)
  }

  const renderComponents = (components: Component[]): ReactNode => {
    if (components.length === 0) return null
    return components.map((component: Component) => {
      const config = componentMap?.[component.name]

      if (!config?.component.prod) {
        return null
      }

      return createElement(
        config.component.prod,
        {
          key: component.id,
          id: component.id,
          name: component.name,
          styles: component.styles,
          author: 'whale',
          ...config.defaultProps,
          ...component.props,
          // 遗留的问题：添加事件
        },
        renderComponents(component.children || []),
      )
    })
  }

  return (
    <>
      {pageJson.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          该页面暂无组件
        </div>
      ) : (
        <Container isLoading={loading}>{renderComponents(pageJson)}</Container>
      )}
    </>
  )
})
