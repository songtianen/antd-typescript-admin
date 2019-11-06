import request from '@/utils/request';
import { UserRegisterParams } from './index';

export async function fakeRegister(params: UserRegisterParams) {
  return request(`/user/register`, {
    method: 'POST',
    data: params,
  });
}
// 获取验证码

export async function fackCapcha(params: UserRegisterParams) {
  return request(`/user/capcha`, {
    method: 'GET',
    params,
  });
}
