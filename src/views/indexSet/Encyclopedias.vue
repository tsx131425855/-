<!-- tsx 资讯 -->
<template>
  <div class="package">
    <div class="hide" style="margin-bottom: 20px">
      <el-button type="primary" @click="adddata(1)">新增</el-button>
      <el-select
        v-model="status"
        size="small"
        class="gaosizuobian"
        placeholder="请选择"
      >
        <el-option
          v-for="item in status_map"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <el-input
        v-model="keyword"
        class="input"
        style="margin-left: 10px"
        prefix-icon="el-icon-search"
        placeholder="关键词"
      />
      <el-button type="success" icon="el-icon-search" @click="getDatalist"
        >查询</el-button
      >
    </div>

    <el-table :data="datalist" border style="width: 100%">
      <el-table-column prop="category_name" label="" type="expand">
        <template slot-scope="props">
          <el-table
            :data="props.row.second_category_data"
            border
            style="width: 100%"
          >
            <el-table-column prop="id" label="id" />
            <el-table-column prop="category_name" label="名称" />
            <el-table-column prop="status_text" label="状态" />
            <el-table-column label="排序">
              <template slot-scope="scope">
                <el-button @click="zhiding(scope)">置顶</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="danger" @click="deleteList(scope)"
                  >删除</el-button
                >
                <el-button type="success" @click="updatelist(scope)"
                  >编辑</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="id" />
      <el-table-column prop="category_name" label="名称" />
      <el-table-column prop="status_text" label="状态" />
      <el-table-column label="排序">
        <template slot-scope="scope">
          <el-button @click="zhiding(scope)">置顶</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" @click="deleteList(scope)">删除</el-button>
          <el-button type="success" @click="updatelist(scope)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <PublicDialog
      v-if="dialogVisible"
      :is-show-visible="dialogVisible"
      :tsx-title="'分类管理'"
      tsx-width="1200px"
      @handleClose="handleClose"
    >
      <div slot="forms">
        <el-form :model="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="分类名称" prop="name">
            <el-input
              v-model="ruleForm.category_name"
              maxlength="10"
              class="input"
              placeholder="最多10字"
            />
          </el-form-item>
          <el-form-item label="上级分类" prop="name">
            <el-select
              v-model="ruleForm.pid"
              size="small"
              class="input"
              placeholder="请选择"
            >
              <el-option
                v-for="item in category_map"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="ruleForm.status">
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit()">提交</el-button>
            <el-button @click="handleClose">关闭</el-button>
          </el-form-item>
        </el-form>
      </div>
    </PublicDialog>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import PublicDialog from "@/components/PublicDialog";
import {
  categoryadd,
  categorylists,
  categoryedit,
  categorydel,
  categorycheck,
} from "@/api/indexPageSet/realTime";
import { MessageBoxs } from "@/utils/elementEncapsulation";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { PublicDialog },
  data() {
    // 这里存放数据
    return {
      status: 2,
      status_map: [],
      keyword: "",
      datalist: [],
      category_map: [],
      dialogVisible: false,
      ruleForm: {},
      addEdit: 1,
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
    handleClose() {
      this.dialogVisible = false;
    },
    adddata() {
      this.dialogVisible = true;
      this.addEdit = 1;
      this.ruleForm = { status: 0 };
    },
    updatelist(val) {
      this.addEdit = 2;
      this.dialogVisible = true;
      this.ruleForm = val.row;
    },
    onSubmit() {
      if (this.addEdit == 1) {
        categoryadd(this.ruleForm).then((res) => {
          if (res.code == 1) {
            this.$message({ message: res.msg, type: "success" });
            this.dialogVisible = false;
            this.getDatalist();
          } else {
            this.$message({ message: res.msg, type: "error" });
          }
        });
      } else {
        this.ruleForm.category_id = this.ruleForm.id;
        categoryedit(this.ruleForm).then((res) => {
          if (res.code == 1) {
            this.$message({ message: res.msg, type: "success" });
            this.dialogVisible = false;
            this.getDatalist();
          } else {
            this.$message({ message: res.msg, type: "error" });
          }
        });
      }
    },
    zhiding(row) {
      categorycheck({ category_id: row.row.id }).then((res) => {
        if (res.code == 1) {
          this.$message({ message: res.msg, type: "success" });
          this.getDatalist();
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    },
    deleteList(row) {
      MessageBoxs({
        that: this,
        message: `是否确认删除？`,
      }).then((ss) => {
        if (ss == true) {
          categorydel({ category_id: row.row.id }).then((res) => {
            if (res.code == 1) {
              this.$message({ message: res.msg, type: "success" });
              this.getDatalist();
            } else {
              this.$message({ message: res.msg, type: "error" });
            }
          });
        }
      });
    },
    getDatalist() {
      const data = {
        keyword: this.keyword,
        status: this.status,
      };
      categorylists(data).then((res) => {
        if (res.code == 1) {
          this.datalist = res.data.list;
          this.status_map = res.data.status_map;
          this.category_map = res.data.category_map;
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    },
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
  ctivated() {}, // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style lang='scss' scoped>
// @import url(); 引入公共css类
@import "src/styles/hide.scss";
.uasts {
  display: flex;
  justify-content: space-between;
}
</style>
