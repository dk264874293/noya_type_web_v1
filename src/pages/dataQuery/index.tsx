
import React from 'react';
import { Tabs } from 'antd';
import MotherBaby from './MotherBaby';
import Medicine from './Medicine';
import { getDataadvisorKeywords } from '@/services/app';

const { TabPane } = Tabs;

interface IKeyWords {
  index:number,
  keyWord: string,
  tagName: string
}

interface IDataQueryState {
  keywordsList:IKeyWords[],
  tagVal:string
}



class DataQuery extends React.Component<{},IDataQueryState>{
  readonly state = {
    keywordsList: [],
    tagVal: '1'
  }

  componentDidMount() {
    getDataadvisorKeywords().then((res:IKeyWords[]):void => {
      this.setState({
        keywordsList: res
      })
    })
  }

  tabChange = (val:string):void => {
    this.setState({
      tagVal:val
    })
  }

  render() {
    const { keywordsList,tagVal } = this.state;
    return (
        <>
          <Tabs type="card" onChange={this.tabChange}>
            <TabPane tab="母婴库" key="1">
              {
                /*
                   <MotherBaby  keywordsList={keywordsList} tagVal={tagVal} />
                    <Medicine keywordsList={keywordsList} tagVal={tagVal} />
                */
              }

            </TabPane>
            <TabPane tab="问诊库" key="2">

            </TabPane>
          </Tabs>

        </>
      )
  }
}

export default DataQuery
