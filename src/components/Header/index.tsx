import { memo, useEffect, useState } from 'react'
import { HeaderStyle } from './style'
import logo from '@/assets/images/favicon.ico'
import { Avatar, Button, Dropdown, MenuProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { getUserInfo } from '@/service/modules/user'
import { getImageShow } from '@/service/modules/common'

export default memo(() => {
  const token = localStorage.getItem('token')
  const naviage = useNavigate()
  const baseInfo = {
    username: '',
    avatar: '',
    email:''
  }
  
  const [ userInfo, setUserInfo ] = useState(baseInfo)

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div onClick={()=>{localStorage.clear();setUserInfo(baseInfo); naviage('/')}}>退出登录</div>
      ),
    },
  ];

  useEffect(()=>{
    token && getUserInfo().then((res)=>{
      const { data } = res
      let info = data.data
      info = {
        ...info,
        avatar: getImageShow(info.avatar)
      }
      setUserInfo(info)
    })
  }, [])
  
  return (
    <HeaderStyle>
        <div className='logo' onClick={()=>{naviage('/')}}>
            <img src={logo} alt="鲸灵开发" />
            <h1>鲸灵开发</h1>
        </div>
        <div className='login'>
            {
              token ? (
                <Dropdown menu={{ items }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
                  <Avatar size={45}  src={userInfo.avatar} alt={userInfo.username}/>
                </Dropdown>
              ) : <Button type='primary' onClick={()=>{naviage('/login')}}>登录</Button>
            }
        </div>
    </HeaderStyle>
  )
})