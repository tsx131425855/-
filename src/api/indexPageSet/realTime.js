import { gethttp, postHttp } from "../user";

// 新增资讯分类
export const categoryadd = val => postHttp(val, "/news/category/add");

// 资讯分类列表
export const categorylists = val => gethttp(val, "/news/category/lists");

// 编辑资讯分类
export const categoryedit = val => postHttp(val, "/news/category/edit");

// 删除资讯分类
export const categorydel = val => gethttp(val, "/news/category/del");

// 置顶资讯分类
export const categorycheck = val => gethttp(val, "/news/category/check");

// 新增文章
export const indexadd = val => postHttp(val, "/news/index/add");

// 编辑文章
export const indexedit = val => postHttp(val, "/news/index/edit");

// 文章详情
export const indexeinfo = val => postHttp(val, "/news/index/info");

// 文章列表
export const indexlists = val => gethttp(val, "/news/index/lists");

// 操作是否精选/是否显示/排序
export const indexcheck = val => gethttp(val, "/news/index/check");

// 删除文章
export const indexedel = val => postHttp(val, "/news/index/del");
