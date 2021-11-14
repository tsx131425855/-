<!-- 商品 -->
<template>
  <div class="package">
    <div class="hide hide_title">
      <el-select v-if="options.length>0" v-model="agent_id" class="maright" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <el-dropdown @command="handleCondition">
        <el-button type="primary">
          {{ type_show1 && type_show1.text || '请选择' }}
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in screen_list"
            :key="index"
            :command="item.value"
          >{{ item.text }}</el-dropdown-item>
          <!-- <el-dropdown-item command="订单更新时间">订单更新时间</el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>

      <el-date-picker
        v-model="search_section"
        style="margin: 0 16px 0 10px;width: 390px"
        type="datetimerange"
        align="center"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
      ></el-date-picker>
      <span class="search_toast" style="margin: 0 12px 0 40px">商品状态:</span>
      <el-dropdown @command="handleCommand">
        <el-button type="primary">
          {{ type_show2 && type_show2.text || '请选择' }}
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in condition_list"
            :key="index"
            :command="item.value"
          >{{ item.text }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span class="search_toast" style="margin: 0 12px 0 40px">订单状态:</span>
      <el-dropdown @command="handleCommand2">
        <el-button type="primary">
          {{ type_show3 && type_show3.value || '请选择' }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in state_list"
            :key="index"
            :command="item.id"
          >{{ item.value }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <span class="search_toast" style="margin: 0 12px 0 40px">订单类型:</span>
      <el-select v-model="order_type">
        <el-option
          v-for="(item) in order_type_map"
          :key="item.id"
          :label="item.value"
          :value="item.id"
        ></el-option>
      </el-select>
      <div style="margin-top: 18px">
        <span class="search_toast"></span>
        <el-input
          class="input"
          v-model="keyword"
          prefix-icon="el-icon-search"
          placeholder="订单编号/用户账号/操作账号"
        ></el-input>
        <el-button type="success" @click="querySearch" icon="el-icon-search">查询</el-button>
        <el-button type="warning" v-if="derive==1" @click="exportExcel()">导出</el-button>
      </div>

      <!-- <el-button type="danger" v-if="cutoff.display==1" @click="del">删除</el-button> -->
    </div>

    <template>
      <el-table
        v-loading="loading"
        :data="dataList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column fixed type="selection" width="55"></el-table-column> -->
        <el-table-column fixed type="selection" align="center" width="55" />

        <el-table-column fixed label="操作" align="center">
          <template slot-scope="scope">
            <router-link
              class="routeLike"
              :to="{ path: `/product_detail?order_id=${scope.row.order_id}`}"
            >查看</router-link>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="160" prop="create_time" label="下单日期" />
        <el-table-column fixed align="center" prop="order_sn" min-width="160" label="商品订单编号" />
        <el-table-column fixed align="center" prop="user.user_nickname" label="用户昵称" />
        <el-table-column align="center" prop="user.user_tel" min-width="110" label="用户账号" />
        <el-table-column align="center" prop="store.name" min-width="100" label="商家名称" />
        <el-table-column align="center" prop="store.town_detail" min-width="100" label="地区" />
        <el-table-column align="center" prop="amount" min-width="100" label="订单总金额" />
        <el-table-column align="center" prop="cash" min-width="100" label="微信支付金额" />
        <el-table-column align="center" prop="charge" label="手续费" />
        <el-table-column align="center" prop="balance" min-width="100" label="余额支付金额" />
        <el-table-column align="center" prop="gold_coin" min-width="100" label="金币使用数" />
        <el-table-column align="center" prop="coupon_dis" min-width="120" label="优惠券抵扣金额" />
        <el-table-column align="center" prop="rebate_summary.rebate_balance" label="返佣余额" />
        <el-table-column align="center" prop="rebate_summary.rebate_coin" label="返佣金币" />
        <el-table-column align="center" prop="status_text" label="订单状态" />
        <el-table-column align="center" prop="is_service" label="是否申请售后" />
        <el-table-column align="center" prop="service_summary.balance" label="退余额" />
        <el-table-column align="center" prop="service_summary.cash" label="退微信" />
        <el-table-column align="center" prop="service_summary.service_charge" label="退手续费" />
        <el-table-column align="center" prop="service_summary.gold_coin" label="退金币" />
        <el-table-column
          align="center"
          prop="service_rebate_summary.service_rebate_balance"
          label="佣金-返还余额"
        />
        <el-table-column
          align="center"
          prop="service_rebate_summary.service_rebate_gold"
          label="佣金-返还金币"
        />
        <el-table-column align="center" prop="store_income" label="自提点抽成" />
        <el-table-column align="center" prop="platform_pumping" label="平台抽成" />
        <el-table-column align="center" prop="agent_name" label="代理商" />
        <!-- <el-table-column align="center" prop="create_time" label="一级代理商抽成"></el-table-column> -->
        <!-- <el-table-column align="center" prop="create_time" label="二级代理商抽成"></el-table-column> -->
        <!-- <el-table-column align="center" prop="create_time" label="三级代理商抽成"></el-table-column>-->
        -->
      </el-table>
    </template>
    <div class="block">
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 30, 40,50]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
// 提现明细
/* eslint-disable */
import { product, exportProduct } from "@/api/finance";
import { pickerOptions, parseTime } from "@/utils/index";

/* eslint-disable */
export default {
  /* eslint-disable */
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      keyword: "",
      dataList: [],
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      pageSize: 100,
      addto: {},
      cutoff: {},
      edit: {},
      condition: "", // 时间段筛选条件
      condition_list: [
        { value: 0, text: "全部" },
        { value: 1, text: "上架" },
        { value: 2, text: "下架" }
      ], //  条件列表
      search_section: [] /* 时间区段 */,
      screen_condition: 1 /* 筛选状态条件 */,
      screen_list: [
        { value: 1, text: "下单时间" },
        { value: 2, text: "更新时间" }
      ] /* 筛选条件列表 */,

      orderState: "", // 订单状态
      state_list: [], // 订单状态列表
      order_type: "", // 订单类型
      order_type_map: [], // 订单类型数组
      pickerOptions: {
        shortcuts: pickerOptions
      },
      multipleSelection: [] /** 选中 */,
      elsec: 1 /** 1添加还是 0编辑 */,
      dialogVisible: false,
      options: [] /** 所属组 */,
      form: {
        phone: "",
        groups: [],
        status: "1",
        user_id: "",
        admin: ""
      },
      groups_map: "",
      addoredit: "立即创建",
      loading: false,
      derive: "",
      agent_id:
        JSON.parse(localStorage.getItem("user")).agent_id == 1
          ? ""
          : JSON.parse(localStorage.getItem("user")).agent_id
    };
  },
  //监听属性 类似于data概念
  computed: {
    /**
     * 根据value获得对应value   -> 第一下拉菜单
     */
    type_show1() {
      let type_index = "";

      this.$data.screen_list.find((item, index) => {
        if (item.value === this.$data.screen_condition) {
          type_index = index;
          return true;
        }
      });
      return this.$data.screen_list[type_index];
    },

    /**
     * 根据value获得对应value   -> 第二下拉菜单
     */
    type_show2() {
      let type_index = "";

      this.$data.condition_list.find((item, index) => {
        if (item.value === this.$data.condition) {
          type_index = index;
          return true;
        }
      });
      return this.$data.condition_list[type_index];
    },

    /**
     * 根据value获得对应value   -> 第三下拉菜单
     */
    type_show3() {
      let type_index = "";

      this.$data.state_list.find((item, index) => {
        if (item.id === this.$data.orderState) {
          type_index = index;
          return true;
        }
      });
      return this.$data.state_list[type_index];
    }
  },
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    handleCondition(val) {
      this.$data.screen_condition = val;
      this.search_section = [];
    },
    handleCommand(value) {
      console.log(value);
      this.$data.condition = value;
    },
    handleCommand2(value) {
      console.log(value);
      this.$data.orderState = value;
    },
    handleCurrentChange(val) {
      // 页数
      this.page = val;
      console.log(`当前页: ${val}`);
      this.getData();
    },
    handleSizeChange(val) {
      this.limit = val;
      console.log(`每页 ${val} 条`);
      this.page = 1;
      this.getData();
    },
    handleSelectionChange(val) {
      /** 选中 */
      console.log(val);
      this.multipleSelection = val;
    },
    // 查看订单详情
    editClick(row) {
      console.log("当前要查看此列的数据");
      console.log(row);
    },
    getData() {
      /** 列表数据 */
      this.loading = true;
      const data = {
        day_type: this.screen_condition, // 第一个下拉框 - 时间段条件
        is_show: this.condition, // 第二个下拉框  - 状态值条件
        keywords: this.keyword,
        page: this.page,
        page_num: this.limit,
        order_status: this.orderState,
        agent_id: this.agent_id,
        order_type: this.order_type,
        start_time:
          this.search_section && this.search_section[0]
            ? parseTime(this.search_section[0])
            : "",
        end_time:
          this.search_section && this.search_section[1]
            ? parseTime(this.search_section[1])
            : "",
        agent1: "",
        agent2: "",
        agent3: ""
      };
      const that = this;
      return new Promise((resolve, reject) => {
        product(data).then(res => {
          console.log(res);
          that.loading = false;
          if (res.code == 1) {
            that.dataList = res.data.list;
            that.total = res.data.total;
            that.state_list = res.data.order_status;
            that.order_type_map = res.data.order_type;
            if (res.action) {
              res.action.map(val => {
                if (val.tag == "export" && val.display == 1) {
                  that.derive = 1;
                }
              });
            }
            if (res.agent_map) {
              that.options = res.agent_map;
            }
            // that.condition_list = res.data.status_map;
            // that.screen_list = res.data.date_map;
          } else if (res.code == 2) {
            that.$message.error(res.msg);
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch(error => {
        console.log(error);
      });
    },
    exportExcel() {
      const that = this;
      this.$confirm("请确认筛选条件是否符合", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "开始导出!"
          });

          const data = {
            day_type: this.screen_condition,
            is_show: this.condition,
            keyword: this.keyword,
            order_status: this.orderState,
            agent_id: this.agent_id,
            start_time:
              this.search_section && this.search_section[0]
                ? parseTime(this.search_section[0])
                : "",
            end_time:
              this.search_section && this.search_section[1]
                ? parseTime(this.search_section[1])
                : ""
          };
          //开启新下载窗口
          window.open(exportProduct(data));
        })
        .catch(res => {
          console.log(res);
        });
    },
    handleChange(value) {
      console.log(value);
      this.groups_map = [value[value.length - 1]];
    },
    querySearch() {
      this.page = 1;
      this.getData();
      this.saveData(true);
    },
    // 从缓存中 存/取 条件数据
    saveData(bool) {
      // 判断浏览器是否支持此功能
      if (!window.sessionStorage) {
        console.log("您的浏览器太老了， 无法兼容此条件保存功能！！");
        return;
      }

      if (bool) {
        // 为true时为保存， 反之取出
        let data =
          JSON.parse(sessionStorage.getItem("product_condition")) || {};

        data["keyword"] = this.keyword;
        data["search_section"] = this.search_section;
        data["screen_condition"] = this.screen_condition;
        data["condition"] = this.condition;
        data["orderState"] = this.orderState;
        data["agent_id"] = this.agent_id || "";
        data["options"] = this.options || [];
        // console.log("存储条件 ==》", data);

        sessionStorage.setItem("product_condition", JSON.stringify(data));
      } else {
        // 取出缓存中的条件数据
        let data = JSON.parse(sessionStorage.getItem("product_condition"));
        if (!data) return; // 如果没有缓存， 则直接退出；

        this.keyword = data["keyword"];
        this.search_section = data["search_section"];
        this.screen_condition = data["screen_condition"];
        this.condition = data["condition"];
        this.orderState = data["orderState"];
        this.agent_id = data["agent_id"] || "";
        this.options = data["options"] || [];
      }
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.saveData();
    this.getData();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
@import "src/styles/hide.scss";

.hide_title {
  .search_toast {
    font-family: "微软雅黑";
    font-size: 18px;
    margin-left: 30px;
    margin-right: 8px;
    color: #1e2024;
  }
}
.routeLike {
  color: rgba(34, 20, 235, 0.822);
}
</style>