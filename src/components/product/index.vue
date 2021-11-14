<!-- tsx -->
<template>
  <div class="package">
    <el-dialog
      title="添加商品"
      :visible.sync="dialogVisible"
      :width="maxWidth"
      :modal="false"
      center
      :before-close="handleClose"
    >
      <div class style="margin-bottom: 20px;">
        <span>分类</span>
        <el-select
          v-model="category_id"
          style="width: 120px;"
          size="small"
          class="gaosizuobian"
          placeholder="筛选"
        >
          <el-option
            v-for="item in category_map"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>

        <el-input
          v-model="keyword"
          size="small"
          class="input"
          style="width: 200px;margin-left: 20px;"
          prefix-icon="el-icon-search"
          placeholder="名称/id"
        />
        <el-button @click="page=1,getDatalist()" type="success">查询</el-button>
        <el-button @click="handleClose()" type="danger">取 消</el-button>
        <el-button type="primary" @click="getDataId()">确 定</el-button>
      </div>

      <el-table
        v-if="module_id!=9"
        :data="datalist"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="ID" width="60" type="selection" />
        <el-table-column prop="product_id" label="商品ID" />
        <el-table-column prop="product_name" label="商品名称" />
        <el-table-column prop="product_price" label="商品价格" />
        <el-table-column prop="product_stock" label="商品库存" />
      </el-table>

      <el-table
        v-else
        :data="datalist"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="ID" width="60" type="selection" />
        <el-table-column prop="id" label="商家ID" />
        <el-table-column prop="store_name" label="商家名称" />
        <el-table-column prop="store_category_name" label="商家分类" />
        <el-table-column prop="disable_text" label="商家状态" />
        <el-table-column prop="service_percent" label="抽成" />
        <el-table-column prop="address" label="所属地区" />
      </el-table>

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
    </el-dialog>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { product_list } from "@/api/indexPageSet/newIndex";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    module_id: {
      type: Number,
      default: 0,
    },
    product_ids: {
      type: Array,
      default: () => {
        return [];
      },
    },
    agent: {
      type: String,
      default: JSON.parse(localStorage.getItem("user")).agent_id,
    },
    maxWidth: {
      type: String,
      default: "1200px",
    },
  },
  data() {
    // 这里存放数据
    return {
      limit: 10,
      total: 0,
      page: 1,
      datalist: [],
      keyword: "",
      dialogVisible: true,
      product_cate: [],
      product_category_data: [],
      store_category_data: [],
      classData: [],
      keyword_type_selce: [],
      category_id: 0,
      category_map: [],
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
    handleClose(done) {
      this.$emit("shut", {});
      if (done) done();
    },
    handleSelectionChange(val) {
      /** 选中 */
      const arr = [];
      val.map((res) => {
        arr.push(res);
      });
      this.multipleSelection = arr;
    },
    getDataId() {
      this.$emit("Selection", this.multipleSelection);
    },
    getDatalist() {
      const that = this;
      const data = {
        product_id_arr: this.product_ids,
        keyword: this.keyword,
        page: this.page,
        limit: this.limit,
        agent_id: this.agent,
        category_id: this.category_id,
        module_id: this.module_id,
      };
      return new Promise((resolve, reject) => {
        product_list(data).then((res) => {
          if (res.code == 1) {
            that.datalist = res.data.product_data;
            that.total = res.data.total;
            that.category_map = res.data.category_map;
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch((error) => {
        console.log(error);
      });
    },
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
  ctivated() {}, // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style lang='scss' scoped>
// @import url(); 引入公共css类
@import "src/styles/hide.scss";
</style>
