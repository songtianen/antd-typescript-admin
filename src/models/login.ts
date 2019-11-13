import { Reducer } from 'redux';
import { routerRedux } from 'dva/router';
import router from 'umi/router';

import { Effect } from 'dva';
import { stringify } from 'querystring';
import { message } from 'antd';

import { fakeAccountLogin, getFakeCaptcha } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { setToken, removeToken } from '@/utils/token';

export interface StateType {
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
  msg?: any;
  data?: any;
  statusCode?: any;
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    getCaptcha: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
    errorsHandle: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {},

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);

      // Login successfully
      if (response.statusCode === 200) {
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        setToken(response.data.accessToken);
        const urlParams = new URL(window.location.href);
        // console.log('urlParams = new URL(window.location.href)', urlParams);

        const params = getPageQuery();
        // console.log('params--', params);
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
        // window.location.reload();// 刷新浏览器窗口
      }
      if (response.statusCode === 500) {
        message.error(response.msg);
        yield put({
          type: 'errorsHandle',
          payload: response,
        });
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
    *logout(_, { put }) {
      removeToken();
      const { redirect } = getPageQuery();
      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      console.log('登陆的model', payload);
      setAuthority(payload.data.currentAuthority);
      return {
        ...state,
        ...payload,
        type: payload.type,
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
