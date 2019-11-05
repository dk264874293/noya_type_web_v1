
import { extend } from 'umi-request';
import baseUrl from './env'
import { getToken,removeToken } from '@/utils/auth'
import { message } from 'antd';
import router from 'umi/router';

const request = extend({
  prefix:baseUrl,
  timeout: 200000,
  headers: {
    'Content-type': 'application/json;charset=UTF-8'
  },
});

// 请求添加token
request.interceptors.request.use((url, options) => {
  let { headers }:any = options;
  headers['token']=  getToken();
  return (
    {
      url: url,
      options: { ...options, headers },
    }
  );
});

// 返回拦截做错误处理
request.interceptors.response.use( async (response) => {
    const data = await response.clone().json();
    const { code } = data;
     if(code === 0) {
      return data.result;
    }
    if(code === 401){
      removeToken();
      router.push('/login');
    }
    message.error(data && data.msg);
    return Promise.reject(response);
  }
)

export default request;
