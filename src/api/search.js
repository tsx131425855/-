import { gethttp, postHttp } from "./user";

// 搜索配置列表
export const lists = val => gethttp(val, "/indexpage2/search/lists");

// 新增搜索配置
export const searchadd = val => postHttp(val, "/indexpage2/search/add");

// 编辑搜索配置
export const searchedit = val => postHttp(val, "/indexpage2/search/edit");

// 删除搜索配置
export const searchedel = val => postHttp(val, "/indexpage2/search/del");

// 列表操作接口
export const searchecheck = val => postHttp(val, "/indexpage2/search/check");

// 搜索记录列表
export const searchinfo = val => gethttp(val, "/indexpage2/search/info");

// 导出搜索记录列表
export const searchexport = "/indexpage2/search/export";
