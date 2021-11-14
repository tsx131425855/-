import { gethttp, postHttp } from "./user";

// 短信套餐列表
export const messagenewlists = val => gethttp(val, "/message/meal/lists");

// 新增短信套餐
export const messagenewadd = val => postHttp(val, "/message/meal/add");

// 编辑短信套餐
export const messagenewEdit = val => postHttp(val, "/message/meal/edit");

// 短信套餐详情
export const messagenewinfo = val => gethttp(val, "/message/meal/info");

// 删除短信套餐
export const messagenewdel = val => postHttp(val, "/message/meal/del");

// 短信套餐是否显示
export const messagenewshow = val => gethttp(val, "/message/meal/check_show");

// 置顶短信套餐
export const messagenewcheck_sort = val =>
  gethttp(val, "/message/meal/check_sort");

// 短信列表
export const assetlists = val => gethttp(val, "/message/sms/lists");

// 短信详情
export const assetinfo = val => gethttp(val, "/message/sms/info");

// 短信订单列表
export const assetorderlist = val => gethttp(val, "/message/sms/orderlist");

// 短信订单详情
export const assetorder_info = val => gethttp(val, "/message/sms/order_info");

// 导出短信订单
export const assetexport = "/message/sms/export";

// 发送短信消息配置内容
export const assetmsg_info = val => gethttp(val, "/message/sms/msg_info");

// 发送物业平台短信
export const assetsend_sms = val => postHttp(val, "/message/sms/send_sms");
