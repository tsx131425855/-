import { gethttp, postHttp } from "./user";

// 入驻/加盟信息列表
export const lists = val => gethttp(val, "/company/index/lists");

// 批量删除
export const deletes = val => postHttp(val, "/company/index/delete");

// 添加新闻
export const newsadd = val => postHttp(val, "/company/news/add");

// 后台新闻列表
export const newslists = val => gethttp(val, "/company/news/lists");

// 新闻详情
export const newsinfo = val => gethttp(val, "/company/news/info");
// 新闻批量删除
export const newsdelete = val => postHttp(val, "/company/news/delete");
// 编辑新闻
export const newsedit = val => postHttp(val, "/company/news/edit");
// 新闻
export const newssettop = val => postHttp(val, "/company/news/set_top");

// 添加友情链接
export const companyadd = val => postHttp(val, "/company/link/add");

// 编辑友情链接
export const companyedit = val => postHttp(val, "/company/link/edit");

// 友情链接列表
export const companylists = val => postHttp(val, "/company/link/lists");

// 删除友情链接
export const companydelete = val => postHttp(val, "/company/link/delete");

// 保存友情链接排序
export const companysort = val => postHttp(val, "/company/link/keep_sort");

// 扶农添加
export const actionsadd = val => postHttp(val, "/company/actions/add");

// 扶农编辑
export const actionsedit = val => postHttp(val, "/company/actions/edit");

// 扶农删除
export const actionsdelete = val =>
         postHttp(val, "/company/actions/delete");

// 扶农排序
export const actionsset_sort = val => gethttp(val, "/company/actions/set_sort");

// 扶农列表
export const actionslists = val => gethttp(val, "/company/actions/lists");
