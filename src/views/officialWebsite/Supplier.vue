<!-- tsx 官网供应商 -->
<template>
  <div class="package">
    <div class="hide">
      <el-input v-model="keyword" class="input" prefix-icon="el-icon-search" placeholder="单行输入" />
      <!-- <el-button type="danger" class v-if="del==1" @click="delBusiness()">删除</el-button> -->
      <el-button type="success" class @click="page=1,getData()">查询</el-button>
    </div>

    <!-- 表格 -->
    <template>
      <el-table
        v-loading="loading"
        :data="dataList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="55" />
        <el-table-column align="center" prop="id" label="ID" />
        <el-table-column align="center" prop="user_name" label="姓名" />
        <el-table-column align="center" prop="phone" label="手机号" />
        <el-table-column align="center" prop="company_name" label="公司名称" />
        <el-table-column align="center" prop="add_time" label="省市区">
          <template
            slot-scope="scope"
          >{{scope.row.province_name}} {{scope.row.city_name}} {{scope.row.area_name}}</template>
        </el-table-column>
        <el-table-column align="center" prop="address" label="详细地址" />
        <el-table-column prop="create_time" label="创建时间" />
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
import { lists } from "@/api/officialWebsite";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      keyword: "",
      dataList: [],
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      loading: false
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
    handleSelectionChange(val) {
      /** 选中 */
      const arr = [];
      val.map(res => {
        arr.push(res.product_id);
      });
      this.multipleSelection = arr;
    },
    getData() {
      this.loading = true;
      const DATA = {
        keyword: this.keyword,
        type: 1,
        page: this.page,
        limit: this.limit
      };

      lists(DATA).then(res => {
        console.log(res);
        this.loading = false;
        if (res.code == 1) {
          this.dataList = res.data.list;
          this.total = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
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
  ctivated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style lang='scss' scoped>
// @import url(); 引入公共css类
@import "src/styles/hide.scss";
</style>
