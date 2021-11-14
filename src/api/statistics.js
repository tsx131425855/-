import request from "@/utils/request";
import { gethttp, postHttp } from "./user";
/* eslint-disable */

const data = { token: localStorage.getItem("Token") };

export function vipChart(val) {
  // 会员统计图表接口
  Object.assign(val, data);
  return request({
    url: "/statis/index/userStatis",
    method: "get",
    // header: {
    //   'token': localStorage.getItem('Token')
    // },
    params: val
  });
}

export function vipChartRanking(val) {
  // 会员排行图表
  Object.assign(val, data);
  return request({
    url: "/statis/index/user_rank",
    method: "get",
    // header: {
    //   'token': localStorage.getItem('Token')
    // },
    params: val
  });
}

export function vipRanking(val) {
  // 会员用户排行列表
  Object.assign(val, data);
  return request({
    url: "/statis/index/user_rank_list",
    method: "get",
    // header: {
    //   'token': localStorage.getItem('Token')
    // },
    params: val
  });
}

export function vipSurface(val) {
  // 会员统计列表接口
  Object.assign(val, data);
  return request({
    url: "/statis/index/userAccount",
    method: "get",
    // header: {
    //   'token': localStorage.getItem('Token')
    // },
    params: val
  });
}

export function propertylist(val) {
  // 认筹列表
  Object.assign(val, data);
  return request({
    url: "/statis/subscribe/index",
    method: "get",
    // header: {
    //   'token': localStorage.getItem('Token')
    // },
    params: val
  });
}

export function propertychart(val) {
  // 认筹图表
  Object.assign(val, data);
  return request({
    url: "/statis/subscribe/chart",
    method: "get",
    // header: {
    //   'token': localStorage.getItem('Token')
    // },
    params: val
  });
}

export function orderchart(val) {
  // 订单统计折线图接口
  Object.assign(val, data);
  return request({
    url: "/statis/order/chart",
    method: "get",
    // header: {
    //   'token': localStorage.getItem('Token')
    // },
    params: val
  });
}

export function orderlisst(val) {
  // 订单列表与导出
  Object.assign(val, data);
  return request({
    url: "/statis/order/index",
    method: "get",
    // header: {
    //   'token': localStorage.getItem('Token')
    // },
    params: val
  });
}

export function renovationlist(val) {
  // 装修列表
  Object.assign(val, data);
  return request({
    url: "/statis/decoration_subscribe/index",
    method: "get",
    // header: {
    //   'token': localStorage.getItem('Token')
    // },
    params: val
  });
}

export function renovationchart(val) {
  // 装修统计图表
  Object.assign(val, data);
  return request({
    url: "/statis/decoration_subscribe/chart",
    method: "get",
    // header: {
    //   'token': localStorage.getItem('Token')
    // },
    params: val
  });
}

export function Servicelist(val) {
  // 装修列表
  Object.assign(val, data);
  return request({
    url: "/statis/Service/index",
    method: "get",
    // header: {
    //   'token': localStorage.getItem('Token')
    // },
    params: val
  });
}

export function Servicechart(val) {
  // 装修统计图表
  Object.assign(val, data);
  return request({
    url: "/statis/Service/chart",
    method: "get",
    // header: {
    //   'token': localStorage.getItem('Token')
    // },
    params: val
  });
}

export function statisRank(val) {
  // 商品销量排行
  Object.assign(val, data);
  return request({
    url: "/statis/product_sales/rank",
    method: "get",
    // header: {
    //   'token': localStorage.getItem('Token')
    // },
    params: val
  });
}

export function statisRank2(val) {
  // 商品销量明细
  Object.assign(val, data);
  return request({
    url: "/statis/product_sales/rank2",
    method: "get",
    // header: {
    //   'token': localStorage.getItem('Token')
    // },
    params: val
  });
}

export const subscribeExport = "/statis/subscribe/export"; // 认筹列表导出

export const user_accout_export = "/statis/index/user_accout_export"; // 会员统计导出接口

export const user_rank_export = "/statis/index/user_rank_export"; // 会员排行导出接口

export const DecorationSubscribe = "/statis/decoration_subscribe/export"; // 装修统计导出

export const orderExport = "/statis/order/export"; // 订单列表导出

export const product_sales_export = "/statis/product_sales/export"; // 商品销量排行导出

export const export2 = "/statis/product_sales/export2"; // 商品销量明细导出

export const ServiceExport = "/statis/Service/export"; // 售后导出

// 自提点销售列表列表
export const statisindex = val => gethttp(val, "/statis/self_sale/index");

//自提点销售列表列表导出
export const statisexport = "/statis/self_sale/export"; // 售后导出
