<!-- tsx 自提点销售 -->
<template>
  <div class="package">
    <div class="hide">
      <el-select v-model="agent_id" size="small" class placeholder="请选择代理商">
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <span class="gaosizuobian">类型</span>
      <el-select v-model="type" size="small" class="gaosizuobian" placeholder="筛选">
        <el-option
          v-for="item in statusarr"
          :key="item.value"
          :label="item.text"
          :value="item.value"
        />
      </el-select>
      <!-- <span class="gaosizuobian">下单时间:</span> -->
      <el-date-picker
        v-model="time"
        style="margin-left: 30px;"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <!-- <span class="gaosizuobian">综合搜索:</span> -->
      <el-input
        v-model="keyword"
        size="small"
        class="input gaosizuobian"
        prefix-icon="el-icon-search"
        placeholder="商家id/商家名称/商家手机号"
      />
      <el-button
        type="success"
        size="small"
        class
        @click="page=1,getDatalist()"
        icon="el-icon-search"
      >查询</el-button>
      <el-button
        v-if="daochu==1"
        type="success"
        size="small"
        icon="el-icon-search"
        @click="exporte"
      >导出</el-button>
    </div>

    <el-table v-loading="loading" :data="datalist" @sort-change="sort" style="width: 100%">
      <el-table-column fixed align="center" prop="rank" label="排行" sortable="custom" />
      <el-table-column align="center" prop="store_id" label="商家id" />
      <el-table-column align="center" prop="store_name" label="商家名称" />
      <el-table-column align="center" prop="user_tel" label="商家账号" />
      <el-table-column align="center" prop="sale_amount" label="销售额" />
      <el-table-column align="center" prop="income" label="提货收益" />
      <el-table-column align="center" prop="order_num" label="订单数量" />
      <el-table-column align="center" prop="user_num" label="下单人次" />
      <el-table-column align="center" prop="rate" label="提成比" />
      <el-table-column align="center" prop="store_time" min-width="160" label="创建时间" />
      <el-table-column align="center" prop="agent_name" label="所属代理商" />
    </el-table>

    <!-- <div class="block">
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 30, 40,50]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>-->
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { statisindex, statisexport } from "@/api/statistics";
import {
  exporteurl,
  turnDate,
  exportFile,
  sameDay,
  monthOne
} from "@/utils/user";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      keyword: "",
      datalist: [],
      agent_id: "0",
      agent: [],
      multipleSelection: [],
      loading: false,
      time: [monthOne(1), turnDate(new Date(), 3)],
      start_date: "",
      stop_date: "",
      type: 1,
      statusarr: [],
      daochu: 0,
      dire: "DESC"
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
    exporte() {
      /** 导出 */
      let start_date = "";
      let stop_date = "";
      if (this.time != null && this.time.length > 0) {
        if (this.time[0] instanceof Date) {
          start_date = turnDate(this.time[0], 3);
        }
        if (this.time[1] instanceof Date) {
          stop_date = turnDate(this.time[1], 3);
        }
      }
      const url = `${exporteurl}${statisexport}?keyword=${
        this.keyword
      }&agent_id=${this.agent_id}&dire=${this.dire}&type=${
        this.type
      }&start_date=${start_date}&stop_date=${stop_date}&token=${localStorage.getItem(
        "Token"
      )}`;
      exportFile(url);
    },
    sort(val) {
      if (val.order == "ascending") {
        // 上
        this.dire = "ASC";
      } else if (val.order == "descending") {
        // 下
        this.dire = "DESC";
      }
      this.getDatalist();
    },
    getDatalist() {
      let start_date = "";
      let stop_date = "";
      if (this.time != null && this.time.length > 0) {
        if (this.time[0] instanceof Date) {
          start_date = turnDate(this.time[0], 3);
        }
        if (this.time[1] instanceof Date) {
          stop_date = turnDate(this.time[1], 3);
        }
      }
      const data = {
        keyword: this.keyword,
        type: this.type,
        page: this.page,
        limit: this.limit,
        agent_id: this.agent_id,
        dire: this.dire,
        start_date,
        stop_date
      };
      const that = this;
      statisindex(data).then(res => {
        if (res.code == 1) {
          if (res.action) {
            res.action.map(val => {
              switch (val.tag) {
                case "export":
                  if (val.display == 1) {
                    that.daochu = 1;
                  }
                  break;
              }
            });
          }
          that.datalist = res.data.list;
          that.total = res.data.total;
          that.agent = res.agent_map;
          that.statusarr = res.data.type_map;
        } else {
          that.$message.error(res.msg);
        }
      });
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
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
