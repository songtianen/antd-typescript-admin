import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { fakeRegister, fackCapcha } from './service';
import { setToken } from '@/utils/token';

export interface StateType {
  status?: 'ok' | 'error';
  currentAuthority?: 'user' | 'guest' | 'admin';
  errors: any;
  statusCode: any;
  msg: any;
  data: any;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    submit: Effect;
    getCapcha: Effect;
  };
  reducers: {
    registerHandle: Reducer<StateType>;
    errorsHandle: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userAndregister',

  state: {
    statusCode: undefined,
    msg: '',
    data: '',
    errors: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      try {
        const response = yield call(fakeRegister, payload);
        yield put({
          type: 'registerHandle',
          payload: response,
        });
        if (response.statusCode === 200) {
          setToken(response.data.accessToken);
        }
      } catch (error) {
        yield put({
          type: 'errorsHandle',
          payload: { error: error.data },
        });
      }
    },
    // 获取验证码
    *getCapcha({ payload }, { call, put }) {
      yield call(fackCapcha, payload);
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      console.log('payload', payload);
      return {
        ...state,
        errors: {},
        ...payload,
      };
    },
    errorsHandle(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;
