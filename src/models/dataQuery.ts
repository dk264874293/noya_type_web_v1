
import { Reducer } from 'redux';

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
  }
}

const DefaultState:IDataQuerystate = {
  MotherBabyUUID:'',
  MotherBabyStatus:false,
  MedicineUUID:'',
  MedicineStatus:false
}

const DataQueryModel: IDataQueryType ={
  namespace: 'dataQuery',
  state: DefaultState,

  reducers: {
    setMotherBabyUUID(state = DefaultState,  { payload }) {
      return { ...state, MotherBabyUUID: payload};
    },
    setMotherBabyStatus(state = DefaultState,{ payload }){
      return { ...state, MotherBabyStatus:payload };
    },
    setMedicineUUID(state = DefaultState, { payload }) {
      return { ...state, MedicineUUID:payload };
    },
    setMedicineStatus(state = DefaultState, { payload }) {
      return { ...state, MedicineStatus:payload };
    },
    initData(state){
      return {
          MotherBabyUUID:'',
          MotherBabyStatus:false,
          MedicineUUID:'',
          MedicineStatus:false
      }
    }
  },
};

export default DataQueryModel;
