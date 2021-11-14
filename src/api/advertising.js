import { gethttp, postHttp } from "./user";

// 获取广告
export const getAdv = val => gethttp(val, "/activity/advertisement/index");

// 添加广告--获取初始条件参数
export const addAdv = val => gethttp(val, "/activity/advertisement/add");

// 获取广告 商品/案例
export const getAdvProduct = val =>
  postHttp(val, "/activity/advertisement/ajax");

// 提交添加/修改广告
export const commitAdv = val => postHttp(val, "/activity/advertisement/add");

// 删除广告
export const deleteAdv = val => gethttp(val, "/activity/Advertisement/delete");

// 修改广告-获取广告详情
export const editAdv = val => gethttp(val, "/activity/Advertisement/edit");

// 招商列表
export const businessList = val => gethttp(val, "/company/business/lists");

// 招商列表导出
export const businessexport = "/company/business/export";
