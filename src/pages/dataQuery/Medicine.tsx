import React from 'react';
import { connect } from 'dva';
import DataQueryForm,{ IDataQueryData,IDataQueryState } from './components/DataQueryForm'
import { GlobalModelState } from '@/models/global';
import { IDataQuerystate } from '@/models/dataQuery';
import { getDataadvisorRunMedicine } from '@/services/dataQuery'


interface IMothbaby extends IDataQueryState{
  dataQuery: IDataQuerystate,
  global:GlobalModelState
}

function Medicine({ keywordsList,tagVal,dataQuery,global }:IMothbaby): JSX.Element {

  const Medicine:IDataQueryData = {
    terrify_id: 2,
    keywordsList,
    tagVal,
    DataUUID: dataQuery.MedicineUUID,
    DataStatus: dataQuery.MedicineStatus,
    noiseStatus:false,
    babyDaysStatus:false,
    submitFun: getDataadvisorRunMedicine,
    moreSelect: global.medicineMoreSelect,
    motherNeed: global.medicineNeed,
    userId: global.user.userId,
    classfyData: global.medicineClassfyData,
    setStatusDispatch: 'setMedicineUUID',
    setUUIDDispatch: 'setMedicineStatus'
  }

  return (
    <DataQueryForm  {...Medicine} />
  )
}

export default connect(({ dataQuery,global }:any) => ({
  dataQuery,global
}))(Medicine)
