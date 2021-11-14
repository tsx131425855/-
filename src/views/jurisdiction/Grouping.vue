
<template>
  <div class="package">
    <div v-if="JurisdictionData.action !== 'undefind' &&JurisdictionData.action" class="hide">
      <el-select v-model="agent_id" style="margin-right: 10px;" placeholder="请选择">
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
        prefix-icon="el-icon-search"
        placeholder="请输入内容"
        @change="inputentry"
      />
      <el-button type="success" @click="page=1,getData()">搜索</el-button>
      <el-button v-if="add==1" type="primary" @click="addJurisdiction">添加</el-button>
      <el-button v-if="del==1" type="danger" @click="deletejurisdiction">删除</el-button>
    </div>
    <div>
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="55" />
        <el-table-column prop="group_id" label="分组id" width="80" />
        <el-table-column prop="pid" label="父id" width="60" />
        <el-table-column prop="name" label="组名" width="180" />
        <el-table-column prop="agent_text" label="代理商" width="180" />
        <el-table-column prop="role_text" label="身份" width="180" />
        <!-- <el-table-column prop="rules" label="该组拥有的权限对应的id" width="180"></el-table-column> -->
        <el-table-column prop="remark" label="备注" width="280" />
        <el-table-column prop="status_text" label="状态" width="120" />
        <el-table-column prop="create_time" label="创建时间" width="180" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
            <el-button v-if="edit==1" type="text" size="small" @click="editClick(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
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
    <el-dialog title="权限管理" :visible.sync="dialogVisible" width="800px" :before-close="handleClose">
      <el-form ref="form" :model="form" :rules="rulesForm" label-width="80px">
        <el-form-item label="组名" prop="name">
          <el-input v-model="form.name" class="input" />
        </el-form-item>
        <el-form-item label="上级分组">
          <!-- <el-select v-model="form.pid" placeholder="请选择" @change="selectPid">
            <el-option
              v-for="item in options"
              :key="item.name"
              :label="item.name"
              :value="item.group_id"
            />
          </el-select>-->

          <el-cascader
            v-model="form.pid"
            :options="options"
            placeholder="上级分组"
            change-on-select
            :props="{value: 'group_id',label: 'name', children:'child'}"
            clearable
            @change="selectPid"
          />
        </el-form-item>
        <el-form-item label="代理商">
          <el-select v-model="form.agent_id" placeholder="请选择">
            <el-option
              v-for="item in agent_list"
              :key="item.agent_list"
              :label="item.name"
              :value="item.agent_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="权限id">
          <!-- <el-input
            :disabled="disabled"
            v-model="form.rules"
            @focus="ruleselse"
            placeholder="请选择"
            class="input"
          ></el-input>-->
          <el-button type="info" @click="ruleselse">请选择</el-button>
        </el-form-item>

        <el-form-item label="同步" v-if="form.can_sync==1 && elsec==0">
          <el-radio-group v-model="sync">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">替换</el-radio>
            <el-radio :label="2">增量</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" class="input" />
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
    <el-dialog title="权限" :visible.sync="xiaoVisible" width="600px" :before-close="xiaoClose">
      <!-- <el-transfer
        v-model="existing"
        :data="notHave"
        :titles="titlesarr"
        :props="{label: 'title',key:'rule_id'}"
        @change="transferChange"
      ></el-transfer>-->
      <el-tree
        :props="props"
        :data="notHave"
        node-key="rule_id"
        :default-checked-keys="checkedkeys"
        :show-checkbox="checkbox"
        @check-change="handleCheckChange"
        @check="handleCheckKeys"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="xiaoDialog(0)">取 消</el-button>
        <el-button type="primary" @click="xiaoDialog(1)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  jurisdictiongroupList,
  jurisdictiongroupAdd,
  jurisdictiongroupEdit,
  jurisdictiongroupDel,
  jurisdictiongroup
} from "@/api/Jurisdiction";
/* eslint-disable */
import { validateSum } from "@/utils/validate";
export default {
  /**
   * import引入的组件需要注入到对象中才能使用
   */
  /* eslint-disable */
  components: {},
  data() {
    /**
     * 这里存放数据
     */
    const validateWeigh = (rule, value, callback) => {
      if (value.length > 0) {
        if (!validateSum(value)) {
          callback(new Error("请输入数字"));
        }
      }
    };
    return {
      checkbox: true,
      strictly: true,
      keyword: "",
      tableData: [],
      dialogVisible: false,
      xiaoVisible: false,
      form: {
        name: "",
        pid: [],
        rules: "",
        remark: "",
        status: 0,
        agent_id: "",
        sync: 0
      },
      sync: 0,
      options: [],
      JurisdictionData: {},
      rulesForm: {
        name: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
        ]
      },
      multipleSelection: [] /** 选中 */,
      elsec: 1,
      addoredit: "立即创建",
      existing: [] /** 已有的权限 */,
      notHave: [] /** 未获取权限 */,
      disabled: false,
      titlesarr: ["未获取", "已获取"],
      rule_tree: false,
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      pageSize: 100,
      props: {
        label: "title",
        children: "child"
      },
      checkedkeys: [],
      loading: false,
      add: "",
      edit: "",
      del: "",
      agent_list: [],
      agent: [],
      agent_id: JSON.parse(localStorage.getItem("user")).agent_id,
      getrulebyg: ""
    };
  },
  /**
   * 监听属性 类似于data概念
   */
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    handleClick(row) {
      console.log(row);
    },
    inputentry(e) {
      // 搜索 输入
      this.keyword = e;
    },
    handleClose(done) {
      /** 大弹框  */
      // 关闭弹框
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done()
      //   })
      //   .catch(_ => {})
      done();
      this.disabled = false;
      this.rule_tree = false;
    },
    xiaoClose(done) {
      /** 小弹框  */
      // 关闭弹框
      done();
      this.disabled = false;
    },
    xiaoDialog(val) {
      this.xiaoVisible = false;
      this.disabled = false;
      // if (val == 1) this.form.rules = this.existing;
      if (val == 1) this.form.rules = this.checkedkeys;
      else this.form.rules = "";
      this.existing = [];
    },
    transferChange(value, direction, movedKeys) {
      /** 穿梭框 */
      console.log(value);
      this.existing = value;
    },
    ruleselse() {
      /** 权限选择 */
      this.disabled = true;
      this.xiaoVisible = true;
      if (this.elsec != 1) {
        this.getrulebygid(this.getrulebyg.pid, this.getrulebyg.group_id);
      } else {
        this.getrulebygid("", "");
      }
    },
    handleChange(value) {
      // 选择pid  选择自己的上级
      console.log(value);
    },
    getCheckedNodes(val) {
      // console.log(val);
    },
    addJurisdiction() {
      /** 添加 */
      this.elsec = 1;
      this.addoredit = "立即创建";
      this.dialogVisible = true;
      this.getrulebygid("", "");
      this.reduction();
    },
    reduction() {
      /** 初始化表单 */
      this.form = {
        name: "",
        pid: [],
        rules: "",
        group_id: "",
        remark: "",
        weigh: "",
        status: 0,
        agent_id: "",
        sync: 0
      };
      this.sync = 0;
      // this.notHave = [];
    },
    selectPid(val) {
      // 选择框 做出选择的时候
      console.log(val);
      this.rule_tree = true;
      if (val != "0") {
        this.getrulebygid(val[val.length - 1], 0);
      }
    },
    handleCheckChange(data, val, Node) {
      //  权限 权限id
      console.log(data);
      console.log(val);
      // let checkedkeys =this.checkedkeys;
      // if(val){ // --选中
      //   if(checkedkeys.indexOf(data.rule_id)==-1){
      //       checkedkeys.push(data.rule_id)
      //   }
      // }else{ // 去选中
      //   if(checkedkeys.indexOf(data.rule_id)!=-1){
      //     checkedkeys.splice(checkedkeys.indexOf(data.rule_id))
      //   }
      // }
      // this.checkedkeys=checkedkeys;
      // console.log(checkedkeys)
    },
    handleCheckKeys(leafOnly, val) {
      console.log(leafOnly);
      console.log(val);
      this.checkedkeys = val.checkedKeys;
    },
    getrulebygid(val, val1) {
      const that = this;
      let data = { group_id: val.toString(), curr_id: val1 };
      return new Promise((resolve, reject) => {
        jurisdictiongroup(data).then(res => {
          // console.log(res)
          if (res.code === 1) {
            that.notHave = res.data.rule_tree;
            let checkedkeys = [];
            res.data.rule_tree.map(y => {
              let ss = +1;
              if (y.is_select == 1) {
                checkedkeys.push(y.rule_id);
              }
              if (y.child.length > 0) {
                y.child.map(j => {
                  let uu = +1;
                  if (j.is_select == 1) {
                    checkedkeys.push(j.rule_id);
                  } else if (j.is_select == 0) {
                    // checkedkeys.splice(ss, 1);
                  }
                  if (j.child.length > 0) {
                    j.child.map(i => {
                      if (i.is_select == 1) {
                        checkedkeys.push(i.rule_id);
                      } else if (i.is_select == 0) {
                        // checkedkeys.splice(uu, 1);
                      }
                    });
                  }
                });
              }
            });
            that.checkedkeys = checkedkeys;
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
    deletejurisdiction() {
      // 删除权限
      if (this.multipleSelection.length == 0) return;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const arr = [];
          const that = this;
          this.multipleSelection.map(res => {
            arr.push(res.group_id);
          });
          const data = { group_id: arr };
          return new Promise((resolve, reject) => {
            jurisdictiongroupDel(data).then(res => {
              // console.log(res)
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
    editClick(val) {
      /** 编辑 */
      let sun = [];
      val.group_map.map(res => {
        sun.push(res.group_id);
      });
      sun.pop();
      this.form = val;
      this.form.pid = sun;
      this.form.rules = val.rules_array;
      // this.form = {
      //   name: val.name,
      //   rules: val.rules_array,
      //   pid: sun,
      //   group_id: val.group_id + "",
      //   remark: val.remark,
      //   status: val.status + "",
      //   agent_id: val.agent_id,
      //   sync: val.sync + "",
      //   can_sync: val.can_sync
      // };
      console.log(this.form);
      const arr = [];
      val.rules_array.map(res => {
        arr.push(parseInt(res));
      });
      this.existing = arr;
      this.getrulebyg = val;
      this.getrulebygid(val.pid, val.group_id);
      this.rule_id = val.rule_id;
      this.elsec = 0;
      this.addoredit = "修改";
      this.dialogVisible = true;
    },
    handleSelectionChange(val) {
      /** 选中 */
      console.log(val);
      this.multipleSelection = val;
    },

    onSubmit() {
      // 添加
      // 表单提交
      console.log("submit!");
      let that = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          const data = {
            pid: this.form.pid[this.form.pid.length - 1],
            name: this.form.name,
            rules: this.form.rules,
            remark: this.form.remark,
            status: this.form.status + "",
            agent_id: this.form.agent_id,
            sync: this.sync
          };
          if (this.elsec == 1) {
            jurisdictiongroupAdd(data)
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
          } else {
            Object.assign(data, { group_id: that.form.group_id });
            jurisdictiongroupEdit(data)
              .then(res => {
                if (res.code == 1) {
                  that.$message({ message: res.msg, type: "success" });
                  that.dialogVisible = false;
                  that.reduction();
                  that.elsec = 1;
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
                  // that.$store.dispatch("logout").then(() => {
                  //   location.reload(); //
                  // });
                }
              })
              .catch(error => {
                console.log(error);
              });
          }
        }
      });
    },
    handleCurrentChange(val) {
      // 页数
      this.page = val;
      console.log(`当前页: ${val}`);
      this.getData();
    },
    handleSizeChange(val) {
      this.limit = val;
      console.log(`每页 ${val} 条`);
      localStorage.setItem("limit", val);
      this.page = 1;
      this.getData();
    },
    getData() {
      // 当前列表数据
      const data = {
        keyword: this.keyword,
        page: this.page,
        limit: this.limit,
        agent_id: this.agent_id
      };
      this.loading = true;
      const that = this;
      jurisdictiongroupList(data)
        .then(res => {
          this.loading = false;
          if (res.code == 1) {
            that.tableData = res.data.list;
            that.total = res.data.total;
            // that.options = res.data.group_tree.concat([{name: "无", group_id: 0,child: [],pid: 0,rules: "",status: "1"}]);
            that.options = res.data.group_tree;
            that.JurisdictionData = res;

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
            that.agent_list = res.data.agent_list;
            that.notHave = res.data.rule_tree;
            that.pageSize = res.data.page_num;
            that.keyword = "";
          } else if (res.code === 2) {
            that.$message.error(res.msg);
          } else {
            that.$message.error(res.msg);
          }
        })
        .catch(src => {
          this.$message.error(src);
        });
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getData();
    this.getrulebygid("", "");
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
};
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
@import "src/styles/hide.scss";
.input {
  width: 500px;
}
</style>