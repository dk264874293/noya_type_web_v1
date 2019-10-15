import {
  authLogin,getAppsCommonCommonOaram //,authlogout,setUserChangePassword
} from '@/services/app';
import { Reducer } from 'redux';
import { Subscription, Effect } from 'dva';
import router from 'umi/router';
import {setToken,removeToken,getToken} from '@/utils/auth'

interface SelectModel {
  [index: number]: any;
  length: number;
  value: string;
  key:string;
}

export interface GlobalModelState {
  user:{
    isAdmin: any;
    userId: number;
    userName: string;
  },
  medicineClassfyData: SelectModel[];
  "medicineMoreSelect": SelectModel[];
  'medicineNeed':string[];
  "motherClassfyData": SelectModel[];
  "motherMoreSelect": SelectModel[];
  'motherNeed': SelectModel[];
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {
    userLogin: Effect;
    getUserInfo: Effect;
    userLogout: Effect;
    userChangePassword: Effect;
    getGlobalState: Effect;
  };
  reducers: {
    setUserInfo: Reducer<GlobalModelState>;
  };
  subscriptions: { setup: Subscription };
}

const GlobalModel: GlobalModelType = {
  namespace: 'global',
  state: {
    user:{
      isAdmin: null,
      userName: "",
      userId: 0
    },
    "medicineClassfyData": [],
    "medicineMoreSelect":[],
    'medicineNeed':[],
    "motherClassfyData": [],
    "motherMoreSelect": [],
    'motherNeed':[]
  },

  effects: {
    *userLogin({ payload:  values  }, { call, put }){
      const res = yield call(authLogin, values);
      yield setToken(res.token)
      yield put({type: 'getUserInfo'});
    },
    *getUserInfo(_,{ call, put }){
      const res = yield call(getAppsCommonCommonOaram);
      yield put({
        type: 'setUserInfo',
        payload: res,
      });
    },
    *userLogout(_, { call, put }){
      // yield call(authlogout);
      // yield put({
      //   type: 'setUserInfo',
      //   payload:{
      //     user:{
      //       isAdmin: null,
      //       userName: "",
      //       userId: 0
      //     },
      //     "medicineClassfyData": [],
      //     "medicineMoreSelect":[],
      //     'medicineNeed':[],
      //     "motherClassfyData": [],
      //     "motherMoreSelect": [],
      //     'motherNeed':[]
      //   },
      // });

      // removeToken();
    },
    *userChangePassword({ payload:  values  }, { call }){
      // yield call(setUserChangePassword,values);
    },
    *getGlobalState(_,{select}){
      // return yield select(state => state.global.user.userName);
    }

  },

  reducers: {
    setUserInfo(state, { payload: data }):GlobalModelState {
      return { ...state, ...data };
    },
  },

  subscriptions: {
    // setup({ dispatch, history }) {
    //   history.listen(({pathname}) => {
    //     dispatch({
    //       type: 'getGlobalState'
    //     }).then(res => {
    //       const token = getToken()
    //       // console.log(pathname,token,123)
    //       if(pathname !== '/login' && res === ''){
    //         if(token && token !== ''){
    //           dispatch({
    //             type: 'getUserInfo'
    //           })
    //         }else{
    //           router.push('/login')
    //         }
    //       }else if(pathname === '/login' && res !== '' && (token && token !== '')){
    //         router.push('/dataQuery')
    //       }

    //     })
    //   });
    // },

  },
};

export default GlobalModel
