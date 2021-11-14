<!-- tsx 商品分类 -->
<template>
  <div class="package">
    <div class="hide">
      <el-button @click="dialogVisible = true,pic=[],form={ is_show: 1 },elsec=1">新增</el-button>
      <el-button @click="delData(1)">删除</el-button>
      <el-button @click="showHide(1)">显示</el-button>
      <el-button @click="showHide(0)" class>隐藏</el-button>
      <el-select v-model="agent_id" class style="margin-left: 15px;" placeholder="请选择代理商">
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <el-button
        type="success"
        style="margin-left: 15px;"
        class
        @click="page=1,getDatalist()"
        icon="el-icon-search"
      >查询</el-button>
    </div>
    <!-- 列表 -->
    <template>
      <el-table
        v-loading="loading"
        :data="datalist"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="55" prop="product_category_id" />
        <el-table-column prop="product_category_id" label="分类ID" />
        <el-table-column prop="cate_name" label="分类名称">
          <template slot-scope="scope">
            <div v-if="scope.row.cate_name_flag" style="display: flex;align-items: center;">
              <el-input v-model="scope.row.cate_name" />
              <el-button type="primary" @click="Preservation(scope,1)">保存</el-button>
            </div>
            <div v-else>
              {{scope.row.cate_name}}
              <i class="el-icon-edit" @click="fillClick(scope,1)" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="分类排序">
          <template slot-scope="scope">
            <div v-if="scope.row.sort_flag" style="display: flex;align-items: center;">
              <el-input v-model="scope.row.sort" />
              <el-button type="primary" @click="Preservation(scope,1)">保存</el-button>
            </div>
            <div v-else>
              {{scope.row.sort}}
              <i class="el-icon-edit" @click="fillClick(scope,2)"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="is_show_text" label="是否显示">
          <template slot-scope="scope">
            <div
              @click="Preservation(scope,2)"
              style="display: flex;justify-content: center;cursor:pointer;"
            >
              <i class="el-icon-error" style="color:red" v-if="scope.row.is_show==0"></i>
              <i class="el-icon-success" style="color:green" v-else></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="Preservation(scope.row,3),elsec=0">编辑</el-button>
            <el-button type="text" size="small" @click="delData(2,scope.row)">删除</el-button>
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
    <!-- 新增 -->
    <el-dialog
      :title="elsec==1?'新增分类':'编辑分类'"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="代理商">
          <el-select v-model="form.agent_id" class="maright" placeholder="请选择代理商">
            <el-option
              v-for="item in agent"
              :key="item.agent_id"
              :label="item.name"
              :value="item.agent_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称">
          <el-input v-model="form.cate_name" class="input" style="width:300px" placeholder="单行输入"></el-input>
        </el-form-item>
        <el-form-item label="分类排序">
          <el-input v-model="form.sort" class="input" style="width:300px" placeholder="单行输入"></el-input>
        </el-form-item>
        <el-form-item label="显示">
          <el-radio-group v-model="form.is_show">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分类icon">
          <Upimg
            :exporteurl="exporteurl"
            :fileList="pic"
            fileName="image"
            :showList="true"
            :fileHeaders="headers"
            :disabled="false"
            :maxlimit="1"
            :index="1"
            @Removeimg="RemoveimgArray"
            @Successimg="SuccessimgArray"
          ></Upimg>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{ elsec==1?'立即创建':'修改完成' }}</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
  categoryList,
  categoryAdd,
  categoryEdit,
  categoryDel,
  categoryShow
} from "@/api/commodity";
import { exporteurl } from "@/utils/user";
import { upimg } from "@/api/user";
import Upimg from "@/components/Upimg";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { Upimg },
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
      exporteurl: exporteurl + upimg,
      headers: {
        token: localStorage.getItem("Token"),
        enctype: "multipart/form-data"
      },
      pic: [],
      dialogVisible: false,
      form: {
        is_show: 1,
        agent_id: JSON.parse(localStorage.getItem("user")).agent_id
      },
      elsec: 1 /** 1 新增 0编辑 */
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
        arr.push(res.product_category_id);
      });
      this.multipleSelection = arr;
    },
    handleClose(done) {
      done();
    },
    fillClick(row, val) {
      if (val == 1) {
        this.datalist[row.$index].cate_name_flag = !this.datalist[row.$index]
          .cate_name_flag;
      } else if (val == 2) {
        this.datalist[row.$index].sort_flag = !this.datalist[row.$index]
          .sort_flag;
      }
    },
    Preservation(row, tsx) {
      if (tsx == 2) {
        this.datalist[row.$index].is_show == 1
          ? (this.datalist[row.$index].is_show = 0)
          : (this.datalist[row.$index].is_show = 1);

        this.editData(this.datalist[row.$index], 1);
      } else if (tsx == 1) {
        this.editData(row.row, 1);
      } else if (tsx == 3) {
        this.form = {
          agent_id: row.agent_id,
          category_id: row.product_category_id,
          cate_name: row.cate_name,
          sort: row.sort,
          is_show: row.is_show
        };
        if (row.pic != null && row.pic_url != null) {
          this.pic = [{ name: "", imgPath: row.pic, url: row.pic_url }];
        }
        this.dialogVisible = true;
      }
    },
    RemoveimgArray(val) {
      this.pic = val.img;
    },
    SuccessimgArray(val) {
      this.pic = val.imgArray;
    },
    showHide(val) {
      const data = {
        category_id: this.multipleSelection,
        is_show: val
      };
      const that = this;
      return new Promise((resolve, reject) => {
        categoryShow(data).then(res => {
          this.loading = false;
          if (res.code == 1) {
            that.$message.success(res.msg);
            that.page = 1;
            that.getDatalist();
            that.dialogVisible = false;
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
    editData(val, tsx) {
      let data = {};
      if (tsx == 1) {
        data = {
          category_id: val.product_category_id,
          cate_name: val.cate_name,
          agent_id: val.agent_id,
          pic: val.pic,
          sort: val.sort,
          is_show: val.is_show,
          edit_field: 0
        };
      } else {
        data = {
          category_id: this.form.category_id,
          cate_name: this.form.cate_name,
          agent_id: this.form.agent_id,
          pic: this.pic.length > 0 ? this.pic[0].imgPath : "",
          sort: this.form.sort,
          is_show: this.form.is_show,
          edit_field: 0
        };
      }

      let that = this;
      return new Promise((resolve, reject) => {
        categoryEdit(data).then(res => {
          this.loading = false;
          if (res.code == 1) {
            that.$message.success(res.msg);
            that.page = 1;
            that.getDatalist();
            that.dialogVisible = false;
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
    delData(tsx, val) {
      const that = this;
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return new Promise((resolve, reject) => {
            categoryDel(
              tsx == 1
                ? { category_id: this.multipleSelection }
                : { category_id: [val.product_category_id] }
            ).then(res => {
              this.loading = false;
              if (res.code == 1) {
                that.$message.success(res.msg);
                that.page = 1;
                that.getDatalist();
                that.dialogVisible = false;
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    onSubmit() {
      /** 添加 */
      const that = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.elsec == 1) {
            const data = {
              cate_name: this.form.cate_name,
              agent_id: this.form.agent_id,
              pic: this.pic.length > 0 ? this.pic[0].imgPath : "",
              sort: this.form.sort,
              is_show: this.form.is_show,
              edit_field: this.form.edit_field
            };
            return new Promise((resolve, reject) => {
              categoryAdd(data).then(res => {
                this.loading = false;
                if (res.code == 1) {
                  that.$message.success(res.msg);
                  that.page = 1;
                  that.getDatalist();
                  that.dialogVisible = false;
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
          } else {
            this.editData("", 0);
          }
        }
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
      let that = this;
      return new Promise((resolve, reject) => {
        categoryList(data).then(res => {
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
</style>
