/*
  xlsx导出组件
  name：名称
  data 数据
  title： 标题数组 即可在组件内自动添加为二纬
  header：对应字段
  作者：peiliang.wang
  2019.7.31
*/
import React from 'react'
import XLSX from 'xlsx'
import { Button } from 'antd'

interface IDownloadProps{
  data: any[]
  content: string[]
  style?:React.CSSProperties
}

class DownloadXLSX extends React.Component<IDownloadProps,{loading:boolean}>{
  state = {
    loading:false
  }

  exportFile = () => {
    this.setState({
      loading: true
    })
    const { data,content } = this.props;
    const wb = XLSX.utils.book_new();
    for(const item of data){
      // 添加数据
      const ws = XLSX.utils.json_to_sheet(item.data,
        { skipHeader: false,  header: ['classify','records','posts','users']});
      // 添加标题
      XLSX.utils.sheet_add_aoa(ws,[[item.name,'言论数','贴子数','用户数']],{
          origin:'A1',// 从A1开始增加内容
      })
      XLSX.utils.book_append_sheet(wb, ws, item.name);
    }
    const contentWs = XLSX.utils.json_to_sheet(content,
      { skipHeader: false,  header: ['content']});
    // 添加标题
    XLSX.utils.sheet_add_aoa(contentWs,[['content']],{
        origin:'A1',// 从A1开始增加内容
    })
    XLSX.utils.book_append_sheet(wb, contentWs, '文本数据');

    XLSX.writeFile(wb, '样本数据.xlsx');
    setTimeout(() => this.setState({
      loading: false
    }),1000)
  }

  render(){
    return (
      <Button
        loading={this.state.loading}
        onClick={this.exportFile}
        type="primary"
        style={this.props.style}
        icon="download"
      >
        {this.props.children}
      </Button>
    );
  }

}


export default DownloadXLSX;
