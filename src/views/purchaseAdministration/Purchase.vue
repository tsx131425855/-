<!-- tsx 采购单 -->
<template>
  <div class="package">
    <div class="hide backtsx">
      <span class>代理商</span>
      <el-select v-model="agent_id" size="small" class="gaosizuobian" placeholder="请选择">
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <span class="gaosizuobian">状态</span>
      <el-select v-model="inbound" size="small" class="gaosizuobian" placeholder="请选择">
        <el-option
          v-for="item in inbound_map"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <span class="gaosizuobian">配送方式</span>
      <el-select v-model="shipping_type" size="small" class="gaosizuobian" placeholder="请选择">
        <el-option
          v-for="item in shipping_map"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <span class="gaosizuobian">供应商</span>
      <el-select v-model="supplier_id" size="small" class="gaosizuobian" placeholder="请选择">
        <el-option
          v-for="item in supplier_map"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <el-date-picker
        v-model="time"
        style="margin-left: 30px;"
        type="daterange"
        format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="startend"
      />
      <el-input
        v-model="keyword"
        size="small"
        class="input gaosizuobian"
        prefix-icon="el-icon-search"
        placeholder="商品名称/id"
      />
      <el-button type="success" size="small" @click="page=1,getDatalist()" icon="el-icon-search">查询</el-button>
      <el-button type="success" size="small" @click="exporte()" icon="el-icon-search">导出</el-button>
    </div>

    <template>
      <el-table
        v-loading="loading"
        :data="datalist"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="purchase_id" label="ID" width="60" />
        <el-table-column prop="purchase_sn" label="采购单号" width="100" />
        <el-table-column prop="product_id" label="商品ID" width="80" />
        <el-table-column prop="product_name" label="商品名称" />
        <el-table-column prop="attr_value_name_string" label="规格" />
        <el-table-column prop="price_yuan" label="采购单价（元）" />
        <el-table-column prop="num" label="采购数量" width="80" />
        <el-table-column prop="amount_yuan" label="采购总金额（元）" />
        <el-table-column prop="shipping_type_text" label="配送方式" width="80" />
        <el-table-column prop="supplier_name" label="供应商" />
        <el-table-column prop="supplier_phone" label="供应商电话" />
        <el-table-column prop="close_time_date" label="截单时间" width="100" />
        <el-table-column prop="inbound_text" label="是否入库" />
        <el-table-column prop="create_time_date" label="生成时间" />
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

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { exporteurl, turnDate, sameDay, Day, exportFile } from "@/utils/user";
import { supplierList, supplierExport } from "@/api/supplier";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      start_time: "",
      end_time: "",
      keyword: "",
      agent: [],
      agent_id: JSON.parse(localStorage.getItem("user")).agent_id,
      time: [turnDate(new Date(), 1), turnDate(new Date(), 1)],
      loading: false,
      multipleSelection: [],
      datalist: [],
      start_date: turnDate(new Date(), 1),
      stop_date: turnDate(new Date(), 1),
      inbound: "",
      shipping_type: "",
      supplier_id: "",
      inbound_map: [],
      shipping_map: [],
      supplier_map: []
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
        arr.push(res.product_id);
      });
      this.multipleSelection = arr;
    },
    handleClose(done) {
      done();
    },
    startend(val) {
      if (val) {
        this.start_date = turnDate(val[0], 1);
        this.stop_date = turnDate(val[1], 1);
      } else {
        this.start_date = turnDate(new Date(), 1);
        this.stop_date = turnDate(new Date(), 1);
        this.time = [turnDate(new Date(), 1), turnDate(new Date(), 1)];
      }
    },
    exporte() {
      /** 导出 */
      let url = `${exporteurl}${supplierExport}?agent_id=${
        this.agent_id
      }&keyword=${this.keyword}&start_date=${this.start_date}&stop_date=${
        this.stop_date
      }&supplier_id=${this.supplier_id}&inbound=${this.inbound}&shipping_type=${
        this.shipping_type
      }&token=${localStorage.getItem("Token")}`;
      exportFile(url);
    },
    getDatalist() {
      const that = this;
      const data = {
        agent_id: this.agent_id,
        keyword: this.keyword,
        start_date: this.start_date,
        stop_date: this.stop_date,
        inbound: this.inbound,
        shipping_type: this.shipping_type,
        supplier_id: this.supplier_id,
        page: this.page,
        limit: this.limit
      };
      return new Promise((resolve, reject) => {
        supplierList(data).then(res => {
          if (res.code == 1) {
            that.datalist = res.data.list;
            that.total = res.data.total;
            that.inbound_map = res.data.inbound_map;
            that.shipping_map = res.data.shipping_map;
            that.supplier_map = res.data.supplier_map;
            that.agent = res.agent_map;
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
