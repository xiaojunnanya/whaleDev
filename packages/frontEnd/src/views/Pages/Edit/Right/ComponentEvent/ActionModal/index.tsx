import { Form, Modal } from 'antd'
import { memo } from 'react'
import { ActionModalStyled } from './style'
import { itemsActions, itemsChildType } from '../Actions'
import Describe from '../Actions/Describe'

interface IProps {
  showModal: {
    showActionModal: boolean
    setShowActionModal: (showActionModal: boolean) => void
  }
  handleAction: {
    saveAction: itemsChildType
    setSaveAction: (action: itemsChildType) => void
  }
}

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

export default memo((props: IProps) => {
  const [form] = Form.useForm()
  const { showModal, handleAction } = props
  const { showActionModal, setShowActionModal } = showModal
  const { saveAction, setSaveAction } = handleAction
  console.log(saveAction)

  const handleOk = () => {
    setShowActionModal(false)
  }

  const handleCancel = () => {
    setShowActionModal(false)
  }

  const handleClick = (item: any) => {
    setSaveAction(item)
  }

  return (
    <Modal
      title="添加服务编排"
      width={800}
      open={showActionModal}
      okText="确认"
      cancelText="取消"
      onOk={handleOk}
      onCancel={handleCancel}
      className="actonModal"
    >
      <ActionModalStyled>
        <div className="menuAction">
          <ul>
            {itemsActions.map((item: any) => {
              return (
                <li key={item.key} className="category">
                  <span className="navTitle">{item.label}</span>
                  <ul>
                    {item.children.map((child: any) => {
                      return (
                        <li
                          key={child.key}
                          className={`subItem ${
                            saveAction?.key === child.key ? 'checked' : ''
                          }`}
                          onClick={() => handleClick(child)}
                        >
                          <span>{child.label}</span>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="content">
          <Form {...formLayout} form={form}>
            {saveAction?.key && saveAction?.key !== 'none' ? (
              <>
                <Describe>{saveAction?.describe}</Describe>
                {saveAction.render()}
              </>
            ) : (
              <div className="content-text">请选择要执行的动作</div>
            )}
          </Form>
        </div>
      </ActionModalStyled>
    </Modal>
  )
})
