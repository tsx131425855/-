
<template>
  <div class="package">
    <div class="hide">
      <el-input
        v-model="keyword"
        class="input"
        prefix-icon="el-icon-search"
        placeholder="请输入标题或路径"
        @change="inputentry"
      />
      <el-button type="success" @click="page=1,getData()">搜索</el-button>
      <el-button v-if="add==1" type="primary" @click="addJurisdiction">添加</el-button>
      <!-- <el-button
        type="danger"
        v-if="JurisdictionData.action !== 'undefind' &&JurisdictionData.action[2].display==1"
        @click="deletejurisdiction"
      >删除</el-button>-->
    </div>

    <div>
      <!-- <el-table
        :data="tableData"
        border=""
        style="width: 100%"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="55"></el-table-column>
        <el-table-column prop="rule_id" label="规则id" width="100"></el-table-column>
        <el-table-column prop="path" label="规则路径" width="200"></el-table-column>
        <el-table-column prop="route" label="前端路由" width="250"></el-table-column>
        <el-table-column prop="title" label="标题" width="100"></el-table-column>
        <el-table-column prop="remark" label="备注" width="150"></el-table-column>
        <el-table-column prop="is_menu_text" label="是否菜单" width="100"></el-table-column>
        <el-table-column prop="is_node_text" label="是否节点" width="100"></el-table-column>
        <el-table-column prop="weigh" label="权重" width="50"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" ></el-table-column>
        <el-table-column prop="status_text" label="状态" width="80"></el-table-column>
        <el-table-column fixed="right" label="操作"  >
          <template slot-scope="scope">
            <el-button
            v-if="JurisdictionData.action[1].display==1"
              type="text"
              size="small"
              @click="editClick(scope.row)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>-->

      <!-- <el-tree
  :data="tableData"
  :props="defaultProps"
  show-checkbox
  node-key="rule_id"
  default-expand-all
  @check="handleCheckKeys"
  :expand-on-click-node="false"
  :render-content="renderContent">
      </el-tree>-->

      <template>
        <el-table v-loading="loading" :data="tableData" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <!--  这个地方弄表格 -->

              <template v-if="props.row.child.length>0">
                <el-table :data="props.row.child" style="width: 100%" row-class-name="success-row">
                  <el-table-column type="expand">
                    <template slot-scope="props">
                      <!--  这个地方弄表格 -->

                      <template v-if="props.row.child.length>0">
                        <el-table
                          :data="props.row.child"
                          style="width: 100%"
                          row-class-name="warning-row"
                        >
                          <el-table-column type="expand">
                            <template slot-scope="props">
                              <template v-if="props.row.child.length>0">
                                <el-table :data="props.row.child" style="width: 100%">
                                  <el-table-column type="expand">
                                    <template slot-scope="props">
                                      <template v-if="props.row.child.length>0">
                                        <el-table
                                          :data="props.row.child"
                                          style="width: 100%"
                                          row-class-name="warning-row"
                                        >
                                          <el-table-column type="expand">
                                            <template slot-scope="props">
                                              <template v-if="props.row.child.length>0">
                                                <el-table
                                                  :data="props.row.child"
                                                  style="width: 100%"
                                                >
                                                  <el-table-column type="expand">
                                                    <!-- <template slot-scope="props">

                                                    </template>-->
                                                  </el-table-column>
                                                  <el-table-column type="selection" width="55" />
                                                  <el-table-column
                                                    prop="rule_id"
                                                    label="规则id"
                                                    width="100"
                                                  />
                                                  <el-table-column
                                                    prop="path"
                                                    label="规则路径"
                                                    width="200"
                                                  />
                                                  <el-table-column
                                                    prop="route"
                                                    label="前端路由"
                                                    width="250"
                                                  />
                                                  <el-table-column
                                                    prop="title"
                                                    label="标题"
                                                    width="100"
                                                  />
                                                  <el-table-column
                                                    prop="remark"
                                                    label="备注"
                                                    width="150"
                                                  />
                                                  <el-table-column
                                                    prop="is_menu_text"
                                                    label="是否菜单"
                                                    width="100"
                                                  />
                                                  <el-table-column
                                                    prop="is_node_text"
                                                    label="是否节点"
                                                    width="100"
                                                  />
                                                  <el-table-column
                                                    prop="weigh"
                                                    label="权重"
                                                    width="50"
                                                  />
                                                  <el-table-column prop="create_time" label="创建时间" />
                                                  <el-table-column
                                                    prop="status_text"
                                                    label="状态"
                                                    width="80"
                                                  />
                                                  <el-table-column label="操作">
                                                    <template slot-scope="scope">
                                                      <el-button
                                                        v-if="edit==1"
                                                        type="text"
                                                        size="small"
                                                        @click="editClick(scope.row)"
                                                      >编辑</el-button>
                                                      <el-button
                                                        v-if="del==1"
                                                        type="text"
                                                        size="small"
                                                        @click="preDeletion(scope.row)"
                                                      >删除</el-button>
                                                    </template>
                                                  </el-table-column>
                                                </el-table>
                                              </template>
                                            </template>
                                          </el-table-column>
                                          <el-table-column type="selection" width="55" />
                                          <el-table-column prop="rule_id" label="规则id" width="100" />
                                          <el-table-column prop="path" label="规则路径" width="200" />
                                          <el-table-column prop="route" label="前端路由" width="250" />
                                          <el-table-column prop="title" label="标题" width="100" />
                                          <el-table-column prop="remark" label="备注" width="150" />
                                          <el-table-column
                                            prop="is_menu_text"
                                            label="是否菜单"
                                            width="100"
                                          />
                                          <el-table-column
                                            prop="is_node_text"
                                            label="是否节点"
                                            width="100"
                                          />
                                          <el-table-column prop="weigh" label="权重" width="50" />
                                          <el-table-column prop="create_time" label="创建时间" />
                                          <el-table-column
                                            prop="status_text"
                                            label="状态"
                                            width="80"
                                          />
                                          <el-table-column label="操作">
                                            <template slot-scope="scope">
                                              <el-button
                                                v-if="edit==1"
                                                type="text"
                                                size="small"
                                                @click="editClick(scope.row)"
                                              >编辑</el-button>
                                              <el-button
                                                v-if="del==1"
                                                type="text"
                                                size="small"
                                                @click="preDeletion(scope.row)"
                                              >删除</el-button>
                                            </template>
                                          </el-table-column>
                                        </el-table>
                                      </template>
                                    </template>
                                  </el-table-column>
                                  <el-table-column type="selection" width="55" />
                                  <el-table-column prop="rule_id" label="规则id" width="100" />
                                  <el-table-column prop="path" label="规则路径" width="200" />
                                  <el-table-column prop="route" label="前端路由" width="250" />
                                  <el-table-column prop="title" label="标题" width="100" />
                                  <el-table-column prop="remark" label="备注" width="150" />
                                  <el-table-column prop="is_menu_text" label="是否菜单" width="100" />
                                  <el-table-column prop="is_node_text" label="是否节点" width="100" />
                                  <el-table-column prop="weigh" label="权重" width="50" />
                                  <el-table-column prop="create_time" label="创建时间" />
                                  <el-table-column prop="status_text" label="状态" width="80" />
                                  <el-table-column label="操作">
                                    <template slot-scope="scope">
                                      <el-button
                                        v-if="edit==1"
                                        type="text"
                                        size="small"
                                        @click="editClick(scope.row)"
                                      >编辑</el-button>
                                      <el-button
                                        v-if="del==1"
                                        type="text"
                                        size="small"
                                        @click="preDeletion(scope.row)"
                                      >删除</el-button>
                                    </template>
                                  </el-table-column>
                                </el-table>
                              </template>
                            </template>
                          </el-table-column>
                          <el-table-column type="selection" width="55" />
                          <el-table-column prop="rule_id" label="规则id" width="100" />
                          <el-table-column prop="path" label="规则路径" width="200" />
                          <el-table-column prop="route" label="前端路由" width="250" />
                          <el-table-column prop="title" label="标题" width="100" />
                          <el-table-column prop="remark" label="备注" width="150" />
                          <el-table-column prop="is_menu_text" label="是否菜单" width="100" />
                          <el-table-column prop="is_node_text" label="是否节点" width="100" />
                          <el-table-column prop="weigh" label="权重" width="50" />
                          <el-table-column prop="create_time" label="创建时间" />
                          <el-table-column prop="status_text" label="状态" width="80" />
                          <el-table-column label="操作">
                            <template slot-scope="scope">
                              <el-button
                                v-if="edit==1"
                                type="text"
                                size="small"
                                @click="editClick(scope.row)"
                              >编辑</el-button>
                              <el-button
                                v-if="del==1"
                                type="text"
                                size="small"
                                @click="preDeletion(scope.row)"
                              >删除</el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                      </template>
                    </template>
                  </el-table-column>

                  <el-table-column prop="rule_id" label="规则id" width="100" />
                  <el-table-column prop="path" label="规则路径" width="200" />
                  <el-table-column prop="route" label="前端路由" width="250" />
                  <el-table-column prop="title" label="标题" width="100" />
                  <el-table-column prop="remark" label="备注" width="150" />
                  <el-table-column prop="is_menu_text" label="是否菜单" width="100" />
                  <el-table-column prop="is_node_text" label="是否节点" width="100" />
                  <el-table-column prop="weigh" label="权重" width="50" />
                  <el-table-column prop="create_time" label="创建时间" />
                  <el-table-column prop="status_text" label="状态" width="80" />
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button
                        v-if="edit==1"
                        type="text"
                        size="small"
                        @click="editClick(scope.row)"
                      >编辑</el-button>
                      <el-button
                        v-if="del==1"
                        type="text"
                        size="small"
                        @click="preDeletion(scope.row)"
                      >删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </template>
          </el-table-column>

          <el-table-column prop="rule_id" label="规则id" width="100" />
          <el-table-column prop="path" label="规则路径" width="200" />
          <el-table-column prop="route" label="前端路由" width="250" />
          <el-table-column prop="title" label="标题" width="100" />
          <el-table-column prop="remark" label="备注" width="150" />
          <el-table-column prop="is_menu_text" label="是否菜单" width="100" />
          <el-table-column prop="is_node_text" label="是否节点" width="100" />
          <el-table-column prop="weigh" label="权重" width="50" />
          <el-table-column prop="create_time" label="创建时间" />
          <el-table-column prop="status_text" label="状态" width="80" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button v-if="edit==1" type="text" size="small" @click="editClick(scope.row)">编辑</el-button>
              <el-button v-if="del==1" type="text" size="small" @click="preDeletion(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- </div>
  </div>
      </template>-->
    </div>
    <div class="block">
      <!-- <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        layout="prev, pager, next, jumper"
        :total="total"
      ></el-pagination>-->

      <!-- <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 20, 30, 40,50]"
      :page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>-->
    </div>
    <el-dialog title="权限管理" :visible.sync="dialogVisible" width="800px" :before-close="handleClose">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" class="input" />
        </el-form-item>
        <el-form-item label="规则路径">
          <el-input v-model="form.path" class="input" />
        </el-form-item>
        <el-form-item label="前端路由">
          <el-input v-model="form.route" class="input" />
        </el-form-item>
        <el-form-item label="权重">
          <el-input v-model="form.weigh" class="input" />
        </el-form-item>
        <el-form-item label="上级规则">
          <el-cascader
            v-model="form.pid"
            :options="options"
            change-on-select
            size="medium"
            :props="{value: 'rule_id',label: 'title', children:'child'}"
            clearable
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="icon">
          <el-select v-model="form.icon" placeholder="请选择icon">
            <el-option
              v-for="item in icon"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <i :class="item.value" />
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否菜单">
          <el-radio-group v-model="form.is_menu">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否节点">
          <el-radio-group v-model="form.is_node">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="日志记录">
          <el-radio-group v-model="form.is_log">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="内容检测">
          <el-radio-group v-model="form.is_scan">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="0">禁用</el-radio>
            <el-radio label="1">启用</el-radio>
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
  </div>
