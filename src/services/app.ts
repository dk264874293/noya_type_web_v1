import request from '@/utils/request';

interface authLoginModel {
  username:string;
  password:string;
  captcha:string;
  uuid: number|string
}

// 登陆
export async function authLogin({ username,password,captcha,uuid}:authLoginModel): Promise<any> {
  return request('/sys/login',{
    method: 'post',
    data:{
      username,password,captcha,uuid
    }
  });
}

// 登出
export function authlogout(): Promise<any> {
  return request('/sys/logout',{
    method:'get'
  })
}

interface IChangePassword{
  old_password:string
  new_password:string
  confirm_password:string
}

// 修改密码
export function setUserChangePassword(values:IChangePassword): Promise<any>{
  return request('/user/change-password/',{
    method: 'post',
    data: {
      ...values
    }
  })
}

// 获取用户信息
export async function getAppsCommonCommonOaram(): Promise<any> {
  return request('/api/dataadvisor/get-common-parameters',{
    method: 'get'
  })
}

export async function getDataadvisorKeywords(): Promise<any> {
  return request('/api/dataadvisor/get-keywords',{
    method:'get'
  })
}
