<!-- tsx 扶农进展 -->
<template>
  <div class="package">
    <div class="hide">
      <span>所属代理商：</span>
      <el-select
        v-if="agent.length>0"
        v-model="agent_id"
        style="margin-right: 30px;"
        placeholder="请选择"
      >
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <span>文章名称：</span>
      <el-input v-model="keyword" class="input" prefix-icon="el-icon-search" placeholder />
      <el-button type="danger" class @click="del()">删除</el-button>
      <el-button type="warning" @click="Edit()">编辑</el-button>
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
        @sort-change="sort"
      >
        <el-table-column fixed type="selection" width="55" />
        <el-table-column align="center" prop="main_title" label="文章名称" />
        <el-table-column align="center" prop="uv" label="浏览量" />
        <el-table-column align="center" prop="agent_text" label="所属代理商" />
        <el-table-column align="center" prop="status_text" label="显示/隐藏" width="100" />
        <el-table-column align="center" prop="create_time" label="创建时间" />
        <el-table-column align="center" prop="send_time" label="发布时间" />
        <el-table-column align="center" prop="sort" label="排序" sortable="custom">
          <template slot-scope="scope">
            <el-input class v-model="scope.row.sort" @change="looprecommend(scope,$event)" />
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
      width="60%"
      top="5vh"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div>
        <el-form ref="form" :model="form" size="mini" label-width="100px">
          <el-form-item label="所属代理商" prop="product_price">
            <el-select v-model="form.agent_id" style="margin-right: 30px;" placeholder="请选择">
              <el-option
                v-for="item in agent"
                :key="item.agent_id"
                :label="item.name"
                :value="item.agent_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="主标题" prop="product_price">
            <el-input v-model="form.main_title" placeholder="单行输入" maxlength="30" />
          </el-form-item>
          <el-form-item label="内容简介" prop="product_price">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="form.sub_title"
              maxlength="100"
            ></el-input>
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
          <el-form-item label="是否显示" prop="product_price">
            <el-radio v-model="form.status" label="1">是</el-radio>
            <el-radio v-model="form.status" label="0">否</el-radio>
          </el-form-item>
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
  actionslists,
  actionsadd,
  actionsset_sort,
  actionsdelete,
  newsinfo,
  actionsedit
} from "@/api/officialWebsite";
import { exporteurl, turnDate } from "@/utils/user";
import { upimg } from "@/api/user";
import Upimg from "@/components/Upimg";
import richText from "@/components/RichText";
import { MessageBoxs } from "@/utils/elementEncapsulation";
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
      multipleSelection: [],
      dialogVisible: false,
      form: { cover_image: "", status: "0" },
      exporteurl: exporteurl + upimg,
      headers: {
        token: localStorage.getItem("Token"),
        enctype: "multipart/form-data"
      },
      cover: [],
      addEdit: 1,
      content: "",
      sort_type: "ASC",
      agent: [],
      agent_id:
        JSON.parse(localStorage.getItem("user")).agent_id == 1
          ? ""
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
        arr.push(res);
      });
      this.multipleSelection = arr;
    },
    SuccessimgArray(val) {
      this.cover = val.imgArray;
    },
    sort(val) {
      if (val.order == "ascending") {
        // 上
        this.sort_type = "ASC";
      } else if (val.order == "descending") {
        // 下
        this.sort_type = "DESC";
      }
      this.page = 1;
      this.getData();
    },
    looprecommend(tsx, e) {
      const data = { id: tsx.row.id, num: e };
      const that = this;
      actionsset_sort(data).then(res => {
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
      if (this.multipleSelection.length == 1) {
        this.addEdit = 2;
        this.form = this.multipleSelection[0];
        if (this.multipleSelection[0].cover_image) {
          this.cover = [
            {
              name: "",
              imgPath: this.multipleSelection[0].cover_image,
              url: this.multipleSelection[0].cover_image_url
            }
          ];
        }
        this.content = this.multipleSelection[0].content;
        this.dialogVisible = true;
      } else {
        this.$message.error("请先选择一条");
      }
    },
    add() {
      this.form = { cover_image: "", status: "0" };
      this.cover = [];
      this.addEdit = 1;
      this.content = "";
      this.dialogVisible = true;
    },
    del() {
      const that = this;
      if (this.multipleSelection.length == 1) {
        MessageBoxs({
          that: this,
          message: "是否确认删除？ "
        }).then(res => {
          if (res == true) {
            actionsdelete({ id: this.multipleSelection[0].id }).then(res => {
              if (res.code == 1) {
                that.$message.success(res.msg);
                that.page = 1;
                that.getData();
              } else {
                that.$message.error(res.msg);
              }
            });
          }
        });
      } else {
        that.$message.error("请先选择一条");
        return;
      }
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
        actionsadd(this.form).then(res => {
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
        actionsedit(this.form).then(res => {
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
        limit: this.limit,
        agent_id: this.agent_id,
        dire: this.sort_type
      };

      actionslists(DATA).then(res => {
        console.log(res);
        this.loading = false;
        if (res.code == 1) {
          this.dataList = res.data.list;
          this.total = res.data.total;
          this.agent = res.agent_map;
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
