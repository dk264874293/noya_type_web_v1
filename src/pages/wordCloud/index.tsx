import React from 'react';
import {
  Modal,Button,Input,Spin,Row,Col,List,message
} from 'antd';
import { getWordcloudGetContent,getWordcloudExtractWord } from '@/services/wordColoud';
import { getDataadvisorPollData } from '@/services/dataQuery';
import  { WordCloudBar }  from '@/charts/index';
import { ConnectProps } from '@/models/connect'



const { TextArea } = Input;

interface IWordCloudContentState{
  sql:string
  loading:boolean
  visible:boolean
  sqlContent:string
  wordList: string
  wordChartsData: any[],
  thatWordCloud: any[]
}


class WordCloudContent extends React.Component<ConnectProps,IWordCloudContentState>{
  state={
    sql:'',
    loading:false,
    visible:false,
    sqlContent:'',
    wordList: '',
    wordChartsData: [],
    thatWordCloud: []
  }

  componentDidMount(){
    const { location } = this.props;
    const query = (location && location.query) ? location.query : '';

    if(query && query.uuid && query.uuid !== ''){
      this.setState({
        loading:true
      })
      getDataadvisorPollData(query.uuid).then(res => {
        const {content} = res;
        const sqlContent = content.map(_ => _.content).join('\n')
        this.setState({
          sqlContent,
          loading:false
        })
      })
    }
  }

  // 打开sql
  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  // sql查询提交
  handleSubmit = () => {
    const {sql} = this.state;
    if(sql !== ''){
      this.setState({
        loading:true
      })
      getWordcloudGetContent(sql).then((res) => {
        const sqlContent = res.map(_ => _.content).join('\n')
        this.setState({
          sqlContent,
          visible:false
        })

      }).finally(() => {
        this.setState({
          loading:false
        })
      })
    }
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  sqlChange = ({ target: { value } }) => {
    this.setState({
      sql: value
    })
  }

  sqlContentChange = ({ target: { value } }) => {
    this.setState({
      sqlContent:value
    })
  }

  // 获取关键词
  getExtractWord = () => {
    const {sqlContent} = this.state;
    this.setState({
      loading: true
    })
    if(sqlContent !== ''){
      getWordcloudExtractWord(sqlContent).then(res =>{
        const wordData = res.map(item => item.key + ' ' + item.value).join('\n')
        this.setState({
          wordList:wordData
        })

      }).finally(() => {
        this.setState({
          loading:false
        })
      })
    }
  }

  wordCloudClick = ({name}) => {
    const { sqlContent } = this.state;
    const sqlList = sqlContent.split('\n').filter(item => item.toLocaleLowerCase().indexOf(name) >= 0);
    const thatWordCloud = sqlList.map(item => item.replace( new RegExp(name,'g') ,`<span style="color:red">${name}</span>`));
    this.setState({
      thatWordCloud: thatWordCloud
    })
  }

  wordChange = ({ target: { value } }) => {
    console.log(value)
    this.setState({
      wordList : value
    })
  }

  setWordData = () => {
    const { wordList } = this.state;
    if(wordList === ''){
      message.error("请先生成关键字")
      return
    }
    const dataList = wordList.split('\n').map( _ => _.split(' '))
    const filterList = dataList.filter(item =>item.length === 2 &&  !isNaN(parseFloat(item[1]))).map(item => ({ name: item[0], value: parseFloat(item[1]) }))
    this.setState({
      wordChartsData: filterList
    })
  }

  render(){
    const { sql,visible,loading,sqlContent,wordList,thatWordCloud,wordChartsData } = this.state;

    const thatWordCloudDom = thatWordCloud.length > 0 ? (
      <List
        itemLayout="vertical"
        size="large"
        dataSource={thatWordCloud}
        footer={null}
        size='small'
        pagination={{
          size:"small"
        }}
        renderItem={item => (
          <List.Item
            key={item}
          >
            <div dangerouslySetInnerHTML={{__html:item}}></div>
          </List.Item>
        )}
      />
    ) : null;

    return (
      <div>
        <Spin spinning={loading}>
          <div style={{textAlign:'right',marginBottom:20}}>
            <Button type="primary" style={{marginRight:10}} onClick={this.showModal}>
              SQL拉取文本
            </Button>
            <Button type="primary" disabled={sqlContent === ''} onClick={this.getExtractWord}>
              提取关键词
            </Button>
          </div>
          <TextArea
            value={sqlContent}
            onChange={this.sqlContentChange}
            placeholder="请拉取文本"
            autosize={{ minRows: 6, maxRows: 10 }}
          />

          <Row style={{marginTop:20}}>
            <Col span={3}>
              <Button
                type="primary"
                style={{marginBottom: 20}}
                disabled={wordList === ''}
                onClick={this.setWordData}>
                绘制词云
              </Button>
              <TextArea
                value={wordList}
                onChange={this.wordChange}
                autosize={{ minRows: 26, maxRows: 26 }}
              />
            </Col>
            <Col span={14}>
              <WordCloudBar chartData={wordChartsData} wordCloudClick={this.wordCloudClick}  />
            </Col>
            <Col span={7}>
              {thatWordCloudDom}
            </Col>
          </Row>
          <Modal
            title="SQL拉取文本"
            visible={visible}
            closable={false}
            onCancel={this.handleCancel}
            footer={[
              <Button key="back" loading={loading}  onClick={this.handleCancel}>
                取消
              </Button>,
              <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
                确认
              </Button>,
            ]}
          >
            <TextArea
              value={sql}
              onChange={this.sqlChange}
              placeholder="请输入SQL"
              autosize={{ minRows: 3, maxRows: 6 }}
            />
          </Modal>
        </Spin>
      </div>
    )
  }
}

export default WordCloudContent;
