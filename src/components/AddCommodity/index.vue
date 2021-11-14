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
        <span v-show="CommodityType">商品类型</span>
        <el-select
          v-show="CommodityType"
          v-model="product_type"
          style="width: 120px;"
          size="small"
          class="gaosizuobian"
          placeholder="筛选"
          @change="productSelect"
        >
          <el-option
            v-for="item in product_cate"
            :key="item.product_cate_id"
            :label="item.product_cate_name"
            :value="item.product_cate_id"
          />
        </el-select>
        <span>分类</span>
        <el-select
          v-model="cate_id"
          style="width: 120px;"
          size="small"
          class="gaosizuobian"
          placeholder="筛选"
        >
          <el-option
            v-for="item in classData"
            :key="item.cate_id"
            :label="item.cate_name"
            :value="item.cate_id"
          />
        </el-select>
        <span>关键字筛选</span>
        <el-select
          v-model="keyword_type"
          style="width: 120px;"
          size="small"
          class="gaosizuobian"
          placeholder="筛选"
        >
          <el-option
            v-for="item in keyword_type_selce"
            :key="item.type_id"
            :label="item.type_name"
            :value="item.type_id"
          />
        </el-select>
        <el-input
          v-model="keyword"
          size="small"
          class="input"
          style="width: 200px;margin-left: 20px;"
          prefix-icon="el-icon-search"
          placeholder="商品名称/id"
        />
        <el-button @click="page=1,getDatalist()" type="success">查询</el-button>
        <el-button @click="handleClose()" type="danger">取 消</el-button>
        <el-button type="primary" @click="getDataId()">确 定</el-button>
      </div>

      <template>
        <el-table
          :data="datalist"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column label="ID" width="60" type="selection" />
          <el-table-column prop="product_type" label="商品类型" width="120" />
          <el-table-column prop="product_id" label="商品ID" />
          <el-table-column prop="product_name" label="商品名称" />
          <el-table-column prop="product_price" label="商品价格" />
          <el-table-column prop="product_stock" label="商品库存" width="80" />
          <!-- <el-table-column v-if="product_type==1" prop="is_show" label="是否上架" width="100">
            <template slot-scope="scope">{{scope.row.is_show==1?'上架':'未上架'}}</template>
          </el-table-column>
          <el-table-column v-if="product_type==1" prop="is_recommend" label="是否推荐">
            <template slot-scope="scope">{{scope.row.is_recommend==1?'推荐':'未推荐'}}</template>
          </el-table-column>-->
          <!-- <el-table-column prop="add_time" label="创建时间" /> -->
          <el-table-column prop="product_remark" label="备注" />
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
    </el-dialog>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { product_list } from "@/api/Spike";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    // dialogVisible: {
    //   type: Boolean,
    //   default: false
    // }
    product_ids: {
      type: Array,
      default: () => {
        return [];
      }
    },
    agent: {
      type: String,
      default: JSON.parse(localStorage.getItem("user")).agent_id
    },
    maxWidth: {
      type: String,
      default: "1200px"
    },
    channel: {
      type: Number,
      default: 0
    },
    CommodityType: {
      type: Boolean,
      default: true
    }
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
      product_type: 1,
      cate_id: 0,
      keyword_type: "product_name",
      product_cate: [],
      product_category_data: [],
      store_category_data: [],
      classData: [],
      keyword_type_selce: []
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
      val.map(res => {
        arr.push(res);
      });
      this.multipleSelection = arr;
    },
    getDataId() {
      this.$emit("Selection", this.multipleSelection);
    },
    productSelect(val) {
      if (val == 1) this.classData = this.product_category_data;
      else this.classData = this.store_category_data;
    },
    getDatalist() {
      const that = this;
      const data = {
        product_ids: this.product_ids,
        keyword: this.keyword,
        page: this.page,
        limit: this.limit,
        agent_id: this.agent,
        product_type: this.product_type,
        cate_id: this.cate_id,
        keyword_type: this.keyword_type,
        channel: this.channel
      };
      return new Promise((resolve, reject) => {
        product_list(data).then(res => {
          if (res.code == 1) {
            that.datalist = res.data.list;
            that.total = res.data.count;
            that.product_cate = res.data.product_cate;
            that.product_category_data = res.data.product_category_data;
            that.store_category_data = res.data.store_category_data;
            that.keyword_type_selce = res.data.keyword_type;
            if (that.product_type == 1) {
              that.classData = that.product_category_data;
            } else that.classData = that.store_category_data;
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
