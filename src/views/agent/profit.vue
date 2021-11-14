<!-- tsx 收益 -->
<template>
  <div class="package">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="已入账" name="2"></el-tab-pane>
      <el-tab-pane label="未入帐" name="1"></el-tab-pane>
      <el-tab-pane label="已打款" name="3"></el-tab-pane>
    </el-tabs>
    <div v-if="activeName==1" class="hide">
      <span style="margin-right: 10px;">未结算总额：{{summary.amount}}</span>
      <span style="margin-right: 10px;">自营商品订单：{{summary.type1}}</span>
      <span style="margin-right: 10px;">外卖订单：{{summary.type2}}</span>
      <span>平台商品订单：{{summary.type3}}</span>
    </div>
    <div v-if="activeName==2" class="hide">
      <span style="margin-right: 10px;">已结算总额：{{summary.amount}}</span>
      <span style="margin-right: 10px;">自营商品订单：{{summary.type1}}</span>
      <span style="margin-right: 10px;">外卖订单：{{summary.type2}}</span>
      <span>平台商品订单：{{summary.type3}}</span>
    </div>
    <div v-if="activeName==3" class="hide">
      <span style="margin-right: 10px;">已打款总额：{{summary.amount}}</span>
      <span style="margin-right: 10px;">商品订单：{{summary.type1}}</span>
      <span style="margin-right: 10px;">外卖订单：{{summary.type2}}</span>
      <span>分销订单：{{summary.type3}}</span>
    </div>
    <div style="margin-bottom: 10px;">
      <span style="margin-right: 10px;">代理商</span>
      <el-select
        v-if="agent.length>0"
        v-model="agent_id"
        placeholder="请选择"
        size="mini"
        @change="page=1,getDatalist()"
      >
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <span>订单类型：</span>
      <el-select
        v-model="order_type"
        @change="page=1,getDatalist()"
        class="maright"
        placeholder="请选择订单类型"
      >
        <el-option
          v-for="item in order_typelist"
          :key="item.key"
          :label="item.text"
          :value="item.key"
        />
      </el-select>
      <span v-if="activeName==1">退款状态：</span>
      <el-select
        v-model="order_status"
        v-if="activeName==1"
        @change="page=1,getDatalist()"
        class="maright"
        placeholder="请选择退款状态"
      >
        <el-option
          v-for="item in order_statuslist"
          :key="item.key"
          :label="item.text"
          :value="item.key"
        />
      </el-select>
      <span v-if="activeName!=1">时间筛选：</span>
      <el-date-picker
        v-if="activeName!=1"
        v-model="date_type"
        type="daterange"
        :picker-options="pickerOptions"
        :clearable="false"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        @change="page=1,getDatalist()"
      />

      <el-input
        v-model="keyword"
        size="small"
        class="input gaosizuobian"
        prefix-icon="el-icon-search"
        placeholder="订单号/用户账号"
      />
      <el-button type="success" class @click="page=1,getDatalist()" icon="el-icon-search">查询</el-button>
      <el-button type="success" icon="el-icon-printer" @click="exporte">导出</el-button>
      <span v-if="activeName==1&&order_status==3" style=" float: right;">已退款订单收益为{{summary.refund}}</span>
    </div>
    <template>
      <el-table
        v-loading="loading"
        :data="datalist"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="55" />
        <el-table-column prop="type_text" label="订单类型" width="100" />
        <el-table-column prop="order_sn" label="订单号" />
        <el-table-column prop="store_name" v-if="order_type==2" label="商家名称" />
        <el-table-column prop="user_tel" v-if="order_type!=2" label="用户账号" />
        <el-table-column prop="user_nickname" label="用户昵称" />
        <el-table-column prop="create_time_date" label="下单时间" width="90" align="center" />
        <el-table-column
          v-if="activeName==2"
          prop="settle_time_date"
          label="结算时间"
          width="90"
          align="center"
        />
        <el-table-column prop="order_amount" label="订单总额" />
        <el-table-column
          v-if="role==1&&order_type==1&&activeName!=3"
          prop="order_coupon_dis"
          label="订单优惠"
        />
        <el-table-column
          v-if="role==1&&order_type==1&&activeName!=3"
          prop="agent_comm"
          label="订单收益"
        />
        <el-table-column v-if="(role==1||role==0)&&order_type!=1" prop="income" label="提成" />
        <el-table-column
          prop="platform_comm"
          v-if="role==1&&order_type==1&&activeName!=3"
          label="平台提成"
        />
        <el-table-column prop="partner_comm" v-if="role==2" label="乡镇提成" />
        <el-table-column prop="village_comm" v-if="role==3" label="村提成" />
        <el-table-column
          v-if="role==1&&order_type==1&&activeName!=3"
          prop="store_comm"
          label="自提点提成"
        />
        <el-table-column v-if="order_type==1&&activeName==1" prop="refund_text" label="退款状态" />
        <el-table-column prop="village_rebate_comm" v-if="(role==1||role==0)" label="村级粉丝佣金" />
        <!-- <el-table-column prop="refund_amount" label="退款金额" /> -->
        <el-table-column prop="order_status_text" label="订单状态" />
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

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { exporteurl, exportFile, turnDate } from "@/utils/user";
import { settlelist, listexport } from "@/api/agent";
import { pickerOptions } from "@/utils/index";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      activeName: "2",
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      loading: false,
      datalist: [],
      keyword: "",
      multipleSelection: [],
      order_type: 1,
      order_typelist: [],
      order_statuslist: [
        { key: 0, text: "未退款" },
        { key: 3, text: "已退款" }
      ],
      date_type: [
        new Date(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ],
      order_status: "",
      summary: {},
      date_type_map: [],
      role: "",
      pickerOptions: {
        shortcuts: pickerOptions
      },
      agent: [],
      agent_id: "0"
    };
  },
  // 过滤器
  filters: {},
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    handleCurrentChange(val) {
      // 页数
      this.page = val;
      console.log(`当前页: ${val}`);
      this.getDatalist();
    },
    handleSizeChange(val) {
      this.limit = val;
      console.log(`每页 ${val} 条`);
      localStorage.setItem("limit", val);
      this.page = 1;
      this.getDatalist();
    },
    handleSelectionChange(val) {
      /** 选中 */
      let arr = [];
      val.map(res => {
        arr.push(res);
      });
      this.multipleSelection = arr;
    },
    handleClick(tab, event) {
      // console.log(tab, event);
      if (this.activeName == 1) {
        this.page = 1;
        this.order_type = 1;
        this.date_type = ["", ""];
        this.order_status = "";
      } else {
        this.page = 1;
        this.order_type = 1;
        this.date_type = [
          new Date(new Date().getTime() - 3600 * 1000 * 24 * 7),
          new Date()
        ];
        this.order_status = "";
      }

      this.getDatalist();
    },
    exporte() {
      /** 导出 */
      let start_date = "";
      let stop_date = "";
      if (this.date_type[0] instanceof Date) {
        start_date = turnDate(this.date_type[0], 1);
      } else start_date = this.date_type[0];
      if (this.date_type[1] instanceof Date) {
        stop_date = turnDate(this.date_type[1], 1);
      } else stop_date = this.date_type[1];
      const url = `${exporteurl}${listexport}?settle_type=${
        this.activeName
      }&order_type=${this.order_type}&order_status=${
        this.order_status
      }&start_date=${start_date}&stop_date=${stop_date}&token=${localStorage.getItem(
        "Token"
      )}`;
      exportFile(url);
    },
    getDatalist() {
      let start_date = "";
      let stop_date = "";
      if (this.date_type[0] instanceof Date) {
        start_date = turnDate(this.date_type[0], 1);
      } else start_date = this.date_type[0];
      if (this.date_type[1] instanceof Date) {
        stop_date = turnDate(this.date_type[1], 1);
      } else stop_date = this.date_type[1];
      const data = {
        settle_type: this.activeName,
        order_type: this.order_type,
        start_date,
        stop_date,
        keyword: this.keyword,
        order_status: this.order_status,
        limit: this.limit,
        page: this.page,
        agent_id: this.agent_id
      };
      this.loading = true;
      const that = this;
      return new Promise((resolve, reject) => {
        settlelist(data).then(res => {
          this.loading = false;
          if (res.code == 1) {
            if (res.action) {
              res.action.map(val => {
                switch (val.tag) {
                  case "add":
                    if (val.display == 1) {
                      that.add = 1;
                    }
                    break;
                  case "del":
                    if (val.display == 1) {
                      that.del = 1;
                    }
                    break;
                  case "edit":
                    if (val.display == 1) {
                      that.edit = 1;
                    }
                    break;
                  default:
                    break;
                }
              });
              res.action.map(val => {
                if (val.tag == "orderexport" && val.display == 1) {
                  that.derive = 1;
                }
              });
            }
            if (res.agent_map) {
              that.agent = res.agent_map;
            }
            that.role = res.data.role;
            that.datalist = res.data.list;
            that.summary = res.data.summary;
            that.total = res.data.total;
            that.order_typelist = res.data.type_map;
            that.date_type_map = res.data.date_type_map;
            that.order_statuslist = res.data.order_status_map;
          } else if (res.code === 2) {
            that.$message.error(res.msg);
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch(error => {
        console.log(error);
      });
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    if (JSON.stringify(this.$route.query).length > 2) {
      this.activeName = this.$route.query.id.toString();
    } else {
      this.activeName = "2";
    }
    this.getDatalist();
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  ctivated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style lang='scss' scoped>
// @import url(); 引入公共css类
@import "src/styles/hide.scss";
</style>
