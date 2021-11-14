<!-- g管理员  -->
<template>
  <div class="package">
    <div v-if="addto" class="hide">
      <el-select v-model="agent_id" class style="margin-right: 10px;" placeholder="请选择">
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <el-input
        v-model="keyword"
        class="input"
        style
        prefix-icon="el-icon-search"
        placeholder="用户id/昵称/手机号"
        @change="inputentry"
      />
      <el-button type="success" @click="page=1,getData()">搜索</el-button>
      <el-button v-if="add==1" type="primary" @click="addAdministration">添加</el-button>
      <el-button v-if="del==1" type="danger" @click="delAdministration">删除</el-button>
    </div>
    <template>
      <el-table
        v-loading="loading"
        :data="dataList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="55" />
        <el-table-column prop="admin_id" label="管理员id" width="80" />
        <el-table-column prop="user_id" label="用户id" width="80" />
        <el-table-column prop="user_nickname" label="用户昵称" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="agent_text" label="代理商" width="180" />
        <el-table-column prop="groups_text" label="权限组" />
        <el-table-column prop="last_ip" label="最近登录IP" />
        <el-table-column prop="last_time" label="最近登录时间" width="100" />
        <el-table-column prop="status_text" label="状态" />
        <el-table-column prop="create_time" label="创建时间" width="100" />
        <el-table-column prop="update_time" label="更新时间" width="100" />
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-button v-if="edit==1" type="text" size="small" @click="editClick(scope.row)">编辑</el-button>
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
    <el-dialog title="管理员" :visible.sync="dialogVisible" width="500px" :before-close="handleClose">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="手机号">
          <!-- <el-input v-model="form.phone" class="input" style="width:300px" maxlength="11" ></el-input> -->
          <el-autocomplete
            v-model="form.phone"
            class="inline-input"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            :trigger-on-focus="false"
            label="user_tel"
            :value="form.phone"
            :disabled="elsec==0?true:false"
            @select="handleSelect"
          >
            <template slot-scope="{ item }" style="display: flex;">
              <div class="name">{{ item.value }}</div>
              <span class="addr">{{ item.nickname }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="分组">
          <!-- <el-select v-model="form.groups" placeholder="请选择组别" >
                <el-option
                    v-for="item in options"
                    :key="item.name"
                    :label="item.name"
                    :value="item.group_id"
                ></el-option>
          </el-select>-->

          <div>
            <el-cascader
              v-model="form.groups"
              :options="options"
              placeholder="请选择组别"
              change-on-select
              :props="{value: 'group_id',label: 'name', children:'child'}"
              clearable
              @change="handleChange"
            />
          </div>
          <div />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="0">禁用</el-radio>
            <el-radio label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{ addoredit }}</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
      <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>-->
    </el-dialog>
  </div>
</template>

