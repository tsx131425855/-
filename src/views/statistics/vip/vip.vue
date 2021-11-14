<!--  -->
<template>
  <div class="package">
    <div class="bothSides">
      <div v-if="status==1">
        <div>
          <span>今日 &nbsp;&nbsp;&nbsp;</span>
          <span>新增会员总人数:{{ sunData.this_days_total }}&nbsp;</span>
          <span>新增分享进入会员人数:{{ sunData.this_days_share_total }} &nbsp;</span>
          <span>新增搜索进入会员人数:{{ sunData.this_days_default_total }}</span>
        </div>
        <div>
          <span>昨日 &nbsp;&nbsp;&nbsp;</span>
          <span>新增会员总人数:{{ sunData.last_days_total }}&nbsp;</span>
          <span>新增分享进入会员人数:{{ sunData.last_days_share_total }} &nbsp;</span>
          <span>新增搜索进入会员人数:{{ sunData.last_days_default_total }}</span>
        </div>
      </div>
      <div v-else>
        <div>
          <span>本月 &nbsp;&nbsp;&nbsp;</span>
          <span>新增会员总人数:{{ sunData.this_month_total }}&nbsp;</span>
          <span>新增分享进入会员人数:{{ sunData.this_month_share_total }} &nbsp;</span>
          <span>新增搜索进入会员人数:{{ sunData.this_month_default_total }}</span>
        </div>
        <div>
          <span>上日 &nbsp;&nbsp;&nbsp;</span>
          <span>新增会员总人数:{{ sunData.last_month_total }}&nbsp;</span>
          <span>新增分享进入会员人数:{{ sunData.last_month_share_total }} &nbsp;</span>
          <span>新增搜索进入会员人数:{{ sunData.last_month_default_total }}</span>
        </div>
      </div>
      <div>
        <el-button type="primary" round @click="status=1,getVipChart()">今日</el-button>
        <el-button round @click="status=2,getVipChart()">本月</el-button>
      </div>
    </div>
    <BrokenLineDiagram ref="bld" :chart-data="vipData" :max="max" :x-axis="xAxis" :legend="legend" />

    <div class="hide">
      <el-select v-if="agent.length>0" v-model="agent_id" class="maright" placeholder="请选择">
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <el-input
        v-model="keyword"
        class="input"
        prefix-icon="el-icon-search"
        placeholder="会员昵称/会员手机/会员id"
        @change="inputentry"
      />
      <el-select v-model="identity_state" class="maright" placeholder="请选择身份">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="time_v" placeholder="时间状态" class="maright">
        <el-option v-for="item in times" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-date-picker
        v-model="time"
        class="maright"
        type="datetimerange"
        format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="startend"
      />
      <el-button type="success" class="maright" @click="page=1,getData()">查询</el-button>
      <el-button v-if="derive==1" class="maright" plain @click="exporte">导出</el-button>
    </div>
    <template>
      <el-table
        v-loading="loading"
        :data="vipList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="55" />
        <el-table-column prop="user_id" label="用户id" width="70" />
        <el-table-column prop="user_nickname" label="会员昵称" />
        <el-table-column prop="user_tel" label="会员手机号" />
        <el-table-column prop="user_credit" label="会员积分" />
        <el-table-column prop="user_create_time" label="会员注册时间" />
        <el-table-column prop="user_login_num" label="用户登录次数" />
        <el-table-column prop="user_lasttime" label="最近登录时间" />
        <el-table-column prop="user_gold" label="金币余额" />
        <el-table-column prop="user_balance" label="钱包余额" />
        <el-table-column prop="grade_name" label="会员等级" />
        <el-table-column prop="user_source_name" label="注册方式" />
        <el-table-column prop="share_num" label="粉丝数量" />
        <el-table-column prop="top_user_name" label="分销上级" />
        <el-table-column prop="user_yesno_name" label="会员状态" />
        <el-table-column prop="yh_price" label="累计优惠" />
        <el-table-column prop="count" label="累计订单数量" />
        <el-table-column prop="amount" label="累计消费金额" />
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
/* eslint-disable */
import { vipChart, vipSurface, user_accout_export } from "@/api/statistics";
import echarts from "echarts";
import BrokenLineDiagram from "@/components/BrokenLineDiagram";
import { turnDate, exporteurl, sameDay, Day,exportFile } from "@/utils/user";

