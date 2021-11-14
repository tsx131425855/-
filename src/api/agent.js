import { gethttp, postHttp } from "./user";

// 基础设置
export const agentBase = val => postHttp(val, "/agent/index/base");

// 获取基础设置
export const agentBaseInfo = val =>
  gethttp(val, "/agent/index/get_agent_base_info");

// 获取代理商地址
export const agentAddress = val =>
  gethttp(val, "/agent/index/get_address_list");

// 基础设置
export const agentAdd = val => postHttp(val, "/agent/index/add");

// 修改代理商
export const agentEdit = val => postHttp(val, "/agent/index/edit");

// 代理商列表
export const agentlists = val => gethttp(val, "/agent/index/lists");

// 代理商禁用/启用
export const agentCheck = val => gethttp(val, "/agent/index/check");

// 代理商查看/编辑
export const agentInfo = val => gethttp(val, "/agent/index/info");

// 操作日志
export const daily = val => gethttp(val, "/agent/index/daily");

// 修改代理商
export const partnerAjax = val => gethttp(val, "/agent/agent_partner/ajax");

// 合伙人列表
export const partnerIndex = val => gethttp(val, "/agent/agent_partner/index");

// 新增合伙人
export const partnerAdd = val => postHttp(val, "/agent/agent_partner/add");

// 编辑合伙人
export const postEdit = val => postHttp(val, "/agent/agent_partner/edit");

// 查看编辑合伙人
export const getEdit = val => gethttp(val, "/agent/agent_partner/edit");

// 合伙人buon操作
export const getCheck = val => gethttp(val, "/agent/agent_partner/check");

// 新增负责人
export const addPerson = val => postHttp(val, "/agent/agent_village/add");

// 负责人代理地址ajax
export const Personajax = val => gethttp(val, "/agent/agent_village/ajax");

// 负责人列表
export const personList = val => gethttp(val, "/agent/agent_village/index");

// 查看编辑负责人
export const agent_villageinfo = val =>
  gethttp(val, "/agent/agent_village/info");

// 编辑负责人
export const agent_villageedit = val =>
  gethttp(val, "/agent/agent_village/edit");

// 结算列表
export const center = val => gethttp(val, "/agent/settle/center");

// 结算导出
export const centerexport = "/agent/settle/centerexport";

// 订单导出
export const orderexport = "/agent/settle/orderexport";

// 跳转代理商后台
export const jumpagent = val => gethttp(val, "/index/login/jumpagent");

// 结算订单列表
export const settlelist = val => gethttp(val, "/agent/settle/list");

// 结算订单导出
export const listexport = "/agent/settle/listexport";

// 负责人button操作
export const check_villageedit = val =>
  gethttp(val, "/agent/agent_village/check");

// 结算打款
export const centerremit = val => gethttp(val, "/agent/settle/centerremit");

// 结算打款记录
export const centerremitlog = val =>
  gethttp(val, "/agent/settle/centerremitlog");