<script>
import {
  jurisdictionAdmin,
  jurisdictionAdminAdd,
  jurisdictionAdminEdit,
  jurisdictionAdminDel,
  jurisdictionAdminQuery
} from "@/api/Jurisdiction";
/* eslint-disable */
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      keyword: "",
      dataList: [],
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      pageSize: 100,
      addto: {},
      cutoff: {},
      edit: {},
      multipleSelection: [] /** 选中 */,
      elsec: 1 /** 1添加还是 0编辑 */,
      dialogVisible: false,
      options: [] /** 所属组 */,
      form: {
        phone: "",
        groups: [],
        status: "1",
        user_id: "",
        admin: ""
      },
      groups_map: "",
      addoredit: "立即创建",
      loading: false,
      add: "",
      edit: "",
      del: "",
      agent: [],
      agent_id: JSON.parse(localStorage.getItem("user")).agent_id
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
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
      this.page = 1;
      localStorage.setItem("limit", val);
      this.getData();
    },
    handleSelectionChange(val) {
      /** 选中 */
      console.log(val);
      this.multipleSelection = val;
    },
    inputentry(e) {
      // 搜索 输入
      this.keyword = e;
    },
    reduction() {
      /** 初始化表单 */
      this.form = {
        phone: "",
        user_id: "",
        groups: [],
        status: "0",
        admin: ""
      };
    },
    handleClose(done) {
      /** 大弹框  */
      // 关闭弹框
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done()
      //   })
      //   .catch(_ => {})
      this.reduction();
      this.groups_map = [];
      done();
    },
    onSubmit() {
      // 表单提交
      console.log("submit!");
      let that = this;
      if (that.form.phone.length > 10 && that.form.groups) {
        const data = {
          phone: that.form.phone,
          user_id: that.form.user_id,
          groups: that.groups_map,
          status: that.form.status
        };
        if (this.elsec == 1) {
          /** 添加 */
          return new Promise((resolve, reject) => {
            jurisdictionAdminAdd(data)
              .then(res => {
                if (res.code == 1) {
                  that.$message({ message: res.msg, type: "success" });
                  that.dialogVisible = false;
                  that.reduction();
                  that.elsec = 1;
                  that.page = 1;
                  that.getData();
                } else if (res.code === 2) {
                  that.$message.error(res.msg);
                  if (res.token.length > 0) {
                  }
                  setTimeout(() => {
                    that.$store.dispatch("logout").then(() => {
                      location.reload(); //
                    });
                  }, 1000);
                } else {
                  that.$message.error(res.msg);
                }
              })
              .catch(error => {
                console.log(error);
              });
            resolve();
          }).catch(error => {
            console.log(error);
          });
        } else {
          /** 编辑 */
          Object.assign(data, { admin_id: that.form.admin });
          return new Promise((resolve, reject) => {
            jurisdictionAdminEdit(data)
              .then(res => {
                if (res.code == 1) {
                  that.$message({ message: res.msg, type: "success" });
                  that.dialogVisible = false;
                  that.reduction();
                  that.elsec = 1;
                  that.page = 1;
                  that.getData();
                } else if (res.code === 2) {
                  that.$message.error(res.msg);
                  if (res.token.length > 0) {
                  }
                  setTimeout(() => {
                    that.$store.dispatch("logout").then(() => {
                      location.reload(); //
                    });
                  }, 1000);
                } else {
                  that.$message.error(res.msg);
                }
              })
              .catch(error => {
                console.log(error);
              });
            resolve();
          }).catch(error => {
            console.log(error);
          });
        }
      } else {
        that.$message.error("请输入正确的手机号和分组");
      }
    },
    editClick(val) {
      /** 编辑 */
      this.reduction();
      console.log(val);
      this.groups_map = val.groups_array;
      let name = [];

      val.groups_map.map(res => {
        name.push(res.group_id);
      });
      this.form = {
        phone: val.phone,
        user_id: val.user_id,
        groups: name,
        status: val.status + "",
        admin: val.admin_id
      };
      this.elsec = 0;
      this.addoredit = "修改";
      this.dialogVisible = true;
    },
    addAdministration() {
      /** 添加 */
      this.reduction();
      this.elsec = 1;
      this.addoredit = "立即创建";
      this.dialogVisible = true;
    },
    delAdministration() {
      /** 删除 */
      if (this.multipleSelection.length == 0) return;
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const arr = [];
          const that = this;
          this.multipleSelection.map(res => {
            arr.push(res.admin_id);
          });
          const data = { admin_id: arr };
          return new Promise((resolve, reject) => {
            jurisdictionAdminDel(data).then(res => {
              if (res.code === 1) {
                that.$message({ message: res.msg, type: "success" });
                that.page = 1;
                that.getData();
              } else if (res.code === 2) {
                that.$message.error(res.msg);
              } else {
                that.$message.error(res.msg);
              }
            });
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
    getData() {
      /** 列表数据 */
      const data = {
        keyword: this.keyword,
        page: this.page,
        limit: this.limit,
        agent_id: this.agent_id
      };
      this.loading = true;
      const that = this;
      return new Promise((resolve, reject) => {
        jurisdictionAdmin(data).then(res => {
          this.loading = false;
          if (res.code == 1) {
            that.dataList = res.data.list;
            that.total = res.data.total;
            that.pageSize = res.data.page_num;
            that.options = res.data.group_tree;
            that.addto = res.action[0];
            that.cutoff = res.action[2];
            that.edit = res.action[1];
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
            }
            if (res.agent_map) {
              that.agent = res.agent_map;
            }
          } else if (res.code == 2) {
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
    handleChange(value) {
      console.log(value);
      this.groups_map = [value[value.length - 1]];
    },
    handleSelect(item) {
      console.log(item);
      this.form.phone = item.value;
      this.form.user_id = item.user_id;
    },
    querySearch(queryString, cb) {
      console.log(queryString);
      const data = { keyword: queryString };
      const that = this;
      return new Promise((resolve, reject) => {
        jurisdictionAdminQuery(data).then(res => {
          console.log(res);
          if (res.code == 1) {
            let results = res.data.length > 0 ? res.data : [];
            cb(results);
          } else if (res.code == 2) {
            that.$message.error(res.msg);
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch(error => {});
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getData();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style>
.el-autocomplete-suggestion li {
  display: flex;
}
</style>

<style lang='scss' scoped>
//@import url(); 引入公共css类
@import "src/styles/hide.scss";

#el-autocomplete-2961-item-0 {
  display: flex;
}
</style>