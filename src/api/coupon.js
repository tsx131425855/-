/**
 * 说明: 此为优惠券目录下所有接口 (维护: magicsli)
 * 获取数据统一采用get请求
 * 处理数据统一采用post请求
 * 导出Excel表格全部采用window.open开启新窗口下载页面
 */

/* 导入axios */
import request from '@/utils/request'

/* 导入服务器地址 */
import { exporteurl } from '@/utils/user'

// 获取token
const data = { token: localStorage.getItem('Token') }

import qs from 'qs'
/**
 * 导出公共方法
 * @param {url} val 导出路由地址
 * @param {params} val 携带的参数对象
 */
function baseExport(url, params = {}) {
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
function baseGet(url, val = {}) {
  Object.assign(val, data)
  return request({
    url: url,
    method: 'get',
    params: val
  })
}

/**
 * post请求公共方法
 * @param {url} val 查询路由地址
 * @param {val} val 携带参数
 */
function basePost(url, val = {}) {
  Object.assign(val, data)
  return request({
    url: url,
    method: 'post',
    data: qs.stringify(val)
  })
}

/**
 * 获取优惠券列表
 */
export const couponList = val => baseGet('/coupon/coupon/index', val);

/**
 * 获取添加条件
 */
export const addCoupon = val => baseGet('/coupon/coupon/add', val);

/**
 * 提交添加
 */
export const commitCoupon = val => basePost('/coupon/coupon/add', val);

/**
 * 获取优惠券详情列表
 */
export const couponDetail = val => baseGet('/coupon/code/index', val);

/**
 * 修改优惠券详情列表数据
 */
export const changeCouponDetail = val => basePost('/coupon/code/ajax', val);

/**
 * 导出优惠券详情列表数据
 */
export const exportcouponDetail = val => baseExport('/coupon/code/export', val);

/**
 * 修改优惠券数据
 */
export const changeCoupon = val => basePost('/coupon/coupon/ajax', val);

/**
 * 白名单列表
 */
export const whiteList = val => baseGet('/coupon/white/index', val);

/**
 * 删除白名单
 */
export const detelWhite = val => basePost('/coupon/white/delete', val)

/**
 *  添加白名单
 */
export const addWhite = val => baseGet('/coupon/white/add', val)

/**
 * 提交添加白名单
 */
export const commitWhite = val => basePost('/coupon/white/add', val)

/**
 * 添加白名单商品
 */
export const addProduct = val => baseGet('/coupon/white/product', val);

/**
 * 修改白名单
 */
export const editWhite = val => baseGet('/coupon/white/edit', val)

/**
 * 提交修改白名单
 */
export const editCommitWhite = val => basePost('/coupon/white/edit', val)