import { postHttp } from "./user";

export const jurisdictionList = val => postHttp(val, "/auth/rule/index"); // 权限规则-列表

// 权限规则-添加
export const jurisdictionAdd = val => postHttp(val, "/auth/rule/add");
// 权限规则-修改
export const jurisdictionEdit = val => postHttp(val, "/auth/rule/edit");

// 权限规则-删除
export const jurisdictionDel = val => postHttp(val, "/auth/rule/del");

// 权限分组-列表
export const jurisdictiongroupList = val => postHttp(val, "/auth/group/index");

// 权限分组-添加
export const jurisdictiongroupAdd = val => postHttp(val, "/auth/group/add");

// 权限分组-修改
export const jurisdictiongroupEdit = val => postHttp(val, "/auth/group/edit");

// 权限分组-删除
export const jurisdictiongroupDel = val => postHttp(val, "/auth/group/del");

// 查询分组权限
export const jurisdictiongroup = val =>
  postHttp(val, "/auth/group/getrulebygid");

// 管理员-列表
export const jurisdictionAdmin = val => postHttp(val, "/auth/admin/index");

// 管理员-添加
export const jurisdictionAdminAdd = val => postHttp(val, "/auth/admin/add");

// 权限分组-修改
export const jurisdictionAdminEdit = val => postHttp(val, "/auth/admin/edit");

// 管理员-删除
export const jurisdictionAdminDel = val => postHttp(val, "/auth/admin/del");

// 管理员 查询用户
export const jurisdictionAdminQuery = val => postHttp(val, "/auth/admin/query");

// 日志列表
export const jurisdictionLog = val => postHttp(val, "/auth/log/index");
