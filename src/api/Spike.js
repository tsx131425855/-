import { gethttp, postHttp } from "./user";

// 添加秒杀活动配置
export const add_rule = val => postHttp(val, "/product/seckill/add_rule");

// 添加的商品列表接口
export const product_list = val =>
  gethttp(val, "/product/seckill/product_list");

// 秒杀列表
export const spike_product_list = val => gethttp(val, "/product/seckill/lists");

// 编辑/查看秒杀设置信息
export const spike_info = val => gethttp(val, "/product/seckill/info");

// 编辑秒杀活动配置
export const spike_edit_rule = val =>
  postHttp(val, "/product/seckill/edit_rule");

// 添加/编辑秒杀商品规则
export const add_product_rule = val =>
  postHttp(val, "/product/seckill/add_product_rule");

// 秒杀订单列表
export const seckill_order_list = val =>
  gethttp(val, "/product/seckill/seckill_order_list");

// 秒杀订单列表导出
export const seckillexport = `/product/seckill/export`;

// 秒杀资金统计
export const seckill_order_static = val =>
  gethttp(val, "/product/seckill/seckill_order_static");

// 秒杀商品统计
export const seckill_product_static = val =>
  gethttp(val, "/product/seckill/seckill_product_static");

// 秒杀商品统计导出
export const seckill_product_export = `/product/seckill/seckill_product_export`;

// 批量上下架秒杀活动
export const change_show = val => gethttp(val, "/product/seckill/change_show");

// 秒杀商品规格
export const seckill_product_info = val =>
  gethttp(val, "/product/seckill/seckill_product_sku_info");
