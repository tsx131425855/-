import { gethttp, postHttp } from "./user";

// 商品添加页所需数据
export const productmsg = val => gethttp(val, "/product/product/msg");

// 添加商品
export const addcommodity = val => postHttp(val, "/product/product/add");

// 商品列表
export const productlists = val => gethttp(val, "/product/product/lists");

// 批量循环
export const loop_cycle = val => gethttp(val, "/product/product/loop_cycle");

// 批量推荐
export const loop_recommend = val =>
  gethttp(val, "/product/product/loop_recommend");

// 批量上下架
export const loop_show = val => gethttp(val, "/product/product/loop_show");

// 修改排序
export const change_sort = val => postHttp(val, "/product/product/change_sort");

// 批量复制商品
export const productcopy = val => gethttp(val, "/product/product/copy");

// 批量删除
export const loop_delete = val => gethttp(val, "/product/product/loop_delete");

// 商品列表页筛选接口
export const listmsg = val => gethttp(val, "/product/product/listmsg");

// 编辑商品信息
export const edit_product_info = val =>
  gethttp(val, "/product/product/edit_product_info");

// 编辑商品
export const productedit = val => postHttp(val, "/product/product/edit");

// 商品分类列表
export const categoryList = val => gethttp(val, "/product/category/index");

// 添加商品分类
export const categoryAdd = val => postHttp(val, "/product/category/add");

// 编辑商品分类
export const categoryEdit = val => postHttp(val, "/product/category/edit");

// 商品分类删除
export const categoryDel = val => gethttp(val, "/product/category/del");

// 商品显示/隐藏
export const categoryShow = val => gethttp(val, "/product/category/show");

// 列表
export const autoSortList = val => gethttp(val, "/product/auto_sort/index");

// 配置保存
export const configsave = val => postHttp(val, "/product/auto_sort/configsave");

// 排序商品添加
export const autoSortAdd = val => postHttp(val, "/product/auto_sort/add");

// 添加商品列表
export const query = val => postHttp(val, "/product/auto_sort/query");

// 回收站列表
export const recoverytList = val => gethttp(val, "/product/product/recovery");

// 回收站批量恢复
export const batch_recovery = val =>
  postHttp(val, "/product/product/batch_recovery");

// 排序商品删除
export const autoSortdel = val => gethttp(val, "/product/auto_sort/del");

// 商品列表导出
export const productExport = `/product/product/export`;

// 添加分销商品
export const addProduct = val =>
  postHttp(val, "/product/product/add_retail_product");

// 分销商品列表
export const retailLists = val => gethttp(val, "/product/product/retail_lists");

// 分销商品置顶
export const settop = val => gethttp(val, "/product/product/set_top");

// 批量删除分销商品
export const deleteRetail = val =>
  postHttp(val, "/product/product/loop_delete_retail");

// 批量复制分销商品
export const copyRetail = val => gethttp(val, "/product/product/copy_retail");

// 分销商品信息
export const getRetailInfo = val =>
  gethttp(val, "/product/product/edit_retail_info");

// 编辑分销商品
export const editRetail = val => postHttp(val, "/product/product/edit_retail");

// 分类列表
export const categorys = val =>
  gethttp(val, "/product/product_retail/categorys");

// 分销商品列表
export const product_retaillists = val =>
  gethttp(val, "/product/product_retail/lists");

// 添加/取消分销商品
export const check_retail = val =>
  gethttp(val, "/product/product_retail/check_retail");

// 规格模板列表
export const templatelists = val =>
  gethttp(val, "/attribute/product_attr_template/lists");

// 添加规格模板
export const templateAdd = val =>
  postHttp(val, "/attribute/product_attr_template/add");

// 删除规格模板
export const templateDel = val =>
  postHttp(val, "/attribute/product_attr_template/del");

// 模板查看
export const templateInfo = val =>
  gethttp(val, "/attribute/product_attr_template/info");

// 编辑规格模板
export const templateEdit = val =>
  postHttp(val, "/attribute/product_attr_template/edit");

// 检测新增/修改规格是否有重复/空值数据
export const check_attr_repeat = val =>
  postHttp(val, "/attribute/product_attr_template/check_attr_repeat");

// 检测新增/修改规格属性是否有重复/空值数据
export const check_attr_value_repeat = val =>
  postHttp(val, "/attribute/product_attr_template/check_attr_value_repeat");

// 商品基础列表
export const productwareList = val => gethttp(val, "/productware/base/index");

// 转入公共库
export const productwareturnpublic = val =>
  postHttp(val, "/productware/base/turnpublic");

// 转入回收站
export const productwareturnrecycle = val =>
  postHttp(val, "/productware/base/turnrecycle");

// 商品基础查看
export const productwareView = val => gethttp(val, "/productware/base/view");

// 商品公共列表
export const productwarepubList = val => gethttp(val, "/productware/pub/index");

// 公共库编辑
export const productwarepubedit = val => postHttp(val, "/productware/pub/edit");

// 转入回收站
export const productwarepubturnrecycle = val =>
  postHttp(val, "/productware/pub/turnrecycle");

// 商品公共查看
export const productwarepubView = val => gethttp(val, "/productware/pub/view");

// 商品公共库分类列表
export const productwareindex = val => gethttp(val, "/productware/cate/index");

// 商品公共库分类添加
export const productwarepubadd = val => postHttp(val, "/productware/cate/add");

// 商品公共库分类编辑
export const productwarepubcateedit = val =>
  postHttp(val, "/productware/cate/edit");

// 商品公共库分类删除
export const productwarepubdel = val => postHttp(val, "/productware/cate/del");

// 商品公共库分类排序
export const productwarepubsort = val =>
  postHttp(val, "/productware/cate/sort");

// 商品公共库回收列表
export const productwarerecycleindex = val =>
  gethttp(val, "/productware/recycle/index");

// 商品回收转入公共库
export const productwarerecycleturnpublic = val =>
  postHttp(val, "/productware/recycle/turnpublic");

// 商品回收查看
export const productwarerecycleview = val =>
  gethttp(val, "/productware/recycle/view");

// 公共商品列表
export const getpubliclist = val =>
  gethttp(val, "/product/product/getpubliclist");

// 公共商品添加
export const addpublicproduct = val =>
  postHttp(val, "/product/product/addpublicproduct");
