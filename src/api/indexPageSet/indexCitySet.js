import { gethttp, postHttp } from "../user";

// 获取所有代理的数据 (所有的接口都需要基于此状态)
export const getAgent = val => gethttp(val, "/indexpage/indexPage/ajax");

// 获取我的城市所有模块初始数据
export const getCitySet = val => gethttp(val, "/indexpage/indexPage/index");

// 删除ICON
export const deleteIcon = val => gethttp(val, "/indexpage/indexPage/del1");

// 修改Icon
export const getEditIcon = val => gethttp(val, "/indexpage/IndexPage/edit1");

// 修改Icon commit
export const editIconCommit = val =>
  postHttp(val, "/indexpage/IndexPage/edit1");

// 添加Icon
export const getAddIcon = val => gethttp(val, "/indexpage/IndexPage/add1");

// 添加Icon commit
export const addIconCommit = val => postHttp(val, "/indexpage/IndexPage/add1");

// 添加商品列表
export const getAddProduct = val =>
  gethttp(val, "/indexpage/IndexPage/product");

// 模块是否显示
export const checkShow = val => postHttp(val, "/indexpage/IndexPage/show");

// icon模块排序
export const changeSort = val => postHttp(val, "/indexpage/IndexPage/sort1");

// 添加外卖商家列表
export const getStoreList = val => postHttp(val, "/indexpage/IndexPage/store");

// 好店推荐提交修改
export const goodStoreCommit = val =>
  postHttp(val, "/indexpage/IndexPage/add2");

// 保存名称配置
export const commitRob = val => postHttp(val, "/indexpage/IndexPage/add3");

// 保存会员特权配置
export const commitMember = val => postHttp(val, "/indexpage/IndexPage/add6");

// 保存底部推荐商品
export const commitRecommend = val =>
  postHttp(val, "/indexpage/IndexPage/add7");

// 获取底部推荐分类详情
export const getRecommendDetail = val =>
  gethttp(val, "/indexpage/IndexPage/cate_info");

// 提交底部推荐分类详情
export const commitRecommendDetail = val =>
  postHttp(val, "/indexpage/IndexPage/cate_add");

// 获取底部推荐分类编辑详情
export const getEditRecommendDetail = val =>
  gethttp(val, "/indexpage/IndexPage/cate_save");

// 提交底部推荐分类编辑详情
export const commitEditRecommendDetail = val =>
  postHttp(val, "/indexpage/IndexPage/cate_edit");

// 切换底部推荐商品分类显示状态
export const changeShowRecommend = val =>
  postHttp(val, "/indexpage/IndexPage/cate_status");

// 删除分类
export const deleteRecommendCate = val =>
  postHttp(val, "/indexpage/IndexPage/cate_delete");

// 添加精选推荐
export const selectedadd8 = val => postHttp(val, "/indexpage/IndexPage/add8");

// 精选推荐列表
export const selected_list = val =>
  gethttp(val, "/indexpage/IndexPage/selected_list");

// 精选推荐详情
export const selected_info = val =>
  gethttp(val, "/indexpage/IndexPage/selected_info");

// 精选推荐编辑
export const selectededit8 = val => postHttp(val, "/indexpage/IndexPage/edit8");

// 是否显示精选推荐模块
export const selected_show = val =>
  gethttp(val, "/indexpage/IndexPage/selected_show");

// 删除精选推荐模块
export const selected_del = val =>
  gethttp(val, "/indexpage/IndexPage/selected_del");

// 是否显示精选推荐列表中模块
export const cate_selected_show = val =>
  gethttp(val, "/indexpage/IndexPage/cate_selected_show");

// 保存精选推荐模块
export const add_modular = val =>
  postHttp(val, "/indexpage/IndexPage/add_modular");
