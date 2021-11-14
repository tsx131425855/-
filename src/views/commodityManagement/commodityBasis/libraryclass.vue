<!-- tsx 公共库分类 -->
<template>
  <div class="package">
    <div class="hide">
      <el-input v-model="keyword" class="input" prefix-icon="el-icon-search" placeholder="分类名称" />
      <el-button type="success" class @click="page=1,getDatalist()">查询</el-button>
      <el-button type="primary" class @click="addClass()">新增</el-button>
      <el-button type="warning" class @click="change">修改</el-button>
      <el-button type="danger" class @click="garbage">删除</el-button>
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
        <el-table-column prop="cate_name" label="分类名" />
        <el-table-column prop="nums" label="关联商品数" />
        <el-table-column prop="level_text" label="分类等级" />
        <el-table-column prop="create_time" label="创建时间" />
        <el-table-column prop="sort" label="排序">
          <template slot-scope="scope">
            <i
              class="el-icon-caret-bottom"
              style="color:red;font-size: 18px;"
              @click="sort(scope,'-1')"
            />
            <i
              class="el-icon-caret-top"
              style="color:green;font-size: 18px;"
              @click="sort(scope,1)"
            />
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
    <PublicDialog
      v-if="dialogVisible"
      :isShowVisible="dialogVisible"
      tsxTitle="选择分类"
      tsxWidth="600px"
      @handleClose="handleClose"
    >
      <div slot="forms">
        <div style="margin-bottom: 20px;">
          <span>分类名称：</span>
          <el-input
            v-model="cate_name"
            class="input"
            prefix-icon="el-icon-search"
            maxlength="15"
            placeholder="0/15"
          />
        </div>
        <div>
          <span>级别：</span>
          <el-radio v-model="level" label="1">L1</el-radio>
        </div>
        <div style="margin-top: 20px;">
          <el-button size="small" @click="cancel">取消</el-button>
          <el-button type="primary" size="small" @click="commitpublic">确定</el-button>
        </div>
      </div>
    </PublicDialog>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import PublicDialog from "@/components/PublicDialog";
import {
  productwareindex,
  productwarepubadd,
  productwarepubcateedit,
  productwarepubdel,
  productwarepubsort
} from "@/api/commodity";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { PublicDialog },
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
      shipping: "",
      shipping_map: [],
      cate_id: "",
      cate_map: [],
      agent: [],
      addedit: 1,
      level: "1",
      cate_name: "",
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
        arr.push(res);
      });
      this.multipleSelection = arr;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    Reset() {
      Object.assign(this.$data, this.$options.data());
    },
    sort(scope, val) {
      productwarepubsort({ cate_id: scope.row.cate_id, step: val }).then(
        res => {
          if (res.code == 1) {
            this.page = 1;
            this.getDatalist();
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        }
      );
    },
    change() {
      /** 修改分类 */
      if (this.multipleSelection.length == 1) {
        this.addedit = 2;
        this.cate_id = this.multipleSelection[0].cate_id;
        this.cate_name = this.multipleSelection[0].cate_name;
        this.dialogVisible = true;
      } else this.$message("请选择1条记录");
    },
    addClass() {
      /** 新增分类 */
      this.addedit = 1;
      this.cate_id = "";
      this.cate_name = "";
      this.dialogVisible = true;
    },
    garbage() {
      /** 删除 */
      if (this.multipleSelection.length == 1) {
        this.$confirm("此操作将会删除分类, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            const data = {
              cate_id: [this.multipleSelection[0].cate_id]
            };
            productwarepubdel(data).then(res => {
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
        cate_name: this.cate_name,
        level: this.level,
        cate_id: this.cate_id
      };
      if (this.addedit == 1) {
        productwarepubadd(data).then(res => {
          if (res.code == 1) {
            this.page = 1;
            this.getDatalist();
            this.dialogVisible = false;
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        productwarepubcateedit(data).then(res => {
          if (res.code == 1) {
            this.page = 1;
            this.getDatalist();
            this.dialogVisible = false;
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    getDatalist() {
      const data = {
        page: this.page,
        keyword: this.keyword,
        agent_id: this.agent_id,
        limit: this.limit,
        shipping: this.shipping
      };
      this.loading = true;
      const that = this;
      return new Promise((resolve, reject) => {
        productwareindex(data).then(res => {
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

