<!-- tsx  返佣白名单 -->
<template>
  <div class="package">
    <div class="hide backtsx">
      <el-button
        v-if=" white.add==1"
        type="success"
        size="small"
        icon="el-icon-circle-plus"
        @click="whiteAdd"
      >添加</el-button>
      <el-button
        v-if="white.edit==1"
        type="warning"
        size="small"
        icon="el-icon-edit-outline"
        @click="whiteedit(1)"
      >编辑</el-button>
      <el-button
        v-if="white.del==1"
        type="info"
        size="small"
        icon="el-icon-circle-close"
        @click="whiteDels"
      >删除</el-button>
      <el-button v-if="white.view==1" type="info" size="small" @click="whiteedit(0)">查看</el-button>
      <el-button v-if=" white.accept==1" type="info" size="small" @click="adopt">通过</el-button>
      <el-button v-if="white.reject==1" type="info" size="small" @click="refuse">拒绝</el-button>
      <el-button v-if=" white.apply==1" type="info" size="small" @click="Arraignment">提审</el-button>
      <span>状态</span>
      <el-select v-model="status" class="maright" placeholder="请选择">
        <el-option
          v-for="item in status_map"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <span>代理商</span>
      <el-select v-model="agent_id" class="maright" placeholder="请选择代理商">
        <el-option
          v-for="item in agent_map"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <el-input
        v-model="keyword"
        class="input"
        prefix-icon="el-icon-search"
        placeholder="用户名称/用户id"
      />
      <el-button type="primary" class icon="el-icon-search" @click="page=1,getDatalist()">查询</el-button>
      <el-button type="info" size="small" @click="Reset">重置</el-button>
    </div>
    <template>
      <el-table
        v-loading="loading"
        :data="datalist"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="55" prop="white_id" />
        <el-table-column prop="user_id" label="用户ID" />
        <el-table-column prop="user_nickname" label="用户昵称" />
        <el-table-column prop="user_phone" label="用户账户" />
        <el-table-column prop="fans_num" label="粉丝数" />
        <el-table-column prop="create_time" label="创建时间" />
        <el-table-column prop="agent_name" label="代理商名" />
        <!-- <el-table-column prop="status" label="状态值" /> -->
        <el-table-column prop="status_text" label="状态名" />
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
      tsxTitle="新增"
      tsxWidth="800px"
      @handleClose="handleClose"
    >
      <div slot="forms">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="代理商" :required="true">
            <el-select v-model="form.agent_id" class="maright" placeholder="请选择">
              <el-option
                v-for="item in agent_map"
                :key="item.agent_id"
                :label="item.name"
                :value="item.agent_id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="手机号码" prop="product_name">
            <el-input v-model="form.phone" maxlength="11" class="input" placeholder="单行输入" />
          </el-form-item>
          <el-form-item label="商品订单" prop="product_name">
            <el-input-number
              v-model="form.product_percent"
              controls-position="right"
              placeholder="单行输入"
            />%
          </el-form-item>
          <el-form-item label="分销订单" prop="product_name">
            <el-input-number
              v-model="form.order_percent"
              controls-position="right"
              placeholder="单行输入"
            />%
          </el-form-item>
          <el-form-item label="外卖订单" prop="product_name">
            <el-input-number
              v-model="form.take_out_percent"
              controls-position="right"
              placeholder="单行输入"
            />%
          </el-form-item>
        </el-form>
        <div class>
          <el-button size="small" @click="dialogVisible=false">关闭</el-button>
          <el-button type="primary" size="small" @click="commit">保存</el-button>
        </div>
      </div>
    </PublicDialog>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
  whiteList,
  whiteAdd,
  whiteDel,
  whiteApply,
  whiteAccept,
  whiteReject
} from "@/api/membersBoon";
import PublicDialog from "@/components/PublicDialog";

