import { gethttp, postHttp, baseExport } from "./user";

// 获取爆款商品
export const getHot = val => gethttp(val, '/pagetable/explosive/index');

// 获取爆款商品列表
export const getHotProduct = val => postHttp(val, '/pagetable/explosive/agent_product');

// 添加爆款 
export const addHot = val => postHttp(val, '/pagetable/explosive/add');

// 删除爆款
export const deleteHot = val => postHttp(val, '/pagetable/explosive/delete');
