<!-- tsx 商品公共库 -->
<template>
  <div class="package">
    <div class="hide">
      <span>分类&nbsp;&nbsp;&nbsp;</span>
      <el-select v-model="cate" style="margin-bottom: 0px;" class="maright" placeholder="请选择">
        <el-option v-for="item in cate_map" :key="item.key" :label="item.value" :value="item.key" />
      </el-select>
      <span>配送方式&nbsp;&nbsp;&nbsp;</span>
      <el-select v-model="shipping" style="margin-bottom: 0px;" class="maright" placeholder="请选择">
        <el-option
          v-for="item in shipping_map"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <el-input
        v-model="keyword"
        class="input"
        prefix-icon="el-icon-search"
        placeholder="商品主标题/副标题"
      />
      <el-button type="success" class @click="page=1,getDatalist()">查询</el-button>
      <el-button type="primary" class @click="Reset()">重置</el-button>
      <el-button type="warning" @click="See()">查看</el-button>
      <el-button plain class @click="change">修改分类</el-button>
      <el-button plain class @click="garbage">转入回收站</el-button>
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
        <el-table-column prop="product_name" label="商品主标题" />
        <el-table-column prop="product_sub_name" label="商品副标题" />
        <el-table-column prop="pub_cate_name" label="分类" />
        <el-table-column prop="product_ot_price" label="市场价格" />
        <el-table-column prop="dispatching_type" label="配送方式" />
        <el-table-column prop="create_time" label="创建时间" />
        <el-table-column prop="agent_name" label="所属代理" />
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

    <PublicDialog
      v-if="dialogVisible"
      :isShowVisible="dialogVisible"
      tsxTitle="选择分类"
      tsxWidth="600px"
      @handleClose="handleClose"
    >
      <div slot="forms">
        <span>请选择：</span>
        <el-select v-model="cate_id" style="margin-bottom: 0px;" class="maright" placeholder="请选择">
          <el-option
            v-for="item in cate_map"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
        <router-link style="color:#3399CC;" :to="{ path: `/commodityBasis/libraryclass`}">无分类,前往设置</router-link>
        <div style="margin-top: 20px;">
          <el-button size="small" @click="cancel">取消</el-button>
          <el-button type="primary" size="small" @click="commitpublic">确定</el-button>
        </div>
      </div>
    </PublicDialog>
    <PublicDialog
      v-if="seeContent"
      :isShowVisible="seeContent"
      tsxWidth="80%"
      @handleClose="handleCloseinfo"
    >
      <ProductDetails
        slot="forms"
        :addedit="3"
        :info="info"
        :agent="agent"
        :other="other"
        @colse="handleCloseinfo"
      />
    </PublicDialog>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import PublicDialog from "@/components/PublicDialog";
import {
  productwarepubList,
  productwarepubedit,
  productwarepubturnrecycle,
  productwarepubView
} from "@/api/commodity";
import ProductDetails from "@/components/ProductDetails";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { PublicDialog, ProductDetails },
  data() {
    // 这里存放数据
    return {
      keyword: "",
      datalist: [],
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      loading: false,
      multipleSelection: [],
      gent: [],
      dialogVisible: false,
      seeContent: false,
      shipping: "",
      shipping_map: [],
      cate: "",
      cate_id: "",
      cate_map: [],
      info: {},
      other: {},
      agent: [],
      agent_id:
        JSON.parse(localStorage.getItem("user")).agent_id == 1
          ? "0"
          : JSON.parse(localStorage.getItem("user")).agent_id
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
    handleClose() {
      this.dialogVisible = false;
    },
    handleCloseinfo() {
      /**  关闭查看 */
      this.seeContent = false;
    },
    Reset() {
      Object.assign(this.$data, this.$options.data());
    },
    change() {
      /** 转入公共库 */
      if (this.multipleSelection.length > 0) {
        this.cate_id = "";
        this.dialogVisible = true;
      } else this.$message("请选择1条记录");
    },
    See() {
      if (this.multipleSelection.length == 1) {
        productwarepubView({
          product_id: this.multipleSelection[0]
        }).then(res => {
          if (res.code == 1) {
            this.info = res.data.info;
            this.other = res.data.other;
            this.agent = res.agent_map;
            this.seeContent = true;
          } else {
            this.$message.error(res.msg);
          }
        });
      } else this.$message("请选择1条记录");
    },
    garbage() {
      /** 回收站 */
      if (this.multipleSelection.length > 0) {
        this.$confirm("此操作将会把商品回收, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            const data = {
              product_ids: this.multipleSelection
            };
            productwarepubturnrecycle(data).then(res => {
              if (res.code == 1) {
                this.page = 1;
                this.getDatalist();
                this.$message.success(res.msg);
              } else {
                this.$message.error(res.msg);
              }
            });
          })
          .catch(() => {});
      } else this.$message("请选择1条记录");
    },
    cancel() {
      this.$confirm("内容未保存 是否确认关闭", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.dialogVisible = false;
      });
    },
    commitpublic() {
      const data = {
        product_id: this.multipleSelection,
        cate_id: this.cate_id
      };
      productwarepubedit(data).then(res => {
        if (res.code == 1) {
          this.page = 1;
          this.getDatalist();
          this.dialogVisible = false;
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getDatalist() {
      const data = {
        page: this.page,
        keyword: this.keyword,
        cate_id: this.cate,
        limit: this.limit,
        shipping: this.shipping
      };
      this.loading = true;
      const that = this;
      return new Promise((resolve, reject) => {
        productwarepubList(data).then(res => {
          this.loading = false;
          if (res.code == 1) {
            that.total = res.data.total;
            that.datalist = res.data.list;
            that.shipping_map = res.data.shipping_map;
            that.cate_map = res.data.cate_map;
            if (res.action) {
              res.action.map(val => {
                if (val.tag == "userexport" && val.display == 1) {
                  that.derive = 1;
                }
              });
            }
            if (res.agent_map) {
              that.agent = res.agent_map;
            }
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
</style>

