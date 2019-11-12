import request from '@/utils/request';


// 查询sql内容
export function getWordcloudGetContent(sql){
  return request({
    url: '/api/wordcloud/get-content/',
    method: 'post',
    data:{
      sql
    }
  })
}

// 提取关键词
export function getWordcloudExtractWord(words){
  return request({
    url: '/api/wordcloud/extract-word',
    method: 'post',
    data: {
      words
    }
  })
}
