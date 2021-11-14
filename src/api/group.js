


import { gethttp, postHttp, baseExport } from "./user";


// 获取拼团商品
export const product_group = val => postHttp(val, '/group/group_product/index');

// 获取拼团活动
export const activity_group = val => gethttp(val, '/group/group/index');

// 获取拼团订单
export const order_group = val => gethttp(val, '/group/order/index');

// 编辑商品(获取)
export const setProduct = val => gethttp(val, '/group/group_product/edit');

// 编辑商品(提交)
export const commitSetProduct = val => postHttp(val, '/group/group_product/edit');

// 删除商品
export const deleteProduct = val => postHttp(val, '/group/group_product/del');

// 修改排序
export const changeSort = val => postHttp(val, '/group/group_product/sort');

// 拼团活动添加商品时商品列表
export const productList = val => postHttp(val, '/group/group_product/productlist');

// 添加(获取初始数据)拼团活动
export const addGroup = val => gethttp(val, '/group/group/add');

// 添加(提交)拼团活动
export const commitAddGroup = val => postHttp(val, '/group/group/add');

// 修改(获取数据)拼团活动
export const editGroup = val => gethttp(val, '/group/group/edit');

// 修改(提交)拼团活动
export const commitEditGroup = val => postHttp(val, '/group/group/edit');
