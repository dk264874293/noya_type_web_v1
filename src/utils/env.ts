//设置开发环境及生产环境API接口地址
let baseUrl:string;

if (process.env.NODE_ENV === "development") {
  baseUrl = "http://172.16.1.112:8090";
} else {
  baseUrl = "http://172.16.1.145:8090";
}

export default baseUrl;
