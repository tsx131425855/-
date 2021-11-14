<!-- 装修tsx -->
<template>
  <div class="package">
    <div class="bothSides">
      <div>
        <el-button round @click="status=1,getDataChart()">本月</el-button>
        <el-button round @click="status=2,getDataChart()">上月</el-button>
        <el-button round @click="status=3,getDataChart()">本年</el-button>
      </div>
    </div>
    <CakeLike :cakedata="renovationData" :legend="legend" />
    <div class="hide">
      <el-select v-if="agent.length>0" v-model="agent_id" class="maright" placeholder="请选择">
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <div class="maright">筛选条件</div>
      <el-select v-model="statuss" class="maright" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-model="time"
        class="maright"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="startend"
      />
      <el-input
        v-model="keyword"
        class="input"
        prefix-icon="el-icon-search"
        placeholder="案例名称/案例id/公司名称/手机号码"
        @change="inputentry"
      />
      <el-button type="success" class="maright" @click="page=1,getDatalist()">查询</el-button>
      <el-button v-if="derive==1" class="maright" plain @click="exporte">导出</el-button>
    </div>
    <template>
      <el-table
        v-loading="loading"
        :data="listdata"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column
          fixed
          type="selection"
          row-key="property_id"
          width="55"
          prop="property_id"
        ></el-table-column>-->

        <el-table-column prop="id" label="订单编号" width="90" />
        <el-table-column prop="order_status" label="订单状态" />
        <el-table-column prop="user_nickname" label="会员昵称" />
        <el-table-column prop="user_tel" label="手机号码" />
        <el-table-column prop="pay_time" label="付款时间" width="100" />
        <el-table-column prop="pay_total" label="付款金额" />
        <el-table-column prop="finished" label="余额支付" />
        <el-table-column prop="pay_platform" label="微信支付" />
        <el-table-column prop="decoration_name" label="预约案例" />
        <el-table-column prop="company_name" label="装修公司" />
        <el-table-column prop="sign_money" label="签约金额" />
        <el-table-column prop="property_name" label="楼盘小区" />
        <el-table-column prop="refund_money" label="退款金额" />
        <el-table-column prop="refund_time" label="退款时间" width="100" />
        <el-table-column prop="agent_name" label="代理商" />
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
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
/* eslint-disable */

import {
  renovationlist,
  renovationchart,
  DecorationSubscribe
} from "@/api/statistics";
import { turnDate, exporteurl, Day, sameDay,exportFile } from "@/utils/user";
import CakeLike from "@/components/CakeLike";
export default {
  /* eslint-disable */

  // import引入的组件需要注入到对象中才能使用
  components: { CakeLike },
  data() {
    // 这里存放数据
    return {
      renovationData: {},
      legend: [],
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      status: 1,
      options: [],
      time: [new Date(new Date().setHours(0, 0, 0, 0)), new Date()],
      keyword: "",
      statuss: "0",
      listdata: [],
      start_time: sameDay(),
      end_time: sameDay(),
      loading: false,
      multipleSelection: [],
      derive: "",
      agent: [],
      agent_id:
        JSON.parse(localStorage.getItem("user")).agent_id == 1
          ? ""
          : JSON.parse(localStorage.getItem("user")).agent_id
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
    inputentry(e) {
      // 搜索 输入
      this.keyword = e;
    },
    handleSelectionChange(val) {
      /** 选中 */
      let arr = [];
      val.map(res => {
        arr.push(res.id);
      });
      this.multipleSelection = arr;
    },
    startend(val) {
      /** 获取时间 */
      if (val) {
        this.start_time = turnDate(val[0]);
        this.end_time = turnDate(val[1]);
      } else {
        this.start_time = sameDay();
        this.end_time = sameDay();
        this.time = [sameDay(), sameDay()];
      }
    },
    exporte() {
      /** 导出 */
      let url = `${exporteurl}${DecorationSubscribe}?order_status=${
        this.statuss
      }&start_time=${this.start_time}&end_time=${this.end_time}&keyword=${
        this.keyword
      }&id=${this.multipleSelection}&agent_id=${
        this.agent_id
      }&token=${localStorage.getItem("Token")}`;
     exportFile(url);
    },
    getDataChart() {
      const data = {
        agent_id: this.agent_id,
        date: this.status
      };
      const that = this;
      this.loading = true;
      return new Promise((resolve, reject) => {
        renovationchart(data).then(res => {
          this.loading = false;
          if (res.code == 1) {
            that.sunData = res.data.summary_data;
            let obj = {
              one: res.data[0],
              two: res.data[1],
              three: res.data[2]
            };
            that.renovationData = obj;
            that.legend = res.data.charts_name;
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
    },
    getDatalist() {
      const data = {
        keyword: this.keyword,
        start_time: this.start_time,
        end_time: this.end_time,
        page: this.page,
        limit: this.limit,
        order_status: this.statuss,
        agent_id: this.agent_id
      };
      const that = this;
      return new Promise((resolve, reject) => {
        renovationlist(data).then(res => {
          if (res.code == 1) {
            that.listdata = res.data.list;
            let arr = [];
            let i = 0;
            if (res.action) {
              res.action.map(val => {
                if (val.tag == "export" && val.display == 1) {
                  that.derive = 1;
                }
              });
            }
            if (res.agent_map) {
              that.agent = res.agent_map;
            }
            for (i in res.data.order_status) {
              arr.push({ value: i, label: res.data.order_status[i] });
            }
            that.options = arr;
            that.total = res.data.count;
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
    this.getDataChart();
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
  activated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
@import "src/styles/hide.scss";
</style>