</template>

<script>
/* eslint-disable */
import {
  jurisdictionList,
  jurisdictionAdd,
  jurisdictionEdit,
  jurisdictionDel
} from "@/api/Jurisdiction";
import { validateSum } from "@/utils/validate";
import { icons } from "@/utils/icon";
/* eslint-disable no-alert */
/* eslint-disable */
export default {
  /**
   * import引入的组件需要注入到对象中才能使用
   */
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
      keyword: "",
      tableData: [],
      dialogVisible: false,
      form: {
        path: "",
        title: "",
        route: "",
        pid: [],
        icon: "",
        remark: "",
        is_menu: "0",
        is_node: "0",
        weigh: "",
        status: "0",
        is_scan: 0,
        is_log: 0
      },
      options: [],
      JurisdictionData: {},
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
        ],
        weigh: [{ required: true, trigger: "blur", validator: validateWeigh }]
      },
      multipleSelection: [] /** 选中 */,
      elsec: 1,
      addoredit: "立即创建",
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      pageSize: 100,
      defaultProps: {
        children: "child",
        label: "title"
      },
      loading: false,
      icon: [
        {
          label: "el-icon-share",
          value: "el-icon-share"
        },
        {
          label: "el-icon-setting",
          value: "el-icon-setting"
        },
        {
          label: "el-icon-more",
          value: "el-icon-more"
        },
        {
          label: "el-icon-goods",
          value: "el-icon-goods"
        },
        {
          label: "el-icon-question",
          value: "el-icon-question"
        },
        {
          label: "el-icon-menu",
          value: "el-icon-menu"
        },
        {
          label: "el-icon-warning",
          value: "el-icon-warning"
        },
        {
          label: "el-icon-date",
          value: "el-icon-date"
        }
      ],
      add: "",
      edit: "",
      del: ""
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
    tableRowClassName({ row, rowIndex }) {
      /***  表颜色 */
      return "success-row";
    },
    append(data) {
      /** 树形 修改 */
      console.log(data);
    },
    remove(node, data) {
      /***  树形 删除 */
      console.log(data);
    },
    renderContent(h, { node, data, store }) {
      /** 树型  自定义 */
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <span>{node.label}</span>
          </span>
          <span>
            <el-button
              style="font-size: 12px;"
              type="text"
              on-click={() => this.editClick(data)}
            >
              编辑
            </el-button>
            <el-button
              style="font-size: 12px;"
              type="text"
              on-click={() => this.remove(node, data)}
            >
              删除
            </el-button>
          </span>
        </span>
      );
    },
    preDeletion(val) {
      /** 删除弹框  第四 片了  不要 在弄了 */
      console.log(val);
      let arr = [];
      arr.push(val.rule_id);
      if (val.child.length > 0) {
        /** 这里要循环四次 有四层*/
        val.child.map(res => {
          arr.push(res.rule_id);
          if (res.child.length > 0) {
            /** 有就网下走 */
            res.child.map(j => {
              arr.push(j.rule_id);
              if (j.child.length > 0) {
                /*** 这个是最后一次 */
                j.child.map(i => {
                  arr.push(i.rule_id);
                });
              }
            });
          }
        });
      }

      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deletejurisdiction(arr);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleClick(row) {
      console.log(row);
    },
    inputentry(e) {
      // 搜索 输入
      this.keyword = e;
    },
    handleClose(done) {
      // 关闭弹框
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleChange(value) {
      // 选择pid  选择自己的上级
      // console.log(value);
    },
    getCheckedNodes(val) {
      // console.log(val);
    },
    addJurisdiction() {
      /** 添加 */
      this.reduction();
      this.elsec = 1;
      this.addoredit = "立即创建";
      this.dialogVisible = true;
    },
    reduction() {
      /** 初始化表单 */
      this.form = {
        path: "",
        title: "",
        route: "",
        pid: [],
        icon: "",
        remark: "",
        is_menu: "0",
        is_node: "0",
        weigh: "",
        status: "0",
        is_scan: "0",
        is_log: "0"
      };
    },
    handleCheckKeys(leafOnly, val) {
      val.checkedKeys;
    },
    deletejurisdiction(val) {
      // 删除权限
      // if (this.multipleSelection.length == 0) return;
      // const arr = [];
      const that = this;
      // this.multipleSelection.map(res => {
      //   arr.push(res.rule_id);
      // });

      const data = { rule_id: val };
      return new Promise((resolve, reject) => {
        jurisdictionDel(data).then(res => {
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
    },
    editClick(val) {
      /** 编辑 */
      this.reduction();
      console.log(val);
      let arr = "";
      this.rule_id = val.rule_id;
      if (val.rule_map) {
        arr = val.rule_map.map(res => res.rule_id);
        this.rule_id = arr[arr.length - 1] || val.rule_id;
        arr.pop();
      }

      this.form = {
        path: val.path,
        title: val.title,
        route: val.route,
        pid: arr,
        icon: val.icon,
        remark: val.remark,
        is_menu: val.is_menu + "",
        is_node: val.is_node + "",
        weigh: val.weigh + "",
        status: val.status + "",
        is_log: val.is_log + "",
        is_scan: val.is_scan + ""
      };

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
            pid: this.form.pid[this.form.pid.length - 1] || "",
            path: this.form.path,
            route: this.form.route,
            title: this.form.title,
            icon: this.form.icon,
            remark: this.form.remark,
            is_menu: this.form.is_menu + "",
            is_node: this.form.is_node + "",
            weigh: this.form.weigh,
            status: this.form.status + "",
            is_log: this.form.is_log + "",
            is_scan: this.form.is_scan + ""
          };
          if (this.elsec == 1) {
            jurisdictionAdd(data)
              .then(res => {
                if (res.code == 1) {
                  that.$message({ message: res.msg, type: "success" });
                  that.dialogVisible = false;
                  that.reduction();
                  that.elsec = 1;
                  that.page = 1;
                  that.getData();
                  that.$store.dispatch("app/changeSidebar").then(res => {
                    // console.log(res);
                  });
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
                // console.log(error);
              });
          } else {
            Object.assign(data, { rule_id: that.rule_id });
            // console.log(data);
            jurisdictionEdit(data)
              .then(res => {
                if (res.code == 1) {
                  that.$message({ message: res.msg, type: "success" });
                  that.dialogVisible = false;
                  that.reduction();
                  that.elsec = 1;
                  that.page = 1;
                  that.getData();
                  // that.$root.eventHub.$emit('sidebar',that)
                  that.$store.dispatch("app/changeSidebar").then(res => {
                    // console.log(res);
                  });
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
      let data = {
        keyword: this.keyword,
        page: this.page,
        limit: this.limit
      };
      this.loading = true;
      const that = this;
      jurisdictionList(data)
        .then(res => {
          // console.log(res.data)
          this.loading = false;
          if (res.code == 1) {
            this.tableData = res.data.rule_tree;
            this.total = res.data.total;
            this.options = res.data.rule_tree;
            this.JurisdictionData = res;
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

            this.pageSize = res.data.page_num;
          } else if (res.code === 2) {
            that.$message.error(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(src => {
          that.$message.error(src.msg);
          localStorage.setItem("Token", src.token);
          that.$store.dispatch("logout").then(() => {
            location.reload(); //
          });
        });
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getData();
    if (icons.length > 0) {
      const icon = this.icon;
      icons.map(res => {
        icon.push({ label: res, value: res });
      });
      this.icon = icon;
    }
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

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>