import request from '@/utils/request';

export interface ITemplateConfig{
  config:{
    babyDays:string[]
    classifyStatic:string[]
    dataRange: string[]
    keyWords: any[]
    multipleChoice: {[propName: string]:string[]}[]
    noisePost: any
    noiseUser: any
    platformId: string[]
    showClassifyData: string
    showData: string
    template: string
  }
}

export interface ITemplate extends ITemplateConfig{
  data?:any
  id: number
  name: string
  terrifyId: number
  userId: number
}

// 获取模版信息
export function getDataAdvisorGetTemplate(terrify_id:number,user_id:number):Promise<ITemplate[]>{
  return request('/api/dataadvisor/get-template',{
    method: 'get',
    params:{
      terrify_id,user_id
    }
  })
}
// 获取平台信息
export function getDatAadvisorGetPlatform(terrify_id:number): Promise<any[]>{
  return request('/api/dataadvisor/get-platform',{
    method: 'get',
    params: {
      terrify_id
    }
  })
}

// 获取数据列表
export function getDataadvisorGetInfoData(paramters:string){
  return request('/api/dataadvisor/get-info-data',{
    method: 'get',
    params:{
      paramters
    }
  })
}

export interface IMotherBady{
  platformId:string[]
  keyWords:string[]
  classifyStatic:string[]
  template:string
  multipleChoice:any[]
  dataRange:string[]
  showData: number | null
  showClassifyData: number | null
  babyDays?:string[]
  noisePost?: number | null
  noiseUser?: number | null
}

//查询母婴数据
export function getDataadvisorGetMotherBaby(dataform: IMotherBady){
  return request('/api/dataadvisor/get-mother-baby',{
    method: 'post',
    data:{
      ...dataform
    }
  })
}

// 轮询查询状态
export function getDataadvisorPollData(uuid:string){
  return request('/api/dataadvisor/poll-data',{
    method: 'get',
    params:{
      uuid
    }
  })
}

// 医疗数据查询
export function getDataadvisorRunMedicine(dataform: IMotherBady){
  return request('/api/dataadvisor/get-medicine/',{
    method:'post',
    data:{
      ...dataform
    }
  })
}
