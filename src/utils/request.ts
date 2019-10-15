
import { extend } from 'umi-request';
import baseUrl from './env'

const request = extend({
  prefix:baseUrl,
  timeout: 200000,
  headers: {
    'Content-type': 'application/json'
  },
});

export default request;
