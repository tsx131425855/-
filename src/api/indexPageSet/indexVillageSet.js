import { gethttp, postHttp } from "../user";


// 获取所有代理的数据 (所有的接口都需要基于此状态)
export const getAgent = val => gethttp(val, '/indexpage/indexPage/ajax');

// 获取我的城市所有模块初始数据
export const getCitySet = val => gethttp(val, '/indexpage/IndexPage2/index');

// 删除ICON
export const deleteIcon = val => gethttp(val, '/indexpage/IndexPage2/del1');

// 修改Icon
export const getEditIcon = val => gethttp(val ,'/indexpage/IndexPage2/edit1');

// 修改Icon commit
export const editIconCommit = val => postHttp(val, '/indexpage/IndexPage2/edit1');

// 添加Icon  
export const getAddIcon = val => gethttp(val, '/indexpage/IndexPage2/add1');

// 添加Icon commit 
export const addIconCommit = val => postHttp(val, '/indexpage/IndexPage2/add1');

// 添加商品列表
export const getAddProduct = val => gethttp(val, '/indexpage/IndexPage/product');

// 模块是否显示
export const checkShow = val => postHttp(val, '/indexpage/IndexPage/show');

// icon模块排序
export const changeSort = val => postHttp(val, '/indexpage/IndexPage2/sort1');

// 添加外卖商家列表
export const getStoreList = val => postHttp(val, '/indexpage/IndexPage/store');

// 实体店
export const entityStoreCommit = val => postHttp(val, '/indexpage/IndexPage2/add2');

// 切换icon_type
export const checkIconType = val => postHttp(val, '/indexpage/IndexPage2/edit_icon_type');

// 提交左侧模块
export const commitleft = val => postHttp(val, '/indexpage/IndexPage2/add3')

// 提交右侧模块
export const commitRight = val => postHttp(val, '/indexpage/IndexPage2/add4')

// 提交右侧模块
export const commitFourModule = val => postHttp(val, '/indexpage/IndexPage2/add5')

// 提交右侧模块
export const commitRecommend = val => postHttp(val, '/indexpage/IndexPage2/add6')
