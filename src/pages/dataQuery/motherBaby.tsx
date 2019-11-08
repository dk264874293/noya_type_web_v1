import React from 'react';
import { connect } from 'dva';
import DataQueryForm,{ IDataQueryData,IDataQueryState } from './components/DataQueryForm'
import { GlobalModelState } from '@/models/global';
import { IDataQuerystate } from '@/models/dataQuery';
import { getDataadvisorGetMotherBaby } from '@/services/dataQuery'


interface IMothbaby extends IDataQueryState{
  dataQuery: IDataQuerystate
  global:GlobalModelState
}

function MotherBaby({ keywordsList,tagVal,dataQuery,global }:IMothbaby): JSX.Element {
  const MotherBaby:IDataQueryData = {
    terrify_id: 1,
    keywordsList,
    tagVal,
    DataUUID: dataQuery.MotherBabyUUID,
    DataStatus: dataQuery.MotherBabyStatus,
    noiseStatus:true,
    babyDaysStatus:true,
    submitFun: getDataadvisorGetMotherBaby,
    moreSelect: global.motherMoreSelect,
    motherNeed: global.motherNeed,
    userId: global.user.userId,
    classfyData: global.motherClassfyData,
    setStatusDispatch: 'setMotherBabyUUID',
    setUUIDDispatch: 'setMotherBabyUUID'
  }

  return (
    <DataQueryForm  {...MotherBaby} />
  )
}

export default connect(({ dataQuery,global }:any) => ({
  dataQuery,global
}))(MotherBaby)
