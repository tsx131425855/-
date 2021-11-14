<!-- tsx 选择商品 -->
<template>
  <div class>
    <div style="margin:15px 0;">
      <el-button type="primary" @click="addproduct">添加商品</el-button>
      <el-button type="warning" @click="recommenddetele">删除</el-button>
    </div>

    <el-table
      :data="product_list"
      style="width: 100%"
      max-height="200"
      @selection-change="selectCommodity"
    >
      <el-table-column fixed type="selection" align="center" width="55" />
      <el-table-column align="center" prop="product_id" label="商品ID" />
      <el-table-column align="center" min-width="200px" prop="product_name" label="商品名称" />
      <el-table-column align="center" prop="product_price" label="销售价" />
      <el-table-column align="center" prop="product_stock" label="库存量" />
      <el-table-column min-width="200" align="center" label="排序">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-arrow-up"
            circle
            @click="move('2' ,scope.$index, 2)"
          ></el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-arrow-down"
            circle
            @click="move('1' ,scope.$index, 2)"
          ></el-button>
          <el-button
            size="mini"
            type="success"
            @click="handleGoTop(product_list,scope.$index, 7)"
          >置顶</el-button>
        </template>
      </el-table-column>
    </el-table>

    <AddCommodity
      v-if="product"
      :product_ids="product_ids"
      :channel="1"
      :agent="agent_id+''"
      :CommodityType="false"
      @shut="setProduct"
      @Selection="SelectionProduct"
    />
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { arrRoofPlacement, arrDisplacement } from "@/utils/user";
import AddCommodity from "@/components/AddCommodity";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { AddCommodity },
  props: {
    product_list: {
      type: Array,
      default: () => {
        return [];
      }
    },
    agent_id: {
      type: String,
      default: JSON.parse(localStorage.getItem("user")).agent_id
    }
  },
  data() {
    // 这里存放数据
    return {
      selectionCommodity: [],
      product: false,
      product_ids: [] // 猜你喜欢
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
    addproduct() {
      const product_ids = [];
      if (this.product_list.length > 0) {
        for (const key in this.product_list) {
          product_ids.push(this.product_list[key].product_id);
        }
      }
      this.product_ids = product_ids;
      this.product = true;
    },
    recommenddetele() {
      if (this.selectionCommodity.length > 0) {
        for (const i in this.selectionCommodity) {
          for (const key in this.product_list) {
            if (
              this.selectionCommodity[i].product_id ===
              this.product_list[key].product_id
            ) {
              this.product_list.splice(key, 1);
            }
          }
        }
      } else {
        this.$message.error("请先选中需要删除的商品");
      }
    },
    selectCommodity(val) {
      const arr = [];
      val.map(res => {
        arr.push(res);
      });
      this.selectionCommodity = arr;
    },
    move(val, index, tsx) {
      /** 上下移动 */
      if (tsx == 1) {
        this.selecteddatalist = arrDisplacement(
          val,
          this.selecteddatalist,
          index
        );
      } else {
        this.product_list = arrDisplacement(val, this.product_list, index);
      }
    },
    /**
     * 一键置顶
     */
    handleGoTop(modal, index) {
      this.product_list = arrRoofPlacement(modal, index);
    },
    setProduct() {
      this.product = false;
      this.product_ids = [];
    },
    SelectionProduct(val) {
      if (val && val.length > 0) {
        const arr = [];
        val.map(tsx => {
          Object.assign(tsx, { seckill_data: [] });
          arr.push(tsx);
        });
        this.product_list.push.apply(this.product_list, arr);
      }
      this.product = false;
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
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
</style>