export default {
  // import引入的组件需要注入到对象中才能使用
  components: { PublicDialog },
  data() {
    // 这里存放数据
    return {
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      keyword: "",
      datalist: [],
      multipleSelection: [],
      agent_id: "0",
      agent_map: [],
      dialogVisible: false,
      loading: false,
      status: "",
      status_map: [],
      form: {},
      white: {}
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
        arr.push(res);
      });
      this.multipleSelection = arr;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    whiteedit(val) {
      /** 编辑 */
      if (this.multipleSelection.length == 1) {
        this.$router.push({
          path: "/fansWhiteEdit",
          query: { white_id: this.multipleSelection[0].white_id, type: val }
        });
      } else {
        this.$message("只能选择一条");
      }
    },
    whiteAdd() {
      this.form = {};
      this.dialogVisible = true;
    },
    Reset() {
      this.keyword = "";
      this.agent_id = "0";
      this.status = "";
      this.page = 1;
      this.getDatalist();
    },
    adopt() {
      /** 通过 */
      if (this.multipleSelection.length == 1) {
        this.$confirm(`此操作将通过此用户, 是否继续?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          whiteAccept({ white_id: this.multipleSelection[0].white_id }).then(
            res => {
              if (res.code == 1) {
                this.getDatalist();
                this.$message.success(res.msg);
              } else {
                this.$message.error(res.msg);
              }
            }
          );
        });
      } else {
        this.$message("只能选择一条");
      }
    },
    refuse() {
      /** 拒绝 */
      if (this.multipleSelection.length == 1) {
        this.$confirm(`此操作将拒绝用户, 是否继续?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          whiteReject({ white_id: this.multipleSelection[0].white_id }).then(
            res => {
              if (res.code == 1) {
                this.getDatalist();
                this.$message.success(res.msg);
              } else {
                this.$message.error(res.msg);
              }
            }
          );
        });
      } else {
        this.$message("只能选择一条");
      }
    },
    Arraignment() {
      /** 提审 */
      if (this.multipleSelection.length == 1) {
        this.$confirm(
          `此操作将${
            this.multipleSelection[0].status == 2 ? "重新提审" : "提审"
          }, 是否继续?`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
          whiteApply({ white_id: this.multipleSelection[0].white_id }).then(
            res => {
              if (res.code == 1) {
                this.getDatalist();
                this.$message.success(res.msg);
              } else {
                this.$message.error(res.msg);
              }
            }
          );
        });
      } else {
        this.$message("只能选择一条");
      }
    },
    whiteDels() {
      if (this.multipleSelection.length == 1) {
        this.$confirm(`此操作将删除用户, 是否继续?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          whiteDel({ white_id: [this.multipleSelection[0].white_id] }).then(
            res => {
              this.page = 1;
              this.getDatalist();
              this.$message.success(res.msg);
            }
          );
        });
      } else {
        this.$message("只能选择一条");
      }
    },
    commit() {
      whiteAdd(this.form).then(res => {
        if (res.code == 1) {
          this.dialogVisible = false;
          this.page = 1;
          this.getDatalist();
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getDatalist() {
      const data = {
        keyword: this.keyword,
        agent_id: this.agent_id,
        limit: this.limit,
        status: this.status,
        page: this.page
      };
      this.loading = true;
      const that = this;
      return new Promise((resolve, reject) => {
        whiteList(data).then(res => {
          this.loading = false;
          if (res.code == 1) {
            if (res.action) {
              res.action.map(val => {
                switch (val.tag) {
                  case "add":
                    if (val.display == 1) {
                      that.white.add = 1;
                    }
                    break;
                  case "view":
                    if (val.display == 1) {
                      that.white.view = 1;
                    }
                    break;
                  case "fansshift":
                    if (val.display == 1) {
                      that.white.fansshift = 1;
                    }
                    break;
                  case "edit":
                    if (val.display == 1) {
                      that.white.edit = 1;
                    }
                    break;
                  case "del":
                    if (val.display == 1) {
                      that.white.del = 1;
                    }
                    break;

                  case "apply":
                    if (val.display == 1) {
                      that.white.apply = 1;
                    }
                    break;
                  case "accept":
                    if (val.display == 1) {
                      that.white.accept = 1;
                    }
                    break;
                  case "reject":
                    if (val.display == 1) {
                      that.white.reject = 1;
                    }
                    break;
                  case "fansorderexport":
                    if (val.display == 1) {
                      that.white.fansorderexport = 1;
                    }
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
              that.agent_map = res.agent_map;
            }
            that.datalist = res.data.list;
            that.status_map = res.data.status_map;
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
.el-input-number--small {
  width: 200px;
}
.backtsx {
  span {
    margin: 0 10px;
    display: inline-block;
  }
}
</style>
