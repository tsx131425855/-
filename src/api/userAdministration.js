import request from "@/utils/request";
import { gethttp, postHttp } from "./user";

/* eslint-disable */

const data = {
  token: localStorage.getItem("Token")
};

export function userList(val) {
  // 用户列表
  Object.assign(val, data);
  return request({
    url: "/user/index/user_list",
    method: "get",
    params: val
  });
}

export function userFansList(val) {
  // 用户粉丝列表
  Object.assign(val, data);
  return request({
    url: "/user/index/userFansList",
    method: "get",
    params: val
  });
}

export function userorderList(val) {
  // 用户订单列表
  Object.assign(val, data);
  return request({
    url: "/user/index/userorderlist",
    method: "get",
    params: val
  });
}

export const userexport = "/user/index/userexport"; // 用户列表导出

// 用户添加
export const useradd = val => postHttp(val, "/user/index/useradd");

// 用户编辑
export const useredit = val => postHttp(val, "/user/index/useredit");

// 用户提现列表
export const transferlist = val => postHttp(val, "/user/transfer/list");

// 用户提现操作
export const actions = val => postHttp(val, "/user/transfer/actions");

// 推荐商家列表
export const refererrebatelist = val =>
  gethttp(val, "/user/index/refererrebatelist");

// 推荐商家解绑
export const refererrebateremove = val =>
  postHttp(val, "/user/index/refererrebateremove");

// 用户提现导出
export const transferexport = "/user/transfer/export";

// 优惠券列表
export const couponlist = val => gethttp(val, "/user/index/info");

// 赠送优惠券
export const coupon_send = val => postHttp(val, "/user/index/coupon_send");

// 作废优惠券
export const coupon_confiscate = val =>
  postHttp(val, "/user/index/coupon_confiscate");

// 核销优惠券
export const coupon_cance = val => postHttp(val, "/user/index/coupon_cance");
