<!-- tsx 回收站 -->
<template>
  <div class="package">
    <div class="hide backtsx" style="align-items: center;">
      <el-button type="primary" v-if="recovery==1" @click="recoverys(1)" size="medium ">恢复</el-button>
      <el-select v-model="agent_id" style="margin-left: 10px;" placeholder="请选择代理商">
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <el-input
        v-model="keyword"
        style="margin-left: 10px;"
        class="input"
        prefix-icon="el-icon-search"
        placeholder="商品名称/id"
      />
      <el-button
        type="success"
        size="medium "
        @click="page=1,getDatalist()"
        icon="el-icon-search"
      >查询</el-button>
    </div>
    <template>
      <el-table
        v-loading="loading"
        :data="datalist"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="55" prop="product_category_id" />
        <el-table-column prop="product_id" label="id" />
        <el-table-column prop="product_name" label="商品名称" />
        <el-table-column prop="cate_name" label="商品分类" />
        <el-table-column prop="agent_name" label="所属代理商" />
        <el-table-column prop="product_price" label="商品价格" />
        <el-table-column prop="product_stock" label="商品库存" />
        <el-table-column prop="dispatching_type" label="配送方式" />
        <el-table-column prop="is_show" label="供应商" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="recoverys(2,scope.row)">恢复</el-button>
          </template>
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

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { recoverytList, batch_recovery } from "@/api/commodity";
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
      multipleSelection: [],
      loading: false,
      agent_id: "0",
      agent: [],
      recovery: 0
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
      const arr = [];
      val.map(res => {
        arr.push(res.product_id);
      });
      this.multipleSelection = arr;
    },
    recoverys(val, tsx) {
      const that = this;
      return new Promise((resolve, reject) => {
        batch_recovery({
          product_id_str:
            val == 1 ? this.multipleSelection.toString() : tsx.product_id
        }).then(res => {
          that.loading = false;
          if (res.code == 1) {
            that.$message.success(res.msg);
            that.page = 1;
            that.getDatalist();
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
        agent_id: this.agent_id,
        limit: this.limit,
        page: this.page
      };
      this.loading = true;
      const that = this;
      return new Promise((resolve, reject) => {
        recoverytList(data).then(res => {
          this.loading = false;
          if (res.code == 1) {
            if (res.action) {
              res.action.map(val => {
                if (val.tag == "batch_recovery" && val.display == 1) {
                  that.recovery = 1;
                }
              });
            }
            if (res.agent_map) {
              that.agent = res.agent_map;
            }
            that.datalist = res.data.list;
            // that.options = res.data.status_map;
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
.input {
  width: 200px;
}
</style>
