<!-- tsx 新闻 -->
<template>
  <div class="package">
    <div class="hide">
      <el-input v-model="keyword" class="input" prefix-icon="el-icon-search" placeholder="单行输入" />
      <el-button type="danger" class @click="del()">删除</el-button>
      <el-button type="primary" class @click="add()">新增</el-button>
      <el-button type="success" class @click="page=1,getData()">查询</el-button>
    </div>

    <!-- 表格 -->
    <template>
      <el-table
        v-loading="loading"
        :data="dataList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="55" />
        <el-table-column align="center" prop="id" label="ID" width="80" />
        <el-table-column align="center" prop="main_title" label="标题" />
        <!-- <el-table-column align="center" prop="content" label="消息内容" /> -->
        <el-table-column align="center" prop="create_time" label="创建时间" />
        <el-table-column align="center" prop="send_time" label="发送时间" />
        <el-table-column align="center" prop="status_text" label="启用状态" />
        <el-table-column align="center" prop="status_text" label="置顶">
          <template slot-scope="scope">
            <div
              @click="looprecommend(scope)"
              style="display: flex;justify-content: center;cursor:pointer;"
            >
              <i class="el-icon-error" style="color:red" v-if="scope.row.is_top==0"></i>
              <i class="el-icon-success" style="color:green" v-else></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              v-if="Journalism.edit==1"
              type="text"
              size="small"
              @click="Edit(scope.row,1)"
            >编辑</el-button>
            <el-button
              v-if="Journalism.loop_delete==1"
              type="text"
              size="small"
              style="margin: 0;"
              @click="loopdelete(2,scope.row)"
            >删除</el-button>
            <!-- <el-button type="text" size="small" style="margin: 0;" @click="qq(scope.row)">查看</el-button> -->
            <el-button type="text" size="small" style="margin: 0;" @click="Edit(scope.row)">编辑</el-button>
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
    <el-dialog
      title
      :visible.sync="dialogVisible"
      width="50%"
      top="5vh"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div>
        <el-form ref="form" :model="form" size="mini" label-width="80px" label-position="top">
          <el-form-item label="主标题" prop="product_price">
            <el-input v-model="form.main_title" placeholder="单行输入" />
          </el-form-item>
          <el-form-item label="内容简介" prop="product_price">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="form.sub_title"
            ></el-input>
          </el-form-item>
          <el-form-item label="跳转链接地址" prop="product_price">
            <el-input v-model="form.href" placeholder="单行输入" />
          </el-form-item>
          <el-form-item label="发送时间" prop="product_price">
            <el-date-picker v-model="form.send_time" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <div>
            <el-form-item label="封面图片">
              <Upimg
                :exporteurl="exporteurl"
                :file-list="cover"
                file-name="image"
                :show-list="true"
                :file-headers="headers"
                :maxlimit="1"
                :index="4"
                @Successimg="SuccessimgArray"
              />
            </el-form-item>
          </div>

          <el-form-item label="文本内容">
            <richText
              ref="rich"
              v-if="dialogVisible"
              :exporteurl="exporteurl"
              fileName="image"
              :fileHeaders="headers"
              :content="content"
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
  newslists,
  newsadd,
  newssettop,
  newsdelete,
  newsinfo,
  newsedit
} from "@/api/officialWebsite";
import { exporteurl, turnDate } from "@/utils/user";
import { upimg } from "@/api/user";
import Upimg from "@/components/Upimg";
import richText from "@/components/RichText";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { Upimg, richText },
  data() {
    // 这里存放数据
    return {
      keyword: "",
      dataList: [],
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      loading: false,
      Journalism: {},
      dialogVisible: false,
      form: { cover_image: "" },
      exporteurl: exporteurl + upimg,
      headers: {
        token: localStorage.getItem("Token"),
        enctype: "multipart/form-data"
      },
      cover: [],
      addEdit: 1,
      content: ""
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
      this.getData();
    },
    handleSizeChange(val) {
      this.limit = val;
      console.log(`每页 ${val} 条`);
      localStorage.setItem("limit", val);
      this.page = 1;
      this.getData();
    },
    handleSelectionChange(val) {
      /** 选中 */
      const arr = [];
      val.map(res => {
        arr.push(res.id);
      });
      this.multipleSelection = arr;
    },
    SuccessimgArray(val) {
      this.cover = val.imgArray;
    },
    qq(val) {
      console.log(val);
    },
    looprecommend(tsx) {
      const type = tsx.row.is_top == 0 ? 1 : 0;
      const data = { id: tsx.row.id, type };
      const that = this;
      newssettop(data).then(res => {
        this.loading = false;
        if (res.code == 1) {
          that.$message.success(res.msg);
          that.getData();
        } else {
          that.$message.error(res.msg);
        }
      });
    },
    Edit(val) {
      newsinfo({ id: val.id }).then(res => {
        this.addEdit = 2;
        if (res.code == 1) {
          this.form = res.data.list[0];
          if (res.data.list[0].cover_image) {
            this.cover = [
              {
                name: "",
                imgPath: res.data.list[0].cover_image,
                url: res.data.list[0].cover_image_url
              }
            ];
          }
          this.content = res.data.list[0].content;
          this.dialogVisible = true;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    add() {
      this.form = { cover_image: "" };
      this.cover = [];
      this.addEdit = 1;
      this.content = "";
      this.dialogVisible = true;
    },
    del() {
      const that = this;
      let data = {};
      if (this.multipleSelection.length > 0) {
        data = {
          id: this.multipleSelection.toString()
        };
      } else {
        that.$message.error("请先选择");
        return;
      }
      newsdelete(data).then(res => {
        if (res.code == 1) {
          that.$message.success(res.msg);
          that.page = 1;
          that.getData();
        } else {
          that.$message.error(res.msg);
        }
      });
    },
    commit() {
      this.form.content = this.$refs["rich"].rich();
      if (this.form.send_time) {
        if (this.form.send_time instanceof Date) {
          this.form.send_time = turnDate(this.form.send_time, 2);
        }
      }
      if (this.cover.length > 0) {
        this.form.cover_image = this.cover[0].imgPath;
      }
      if (this.addEdit == 1) {
        newsadd(this.form).then(res => {
          console.log(res);
          this.loading = false;
          if (res.code == 1) {
            this.getData();
            this.dialogVisible = false;
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        newsedit(this.form).then(res => {
          if (res.code == 1) {
            this.$message.success(res.msg);
            this.page = 1;
            this.getData();
            this.dialogVisible = false;
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    getData() {
      this.loading = true;
      const DATA = {
        keyword: this.keyword,
        page: this.page,
        limit: this.limit
      };

      newslists(DATA).then(res => {
        console.log(res);
        this.loading = false;
        if (res.code == 1) {
          this.dataList = res.data.list;
          this.total = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getData();
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
