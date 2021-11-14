import { gethttp, postHttp } from "./user";

/* eslint-disable */
const data = { token: localStorage.getItem("Token") };

// 商家列表
export const businessList = val => gethttp(val, "/store/index/index");

// 商家ajax查询
export const businessAjaxQuery = val => gethttp(val, "/store/index/ajax");

// 新增商家
export const businessAdd = val => postHttp(val, "/store/index/add");

// 图片上传
export const upimg = val => postHttp(val, "/home/index/upload");

// 商家分类列表
export const businessCateList = val => gethttp(val, "/store/cate/index");

// 新增分类
export const businessCateAdd = val => postHttp(val, "/store/cate/add");

// 编辑分类
export const businessCateEdit = val => postHttp(val, "/store/cate/edit");

// 删除分类
export const businessCateEel = val => postHttp(val, "/store/cate/del");

// 删除商家
export const businessDel = val => gethttp(val, "/store/index/del");

// 商家修改获得
export const businessGetEdit = val => gethttp(val, "/store/index/edit");

// 商家修改提交
export const businessPostEdit = val => postHttp(val, "/store/index/edit");

// 商家订单列表
export const businessOrderList = val => gethttp(val, "/store/order/list");

// 订单列表查看
export const businessOrderDetail = val => gethttp(val, "/store/order/detail");

// 订单列表导出
export const businessorderexport = "/store/order/orderexport";

// 商家订单退款
export const businessRefund = val => postHttp(val, "/store/order/refund");

// 订单拒绝退款
export const businessRefundRefuse = val =>
  postHttp(val, "/store/order/refundRefuse");

// 修改订单退款金额
export const businessRefundModify = val =>
  postHttp(val, "/store/order/refundModify");

  // 商家导出
export const storeexport = "/store/index/export";

// 跳转商家后台
export const jumpstore = val => gethttp(val, "/index/login/jumpstore");

// 商家管理操作日志
export const get_store_log = val =>
         gethttp(val, "/store/index/get_store_log");

// 更换代理商 换分类
export const get_category = val =>
         gethttp(val, "/store/index/get_category");
