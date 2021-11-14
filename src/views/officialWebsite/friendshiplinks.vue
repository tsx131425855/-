<!-- tsx 友情链接 -->
<template>
  <div class="package">
    <div class="hide">
      <el-button type="primary" icon="el-icon-circle-plus" @click="add">新增</el-button>
      <el-button type="warning" icon="el-icon-edit" @click="update">修改</el-button>
      <el-button type="danger" icon="el-icon-circle-close" @click="deteles">删除</el-button>
    </div>

    <!-- 列表 -->
    <template>
      <el-table
        :data="datalist"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="55" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="url" label="URL" />
        <el-table-column label="排序" width="150">
          <template slot-scope="scope">
            <i
              class="el-icon-caret-bottom"
              style="color:red;font-size: 18px;"
              @click="sort(scope,1)"
            />
            <i
              class="el-icon-caret-top"
              style="color:green;font-size: 18px;"
              @click="sort(scope,2)"
            />
          </template>
        </el-table-column>
      </el-table>
    </template>
    <PublicDialog
      v-if="closeShowView"
      :isShowVisible="closeShowView"
      title="友情链接管理"
      @handleClose="handleClose"
    >
      <div slot="forms">
        <el-form label-position="left" label-width="80px" :model="formLabelAlign">
          <el-form-item label="名称" :required="true">
            <el-input v-model="formLabelAlign.name" class="input" placeholder="0/15" />
          </el-form-item>
          <el-form-item label="URL" :required="true">
            <el-input v-model="formLabelAlign.url" class="input" />
          </el-form-item>
          <el-form-item label>
            <span>icon jpg png 格式 限1张</span>
            <Upimg
              :exporteurl="exporteurl"
              :fileList="urllist"
              fileName="image"
              :showList="true"
              :fileHeaders="headers"
              :disabled="false"
              :maxlimit="1"
              :index="1"
              @Removeimg="SuccessimgArray"
              @Successimg="SuccessimgArray"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="commit" type="primary">提交</el-button>
            <el-button type="warning" @click="handleClose">取消</el-button>
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
import { upimg } from "@/api/user";
import { exporteurl, arrDisplacement } from "@/utils/user";
import Upimg from "@/components/Upimg";
import {
  companyadd,
  companyedit,
  companylists,
  companydelete,
  companysort
} from "@/api/officialWebsite";
import { compress } from "image-conversion";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { PublicDialog, Upimg },
  data() {
    // 这里存放数据
    return {
      formLabelAlign: {},
      datalist: [],
      closeShowView: false,
      headers: {
        token: localStorage.getItem("Token"),
        enctype: "multipart/form-data"
      },
      exporteurl: exporteurl + upimg,
      urllist: [],
      multipleSelection: []
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
    handleSelectionChange(val) {
      /** 选中 */
      let arr = [];
      val.map(res => {
        arr.push(res);
      });
      this.multipleSelection = arr;
    },
    handleClose() {
      this.closeShowView = false;
    },
    SuccessimgArray(val) {
      this.urllist = val.imgArray;
      if (val.imgArray && val.imgArray[0].imgPath) {
        this.formLabelAlign.icon_image = val.imgArray[0].imgPath;
      } else {
        this.formLabelAlign.icon_image = "";
      }
    },
    sort(row, val) {
      // 数组上下移动
      const id_data = [];
      this.datalist = arrDisplacement(val, this.datalist, row.$index);
      this.datalist.map(res => {
        id_data.push(res.id);
      });
      setTimeout(
        companysort({ id_data: id_data.toString() }).then(res => {
          if (res.code == 1) {
            this.$message({
              type: "success",
              message: res.msg
            });
            this.getdatalist();
          } else {
            this.$message({
              type: "error",
              message: res.msg
            });
          }
        }),
        100
      );
    },
    add() {
      this.formLabelAlign = {};
      this.closeShowView = true;
      this.urllist = [];
      this.adddate = 1;
    },
    update() {
      if (this.multipleSelection.length == 1) {
        this.adddate = 2;
        this.formLabelAlign = this.multipleSelection[0];
        if (this.multipleSelection[0].icon_image.length > 0) {
          this.urllist = [
            {
              name: "",
              imgPath: this.multipleSelection[0].icon_image,
              url: this.multipleSelection[0].icon_image_url
            }
          ];
        }

        this.closeShowView = true;
      } else {
        this.$message({
          type: "info",
          message: "请选择一条"
        });
      }
    },
    deteles() {
      if (this.multipleSelection.length == 1) {
        companydelete({ id: this.multipleSelection[0].id }).then(res => {
          if (res.code == 1) {
            this.$message({
              type: "success",
              message: res.msg
            });
            this.getdatalist();
          } else {
            this.$message({
              type: "error",
              message: res.msg
            });
          }
        });
      } else {
        this.$message({
          type: "info",
          message: "请选择一条"
        });
      }
    },
    commit() {
      if (this.adddate == 1) {
        companyadd(this.formLabelAlign).then(res => {
          if (res.code == 1) {
            this.$message({
              type: "success",
              message: res.msg
            });
            this.closeShowView = false;
            this.getdatalist();
          } else {
            this.$message({
              type: "error",
              message: res.msg
            });
          }
        });
      } else {
        companyedit(this.formLabelAlign).then(res => {
          if (res.code == 1) {
            this.$message({
              type: "success",
              message: res.msg
            });
            this.closeShowView = false;
            this.getdatalist();
          } else {
            this.$message({
              type: "error",
              message: res.msg
            });
          }
        });
      }
    },
    getdatalist() {
      companylists().then(res => {
        if (res.code == 1) {
          this.datalist = res.data;
        }
      });
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getdatalist();
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
