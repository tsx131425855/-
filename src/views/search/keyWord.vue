<!-- tsx 关键词配置 -->
<template>
  <div class="package">
    <div class="addhide uasts" style="margin-bottom: 20px;">
      <div>
        <el-button type="primary" @click="sendOut(1)">新增</el-button>
        <el-button type="danger" @click="deleteList(2)">删除</el-button>
        <el-button type="success" @click="updatelist(1)">编辑</el-button>
      </div>
      <div>
        <el-select v-model="agent_id" size="small" class="gaosizuobian" placeholder="请选择代理商">
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
          style="margin-left: 10px;"
          prefix-icon="el-icon-search"
          placeholder="关键词"
        />
        <el-button type="success" icon="el-icon-search" @click="search">查询</el-button>
      </div>
    </div>

    <el-table
      v-loading="loading"
      :data="datalist"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column fixed type="selection" width="55" />
      <el-table-column prop="keyword" label="关键词" />
      <el-table-column prop="type_text" label="场景" />
      <el-table-column prop="url" label="跳转链接" />
      <el-table-column label="热搜">
        <template slot-scope="scope">
          <i
            v-show="scope.row.is_hot==1"
            style="font-size: 20px;"
            class="el-icon-success"
            @click="isshow('is_hot',0,scope.row)"
          />
          <i
            v-show="scope.row.is_hot==0"
            style="font-size: 20px;"
            class="el-icon-error"
            @click="isshow('is_hot',1,scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="默认">
        <template slot-scope="scope">
          <i
            v-show="scope.row.is_default==1"
            style="font-size: 20px;"
            class="el-icon-success"
            @click="isshow('is_default',0,scope.row)"
          />
          <i
            v-show="scope.row.is_default==0"
            style="font-size: 20px;"
            class="el-icon-error"
            @click="isshow('is_default',1,scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="显示">
        <template slot-scope="scope">
          <i
            v-show="scope.row.is_show==1"
            style="font-size: 20px;"
            class="el-icon-success"
            @click="isshow('is_show',0,scope.row)"
          />
          <i
            v-show="scope.row.is_show==0"
            style="font-size: 20px;"
            class="el-icon-error"
            @click="isshow('is_show',1,scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="排序">
        <template slot-scope="scope">
          <el-input v-model="scope.row.sort" @blur="isshow('sort',scope.row.sort,scope.row)" />
          <svg-icon icon-class="arrow" />
        </template>
      </el-table-column>
      <el-table-column prop="agent_name" label="代理商"></el-table-column>
    </el-table>
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
      :is-show-visible="dialogVisible"
      :tsx-title="addEdit==1?'新增':'编辑'"
      tsx-width="1200px"
      @handleClose="handleClose"
    >
      <div slot="forms">
        <div class="getboss">
          <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="所属代理商" prop="name">
              <el-select
                v-model="ruleForm.agent_id"
                size="small"
                class="input"
                placeholder="请选择代理商"
              >
                <el-option
                  v-for="item in agent_map"
                  :key="item.agent_id"
                  :label="item.name"
                  :value="item.agent_id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="关键词" prop="name">
              <el-input v-model="ruleForm.keyword" maxlength="10" class="input" />
            </el-form-item>
            <el-form-item label="场景" prop="name">
              <el-checkbox-group v-model="ruleForm.type">
                <el-checkbox
                  v-for="(item,index) in type_map"
                  :key="index"
                  :label="item.key"
                  name="type"
                >{{item.value}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="热搜">
              <el-radio-group v-model="ruleForm.is_hot">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="默认">
              <el-radio-group v-model="ruleForm.is_default">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="显示">
              <el-radio-group v-model="ruleForm.is_show">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="跳转链接">
              <el-input v-model="ruleForm.url" placeholder="关键词的跳转链接" class="input" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit()">提交</el-button>
              <el-button @click="handleClose">关闭</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </PublicDialog>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import PublicDialog from "@/components/PublicDialog";
import { arrDisplacement, exporteurl } from "@/utils/user";
import { MessageBoxs } from "@/utils/elementEncapsulation";
import {
  lists,
  searchadd,
  searchedit,
  searchedel,
  searchecheck,
} from "@/api/search";
import Upimg from "@/components/Upimg";
import { upimg } from "@/api/user";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { PublicDialog, Upimg },
  // 过滤器
  filters: {},
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
      dialogVisible: false,
      form: { type: [] },
      addEdit: 1,
      agent_map: [],
      ruleForm: {},
      exporteurl: exporteurl + upimg /** 上传图片的路径 */,
      headers: {
        token: localStorage.getItem("Token"),
        enctype: "multipart/form-data",
      } /** 规定的请求头 */,
      stupidThing: [],
      agent_id: JSON.parse(localStorage.getItem("user")).agent_id,
      agent: [],
      type_map: [],
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
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
  destroyed() {},
  // 方法集合
  methods: {
    handleCurrentChange(val) {
      // 页数
      this.page = val;
      this.getDatalist();
    },
    handleSizeChange(val) {
      this.limit = val;
      localStorage.setItem("limit", val);
      this.page = 1;
      this.getDatalist();
    },
    handleSelectionChange(val) {
      /** 选中 */
      const arr = [];
      val.map((res) => {
        arr.push(res);
      });
      this.multipleSelection = arr;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    sendOut(val) {
      this.addEdit = val;
      this.dialogVisible = true;
      this.ruleForm = {
        is_hot: "1",
        is_default: "1",
        is_show: "1",
        type: [],
        agent_id: this.agent_map[0].agent_id,
      };
    },
    search() {
      this.page = 1;
      this.getDatalist();
    },
    isshow(type, val, row) {
      searchecheck({ type, value: val, id: row.id }).then((res) => {
        if (res.code == 1) {
          this.getDatalist();
          this.$message({ message: res.msg, type: "success" });
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    },
    updatelist(row) {
      this.addEdit = 2;
      if (this.multipleSelection.length == 1) {
        this.ruleForm = this.multipleSelection[0];
        this.dialogVisible = true;
      } else {
        this.$message({ message: "请选择一条", type: "error" });
      }
    },

    deleteList(row) {
      if (this.multipleSelection.length > 0) {
        MessageBoxs({
          that: this,
          message: `是否确认删除？`,
        }).then((ss) => {
          if (ss == true) {
            searchedel({
              id: this.multipleSelection.flatMap((x) => [x.id]),
            }).then((res) => {
              if (res.code == 1) {
                this.getDatalist();
                this.$message({ message: res.msg, type: "success" });
              } else {
                this.$message({ message: res.msg, type: "error" });
              }
            });
          }
        });
      } else {
        this.$message({ message: "请选择一条", type: "error" });
      }
    },

    onSubmit() {
      const data = this.ruleForm;
      if (this.addEdit == 1) {
        searchadd(data).then((res) => {
          if (res.code == 1) {
            this.page = 1;
            this.getDatalist();
            this.multipleSelection = [];
            this.dialogVisible = false;
            this.$message({ message: res.msg, type: "success" });
          } else {
            this.$message({ message: res.msg, type: "error" });
          }
        });
      } else if (this.addEdit == 2) {
        searchedit(data).then((res) => {
          if (res.code == 1) {
            this.page = 1;
            this.getDatalist();
            this.dialogVisible = false;
            this.$message({ message: res.msg, type: "success" });
          } else {
            this.$message({ message: res.msg, type: "error" });
          }
        });
      } else {
        this.dialogVisible = false;
      }
    },
    getDatalist() {
      const data = {
        keyword: this.keyword,
        page: this.page,
        limit: this.limit,
        agent_id: this.agent_id,
      };
      lists(data).then((res) => {
        if (res.code == 1) {
          this.datalist = res.data.list;
          this.total = res.data.total;
          this.agent = res.agent_map;
          this.agent_map = res.agent_map;
          if (this.agent_map.length > 0) {
            this.agent_map.shift();
          }

          this.type_map = res.data.type_map;
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    },
  }, // 生命周期 - 销毁完成
  ctivated() {}, // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style lang='scss' scoped>
// @import url(); 引入公共css类
@import "src/styles/hide.scss";
.feiwu {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  margin-bottom: 20px;
  margin-top: 20px;
}
.uasts {
  display: flex;
  justify-content: space-between;
}
.inputs {
  width: 200px;
}
.youhapu {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;
}
</style>
