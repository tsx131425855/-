import { gethttp, postHttp } from "./user";


// 添加推送消息
export const addMessage = val => postHttp(val, '/messagenew/message/add');

// 获取消息推送
export const getMessageInfo = val => gethttp(val, '/messagenew/message/info');

// 保存编辑的消息
export const commitMessage = val => postHttp(val, '/messagenew/message/edit');

// 获取消息列表
export const getMessage = val => gethttp(val, '/messagenew/message/index');

// 批量软删除消息
export const deleteMessage = val => gethttp(val, '/messagenew/message/delete');

