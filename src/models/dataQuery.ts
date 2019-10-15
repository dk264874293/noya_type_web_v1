

export default {
  namespace: 'dataQuery',
  state: {
    MotherBabyUUID:'',
    MotherBabyStatus:false,
    MedicineUUID:'',
    MedicineStatus:false
  },

  effects: {
  },

  reducers: {
    setMotherBabyUUID(state,  { payload: MotherBabyUUID }) {
      return { ...state, MotherBabyUUID };
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
