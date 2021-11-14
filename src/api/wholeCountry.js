import { gethttp, postHttp } from "./user";

// 添加全国特产商品
export const addNational = val =>
  postHttp(val, "/product/product/add_national");

// 编辑全国特产商品
export const editNational = val =>
  postHttp(val, "/product/product/edit_national");

// 全国特产地区列表
export const nationallists = val => gethttp(val, "/national/index/lists");

// 新增全国特产地区
export const nationaladd = val => postHttp(val, "/national/index/add");

// 编辑全国特产地区
export const nationaledit = val => postHttp(val, "/national/index/edit");

// 删除全国特产地区
export const nationaldel = val => postHttp(val, "/national/index/del");

// 切换是否显示
export const nationalcheck_show = val =>
  postHttp(val, "/national/index/check_show");

// 商品列表页筛选接口
export const national_list_msg = val =>
  postHttp(val, "/product/product/national_list_msg");

// 全国特产商品添加页所需数据接口
export const national_msg = val =>
  gethttp(val, "/product/product/national_msg");

// 全国特产地区列表
export const national_lists = val =>
  gethttp(val, "/product/product/national_lists");

// 全国特产商品详情
export const national_product_info = val =>
  gethttp(val, "/product/product/national_product_info");

  // 导出全国特产商品列表
export const natioal_export = `/product/product/natioal_export`;