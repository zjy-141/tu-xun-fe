import client from './client';
import type { ApiResponse, Prize } from '../types';

export const prizesApi = {
  // 获取我的奖品
  getMyPrizes: () =>
    client.get<ApiResponse<{ prizes: Prize[] }>>('/users/me/prizes'),
};
