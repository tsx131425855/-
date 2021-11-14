<!--  -->
<template>
  <div class="package">
    <div class="hide">
      <span class="maright">认筹楼盘</span>
      <el-select v-model="property" class="maright" placeholder="请选择" @change="getDataChart">
        <el-option
          v-for="item in options"
          :key="item.property_id"
          :label="item.property_name"
          :value="item.property_id"
        />
      </el-select>
      <span class="maright">认筹人数 {{ user_count }}</span>
      <span class="maright">认筹金额 {{ total_fee }}</span>
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
      <div class="maright">筛选条件</div>
      <el-select v-model="status" class="maright" placeholder="请选择">
        <el-option v-for="item in optionss" :key="item.key" :label="item.val" :value="item.key" />
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
        placeholder="楼盘名称/会员昵称/会员手机号"
        @change="inputentry"
      />
      <el-button type="success" class="maright" @click="page=1,getDatalist()">查询</el-button>
      <el-button v-if="derive==1" class="maright" plain @click="exporte">导出</el-button>
    </div>
    <template>
      <el-table
        v-loading="loading"
        :data="datalist"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" row-key="property_id" width="55" prop="property_id" />
        <el-table-column prop="user_id" label="用户id" width="70" />
        <el-table-column prop="user_nickname" label="会员昵称" />
        <el-table-column prop="user_tel" label="会员手机号" />
        <el-table-column prop="grade_name" label="会员身份" />
        <el-table-column prop="property_name" label="认筹楼盘" />
        <el-table-column prop="total_fee" label="认筹金额" />
        <el-table-column prop="total_pay_fee" label="认筹总额" />

        <el-table-column prop="add_time" label="认筹时间" width="100"/>
        <el-table-column prop="province" label="省/市/区">
          <template
            slot-scope="scope"
          >{{ scope.row.province }}{{ scope.row.city }}{{ scope.row.district }}</template>
        </el-table-column>
        <el-table-column prop="status_text" label="认筹状态" />
        <el-table-column prop="refund_pay_fee" label="退款金额" />
        <el-table-column prop="refund_add_time" label="退款时间" width="100" />
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
/* eslint-disable no-alert */
/* eslint-disable */
import { propertylist, propertychart,subscribeExport } from "@/api/statistics";
import { turnDate, exporteurl,exportFile } from "@/utils/user";
import Columnar from "@/components/Columnar";

export default {
  // import引入的组件需要注入到对象中才能使用
  /* eslint-disable */
  components: { Columnar },
  data() {
    // 这里存放数据
    return {
      property: 0,
      options: [],
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      start_time: "",
      end_time: "",
      keyword: "",
      condition: "",
      optionss: [],
      time: [new Date(new Date().setHours(0, 0, 0, 0)), new Date()],
      user_count: "",
      total_fee: "",
      chaart: {},
      legend: [],
      xAxis: [],
      datalist: [],
      multipleSelection: [],
      property_id: "",
      status: "-1",
      max: 99,
      loading: false,
      action: [],
      derive: "",
      agent:[],
      agent_id:
        JSON.parse(localStorage.getItem("user")).agent_id == 1
          ? ""
          : JSON.parse(localStorage.getItem("user")).agent_id,
    };
  },
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
    exporte() {
      /** 导出 */
      let url = `${exporteurl}${subscribeExport}?start_time=${
        this.start_time
      }&status=${this.status}&end_time=${this.end_time}&keyword=${
        this.keyword
      }&id=${this.multipleSelection}&agent_id=${this.agent_id}&token=${localStorage.getItem("Token")}`;
     exportFile(url);
    },
    getDataChart() {
      const data = {
        agent_id: this.agent_id,
        property_id: this.property
      };
      const that = this;
      return new Promise((resolve, reject) => {
        propertychart(data).then(res => {
          if (res.code == 1) {
            that.options = res.data.property_data;
            that.total = res.data.total;
            that.user_count = res.data.user_count;
            that.total_fee = res.data.total_fee;
            let obj = {
              one: res.data.subscribe_data.user_count,
              two: res.data.subscribe_data.total_fee
            };
            let max = res.data.subscribe_data.user_count.concat([]);
            if (res.data.subscribe_data.user_count.length > 0)
              that.max = max.sort(function(a, b) {
                return b - a;
              })[0];
            that.chaart = obj;
            that.legend = ["认筹人数", "认筹金额"];

            that.xAxis = res.data.subscribe_data.property_name;
            localStorage.setItem("Token", res.data.token);
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
    startend(val) {
      /** 获取时间 */
      this.start_time = turnDate(val[0]);
      this.end_time = turnDate(val[1]);
    },
    getDatalist() {
      const data = {
        page: this.page,
        start_time: this.start_time,
        end_time: this.end_time,
        keyword: this.keyword,
        limit: this.limit,
        status: this.status,
        agent_id: this.agent_id,
      };
      const that = this;
      this.loading = true;
      return new Promise((resolve, reject) => {
        propertylist(data).then(res => {
          this.loading = false;
          if (res.code == 1) {
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
            that.total = res.data.total;
            that.optionss = res.data.status_info;
            that.datalist = res.data.list;
            
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