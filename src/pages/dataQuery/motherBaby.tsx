import React from 'react';
import { connect } from 'dva';
import DataQueryForm,{ IDataQueryData,IDataQueryState } from './components/DataQueryForm'
import { IDataQuerystate } from '@/models/dataQuery';
import { getDataadvisorGetMotherBaby } from '@/services/dataQuery'


interface IMothbaby extends IDataQueryState{
  dataQuery: IDataQuerystate
}

function MotherBaby({ keywordsList,tagVal,dataQuery }:IMothbaby): JSX.Element {

  const MotherBaby:IDataQueryData = {
    terrify_id: 1,
    keywordsList,
    tagVal,
    DataUUID: dataQuery.MotherBabyUUID,
    DataStatus: dataQuery.MotherBabyStatus,
    noiseStatus:true,
    babyDaysStatus:true,
    submitFun: getDataadvisorGetMotherBaby
  }

  return (
    <DataQueryForm  {...MotherBaby} />
  )
}

export default connect(({ dataQuery }:any) => ({
  dataQuery
}))(MotherBaby)
