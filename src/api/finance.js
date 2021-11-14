/**
 * 说明: 此为财务统计目录下所有接口 (维护: magicsli)
 * 获取数据统一采用get请求
 * 导出Excel表格全部采用window.open开启新窗口下载页面
 */

/* 导入axios */
import request from '@/utils/request'

/* 导入服务器地址 */
import { exporteurl } from '@/utils/user'

// 获取token
const data = { token: localStorage.getItem('Token') }

// import qs from 'qs'
/**
 * 导出公共方法
 * @param {url} val 导出路由地址
 * @param {params} val 携带的参数对象
 */
function baseExport(url, params) {
  Object.assign(params, data)
  var str = exporteurl + url + '?'
  for (var k in params) {
    str += k + '=' + params[k] + '&'
  }
  return str
}

/**
 * get请求公共方法
 * @param {url} val 查询路由地址
 * @param {val} val 携带参数
 */
function baseGet(url, val) {
  Object.assign(val, data)
  return request({
    url: url,
    method: 'get',
    params: val
  })
}

/**
*     获取提现明细
*/
export const deposit = val => baseGet('/statis/transfer/record', val)

/**
*   导出提现明细
*/
export const exportDeposit = val => baseExport('/statis/transfer/recordexport', val)

/*
 *  获取用户余额
 **/
export const user_balance = val => baseGet('/statis/user_balance/index', val)

/**
 * 导出用户余额
 */
export const exportUserBalance = val => baseExport('/statis/user_balance/export', val)

/**
 * 获取总余额详情
 */

export const balance_total = val => baseGet('/statis/user_balance/balancerecord', val)

/**
 * 导出总余额详情
 */
export const exportBalanceTotal = val => baseExport('/statis/user_balance/balancerecordexport', val)

/**
 * 获取提现总额详情
 */
export const deposit_total = val => baseGet('/statis/user_balance/transferrecord', val)

/**
 * 导出提现余额详情
 */
export const exportDepositTotal = val => baseExport('/statis/user_balance/transferrecordexport', val)

/**
 * 获取收入总额详情
 */
export const income_total = val => baseGet('/statis/user_balance/incomerecord', val)

/**
 * 导出获取收入总额详情
 */
export const exportIncomeTotal = val => baseExport('/statis/user_balance/incomerecordexport', val)

/**
 * 获取余额支出
 */
export const expend_balance = val => baseGet('/statis/user_balance/expenserecord', val)

/**
 * 导出余额支出
 */
export const exportExpendBalance = val => baseExport('/statis/user_balance/expenserecordexport', val)

/**
 * 获取微信支出
 */
export const expend_weixin = val => baseGet('/statis/user_balance/payrecord', val)

/**
 * 导出微信支出
 */
export const exportExpendWeixin = val => baseExport('/statis/user_balance/payrecordexport', val)

/**
 * 获取冻结余额
 */
export const freeze = val => baseGet('/statis/user_balance/blockedrecord', val)

/**
 * 导出获取冻结余额
 */
export const exportFreeze = val => baseExport('/statis/user_balance/blockedrecordexport', val)

/**
 * 获取粉丝返佣
 */
export const fans_bonus = val => baseGet('/user/bonus/combacklist', val)

/**
 * 导出粉丝返佣
 */
export const exportFansBonus = val => baseExport('/user/bonus/combackexport', val)

/**
 * 获取自提点分成
 */
export const self_bonus = val => baseGet('/statis/income/index', val)

/**
 * 导出自提点分成
 */
export const exportSelfBonus = val => baseExport('/statis/income/export', val)

/**
 * 获取平台分红
 */
export const platform_bonus = val => baseGet('/user/bonus/lists', val)

/**
 * 导出平台分红
 */
export const exportPlatformBonus = val => baseExport('/user/bonus/export', val)

/**
 * 获取平台抽成
 */
export const platform_pumping = val => baseGet('/user/index/jndcut', val)

/**
 * 导出平台抽成
 */
export const exportPlatformPumping = val => baseExport('/user/index/jndcutexport', val)

/**
 * 获取服务订单
 */
export const serviceOrder = val => baseGet('/statis/so_order/index', val)

/**
 * 导出服务订单
 */
export const exportServiceOrder = val => baseExport('/statis/so_order/export', val)

/**
 * 获取用户金币
 */
export const user_gold = val => baseGet('/user/gold/userGoldList', val)

/**
 * 导出用户金币
 */
export const exportUserGold = val => baseExport('/user/gold/export', val)

/**
 * 获取商品订单流水
 */
export const product = val => baseGet('/statis/order2/index', val)

/**
 * 导出商品订单流水
 */
export const exportProduct = val => baseExport('/statis/order2/export', val)

/**
 * 获取商品订单详情
 */

export const product_detail = val => baseGet('/statis/order2/view', val)

/**
 * 获取认筹报名
 */
export const get_registration = val => baseGet('/statis/subscribe/apply', val)

/**
 * 导出认筹报名
 */
export const exportGetRegistration = val => baseExport('/statis/subscribe/export2', val)

/**
 * 获取优惠买单
 */
export const preferential = val => baseGet('/statis/sc_order/index', val)

/**
 * 导出认筹报名
 */
export const exportPreferential = val => baseExport('/statis/sc_order/export', val)

/**
 * 获取社区活动
 */
export const activity = val => baseGet('/statis/sq_order/index', val)

/**
 * 导出社区活动
 */
export const exportActivity = val => baseExport('/statis/sq_order/export', val)

/**
 * 获取装修报名
 */
export const decoration_home = val => baseGet('/statis/zx_order/index', val)

/**
 * 导出装修报名
 */
export const exportDecorationHome = val => baseExport('/statis/zx_order/export', val)

/**
 * 财务总账
 */
export const caiwu = val => baseGet('/statis/index/caiwu', val)

/**
 * 财务总账导出
 */
export const cwexport = val => baseExport('/statis/index/cwexport', val)

/**
 * 外卖订单列表
 */
export const statisindex = val => baseGet('/statis/wm_order/index', val)

/**
 * 外卖订单列表导出
 */
export const statisexport = "/statis/wm_order/export";