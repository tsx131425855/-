import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: {
          title: "首页",
          icon: "dashboard"
        }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  {
    path: "*",
    redirect: "/404",
    hidden: true
  },
  {
    path: "/jurisdictionRule",
    component: Layout,
    children: [
      {
        path: "/jurisdictionRule",
        component: () => import("@/views/jurisdiction/rule"),
        name: "jurisdictionRule",
        meta: {
          title: "权限资源",
          icon: "international",
          noCache: true
        }
      }
    ]
  },
  {
    path: "/jurisdictionGrouping", //  分组
    component: Layout,
    children: [
      {
        path: "/jurisdictionGrouping",
        component: () => import("@/views/jurisdiction/Grouping"),
        name: "jurisdictionGrouping",
        meta: {
          title: "权限分组",
          icon: "international",
          noCache: true
        }
      }
    ]
  },
  {
    path: "/jurisdictionAdministrators", //  管理员
    component: Layout,
    children: [
      {
        path: "/jurisdictionAdministrators",
        component: () => import("@/views/jurisdiction/administrators"),
        name: "jurisdictionAdministrators",
        meta: {
          title: "管理员",
          icon: "international",
          noCache: true
        }
      }
    ]
  },
  {
    path: "/jurisdictionJournal", //  日志
    component: Layout,
    children: [
      {
        path: "/Journal",
        component: () => import("@/views/jurisdiction/Journal"),
        name: "Journal",
        meta: {
          title: "操作日志",
          icon: "international",
          noCache: true
        }
      }
    ]
  },
  {
    path: "/statistics", //  新增会员
    component: Layout,
    children: [
      {
        path: "/statisticsVip",
        component: () => import("@/views/statistics/vip/vip"),
        name: "statisticsVip",
        meta: {
          title: "新增会员",
          icon: "international"
        }
      }
    ]
  },

  {
    //  会员统计
    path: "/statistics",
    component: Layout,
    children: [
      {
        path: "/statisticsVipRanking",
        component: () => import("@/views/statistics/vip/vipRanking"),
        name: "vipRanking",
        meta: {
          title: "会员排行",
          icon: "international"
        }
      }
    ]
  },
  {
    //  自提点销售
    path: "/statistics",
    component: Layout,
    children: [
      {
        path: "/SelfRaisingSalesVolume",
        component: () => import("@/views/statistics/SelfRaisingSalesVolume"),
        name: "SelfRaisingSalesVolume",
        meta: {
          title: "自提点销售",
          icon: "international"
        }
      }
    ]
  },
  {
    path: "/IdentifyChips",
    component: Layout,
    children: [
      {
        path: "/identifyChipsStatistics",
        component: () =>
          import("@/views/statistics/identifyChips/identifyChips"),
        name: "identifyChips",
        meta: {
          title: "认筹统计",
          icon: "international"
        }
      }
    ]
  },
  {
    path: "/financial", // 财务统计
    component: Layout,
    children: [
      // 提现详情
      {
        path: "/deposit",
        component: () => import("@/views/finance/deposit"),
        name: "deposit",
        meta: {
          title: "提现详情",
          icon: "international"
        }
      },

      // 平台分红
      {
        path: "/platform_bonus",
        component: () => import("@/views/finance/platform_bonus"),
        name: "platform_bonus",
        meta: {
          title: "平台分红",
          icon: "international"
        }
      },

      // 自提点分成
      {
        path: "/self_bonus",
        component: () => import("@/views/finance/self_bonus"),
        name: "self_bonus",
        meta: {
          title: "自提点分成",
          icon: "international"
        }
      },

      // 粉丝佣金
      {
        path: "/fans_bonus",
        component: () => import("@/views/finance/fans_bonus"),
        name: "fans_bonus",
        meta: {
          title: "粉丝返佣",
          icon: "international"
        }
      },

      // 平台抽成
      {
        path: "/platform_pumping",
        component: () => import("@/views/finance/platform_pumping"),
        name: "platform_pumping",
        meta: {
          title: "平台抽成",
          icon: "international"
        }
      },

      // 服务订单
      {
        path: "/serviceOrder",
        component: () => import("@/views/finance/serviceOrder"),
        name: "serviceOrder",
        meta: {
          title: "服务订单",
          icon: "international"
        }
      },

      // 会员余额
      {
        path: "/user_balance",
        component: () => import("@/views/finance/balance/user_balance"),
        name: "user_balance",
        meta: {
          title: "会员余额",
          icon: "international"
        }
      },

      // 总余额 -> 会员余额 ->
      {
        path: "/balance_total",
        component: () => import("@/views/finance/balance/balance_total"),
        name: "balance_total",
        meta: {
          title: "总余额",
          icon: "international"
        }
      },

      // 提现总额 -> 会员余额
      {
        path: "/deposit_total",
        component: () => import("@/views/finance/balance/deposit_total"),
        name: "deposit_total",
        meta: {
          title: "提现总额",
          icon: "international"
        }
      },

      // 收入总额明细 -> 会员余额
      {
        path: "/income_total",
        component: () => import("@/views/finance/balance/income_total"),
        name: "income_total",
        meta: {
          title: "收入总额",
          icon: "international"
        }
      },

      // 余额支出总额 -> 会员余额
      {
        path: "/expend_balance",
        component: () => import("@/views/finance/balance/expend_balance"),
        name: "expend_balance",
        meta: {
          title: "余额支出总额",
          icon: "international"
        }
      },

      // 微信支出总额 -> 会员余额
      {
        path: "/expend_weixin",
        component: () => import("@/views/finance/balance/expend_weixin"),
        name: "expend_weixin",
        meta: {
          title: "微信支出总额",
          icon: "international"
        }
      },

      // 冻结总额 -> 会员余额
      {
        path: "/freeze",
        component: () => import("@/views/finance/balance/freeze"),
        name: "freeze",
        meta: {
          title: "冻结总额",
          icon: "international"
        }
      },

      // 会员金币
      {
        path: "/user_gold",
        component: () => import("@/views/finance/gold/user_gold"),
        name: "user_gold",
        meta: {
          title: "用户金币",
          icon: "international"
        }
      },

      // 可使用金币 -> 会员金币
      {
        path: "/activity_gold",
        component: () => import("@/views/finance/gold/activity_gold"),
        name: "activity_gold",
        meta: {
          title: "可使用金币",
          icon: "international"
        }
      },

      // 支出金币 -> 会员金币
      {
        path: "/expend_gold",
        component: () => import("@/views/finance/gold/expend_gold"),
        name: "expend_gold",
        meta: {
          title: "支出金币",
          icon: "international"
        }
      },

      // 冻结金币 -> 会员金币
      {
        path: "/fireeze_gold",
        component: () => import("@/views/finance/gold/fireeze_gold"),
        name: "fireeze_gold",
        meta: {
          title: "冻结金币",
          icon: "international"
        }
      },

      // 总金币 -> 会员金币
      {
        path: "/gold_total",
        component: () => import("@/views/finance/gold/gold_total"),
        name: "gold_total",
        meta: {
          title: "总金币",
          icon: "international"
        }
      },
      // { path: '/gold_total/:userId/:time', component: () => import('@/views/finance/gold/gold_total'), name: 'gold_total', meta: { title: '总金币', icon: 'international' } },

      // 商品
      {
        path: "/product",
        component: () => import("@/views/finance/product"),
        name: "product",
        meta: {
          title: "商品订单流水",
          icon: "international"
        }
      },

      // 优惠买单
      {
        path: "/preferential",
        component: () => import("@/views/finance/preferential"),
        name: "preferential",
        meta: {
          title: "优惠买单",
          icon: "international"
        }
      },

      // 认筹报名
      {
        path: "/get_registration",
        component: () => import("@/views/finance/get_registration"),
        name: "get_registration",
        meta: {
          title: "认筹报名",
          icon: "international"
        }
      },
      // 外卖订单
      {
        path: "/take_out_order",
        component: () => import("@/views/finance/take_out_order"),
        name: "take_out_order",
        meta: {
          title: "外卖订单",
          icon: "international"
        }
      },

      // 优惠买单
      {
        path: "/preferential",
        component: () => import("@/views/finance/preferential"),
        name: "preferential1",
        meta: {
          title: "优惠买单",
          icon: "international"
        }
      },

      // 装修报名流水
      {
        path: "/decoration_home",
        component: () => import("@/views/finance/decoration_home"),
        name: "decoration_home",
        meta: {
          title: "装修报名流水",
          icon: "international"
        }
      },

      // 社区活动
      {
        path: "/activity",
        component: () => import("@/views/finance/activity"),
        name: "activity",
        meta: {
          title: "社区活动",
          icon: "international"
        }
      },
      // 财务总账主页
      {
        path: "/finance_index",
        component: () => import("@/views/finance/finance_index"),
        name: "finance_index",
        meta: {
          title: "财务总帐",
          icon: "international"
        }
      },
      // 商品详情页 -> 商品
      {
        path: "/product_detail",
        component: () => import("@/views/finance/product_detail"),
        name: "product_detail",
        meta: {
          title: "商品订单详情",
          icon: "international"
        }
      }
    ]
  },

  {
    path: "/Statistics", // 统计 -> 销量 -> 订单统计          装修统计        售后统计
    component: Layout,
    children: [
      {
        path: "/SalesOrders",
        component: () => import("@/views/statistics/salesVolume/Order"),
        name: "SalesOrders",
        meta: {
          title: "订单统计",
          icon: "international"
        }
      },
      {
        path: "/Renovation",
        component: () => import("@/views/statistics/Renovation/Renovation"),
        name: "Renovation",
        meta: {
          title: "装修统计",
          icon: "international"
        }
      },
      {
        path: "/afterSale",
        component: () => import("@/views/statistics/afterSale/afterSale"),
        name: "afterSale",
        meta: {
          title: "售后统计",
          icon: "international"
        }
      }
    ]
  },
  {
    path: "/Statistics", // 统计 -> 商品销量排行
    component: Layout,
    children: [
      {
        path: "/productSalesRanking",
        component: () =>
          import("@/views/statistics/commodity/productSalesRanking"),
        name: "productSalesRanking",
        meta: {
          title: "商品销量排行",
          icon: "international"
        }
      },
      {
        path: "/salesDetails",
        component: () => import("@/views/statistics/commodity/salesDetails"),
        name: "salesDetails",
        meta: {
          title: "商品销量明细",
          icon: "international"
        }
      }
    ]
  },
  {
    path: "/viewMembers", //  用户管理 用户列表
    component: Layout,
    children: [
      {
        path: "/userList",
        component: () => import("@/views/viewMembers/userList"),
        name: "userList",
        meta: {
          title: "用户列表",
          icon: "international"
        }
      },
      {
        path: "/fansDetails", // 用户管理  用户粉丝列表
        component: () => import("@/views/viewMembers/fansDetails"),
        name: "fansDetails",
        meta: {
          title: "用户粉丝列表",
          icon: "international"
        }
      },
      {
        path: "/userOrderList", // 用户管理  用户订单列表
        component: () => import("@/views/viewMembers/userOrderList"),
        name: "userOrderList",
        meta: {
          title: "用户订单列表",
          icon: "international"
        }
      },
      {
        path: "/userCarryCash", // 用户管理  用户提现列表
        component: () => import("@/views/viewMembers/userCarryCash"),
        name: "userCarryCash",
        meta: {
          title: "用户提现",
          icon: "international"
        }
      }
    ]
  },
  {
    path: "/merchantManagement", //  商家管理页面
    component: Layout,
    children: [
      {
        path: "/businessList",
        component: resolve =>
          require(["@/views/merchantManagement/businessList"], resolve),
        name: "businessList",
        meta: {
          title: "商家列表",
          icon: "international"
        }
      },
      {
        path: "/merchantOrder", // 商家列表
        component: resolve =>
          require(["@/views/merchantManagement/merchantOrder"], resolve),
        name: "merchantOrder1",
        meta: {
          title: "订单列表",
          icon: "international"
        }
      },
      {
        path: "/merchantOrderView", // 查看商家详情
        component: resolve =>
          require(["@/views/merchantManagement/merchantOrderView"], resolve),
        name: "merchantOrderView1",
        meta: {
          title: "查看商家详情",
          icon: "international"
        }
      },
      {
        path: "/MerchantClassification", // 商家分类
        component: resolve =>
          require([
            "@/views/merchantManagement/MerchantClassification"
          ], resolve),
        name: "MerchantClassification",
        meta: {
          title: "商家分类",
          icon: "international"
        }
      },
      {
        path: "/merchantOrderView", // 商家订单列表查看
        component: resolve =>
          require(["@/views/merchantManagement/merchantOrderView"], resolve),
        name: "merchantOrderView",
        meta: {
          title: "商家分类",
          icon: "international"
        }
      }
    ]
  },
  {
    path: "/commodityManagement", // 商品管理
    component: Layout,
    children: [
      {
        path: "/commodity",
        component: () => import("@/views/commodityManagement/commodity"),
        name: "commodity",
        meta: {
          title: "商品管理",
          icon: "international"
        }
      },
      {
        path: "/commodityClass",
        component: () => import("@/views/commodityManagement/commodityClass"),
        name: "commodityClass",
        meta: {
          title: "商品分类",
          icon: "international"
        }
      },
      {
        path: "/automaticSorting",
        component: () => import("@/views/commodityManagement/automaticSorting"),
        name: "automaticSorting",
        meta: {
          title: "自动排序设置",
          icon: "international"
        }
      },
      {
        path: "/recycleBin",
        component: () => import("@/views/commodityManagement/recycleBin"),
        name: "recycleBin",
        meta: {
          title: "商品回收站",
          icon: "international"
        }
      },
      {
        path: "/commodityCenter",
        component: () => import("@/views/commodityManagement/commodityCenter"),
        name: "commodityCenter",
        meta: {
          title: "商品中心",
          icon: "international"
        }
      },
      {
        path: "/distributionCommodity",
        component: () =>
          import("@/views/commodityManagement/distributionCommodity"),
        name: "distributionCommodity",
        meta: {
          title: "分销商品",
          icon: "international"
        }
      },
      {
        path: "/Specifications",
        component: () => import("@/views/commodityManagement/Specifications"),
        name: "Specifications",
        meta: {
          title: "商品规格",
          icon: "international"
        }
      },
      {
        path: "/commodityBasis/commodityBasis",
        component: () =>
          import("@/views/commodityManagement/commodityBasis/commodityBasis"),
        name: "commodityBasis",
        meta: { title: "商品基础库" }
      },
      {
        path: "/commodityBasis/commodityPublic",
        component: () =>
          import("@/views/commodityManagement/commodityBasis/commodityPublic"),
        name: "commodityPublic",
        meta: { title: "公共商品库" }
      },
      {
        path: "/commodityBasis/libraryRecyclebin",
        component: () =>
          import("@/views/commodityManagement/commodityBasis/libraryRecyclebin"),
        name: "libraryRecyclebin",
        meta: { title: "回收站" }
      },
      {
        path: "/commodityBasis/libraryclass",
        component: () =>
          import("@/views/commodityManagement/commodityBasis/libraryclass"),
        name: "libraryclass",
        meta: { title: "公共库分类" }
      }
    ]
  },
  {
    path: "/order", // 订单管理
    component: Layout,
    children: [
      {
        path: "/orderList", // 汇总订单列表
        component: () => import("@/views/order/indexList_order"),
        name: "order_list",
        meta: {
          title: "汇总订单列表",
          icon: "international"
        }
      },
      {
        path: "/putOut_order", // 汇总订单出库
        component: () => import("@/views/order/putOut_order"),
        name: "putOut_order",
        meta: {
          title: "汇总订单出库",
          icon: "international"
        }
      },
      {
        path: "/after_help_order", // 汇总售后订单
        component: () => import("@/views/order/after_help_order"),
        name: "after_help_order",
        meta: {
          title: "汇总售后订单",
          icon: "international"
        }
      },
      {
        path: "/order_detail", // 汇总售后订单
        component: () => import("@/views/order/order_detail"),
        name: "order_detail",
        meta: {
          title: "订单详情",
          icon: "international"
        }
      }
    ]
  },
  {
    path: "/coupon", // 优惠券管理
    component: Layout,
    children: [
      {
        path: "/couponList", // 优惠券管理
        component: () => import("@/views/coupon/couponList"),
        name: "couponList",
        meta: {
          title: "优惠券管理",
          icon: "international"
        }
      },
      {
        path: "/couponDetail", // 优惠券管理
        component: () => import("@/views/coupon/couponDetail"),
        name: "couponDetail",
        meta: {
          title: "优惠券管理",
          icon: "international"
        }
      },
      {
        path: "/whiteList", // 白名单
        component: () => import("@/views/coupon/whiteList"),
        name: "whiteList",
        meta: {
          title: "白名单",
          icon: "international"
        }
      },
      {
        path: "/whiteDetail", // 白名单详情
        component: () => import("@/views/coupon/whiteDetail"),
        name: "addWhite",
        meta: {
          title: "添加/修改白名单",
          icon: "international"
        }
      }
    ]
  },
  {
    path: "/group", // 拼团模块
    component: Layout,
    children: [
      {
        path: "/product_group", // 拼团商品
        component: () => import("@/views/group/product_group"),
        name: "product_group",
        meta: {
          title: "拼团商品",
          icon: "international"
        }
      },
      {
        path: "/activity_group", // 拼团活动
        component: () => import("@/views/group/activity_group"),
        name: "activity_group",
        meta: {
          title: "拼团活动",
          icon: "international"
        }
      },
      {
        path: "/order_group", // 拼团商品
        component: () => import("@/views/group/order_group"),
        name: "order_group",
        meta: {
          title: "拼团商品",
          icon: "international"
        }
      },
      {
        path: "/setProduct", // 修改商品
        component: () => import("@/views/group/setProduct"),
        name: "setProduct",
        meta: {
          title: "编辑拼团商品",
          icon: "international"
        }
      },
      {
        path: "/groupDetail", // 活动详情
        component: () => import("@/views/group/groupDetail"),
        name: "groupDetail",
        meta: {
          title: "编辑拼团详情",
          icon: "international"
        }
      }
    ]
  },
  {
    path: "/agent", // 代理人
    component: Layout,
    children: [
      {
        path: "/foundationSetup",
        component: () => import("@/views/agent/foundationSetup"),
        name: "foundationSetup",
        meta: {
          title: "基础设置",
          icon: "international"
        }
      },
      {
        path: "/agencyCenter",
        component: () => import("@/views/agent/agencyCenter"),
        name: "agencyCenter",
        meta: {
          title: "代理商中心",
          icon: "international"
        }
      },
      {
        path: "/partner",
        component: () => import("@/views/agent/partner"),
        name: "partner",
        meta: {
          title: "合伙人",
          icon: "international"
        }
      },
      {
        path: "/villageLevel",
        component: () => import("@/views/agent/villageLevel"),
        name: "villageLevel",
        meta: {
          title: "村级负责人",
          icon: "international"
        }
      },
      {
        path: "/subordinate",
        component: () => import("@/views/agent/subordinate"),
        name: "subordinate",
        meta: {
          title: "下级结算中心",
          icon: "international"
        }
      },
      {
        path: "/profit",
        component: () => import("@/views/agent/profit"),
        name: "profit",
        meta: {
          title: "收益结算",
          icon: "international"
        }
      }
    ]
  },
  {
    path: "/purchaseAdministration", // 采购管理
    component: Layout,
    children: [
      {
        path: "/Purchase",
        component: () => import("@/views/purchaseAdministration/Purchase"),
        name: "Purchase",
        meta: {
          title: "采购单",
          icon: "international"
        }
      },
      {
        path: "/SupplierList",
        component: () => import("@/views/purchaseAdministration/SupplierList"),
        name: "SupplierList",
        meta: {
          title: "供应商列表",
          icon: "international"
        }
      }
    ]
  },
  {
    path: "/officialWebsite", // 官网
    component: Layout,
    children: [
      {
        path: "/JoinIn", // 加盟商
        component: () => import("@/views/officialWebsite/JoinIn"),
        name: "JoinIn",
        meta: {
          title: "加盟商",
          icon: "international"
        }
      },
      {
        path: "/Supplier", // 供应商
        component: () => import("@/views/officialWebsite/Supplier"),
        name: "Supplier",
        meta: {
          title: "供应商",
          icon: "international"
        }
      },
      {
        path: "/Journalism", // 新闻
        component: () => import("@/views/officialWebsite/Journalism"),
        name: "Journalism",
        meta: {
          title: "新闻",
          icon: "international"
        }
      },
      {
        path: "/friendshiplinks", // 友情链接
        component: () => import("@/views/officialWebsite/friendshiplinks"),
        name: "friendshiplinks",
        meta: {
          title: "友情链接",
          icon: "international"
        }
      },
      {
        path: "/supportingAgriculture", // 扶农进度
        component: () =>
          import("@/views/officialWebsite/supportingAgriculture"),
        name: "supportingAgriculture",
        meta: {
          title: "扶农进度",
          icon: "international"
        }
      }
    ]
  },
  {
    path: "/membersBoon", // 会员权益
    component: Layout,
    children: [
      {
        path: "/superMembers", // 超级会员列表
        component: () => import("@/views/membersBoon/superMembers"),
        name: "superMembers",
        meta: {
          title: "超级会员列表",
          icon: "international"
        }
      },
      {
        path: "/trial", // 免费试用列表
        component: () => import("@/views/membersBoon/trial"),
        name: "trial",
        meta: {
          title: "免费试用列表",
          icon: "international"
        }
      },
      {
        path: "/set_benefit", // 权益配置
        component: () => import("@/views/membersBoon/set_benefit"),
        name: "set_benefit",
        meta: {
          title: "权益配置",
          icon: "international"
        }
      },
      {
        path: "/fansWhiteList", // 粉丝返佣白名单
        component: () => import("@/views/membersBoon/fansWhiteList"),
        name: "fansWhiteList",
        meta: {
          title: "粉丝返佣白名单",
          icon: "international"
        }
      },
      {
        path: "/fansWhiteEdit", // 粉丝返佣白名单编辑查看
        component: () => import("@/views/membersBoon/fansWhiteEdit"),
        name: "fansWhiteEdit",
        meta: {
          title: "粉丝返佣白名单编辑/查看",
          icon: "international"
        }
      },
      {
        path: "/superConfiguration", // 超级会员权益配置
        component: () => import("@/views/membersBoon/superConfiguration"),
        name: "superConfiguration",
        meta: {
          title: "超级会员权益配置/查看",
          icon: "international"
        }
      }
    ]
  },
  {
    path: "/pageSet", // 首页/页面 (小程序) 模块配置
    component: Layout,
    children: [
      {
        path: "/indexCitySet", // 首页-我的城市配置
        component: () => import("@/views/indexSet/indexCitySet"),
        name: "indexCitySet",
        meta: {
          title: "首页-我的城市",
          icon: "international"
        }
      },
      {
        path: "/indexVillageSet", // 首页-我的乡配置
        component: () => import("@/views/indexSet/indexVillageSet"),
        name: "indexVillageSet",
        meta: {
          title: "首页-我的乡",
          icon: "international"
        }
      },
      {
        path: "/banner", // 首页-banner
        component: () => import("@/views/indexSet/banner"),
        name: "banner",
        meta: {
          title: "banner",
          icon: "international"
        }
      },
      {
        path: "/newHome", // 新版首页配置
        component: () => import("@/views/indexSet/newHome"),
        name: "newHome",
        meta: {
          title: "新版首页配置",
          icon: "international"
        }
      },
      {
        path: "/Encyclopedias", // 资讯分类
        component: () => import("@/views/indexSet/Encyclopedias"),
        name: "Encyclopedias",
        meta: {
          title: "资讯分类",
          icon: "international"
        }
      },
      {
        path: "/article", // 文章管理
        component: () => import("@/views/indexSet/article"),
        name: "article",
        meta: {
          title: "文章管理",
          icon: "international"
        }
      }
    ]
  },
  {
    path: "/Seckill", // 秒杀活动
    component: Layout,
    children: [
      {
        path: "/SeckillList", // 秒杀活动列表
        component: resolve => require(["@/views/Seckill/SeckillList"], resolve),
        name: "SeckillList",
        meta: {
          title: "秒杀活动列表",
          icon: "international"
        }
      },
      {
        path: "/SeckillOrder", // 秒杀订单
        component: resolve =>
          require(["@/views/Seckill/SeckillOrder"], resolve),
        name: "SeckillOrder",
        meta: {
          title: "秒杀订单",
          icon: "international"
        }
      },
      {
        path: "/activityAnalysis", // 秒杀活动分销
        component: resolve =>
          require(["@/views/Seckill/activityAnalysis"], resolve),
        name: "activityAnalysis",
        meta: {
          title: "秒杀活动分析",
          icon: "international"
        }
      }
    ]
  },
  {
    path: "/activity", // 活动管理
    component: Layout,
    children: [
      {
        path: "/advertising", // 广告管理
        component: () => import("@/views/activity/advertising"),
        name: "advertising",
        meta: {
          title: "广告管理",
          icon: "international"
        }
      },
      {
        path: "/AttractInvestment", // 招商管理
        component: () => import("@/views/activity/AttractInvestment"),
        name: "AttractInvestment",
        meta: {
          title: "招商管理"
        }
      },
      {
        path: "/runActivity", // 运营活动列表
        component: () => import("@/views/activity/run_activity/list"),
        name: "runActivity",
        meta: {
          title: "运营活动",
          icon: "international"
        }
      },
      {
        path: "/runActivityDetail", // 运营活动详情
        component: () => import("@/views/activity/run_activity/detail"),
        name: "runActivityDetail",
        meta: {
          title: "运营活动详情",
          icon: "international"
        }
      }
    ]
  },
  {
    path: "/message", // 消息管理
    component: Layout,
    children: [
      {
        path: "/messageList", // 消息管理
        component: () => import("@/views/message/messageList"),
        name: "messageList",
        meta: {
          title: "消息管理",
          icon: "international"
        }
      }
    ]
  },
  {
    path: "/livePlay", // 直播列表
    component: Layout,
    children: [
      {
        path: "/livePlay", // 直播列表
        component: () => import("@/views/livePlay/livePlay"),
        name: "livePlay",
        meta: {
          title: "直播列表",
          icon: "international"
        }
      },
      {
        path: "/replay", // 回放
        component: () => import("@/views/livePlay/replay"),
        name: "replay",
        meta: {
          title: "回放列表",
          icon: "international"
        }
      }
    ]
  },
  {
    path: "/shortMessage", //  短信管理
    component: Layout,
    children: [
      {
        path: "/platform",
        component: () => import("@/views/shortMessage/platform"),
        name: "platform",
        meta: {
          title: "短信管理",
          icon: "international",
          noCache: true
        }
      },
      {
        path: "/configure",
        component: () => import("@/views/shortMessage/configure"),
        name: "configure",
        meta: {
          title: "短信配置",
          icon: "international",
          noCache: true
        }
      },
      {
        path: "/SMSOrder",
        component: () => import("@/views/shortMessage/SMSOrder"),
        name: "SMSOrder",
        meta: {
          title: "短信订单",
          icon: "international",
          noCache: true
        }
      }
    ]
  },
  {
    path: "/Sales", // 楼盘管理
    component: Layout,
    children: [
      {
        path: "/saleFloor", // 楼盘管理
        component: () => import("@/views/Sales/saleFloor"),
        name: "saleFloor",
        meta: {
          title: "楼盘管理",
          icon: "international"
        }
      },
      {
        path: "/addORupdete", // 楼盘管理新增编辑
        component: () => import("@/views/Sales/addORupdete"),
        name: "addORupdete",
        meta: {
          title: "楼盘管理新增编辑",
          icon: "international"
        }
      },
      {
        path: "/houseType", // 户型管理
        component: () => import("@/views/Sales/houseType"),
        name: "houseType",
        meta: {
          title: "户型管理",
          icon: "international"
        }
      },
      {
        path: "/crowdFunding", // 认筹管理
        component: () => import("@/views/Sales/crowdFunding"),
        name: "crowdFunding",
        meta: {
          title: "认筹管理",
          icon: "international"
        }
      }
    ]
  },
  {
    path: "/hot", // 直播列表
    component: Layout,
    children: [
      {
        path: "/hotProduct", // 爆款
        component: () => import("@/views/hot/hot"),
        name: "hot",
        meta: {
          title: "拉新赚钱",
          icon: "international"
        }
      }
    ]
  },
  {
    path: "/search", // 搜索
    component: Layout,
    children: [
      {
        path: "/keyWord", // 搜索关键词
        component: () => import("@/views/search/keyWord"),
        name: "search",
        meta: {
          title: "搜索关键词",
          icon: "international"
        }
      },
      {
        path: "/searchManagement", // 搜索记录
        component: () => import("@/views/search/searchManagement"),
        name: "searchManagement",
        meta: {
          title: "搜索记录",
          icon: "international"
        }
      }
    ]
  },
  {
    path: "/wholeCountry", // 全国特产
    component: Layout,
    children: [
      {
        path: "/addCommodity", // 商品列表
        component: () => import("@/views/wholeCountry/addCommodity"),
        name: "addCommodity",
        meta: {
          title: "商品列表",
          icon: "international"
        }
      },
      {
        path: "/commodityRegion", // 地区
        component: () => import("@/views/wholeCountry/commodityRegion"),
        name: "commodityRegion",
        meta: {
          title: "地区管理",
          icon: "international"
        }
      }
    ]
  }
];

const createRouter = () =>
  new Router({
    mode: "history",
    scrollBehavior: () => ({
      y: 0
    }),
    routes: constantRoutes
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
