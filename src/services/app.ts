import request from '@/utils/request';

interface authLoginModel {
  username:string;
  password:string;
  captcha:string;
  uuid:number | string
}

export async function authLogin({ username,password,captcha,uuid}:authLoginModel): Promise<any> {
  return request('/sys/login',{
    method: 'post',
    data:{
      username,password,captcha,uuid
    }
  });
}

// 获取用户信息
export async function getAppsCommonCommonOaram(): Promise<any> {
  return request('/api/dataadvisor/get-common-parameters',{
    method: 'get'
  })
}
