import { useDrop } from 'react-dnd'
import { useComponentMapStore } from '../stores/componentMap'
import { useComponetsStore } from '../stores/components'
import { getComponentById } from '@/utils'

export interface ItemType {
  type: string
  dragType?: 'move' | 'add'
  id: string
}

/**
 * 将组件放置容器中
 * @param accept 接受的组件
 * @param id 当前组件的容器id
 * @returns
 */
export function useMaterailDrop(accept: string[], id: string) {
  const { addComponent, components, deleteComponent } = useComponetsStore()
  const { componentMap } = useComponentMapStore()

  const [{ canDrop }, drop] = useDrop(
    () => ({
      accept,
      drop: (item: ItemType, monitor) => {
        // 处理过的就不在处理了
        const didDrop = monitor.didDrop()
        if (didDrop) return
        // 这里暂时去除画板中组件拖拽，所以这个if暂时没有用
        if (item.dragType === 'move') {
          const component = getComponentById(item.id, components)!
          // 删除原先的组件
          deleteComponent(item.id)
          addComponent(component, id)
        } else {
          const config = componentMap[item.type]

          addComponent(
            {
              id: item.type + '_' + String(+new Date()),
              name: item.type,
              desc: config.desc,
              props: config.defaultProps,
            },
            id,
          )
        }
      },
      collect: monitor => ({
        canDrop: monitor.canDrop(),
      }),
    }),
    [components],
  )

  return { canDrop, drop }
}
