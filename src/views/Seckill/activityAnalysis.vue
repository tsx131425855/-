<!-- tsx 活动分析 -->
<template>
  <div class="package">
    <div class="backtsx" style="margin-bottom: 10px;">
      <div style="margin-bottom: 10px;">
        <span>资金统计</span>
        <el-date-picker
          v-model="time"
          style="margin-left: 30px"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        />
        <span class="gaosizuobian">所属代理</span>
        <el-select v-model="agent_id" size="small" class="gaosizuobian" placeholder="请选择">
          <el-option
            v-for="item in agent"
            :key="item.agent_id"
            :label="item.name"
            :value="item.agent_id"
          />
        </el-select>
        <el-button
          type="success"
          size="small"
          class
          icon="el-icon-search"
          @click="page=1,getData()"
        >查询</el-button>
      </div>
      <div class="ganbadie">
        <div>
          <p>
            {{Statistics.order_amount}}
            <span>元</span>
          </p>
          <span>秒杀总金额</span>
        </div>
        <div>
          <p>
            {{Statistics.product_count}}
            <span>件</span>
          </p>
          <span>参与秒杀商品数</span>
        </div>
        <div>
          <p>
            {{Statistics.order_count}}
            <span>个</span>
          </p>
          <span>订单数</span>
        </div>
      </div>
    </div>
    <div class="backtsx" style="margin-bottom: 10px;">
      <span class="gaosizuobian">所属代理</span>
      <el-select v-model="listagent_id" size="small" class="gaosizuobian" placeholder="请选择">
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <span class="gaosizuobian">状态</span>
      <el-select v-model="status" size="small" class="gaosizuobian" placeholder="请选择">
        <el-option v-for="item in statusarr" :key="item.key" :label="item.value" :value="item.key" />
      </el-select>
      <el-date-picker
        v-model="listTime"
        style="margin-left: 30px"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      />
      <el-input
        v-model="keyword"
        size="small"
        class="input gaosizuobian"
        prefix-icon="el-icon-search"
        placeholder="商品名称"
      />
      <el-button
        type="success"
        size="small"
        class
        @click="page=1,getDatalist()"
        icon="el-icon-search"
      >查询</el-button>
      <el-button type="success" icon="el-icon-printer" @click="exporte()">导出</el-button>
    </div>

    <!-- 表格 -->
    <template>
      <el-table v-loading="loading" :data="dataList" border style="width: 100%">
        <el-table-column align="center" prop="product_id" label="商品ID" />
        <el-table-column align="center" prop="product_name" label="商品名称" />
        <el-table-column align="center" prop="start_time" label="开始时间" />
        <el-table-column align="center" prop="end_time" label="结束时间" />
        <el-table-column align="center" prop="product_price" label="销售价" width="100" />
        <el-table-column align="center" prop="seckill_price" label="秒杀价" width="100" />
        <el-table-column prop="default_seckill_num" label="参与数量" />
        <el-table-column prop="completion_rate" label="完成率" />
        <el-table-column prop="finish_text" label="秒完时长" />
        <el-table-column prop="status_text" label="状态" />
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
import { pickerOptions } from "@/utils/index";
import {
  seckill_order_static,
  seckill_product_static,
  seckill_product_export
} from "@/api/Spike";
import { turnDate, exporteurl, exportFile } from "@/utils/user";
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
      dataList: [],
      loading: false,
      pickerOptions: {
        shortcuts: pickerOptions
      },
      time: [
        new Date(new Date(new Date().toLocaleDateString()).getTime()),
        new Date(
          new Date(new Date().toLocaleDateString()).getTime() +
            24 * 60 * 60 * 1000 -
            1
        )
      ],
      agent_id: "0",
      agent: [],
      Statistics: {},
      listTime: [
        new Date(new Date(new Date().toLocaleDateString()).getTime()),
        new Date(
          new Date(new Date().toLocaleDateString()).getTime() +
            24 * 60 * 60 * 1000 -
            1
        )
      ],
      listagent_id: "0",
      statusarr: [],
      status: 0
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
      let start_time = "";
      let end_time = "";
      if (this.listTime.length > 0) {
        if (this.listTime[0] instanceof Date) {
          start_time = turnDate(this.listTime[0], 3);
        }
        if (this.listTime[1] instanceof Date) {
          end_time = turnDate(this.listTime[1], 3);
        }
      }
      const url = `${exporteurl}${seckill_product_export}?keyword=${
        this.keyword
      }&agent_id=${this.listagent_id}&status=${
        this.status
      }&start_time=${start_time}&end_time=${end_time}&token=${localStorage.getItem(
        "Token"
      )}`;
      exportFile(url);
    },

    getData() {
      let start_time = "";
      let end_time = "";
      if (this.time && this.time.length > 0) {
        if (this.time[0] instanceof Date) {
          start_time = turnDate(this.time[0], 3);
        }
        if (this.time[1] instanceof Date) {
          end_time = turnDate(this.time[1], 3);
        }
      }
      const data = {
        agent_id: this.agent_id,
        start_time,
        end_time
      };
      const that = this;
      seckill_order_static(data).then(res => {
        if (res.code == 1) {
          that.Statistics = {
            order_count: res.data.order_count,
            order_amount: res.data.order_amount,
            product_count: res.data.product_count
          };
        } else {
          that.$message.error(res.msg);
        }
      });
    },
    getDatalist() {
      let start_time = "";
      let end_time = "";
      if (this.listTime && this.listTime.length > 0) {
        if (this.listTime[0] instanceof Date) {
          start_time = turnDate(this.listTime[0], 3);
        }
        if (this.listTime[1] instanceof Date) {
          end_time = turnDate(this.listTime[1], 3);
        }
      }
      const data = {
        keyword: this.keyword,
        status: this.status,
        page: this.page,
        limit: this.limit,
        agent_id: this.listagent_id,
        start_time,
        end_time
      };
      const that = this;
      seckill_product_static(data).then(res => {
        if (res.code == 1) {
          that.dataList = res.data.list;
          that.total = res.data.total;
          that.agent = res.agent_map;
          that.statusarr = res.data.status_map;
        } else {
          that.$message.error(res.msg);
        }
      });
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getData();
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
.ganbadie {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  > div {
    width: 300px;
    height: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    p {
      font-size: 20px;
      font-weight: bold;
    }
    span {
      font-size: 14px;
    }
  }
}
</style>
