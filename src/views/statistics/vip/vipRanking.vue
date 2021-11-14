<!--  -->
<template>
  <div class="package">
    <div class="hide">
      <el-button class="maright" @click="time_v=1,getDataChart()">今日</el-button>
      <el-button class="maright" @click="time_v=2,getDataChart()">本月</el-button>
      <el-button class="maright" @click="time_v=3,getDataChart()">本年</el-button>
      <div class="maright">
        买家排行
        <el-select v-model="top_rank" placeholder="请选择" class="maright" @change="getDataChart()">
          <el-option
            v-for="item in top_rank_arr"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <el-select v-model="order_rank" class="maright" placeholder="订单数量" @change="getDataChart()">
        <el-option
          v-for="item in order_rank_arr"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <Columnar :chipsdata="chaart" :max="max" :legend="legend" :x-axis="xAxis" />
    <div class="hide">
      <el-select v-if="agent.length>0" v-model="agent_id" class="maright" placeholder="请选择">
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
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
      <el-input
        v-model="keyword"
        class="input"
        prefix-icon="el-icon-search"
        placeholder="会员昵称/会员手机/会员id"
        @change="inputentry"
      />
      <el-button type="success" class="maright" @click="page=1,getDatalist()">查询</el-button>
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
        <el-table-column prop="top_num" label="排行" width="70" />
        <el-table-column prop="user_id" label="用户id" width="70" />
        <el-table-column prop="user_nickname" label="会员昵称" />
        <el-table-column prop="user_tel" label="会员手机号" />
        <el-table-column prop="user_credit" label="会员积分" />
        <el-table-column prop="identity_name" label="会员身份" />
        <el-table-column prop="user_create_time" label="会员注册时间" />
        <el-table-column prop="user_login_num" label="用户登录次数" />
        <!-- <el-table-column prop="last_time" label="最近登录时间"></el-table-column> -->
        <el-table-column prop="user_gold" label="金币余额" />
        <el-table-column prop="create_time" label="钱包余额" />
        <!-- <el-table-column prop="user_balance" label="更新时间"></el-table-column> -->
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
import { turnDate, exporteurl, sameDay, Day,exportFile } from "@/utils/user";
import {
  vipChartRanking,
  vipRanking,
  user_rank_export
} from "@/api/statistics";
import Columnar from "@/components/Columnar";

export default {
  //import引入的组件需要注入到对象中才能使用
  /* eslint-disable */
  components: { Columnar },
  data() {
    //这里存放数据
    return {
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      time_v: 1,
      top_rank: "1",
      top_rank_arr: [
        { value: "1", label: "top20" },
        { value: "2", label: "top50" }
      ],
      order_rank: "1",
      order_rank_arr: [
        { value: "1", label: "订单数量" },
        { value: "2", label: "订单总额" }
      ],
      chaartL: [],
      legend: [],
      xAxis: [],
      start_time: Day(),
      end_time: sameDay(),
      keyword: "",
      time: [Day(), sameDay()],
      keyword: "",
      chaart: {},
      xAxis: [],
      legend: [],
      vipList: [],
      max: 99,
      selectuid: [],
      multipleSelection: [],
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
    startend(val) {
      /** 获取时间 */
      if (val) {
        this.start_time = turnDate(val[0]);
        this.end_time = turnDate(val[1]);
      } else {
        this.start_time = "";
        this.end_time = "";
        this.time = [];
      }
    },
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
        arr.push(res.user_id);
      });
      this.multipleSelection = arr;
    },
    exporte() {
      /** 导出 */
      let user_id_arr;
      // if(this.multipleSelection.length>0)user_id_arr=this.multipleSelection;
      // else user_id_arr=this.selectuid;
      let url = `${exporteurl}${user_rank_export}?start_time=${
        this.start_time
      }&token=${localStorage.getItem("Token")}&agent_id=${
        this.agent_id
      }&end_time=${this.end_time}&keyword=${this.keyword}&user_id_arr=${
        this.multipleSelection
      }`;
     exportFile(url);
    },
    getDataChart() {
      const data = {
        time_v: this.time_v,
        top_rank: this.top_rank,
        agent_id: this.agent_id,
        order_rank: this.order_rank
      };
      const that = this;
      return new Promise((resolve, reject) => {
        vipChartRanking(data).then(res => {
          if (res.code == 1) {
            let obj = {
              one: res.data.list.order_total, //--订单数量
              two: res.data.list.order_amount, //--  订单价格
              three: res.data.list.rank_num //--   名称
            };
            if (res.data.list.order_total.length > 0) {
              let max = res.data.list.order_total.concat();
              that.max = max.sort(function(a, b) {
                return a - b;
              })[0][1];
            }

            that.chaart = obj;
            that.legend = res.data.list.user_explain;
            that.xAxis = res.data.list.rank_num;
            that.total = res.data.total;
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
        agent_id: this.agent_id,
        limit: this.limit
      };
      const that = this;
      this.loading = true;
      return new Promise((resolve, reject) => {
        vipRanking(data).then(res => {
          this.loading = false;
          if (res.code == 1) {
            if (res.action) {
              res.action.map(val => {
                if (val.tag == "user_rank_export" && val.display == 1) {
                  that.derive = 1;
                }
              });
            }
            if (res.agent_map) {
              that.agent = res.agent_map;
            }
            let selectuid = [];
            res.data.list.list.map(res => {
              selectuid.push(res.user_id);
            });
            that.selectuid = selectuid;
            that.vipList = res.data.list.list;
            that.total = res.data.total;
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
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getDatalist();
    this.getDataChart();
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
<style  scoped>
.package .maright {
  margin-bottom: 0;
}
</style>