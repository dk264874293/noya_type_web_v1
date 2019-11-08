
import React from 'react';
import { Tabs } from 'antd';
import MotherBaby from './MotherBaby';
import Medicine from './Medicine';
import { getDataadvisorKeywords } from '@/services/app';
import { IDataQueryState } from './components/DataQueryForm'

const { TabPane } = Tabs;


class DataQuery extends React.Component<{},IDataQueryState>{
  readonly state = {
    keywordsList: [],
    tagVal: '1'
  }

  componentDidMount() {
    getDataadvisorKeywords().then((res:any[]) => {
      this.setState({
        keywordsList: res
      })
    })
  }

  tabChange = (val:string) => {
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
              <MotherBaby  keywordsList={keywordsList} tagVal={tagVal} />
              {
                /*
                   <MotherBaby  keywordsList={keywordsList} tagVal={tagVal} />

                */
              }

            </TabPane>
            <TabPane tab="问诊库" key="2">
              <Medicine keywordsList={keywordsList} tagVal={tagVal} />
            </TabPane>
          </Tabs>

        </>
      )
  }
}

export default DataQuery
