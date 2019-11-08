import React from 'react';
import { connect } from 'dva';
import DataQueryForm,{ IDataQueryData,IDataQueryState } from './components/DataQueryForm'
import { IDataQuerystate } from '@/models/dataQuery';
import { getDataadvisorRunMedicine } from '@/services/dataQuery'


interface IMothbaby extends IDataQueryState{
  dataQuery: IDataQuerystate
}

function Medicine({ keywordsList,tagVal,dataQuery }:IMothbaby): JSX.Element {

  const Medicine:IDataQueryData = {
    terrify_id: 1,
    keywordsList,
    tagVal,
    DataUUID: dataQuery.MedicineUUID,
    DataStatus: dataQuery.MedicineStatus,
    noiseStatus:false,
    babyDaysStatus:false,
    submitFun: getDataadvisorRunMedicine
  }
  console.log(Medicine)

  return (
    <DataQueryForm  {...Medicine} />
  )
}

export default connect(({ dataQuery }:any) => ({
  dataQuery
}))(Medicine)
