
import { Reducer } from 'redux';
import { Subscription, Effect } from 'dva';

export interface IDataQuerystate {
  MotherBabyUUID: string
  MotherBabyStatus: boolean
  MedicineUUID: string
  MedicineStatus: boolean
}

interface IDataQueryType {
  namespace: 'dataQuery';
  state: IDataQuerystate;
  reducers: {
    setMotherBabyUUID: Reducer<IDataQuerystate>
    setMotherBabyStatus: Reducer<IDataQuerystate>;
    setMedicineUUID: Reducer<IDataQuerystate>;
    setMedicineStatus: Reducer<IDataQuerystate>;
    initData: Reducer<IDataQuerystate>;
  };
  subscriptions: { setup: Subscription };
}

const DataQueryModel: IDataQueryType ={
  namespace: 'dataQuery',
  state: {
    MotherBabyUUID:'',
    MotherBabyStatus:false,
    MedicineUUID:'',
    MedicineStatus:false
  },


  reducers: {
    setMotherBabyUUID(state = {
      MotherBabyUUID:'',
      MotherBabyStatus:false,
      MedicineUUID:'',
      MedicineStatus:false
    },  { payload }):IDataQuerystate {
      return { ...state};
    },
    setMotherBabyStatus(state,{ payload: MotherBabyStatus }){
      return { ...state, MotherBabyStatus };
    },
    setMedicineUUID(state, { payload:MedicineUUID }) {
      return { ...state, MedicineUUID };
    },
    setMedicineStatus(state, { payload:MedicineStatus }) {
      return { ...state, MedicineStatus };
    },
    initData(state){
      return {...state, ...{
          MotherBabyUUID:'',
          MotherBabyStatus:false,
          MedicineUUID:'',
          MedicineStatus:false
        }
      }
    }
  },
};

export default DataQueryModel;
