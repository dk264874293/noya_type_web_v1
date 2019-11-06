import request from '@/utils/request';

// 获取模版信息
export function getDataAdvisorGetTemplate(terrify_id,user_id){
  return request('/api/dataadvisor/get-template',{
    method: 'get',
    params:{
      terrify_id,user_id
    }
  })
}

// 获取平台信息
export function getDatAadvisorGetPlatform(terrify_id){
  return request('/api/dataadvisor/get-platform',{
    method: 'get',
    params: {
      terrify_id
    }
  })
}

// 获取数据列表
export function getDataadvisorGetInfoData(paramters){
  return request('/api/dataadvisor/get-info-data',{
    method: 'get',
    params:{
      paramters
    }
  })
}

//查询母婴数据
export function getDataadvisorGetMotherBaby(dataform){
  return request('/api/dataadvisor/get-mother-baby',{
    method: 'post',
    data:{
      ...dataform
    }
  })
}

// 轮询查询状态
export function getDataadvisorPollData(uuid){
  return request('/api/dataadvisor/poll-data',{
    method: 'get',
    params:{
      uuid
    }
  })
}

// 医疗数据查询
export function getDataadvisorRunMedicine(dataform){
  return request('/api/dataadvisor/get-medicine/',{
    method:'post',
    data:{
      ...dataform
    }
  })
}
