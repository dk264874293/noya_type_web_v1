import moment from 'moment';
// 默认时间格式
export const dateFormat = 'YYYY-MM-DD';

// select筛选使用名字筛选
export const selectFilter = (input, option) => {
  return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

// 禁用时间的规则
export const disabledDate = (current) => {
  // current < moment('2019-01-01',dateFormat) ||
  return current > moment().endOf('day').subtract(1, 'd');
}



// 下载流文件
export function fileDownload(file,fileName="账号名单"){
  const url = window.URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = decodeURIComponent(fileName + '.xlsx');
  a.click();
}