// require('../config/dev.env')
/* eslint-disable no-alert */
/* eslint-disable */
require("echarts/theme/macarons"); // echarts theme
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    BrokenLineDiagram
  },
  data() {
    //这里存放数据  localStorage.getItem("limit") ?localStorage.getItem("limit"): 10,
    return {
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      pageSize: 100,
      vipData: {},
      status: 1, // 状态 1：今日 2：本月
      sunData: {},
      xAxis: [],
      legend: [],
      options: [
        {
          value: "1",
          label: "全部"
        },
        {
          value: "2",
          label: "自提点商家"
        },
        {
          value: "3",
          label: "线下购商家"
        },
        {
          value: "4",
          label: "服务商家"
        },
        {
          value: "5",
          label: "普通会员"
        }
      ],
      times: [
        {
          value: "1",
          label: "注册时间"
        },
        {
          value: "2",
          label: "登录时间"
        },
        {
          value: "3",
          label: "下单时间"
        }
      ],
      identity_state: "1",
      time_v: "1",
      keyword: "",
      time: [Day(), sameDay()],
      vipList: [],
      multipleSelection: [],
      notSelection: [], // ---列表userid
      start: Day(), // 开始时间
      end: sameDay(), // 结束时间
      max: 99,
      loading: false,
      derive: "",
      agent: [],
      agent_id:
        JSON.parse(localStorage.getItem("user")).agent_id == 1
          ? ""
          : JSON.parse(localStorage.getItem("user")).agent_id
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    handleCurrentChange(val) {
      // 页数
      this.page = val;
      console.log(`当前页: ${val}`);
      this.getData();
    },
    handleSizeChange(val) {
      this.limit = val;
      console.log(`每页 ${val} 条`);
      localStorage.setItem("limit", val);
      this.page = 1;
      this.getData();
    },
    inputentry(e) {
      // 搜索 输入
      this.keyword = e;
    },
    handleSelectionChange(val) {
      /** 选中 */
      // this.multipleSelection = val;
      let arr = [];
      val.map(res => {
        arr.push(res.user_id);
      });
      this.multipleSelection = arr;
    },
    startend(val) {
      /** 获取时间 */
      if (val) {
        this.start = turnDate(val[0]);
        this.end = turnDate(val[1]);
      } else {
        this.time = [];
        this.start = "";
        this.end = "";
      }
    },
    exporte() {
      /** 导出 */

      let url = `${exporteurl}${user_accout_export}?start_time=${
        this.start
      }&end_time=${this.end}&agent_id=${this.agent_id}&keyword=${
        this.keyword
      }&identity_state=${this.identity_state}&time_v=${
        this.time_v
      }&user_id_arr=${this.multipleSelection}&token=${localStorage.getItem(
        "Token"
      )}`;
     exportFile(url);
    },
    getData() {
      const data = {
        keyword: this.keyword,
        identity_state: this.identity_state,
        time_v: this.time_v,
        start_time: this.start,
        end_time: this.end,
        limit: this.limit,
        agent_id: this.agent_id,
        page: this.page
      };
      const that = this;
      this.loading = true;
      return new Promise((resolve, reject) => {
        vipSurface(data).then(res => {
          this.loading = false;
          if (res.code == 1) {
            that.vipList = res.data.list.list;
            let arr = [];
            res.data.list.list.map(res => {
              arr.push(res.user_id);
            });
            that.notSelection = arr;
            if (res.action) {
              res.action.map(val => {
                if (val.tag == "user_accout_export" && val.display == 1) {
                  that.derive = 1;
                }
              });
            }
            if (res.agent_map) {
              that.agent = res.agent_map;
            }
            that.total = res.data.list.total;
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
    getVipChart() {
      const data = {
        agent_id: this.agent_id,
        status: this.status
      };
      const that = this;
      return new Promise((resolve, reject) => {
        vipChart(data).then(res => {
          // console.log(res.data)
          if (res.code == 1) {
            that.sunData = res.data.list;
            let user_explain = res.data.list.this_detail.user_explain.split(
              ","
            );
            let days_arr = res.data.list.this_detail.days_arr.split(",");
            let days_default_total = res.data.list.this_detail.days_default_total.split(
              ","
            );
            let days_share_total = res.data.list.this_detail.days_share_total.split(
              ","
            );
            let days_total_all = res.data.list.this_detail.days_total_all.split(
              ","
            );
            // let obj={ [user_explain[0]]: days_total_all, [user_explain[1]]: days_share_total, [user_explain[2]]: days_default_total}
            let obj = {
              one: days_total_all,
              two: days_share_total,
              three: days_default_total
            };
            let max = days_total_all.concat([]);
            that.max = max.sort(function(a, b) {
              return b - a;
            })[0];
            that.vipData = obj;
            that.sunData = res.data.list;
            that.xAxis = days_arr;
            that.legend = user_explain;
            that.$refs.bld.initChart();
          } else if (res.code === 2) {
            that.$message.error(res.msg);
            that.$store.dispatch("logout").then(() => {
              location.reload(); //
            });
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
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getData();
    this.getVipChart();
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
</style>