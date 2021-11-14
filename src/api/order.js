/**
 * 说明: 此为订单目录下所有接口 (维护: magicsli)
 * 获取数据统一采用get请求
 * 处理数据统一采用post请求
 * 导出Excel表格全部采用window.open开启新窗口下载页面
 */

/* 导入axios */
import request from "@/utils/request";

/* 导入服务器地址 */
import { exporteurl } from "@/utils/user";

// 获取token
const data = { token: localStorage.getItem("Token") };

import qs from "qs";
/**
 * 导出公共方法
 * @param {url} val 导出路由地址
 * @param {params} val 携带的参数对象
 */
function baseExport(url, params) {
  console.log(params);
  Object.assign(params, data);
  var str = exporteurl + url + "?";
  for (var k in params) {
    str += k + "=" + params[k] + "&";
  }
  return str;
}

import { gethttp, postHttp } from "./user";
/**
 *   获取汇总订单列表
 */
export const order_list = val => gethttp(val, "/order/index/index");

/**
 *  导出汇总订单列表
 */
export const export_order_list = val => baseExport("/order/index/index", val);

/**
 * 导出出库列表
 */
export const exportOutPut = val => baseExport("/order/outbound/export", val);

/**
 *  获取出库列表
 */
export const outPut_list = val => gethttp(val, "/order/outbound/index");

/**
 * 获取售后订单
 */
export const after_help = val => gethttp(val, "/order/service/index");

/**
 * 操作售后订单
 */
export const handleOreder = val => postHttp(val, "/order/service/handle");

/**
 * 订单详情撤销出库/申请退款
 */
export const modifystatus = val => postHttp(val, "/order/index/modifystatus");

/**
 * 修改地址
 */
export const editaddress = val => gethttp(val, "/order/index/editaddress");

/**
 * 提交修改地址
 */
export const editComiitAddress = val =>
  postHttp(val, "/order/index/editaddress");

/**
 * 订单出库/发货
 */
export const outstock = val => gethttp(val, "/order/outbound/outstock");

/**
 * 提交订单出库/发货
 */
export const commitCutstock = val => postHttp(val, "/order/outbound/outstock");

/**
 * 查看包裹详情
 */
export const lookBagDetail = val => gethttp(val, "/order/index/deliverydetail");

/**
 * 转为待处理
 */
export const returnPending = val => postHttp(val, "/order/outbound/pending");

/**
 * 秒杀订单详情接口
 */
export const seckillview = val => gethttp(val, "/product/seckill/view");
