<!-- tsx 文章 -->
<template>
  <div class="package">
    <div class="addhide uasts" style="margin-bottom: 20px">
      <div>
        <el-button type="primary" @click="sendOut(1)">新增</el-button>
        <el-button type="danger" @click="deleteList(2)">删除</el-button>
        <el-button type="success" @click="updatelist(1)">编辑</el-button>
      </div>
      <div>
        <el-select
          v-model="category_id"
          size="small"
          class="gaosizuobian"
          placeholder="请选择分类"
        >
          <el-option
            v-for="item in news_category_map"
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
        <el-button type="success" icon="el-icon-search" @click="search"
          >查询</el-button
        >
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
      <el-table-column prop="news_name" label="名称" />
      <el-table-column prop="category_name" label="分类名称" />
      <el-table-column prop="uv" label="游览" />
      <el-table-column label="精选">
        <template slot-scope="scope">
          <i
            v-show="scope.row.is_choice == 1"
            style="font-size: 20px"
            class="el-icon-success"
            @click="isshow('is_choice', 0, scope.row)"
          />
          <i
            v-show="scope.row.is_choice == 0"
            style="font-size: 20px"
            class="el-icon-error"
            @click="isshow('is_choice', 1, scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="显示/隐藏">
        <template slot-scope="scope">
          <i
            v-show="scope.row.is_show == 1"
            style="font-size: 20px"
            class="el-icon-success"
            @click="isshow('is_show', 0, scope.row)"
          />
          <i
            v-show="scope.row.is_show == 0"
            style="font-size: 20px"
            class="el-icon-error"
            @click="isshow('is_show', 1, scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="add_time" label="创建时间" />
      <el-table-column prop="send_time" label="发布时间" />
      <el-table-column label="排序">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.sort"
            @blur="isshow('sort', scope.row.sort, scope.row)"
          />
          <svg-icon icon-class="arrow" />
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 30, 40, 50]"
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
      :tsx-title="addEdit == 1 ? '新增' : '编辑' + '文章'"
      tsx-width="1200px"
      @handleClose="handleClose"
    >
      <div slot="forms">
        <div class="getboss">
          <el-form :model="from" label-width="100px" class="demo-from">
            <el-form-item label="文章标题">
              <el-input
                v-model="from.news_name"
                maxlength="30"
                class="input"
                placeholder="最多30字"
              />
            </el-form-item>
            <el-form-item label="所属分类">
              <el-cascader
                v-model="from.category_id"
                :options="categorymap"
                change-on-select
                size="medium"
                :props="{
                  value: 'id',
                  label: 'category_name',
                  children: 'second_category_data',
                }"
                clearable
              />
            </el-form-item>
            <el-form-item label="发送时间">
              <el-date-picker
                type="datetime"
                v-model="from.send_time"
                placeholder="选择日期时间"
              />
            </el-form-item>
            <el-form-item label="标签">
              <el-input
                v-model="from.keyword"
                maxlength="6"
                class="input"
                placeholder="最多6字"
              />
              <el-button @click="buttonlist(1)">添加</el-button>
              <div
                v-if="from.tag_name && from.tag_name.length > 0"
                style="margin-top: 10px"
              >
                <span
                  v-for="(item, index) in from.tag_name"
                  :key="index"
                  class="labels"
                  >{{ item }}
                  <i class="el-icon-error" @click.stop="errrr(index)"></i
                ></span>
              </div>
            </el-form-item>
            <el-form-item label="关联楼盘">
              <el-select
                v-model="from.build_id"
                class="maright"
                multiple
                placeholder="楼盘名称"
              >
                <el-option
                  v-for="item in property_map"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="发布人">
              <el-input
                v-model="from.publisher"
                maxlength="10"
                class="input"
                placeholder="最多10字"
              />
            </el-form-item>
            <el-form-item label="精选">
              <el-radio-group v-model="from.is_choice">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="封面展示">
              <el-radio-group v-model="from.image_type">
                <el-radio :label="0"
                  ><span>单图</span>
                  <Upimg
                    :exporteurl="exporteurl"
                    :fileList="imgArray"
                    fileName="image"
                    :showList="true"
                    :fileHeaders="headers"
                    :maxlimit="1"
                    :index="1"
                    @Removeimg="SuccessimgArray"
                    @Successimg="SuccessimgArray"
                /></el-radio>
                <el-radio :label="1"
                  ><span>3图</span>
                  <Upimg
                    :exporteurl="exporteurl"
                    :fileList="imgArray1"
                    fileName="image"
                    :showList="true"
                    :fileHeaders="headers"
                    :maxlimit="3"
                    :index="2"
                    @Removeimg="SuccessimgArray"
                    @Successimg="SuccessimgArray"
                /></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="视频上传">
              <UpVideo
                :exporteurl="exporteurlVideo"
                :fileList="Video"
                fileName="video"
                :showList="true"
                :fileHeaders="headers"
                :maxlimit="1"
                :index="3"
                @Successfile="SuccessVideo"
                @RemoveVideo="SuccessVideo"
              />
            </el-form-item>
            <richText
              ref="rich"
              v-if="dialogVisible"
              :exporteurl="exporteurl"
              fileName="image"
              :fileHeaders="headers"
              :content="from.content"
            />
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
import UpVideo from "@/components/UpVideo";
import richText from "@/components/RichText";
import {
  indexlists,
  indexadd,
  indexedit,
  indexedel,
  indexcheck,
  indexeinfo,
  categorylists,
} from "@/api/indexPageSet/realTime";
import Upimg from "@/components/Upimg";
import { upimg, upVideo } from "@/api/user";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { PublicDialog, Upimg, UpVideo, richText },
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
      from: { content: "" },
      exporteurl: exporteurl + upimg /** 上传图片的路径 */,
      headers: {
        token: localStorage.getItem("Token"),
        enctype: "multipart/form-data",
      } /** 规定的请求头 */,
      exporteurlVideo: exporteurl + upVideo,
      stupidThing: [],
      news_category_map: [],
      imgArray: [],
      imgArray1: [],
      Video: [],
      content: "",
      category_id: 0,
      property_map: [],
      categorymap: [],
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getDatalist();
    this.getdata();
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
      this.from = {
        is_choice: 1,
        image_type: 0,
        content: "",
        tag_name: [],
      };
      this.imgArray = [];
      this.imgArray1 = [];
      this.Video = [];
    },
    search() {
      this.page = 1;
      this.getDatalist();
    },
    errrr(val) {
      this.from.tag_name.splice(val, 1);
    },
    buttonlist(val) {
      if (val == 1) {
        if (this.from.tag_name.length < 3) {
          this.from.tag_name.push(this.from.keyword);
          this.from.keyword = "";
        } else {
          this.$message({ message: "只能添加三条标签", type: "info" });
        }
      }
    },
    SuccessimgArray(val) {
      console.log("成功复制");
      switch (val.index) {
        case 1:
          this.imgArray = val.imgArray;
          break;
        case 2:
          this.imgArray1 = val.imgArray;
          break;
      }
    },
    SuccessVideo(val) {
      this.Video = val;
    },
    isshow(type, val, row) {
      indexcheck({ type, value: val, news_id: row.news_id }).then((res) => {
        if (res.code == 1) {
          this.page = 1;
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
        indexeinfo({
          news_id: this.multipleSelection[0].news_id,
        }).then((res) => {
          if (res.code == 1) {
            this.imgArray = [];
            this.imgArray1 = [];
            this.Video = [];
            if (res.data.video_url) {
              this.Video = [
                {
                  name: "",
                  video_path: res.data.video_url,
                  video_url: res.data.video_url,
                  video_cover_img: res.data.video_image,
                  url: res.data.video_image_url,
                },
              ];
            }
            if (res.data.image_type == 0) {
              this.imgArray = [
                {
                  name: "",
                  url: res.data.image[0].image_url,
                  imgPath: res.data.image[0].image,
                },
              ];
            } else {
              this.imgArray1 = [];
              res.data.image.map((i) => {
                this.imgArray1.push({
                  name: "",
                  url: i.image_url,
                  imgPath: i.image,
                });
              });
            }
            this.from = res.data;
            this.dialogVisible = true;
          } else {
            this.$message({ message: res.msg, type: "error" });
          }
        });
      } else {
        this.$message({ message: "请选择一条", type: "error" });
      }
    },

    deleteList(row) {
      if (this.multipleSelection.length == 1) {
        MessageBoxs({
          that: this,
          message: `是否确认删除？`,
        }).then((ss) => {
          if (ss == true) {
            indexedel({
              news_id: this.multipleSelection[0].news_id,
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
      if (this.from.image_type == 0) {
        if (this.imgArray.length > 0) {
          this.from.image = [this.imgArray[0].imgPath];
        } else this.from.image = [];
      } else {
        if (this.imgArray1.length > 0) {
          this.from.image = this.imgArray1.flatMap((x) => [x.imgPath]);
        } else this.from.image = [];
      }

      if (this.Video.length > 0) {
        this.from.video_image = this.Video[0].video_cover_img;
        this.from.video_url = this.Video[0].video_path;
      } else [this.from.video_image, this.from.video_url] = ["", ""];

      this.from.content = this.$refs["rich"].rich();
      if (this.from.category_id.length > 0) {
        this.from.category_id = this.from.category_id[
          this.from.category_id.length - 1
        ].toString();
      } else this.from.category_id = "";
      if (this.addEdit == 1) {
        indexadd(this.from).then((res) => {
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
        indexedit(this.from).then((res) => {
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
        category_id: this.category_id,
      };
      indexlists(data).then((res) => {
        if (res.code == 1) {
          this.datalist = res.data.list;
          this.total = res.data.total;
          this.property_map = res.data.property_map;
          this.news_category_map = res.data.news_category_map;
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    },
    getdata() {
      const data = {
        keyword: "",
        status: 0,
      };
      categorylists(data).then((res) => {
        if (res.code == 1) {
          this.categorymap = res.data.list;
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
.labels {
  padding: 10px 20px;
  border: 1px solid #034034;
}
</style>
