import { gethttp, postHttp, baseExport } from "./user";

// 获取超级会员列表
export const getSuperMembers = val => gethttp(val, "/vip/vip/index");

// 获取免费使用列表
export const getTrial = val => gethttp(val, "/vip/free/index");

// 更新试用商品状态
export const updateStatus = val => postHttp(val, "/vip/free/free_oper");

// 获取权益配置
export const getSetBenefit = val => gethttp(val, "/vip/config/index");

// 获取新增的商品列表
export const getProductList = val => postHttp(val, "/vip/config/product");

// 保存设置权益
export const saveSet = val => postHttp(val, "/vip/config/save_config");

// 获取可添加的优惠券
export const getGroup = val => postHttp(val, "/vip/config/coupon");

// 返佣白名单列表
export const whiteList = val => gethttp(val, "/vip/white/list");

// 返佣白名单添加
export const whiteAdd = val => postHttp(val, "/vip/white/add");

// 返佣白名单粉丝列表
export const whiteFanslist = val => gethttp(val, "/vip/white/fanslist");

// 返佣白名单粉丝转移
export const whiteFansshift = val => postHttp(val, "/vip/white/fansshift");

// 返佣白名单粉丝释放
export const whiteFansclear = val => postHttp(val, "/vip/white/fansclear");

// 返佣白名单修改
export const whiteEdit = val => postHttp(val, "/vip/white/edit");

// 返佣白名单删除
export const whiteDel = val => postHttp(val, "/vip/white/del");

// 返佣白名单粉丝查看
export const whiteView = val => gethttp(val, "/vip/white/view");

// 返佣白名单提审、重新提审
export const whiteApply = val => postHttp(val, "/vip/white/apply");

// 返佣白名单审核通过
export const whiteAccept = val => postHttp(val, "/vip/white/accept");

// 返佣白名单审核拒绝
export const whiteReject = val => postHttp(val, "/vip/white/reject");

// 返佣白名单粉丝订单列表
export const whiteFansorder = val => gethttp(val, "/vip/white/fansorder");

// 返佣白名单粉丝订单导出
export const fansorderexport = "/vip/white/fansorderexport";

// 超级会员导出
export const vipexport = "/vip/vip/export";


// 获取超级会员权益配置内容
export const super_config = val => gethttp(val, "/vip/super_config/index");

// 新增免费试用/赠品商品
export const super_configadd3 = val => postHttp(val, "/vip/super_config/add3");

// 商品列表
export const product_list = val =>
  gethttp(val, "/vip/super_config/product_list");

// 修改会员日权益
export const super_configadd2 = val => postHttp(val, "/vip/super_config/add2");

// 修改通用设置
export const super_configadd1 = val => postHttp(val, "/vip/super_config/add1");

// 删除免费试用/赠品商品
export const super_configdel = val => postHttp(val, "/vip/super_config/del");
