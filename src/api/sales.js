import { gethttp, postHttp } from "./user";

// 新增楼盘
export const propertyadd = val => postHttp(val, "/property/index/add");

//
export const base_map = val => gethttp(val, "/property/index/base_map");

// 楼盘列表
export const propertylists = val => gethttp(val, "/property/index/lists");

// 编辑楼盘
export const propertyedit = val => postHttp(val, "/property/index/edit");

// 删除楼盘
export const propertydel = val => gethttp(val, "/property/index/del");

// 保存排序
export const propertysort = val => postHttp(val, "/property/index/sort");

// 楼盘详情
export const propertyinfo = val => gethttp(val, "/property/index/info");

// 保存排序
export const adddeveloper = val =>
  postHttp(val, "/property/index/add_developer");

// 户型列表
export const layoutlists = val => gethttp(val, "/property/layout/lists");

// 新增户型
export const layoutadd = val => postHttp(val, "/property/layout/add");

// 编辑户型
export const layoutedit = val => postHttp(val, "/property/layout/edit");

// 户型详情
export const layoutinfo = val => gethttp(val, "/property/layout/info");

// 删除户型
export const layoutdel = val => gethttp(val, "/property/layout/del");

// 认筹成功/认筹失败
export const subscribehandle = val =>
  gethttp(val, "/property/subscribe/handle");

// 认筹列表
export const subscribelists = val => gethttp(val, "/property/subscribe/lists");

// 导出认筹列表
export const subscribeexport = "/property/subscribe/export";
