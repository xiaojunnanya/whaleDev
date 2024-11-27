import { CommonComponentProps } from '../interface'
import styles from './index.module.less'

const Container = ({ children, style, ...props }: CommonComponentProps) => {
  return (
    <div className={styles['whale-page']} style={style} {...props}>
      {children}
    </div>
  )
}

export default Container
