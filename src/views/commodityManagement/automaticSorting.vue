<!-- tsx自动排序设置 -->
<template>
  <div class="package">
    <div class="backtsx" style="margin-bottom: 10px;">
      <div style="margin-bottom: 10px;">
        <span style="font-weight: bold;">自动排序设置</span>
      </div>
      <div style="margin-bottom: 10px;">
        <el-select v-model="agent_id" @change="page=1,getDatalist()" placeholder="请选择代理商">
          <el-option
            v-for="item in agent"
            :key="item.agent_id"
            :label="item.name"
            :value="item.agent_id"
          />
        </el-select>
        <span style="margin-left: 10px;">轮播间隔</span>
        <el-input v-model="interval_time" class="input" style="width:100px" placeholder="单行输入" />分钟
        <span style="margin-left: 10px;">排序值范围</span>
        <el-input v-model="min_sort" class="input" placeholder="单行输入" style="width:100px" />
        <span>-</span>
        <el-input v-model="max_sort" class="input" placeholder="单行输入" style="width:100px" />
        <span>排序</span>
        <el-radio value="1" label="1">随机</el-radio>
      </div>
      <div>
        <el-button @click="conmit" size="small" type="success">保存</el-button>
      </div>
    </div>
    <div class="backtsx">
      <p style="font-weight: bold;">自动排序商品</p>
      <div style="margin-bottom: 10px;">
        <el-button
          size="mini"
          @click="dialogVisible=true,keywords='',pages=1,classification='',delivery='',frame='',addquery()"
        >添加商品</el-button>
        <el-button size="mini" @click="delSort(1)">移除商品</el-button>
        <el-input v-model="keyword" class="input" placeholder="单行输入" />
        <el-button
          type="success"
          size="mini"
          class
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
          <el-table-column prop="is_show" label="上/下架" />
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="delSort(2,scope.row)">移出</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
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

    <el-dialog
      title="添加商品"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogVisible"
      width="70%"
      top="5vh"
      :before-close="handleClose"
    >
      <div>
        <span>商品分类</span>
        <el-select v-model="classification" class="maright" placeholder="请选择代理商">
          <el-option
            v-for="item in cate_map"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
        <span>配送方式</span>
        <el-select v-model="delivery" class="maright" placeholder="请选择">
          <el-option
            v-for="item in dispat_map"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
        <span>上/下架</span>
        <el-select v-model="frame" class="maright" placeholder="请选择">
          <el-option
            v-for="item in show_map"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
        <span>综合搜索</span>
        <el-input v-model="keywords" class="input" placeholder="单行输入" />
        <el-button size="mini" @click="pages=1,addquery()">筛选</el-button>
      </div>

      <template>
        <el-table
          :data="addDatalist"
          border
          height="500"
          style="width: 100%"
          @selection-change="SelectionChange"
        >
          <el-table-column fixed type="selection" width="55" prop="product_category_id" />
          <el-table-column prop="product_id" label="id" />
          <el-table-column prop="product_name" label="商品名称" />
          <el-table-column prop="cate_name" label="商品分类" />
          <el-table-column prop="product_name" label="所属代理商" />
          <el-table-column prop="product_price" label="商品价格" />
          <el-table-column prop="product_stock" label="商品库存" />
          <el-table-column prop="dispatching_type" label="配送方式" />
          <el-table-column prop="is_show" label="上/下架" />
        </el-table>
      </template>
      <div class="block">
        <el-pagination
          :current-page="pages"
          :page-sizes="[10, 20, 30, 40,50]"
          :page-size="limits"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
          @size-change="handleSizeChanges"
          @current-change="handleCurrentChanges"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSort(),dialogVisible = false">添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
  autoSortList,
  configsave,
  autoSortAdd,
  query,
  autoSortdel
} from "@/api/commodity";
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
      dialogVisible: false,
      addDatalist: [],
      interval_time: "",
      min_sort: "",
      max_sort: "",
      classification: "",
      delivery: "",
      frame: "",
      keywords: "",
      limits: 10,
      pages: 1,
      totals: 0,
      dispat_map: [],
      show_map: [],
      cate_map: [],
      Selection: []
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
    handleClose(done) {
      done();
    },
    SelectionChange(val) {
      const arr = [];
      val.map(res => {
        arr.push(res.product_id);
      });
      this.Selection = arr;
    },
    handleCurrentChanges(val) {
      // 页数
      this.pages = val;
      console.log(`当前页: ${val}`);
      this.addquery();
    },
    handleSizeChanges(val) {
      this.limits = val;
      this.pages = 1;
      this.addquery();
    },
    delSort(tsx, val) {
      const that = this;
      return new Promise((resolve, reject) => {
        autoSortdel({
          product_id: tsx == 1 ? that.multipleSelection : [val.product_id]
        }).then(res => {
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
    addSort() {
      const that = this;
      return new Promise((resolve, reject) => {
        autoSortAdd({ product_id: that.Selection }).then(res => {
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
    addquery() {
      const data = {
        keyword: this.keywords,
        agent_id: this.agent_id,
        cate_id: this.classification,
        is_show: this.frame,
        dispatching_type: this.delivery,
        limit: this.limits,
        page: this.pages
      };
      const that = this;
      return new Promise((resolve, reject) => {
        query(data).then(res => {
          if (res.code == 1) {
            that.addDatalist = res.data.list;
            that.dispat_map = res.data.dispat_map;
            that.show_map = res.data.show_map;
            that.cate_map = res.data.cate_map;
            that.totals = res.data.total;
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
    conmit() {
      const data = {
        agent_id: this.agent_id,
        interval_time: this.interval_time,
        min_sort: this.min_sort,
        max_sort: this.max_sort
      };
      const that = this;
      return new Promise((resolve, reject) => {
        configsave(data).then(res => {
          if (res.code == 1) {
            that.$message.success(res.msg);
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
        autoSortList(data).then(res => {
          this.loading = false;
          if (res.code == 1) {
            if (res.action) {
              res.action.map(val => {
                switch (val.tag) {
                  case "add":
                    if (val.display == 1) {
                      that.add = 1;
                    }
                    break;
                  case "del":
                    if (val.display == 1) {
                      that.del = 1;
                    }
                    break;
                  case "edit":
                    if (val.display == 1) {
                      that.edit = 1;
                    }
                    break;
                  default:
                    break;
                }
              });
              res.action.map(val => {
                if (val.tag == "orderexport" && val.display == 1) {
                  that.derive = 1;
                }
              });
            }
            if (res.agent_map) {
              that.agent = res.agent_map;
            }
            // that.agent_id = res.data.config.agent_id;
            that.interval_time = res.data.config.interval_time;
            that.min_sort = res.data.config.min_sort;
            that.max_sort = res.data.config.max_sort;

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
.hides {
  width: 100%;
  border-radius: 10px;
  border: 1px solid #ccc;
  background-color: rgb(242, 242, 242);
  padding: 10px;
}
.input {
  width: 100px;
  height: 30px;
  line-height: 30px;
}
</style>
<style >
.el-input__inner {
  height: 30px;
  line-height: 30px;
}
</style>
