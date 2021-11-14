<!-- tsx商品销量明细 -->
<template>
  <div class="package">
    <div class="hide">
      <el-select v-if="agent.length>0" v-model="agent_id" class="maright" placeholder="请选择">
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <el-select v-model="address_type" class="maright" placeholder="请选择">
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
        type="daterange"
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
        placeholder="商品名称/id"
        @change="inputentry"
      />
      <el-button type="success" class="maright" @click="page=1,getData()">查询</el-button>
      <el-button v-if="derive==1" class="maright" plain @click="exporte">导出</el-button>
    </div>

    <div v-if="sunData" class="hide">
      <!-- <span class="maright">上架商品数</span> -->
      <span class="maright">下单商品数量 {{ sunData.order_product_num }}</span>
      <span class="maright">销量 {{ sunData.sales }}</span>
      <span class="maright">下单人数 {{ sunData.buyer_num }}</span>
      <span class="maright">合计金额 {{ sunData.total_amount }}</span>
    </div>

    <template>
      <el-table
        v-loading="loading"
        :data="datalist"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          fixed
          type="selection"
          row-key="property_id"
          width="55"
          prop="property_id"
        />
        <el-table-column prop="rank" label="销量排名" width="90" />
        <el-table-column prop="product_id" label="商品ID" />
        <el-table-column prop="product" label="商品名称">
          <template slot-scope="scope">{{ scope.row.product.product_name }}</template>
        </el-table-column>
        <el-table-column prop="min_price" label="商品最低价" width="100" />
        <el-table-column prop="avg_price" label="商品均价" width="100" />
        <el-table-column prop="max_price" label="商品最高价" />
        <el-table-column prop="sales" label="销售数量" width="100" />
        <el-table-column prop="total_amount" label="合计金额" />
        <el-table-column prop="cur_product_start_time" label="上架时间" width="100" />
        <el-table-column prop="address_type" label="配送方式" width="100" />
        <el-table-column prop="product" label="商品分类">
          <template slot-scope="scope">{{ scope.row.product.cate_name }}</template>
        </el-table-column>
        <el-table-column prop="agent_name" label="代理商" />
        <el-table-column prop="product" label="状态" width="100">
          <template slot-scope="scope">{{ scope.row.product.is_show==1?"上架":"下架" }}</template>
        </el-table-column>
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
import { statisRank2, export2 } from "@/api/statistics";
import { turnDate, exporteurl, sameDay, Day,exportFile } from "@/utils/user";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      address_type: "3",
      datalist: [],
      sunData: [],
      options: [
        { value: "1", label: "物流" },
        { value: "2", label: "自提" },
        { value: "3", label: "全部" }
      ],
      keyword: "",
      time: [Day(), sameDay()],
      multipleSelection: [],
      derive: "",
      start_time: Day(),
      end_time: sameDay(),
      loading: false,
      agent_id:
        JSON.parse(localStorage.getItem("user")).agent_id == 1
          ? ""
          : JSON.parse(localStorage.getItem("user")).agent_id,
      agent: []
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
      let arr = [];
      val.map(res => {
        arr.push(res.order_id);
      });
      this.multipleSelection = arr;
    },
    startend(val) {
      /** 获取时间 */
      if (val) {
        console.log(val);
        this.start_time = turnDate(val[0], "1");
        this.end_time = turnDate(val[1], "1");
      } else {
        this.start_time = "";
        this.end_time = "";
        this.time = [];
      }
    },
    exporte() {
      /** 导出 */
      let url = `${exporteurl}${export2}?address_type=${
        this.address_type
      }&keywords=${this.keyword}&agent_id=${this.agent_id}&start_time=${
        this.start_time
      }&end_time=${this.end_time}&product_ids=${
        this.multipleSelection
      }&token=${localStorage.getItem("Token")}`;
      exportFile(url);
    },
    getData() {
      const data = {
        start_time: this.start_time,
        end_time: this.end_time,
        address_type: this.address_type,
        page_num: this.limit,
        agent_id: this.agent_id,
        keywords: this.keyword,
        page: this.page
      };
      this.loading = true;
      const that = this;
      return new Promise((resolve, reject) => {
        statisRank2(data).then(res => {
          this.loading = false;
          if (res.code == 1) {
            if (res.action) {
              res.action.map(val => {
                if (val.tag == "export2" && val.display == 1) {
                  that.derive = 1;
                }
              });
            }
            if (res.agent_map) {
              that.agent = res.agent_map;
            }
            that.sunData = res.data.stat_product;
            that.datalist = res.data.list;
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
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getData();
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