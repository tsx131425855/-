import { gethttp, postHttp } from "../user";

// 新增/编辑 新首页配置基础信息
export const base_map = val => gethttp(val, "/indexpage2/index/base_map");

// 商品/商家列表
export const product_list = val =>
  gethttp(val, "/indexpage2/index/product_list");

// 新增模块
export const indexpage2add1 = val => postHttp(val, "/indexpage2/index/add1");

// 编辑顶部icon
export const indexpage2edit1 = val => postHttp(val, "/indexpage2/index/edit");

// 顶部ICON详情
export const indexpage2info1 = val => gethttp(val, "/indexpage2/index/info");

// 配置列表
export const indexpage2lists = val => gethttp(val, "/indexpage2/index/lists");

// 商家专卖-修改规则
export const indexpage2add_store_time = val =>
  postHttp(val, "/indexpage2/index/add_store_time");

// 删除接口
export const indexpage2del = val => gethttp(val, "/indexpage2/index/del");

// 顶部icon/套餐食谱/原产地直供/集市商超排序接口
export const indexpage2sort = val => gethttp(val, "/indexpage2/index/sort");

// 套餐食谱/原产地直供/集市商超切换是否显示
export const indexpage2check_show = val =>
  gethttp(val, "/indexpage2/index/check_show");
