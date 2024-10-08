import { ContainerStyled } from './style';
import { CommonComponentProps } from '../interface';
import { useMaterailDrop } from '@/hooks/useMaterialDrop';

const Container = ({ children, id, styles }: CommonComponentProps) => {
  const {canDrop, drop } = useMaterailDrop(['Button', 'Container'], id);

  return (
    <ContainerStyled className='whale-container' ref={drop} data-component-id={id}
      style={{ border: canDrop ? '1px dashed #1890ff' : '1px solid #d9d9d9', ...styles}}
    >
      {children}
    </ContainerStyled>
  )
}

export default Container;