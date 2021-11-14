import { gethttp, postHttp } from "./user";

// 采购查看
export const supplierList = val => gethttp(val, "/supplier/purchase/index");

// 采购导出
export const supplierExport = "/supplier/purchase/export";

// 供应商查看
export const supplierLists = val => gethttp(val, "/supplier/supplier/index");

// 供应商添加
export const supplierAdd = val => postHttp(val, "/supplier/supplier/add");

// 供应商编辑
export const supplierEdit = val => postHttp(val, "/supplier/supplier/edit");

// 供应商锁定
export const supplierLock = val => gethttp(val, "/supplier/supplier/lock");
