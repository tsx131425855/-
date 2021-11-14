import { gethttp, postHttp } from "./user";

// 获取运营活动列表
export const getActivity = val => gethttp(val, "/activity/operate_event/lists");

// 添加活动(获取下拉初始数据)
export const getAddActivity = val => gethttp(val, "/activity/operate_event/add");

// 添加活动(提交)
export const CommitAddActivity = val => postHttp(val, "/activity/operate_event/add");

// 修改活动(提交)   
export const commitEditActivity = val => postHttp(val, "/activity/operate_event/edit");

// 修改活动(查看)  
export const getEditActivity = val => gethttp(val, "/activity/operate_event/edit");

// 查询优惠券(弹窗接口)
export const searchCoupon = val => gethttp(val, '/activity/operate_event/coupon_search');

// 复制运营活动
export const copyActivity = val => postHttp(val, '/activity/operate_event/copy');

// 添加优惠券
export const addCoupon = val => postHttp(val, '/activity/operate_event/add_coupon');

// 优惠券列表
export const getCouponList = val => gethttp(val, '/activity/operate_event/get_coupon_list');

// 删除优惠券
export const deleteCoupon = val => postHttp(val, '/activity/operate_event/delete_coupon');

// 清空优惠券
export const clearAllCoupon = val => postHttp(val, '/activity/operate_event/clear_coupon');

// 查询商品
export const searchProduct = val => gethttp(val, '/activity/operate_event/product_search');

// 删除商品
export const deleteProduct = val => postHttp(val, '/activity/operate_event/delete_product');

// 商品列表
export const getProductList = val => gethttp(val, '/activity/operate_event/get_product_list');

// 添加商品
export const addProduct = val => postHttp(val, '/activity/operate_event/add_product');

// 清空商品
export const clearAllProduct = val => postHttp(val, '/activity/operate_event/clear_product');

// 优惠券排序
export const couponSort = val => postHttp(val, '/activity/operate_event/coupon_sort');

// 商品排序
export const productSort = val => postHttp(val, '/activity/operate_event/product_sort');