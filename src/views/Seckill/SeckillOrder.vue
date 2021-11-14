<!-- tsx 秒杀订单 -->
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
      <span class="gaosizuobian">订单状态:</span>
      <el-select v-model="status" size="small" class="gaosizuobian" placeholder="筛选">
        <el-option v-for="item in statusarr" :key="item.key" :label="item.val" :value="item.key" />
      </el-select>
      <span class="gaosizuobian">下单时间:</span>
      <el-date-picker
        v-model="time"
        style="margin-left: 30px;"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <span class="gaosizuobian">综合搜索:</span>
      <el-input
        v-model="keyword"
        size="small"
        class="input gaosizuobian"
        prefix-icon="el-icon-search"
        placeholder="商品名称/订单编号/手机号"
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

    <template>
      <el-table v-loading="loading" :data="datalist" border style="width: 100%">
        <el-table-column fixed align="center" prop="order_id" label="ID" />
        <!-- <el-table-column align="center" prop="agent_name" width="160" label="代理商" /> -->
        <el-table-column fixed width="190" align="center" label="订单编号">
          <template slot-scope="scope">
            <router-link
              style="color: rgb(110,180,228);"
              :to="{ path: `/order_detail?order_id=${scope.row.order_id}`,query: {type: 1}}"
            >{{ scope.row.order_sn }}</router-link>
          </template>
        </el-table-column>
        <el-table-column fixed align="center" prop="user.user_tel" min-width="110" label="下单账号" />
        <el-table-column align="center" min-width="180" label="商品名称">
          <template slot-scope="scope">
            <div class="scope">
              <div
                class="scopeItem"
                v-for="(item, index) in scope.row.product"
                :key="index + item.product_name"
              >{{ item.product_name }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="180" label="规格*数量">
          <template slot-scope="scope">
            <div class="scope">
              <div
                class="scopeItem"
                v-for="(item, index) in scope.row.product"
                :key="index"
              >{{ item.product_attr_value_name_string }}*{{item.number}}</div>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" prop="gold_coin" label="金币(元)" />
        <el-table-column align="center" prop="balance" label="余额(元)" />-->
        <el-table-column align="center" prop="amount_pay" label="实付(元)" />
        <!-- <el-table-column align="center" prop="agent_comm" label="订单收益" />
        <el-table-column align="center" prop="retail" label="分销佣金" />
        <el-table-column align="center" prop="type_text" label="类型" />
        <el-table-column align="center" prop="self_text" label="配送方式" />-->
        <el-table-column align="center" prop="user.user_tel" label="下单手机" />
        <el-table-column align="center" prop="status_text" label="交易状态" />
        <el-table-column align="center" prop="create_time" min-width="160" label="下单时间" />
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
import { seckill_order_list, seckillexport } from "@/api/Spike";
import {
  exporteurl,
  turnDate,
  exportFile,
  arrRoofPlacement
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
      time: [],
      start_time: "",
      end_time: "",
      status: 99,
      statusarr: [],
      daochu: 0
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
      if (this.time.length > 0) {
        if (this.time[0] instanceof Date) {
          start_time = turnDate(this.time[0], 3);
        }
        if (this.time[1] instanceof Date) {
          end_time = turnDate(this.time[1], 3);
        }
      }
      const url = `${exporteurl}${seckillexport}?keyword=${
        this.keyword
      }&agent_id=${this.agent_id}&status=${
        this.status
      }&start_time=${start_time}&end_time=${end_time}&token=${localStorage.getItem(
        "Token"
      )}`;
      exportFile(url);
    },
    getDatalist() {
      let start_time = "";
      let end_time = "";
      if (this.time.length > 0) {
        if (this.time[0] instanceof Date) {
          start_time = turnDate(this.time[0], 3);
        }
        if (this.time[1] instanceof Date) {
          end_time = turnDate(this.time[1], 3);
        }
      }

      const data = {
        keyword: this.keyword,
        status: this.status,
        page: this.page,
        limit: this.limit,
        agent_id: this.agent_id,
        start_time,
        end_time
      };
      const that = this;
      seckill_order_list(data).then(res => {
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
          that.total = res.data.count;
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
