<!-- tsx 全国特产 地区 -->
<template>
  <div class="package">
    <div class="hide">
      <el-button type="primary" icon="el-icon-circle-plus" @click="add(1)">新增</el-button>
      <el-button type="success" icon="el-icon-edit" @click="add(2)">编辑</el-button>
      <el-button type="warning" icon="el-icon-circle-close" @click="deteles">删除</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="datalist"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column fixed type="selection" width="55" />
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="area_name" label="地区" />
      <el-table-column prop="is_show" label="状态">
        <template slot-scope="scope">
          <el-button v-if="scope.row.is_show==1" @click="isshow(0,scope.row)">显示</el-button>
          <el-button v-show="scope.row.is_show==0" @click="isshow(1,scope.row)">不显示</el-button>
        </template>
      </el-table-column>
    </el-table>

    <PublicDialog
      v-if="ShowVisibles"
      tsxTitle="地区管理"
      :isShowVisible="ShowVisibles"
      tsxWidth="1200px"
      @handleClose="handleClose"
    >
      <div slot="forms" style="width:100%">
        <el-row style="margin-bottom: 30px;">
          <el-button type="info" @click="handleClose">关闭</el-button>
          <el-button type="success" @click="onSubmit">保存</el-button>
        </el-row>
        <div>
          <el-form label-width="100">
            <el-form-item label="地区名称:">
              <el-input
                v-model="region.area_name"
                style="width: 300px"
                maxlength="8"
                placeholder="最多8字"
              />
            </el-form-item>
            <el-form-item label="类别">
              <el-radio-group value="2">
                <el-radio label="2">省级</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="列表展示图">
              <Upimg
                :exporteurl="exporteurl"
                :fileList="imglist"
                fileName="image"
                :showList="true"
                :fileHeaders="headers"
                :maxlimit="1"
                :index="1"
                @Removeimg="SuccessimgArray"
                @Successimg="SuccessimgArray"
              />
            </el-form-item>
            <el-form-item label="内页背景图">
              <Upimg
                :exporteurl="exporteurl"
                :fileList="bg_imglist"
                fileName="image"
                :showList="true"
                :fileHeaders="headers"
                :maxlimit="1"
                :index="2"
                @Removeimg="SuccessimgArray"
                @Successimg="SuccessimgArray"
              />
            </el-form-item>
            <el-form-item label="背景色">
              <el-color-picker style="width: 60px; " v-model="region.bg_color" show-alpha></el-color-picker>
              <div
                :style="'background-color:'+ (region.bg_color || '#f5f5f5')"
                class="show-color"
                style="width: 60px;"
              >显示内容</div>
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
import { upimg } from "@/api/user";
import Upimg from "@/components/Upimg";
import PublicDialog from "@/components/PublicDialog";
import {
  nationallists,
  nationaladd,
  nationaledit,
  nationaldel,
  nationalcheck_show,
} from "@/api/wholeCountry";
import { exportFile, exporteurl, conversiontime } from "@/utils/user";
import { MessageBoxs } from "@/utils/elementEncapsulation";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { Upimg, PublicDialog },
  data() {
    // 这里存放数据
    return {
      datalist: [],
      multipleSelection: [],
      loading: false,
      exporteurl: exporteurl + upimg, // 图片上传公共地址
      headers: {
        // 图片上传携带的头
        token: localStorage.getItem("Token"),
        enctype: "multipart/form-data",
      },
      ShowVisibles: false,
      region: {},
      bg_imglist: [],
      imglist: [],
      addedit: 1,
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
      const arr = [];
      val.map((res) => {
        arr.push(res);
      });
      this.multipleSelection = arr;
    },
    handleClose() {
      this.ShowVisibles = false;
    },
    SuccessimgArray(e) {
      if (e.index == 1) {
        this.region.image = e.imgArray[0] ? e.imgArray[0].imgPath : "";
        this.region.image_url = e.imgArray[0] ? e.imgArray[0].url : "";
        this.imglist = e.imgArray;
      } else if (e.index == 2) {
        this.region.bg_image = e.imgArray[0] ? e.imgArray[0].imgPath : "";
        this.region.bg_image_url = e.imgArray[0] ? e.imgArray[0].url : "";
        this.bg_imglist = e.imgArray;
      }
    },
    isshow(is_show, val) {
      nationalcheck_show({ id: val.id, is_show }).then((res) => {
        if (res.code == 1) {
          this.getDatalist();
          this.$message.success(res.msg);
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    },
    deteles() {
      if (this.multipleSelection.length == 1) {
        MessageBoxs({
          that: this,
          message: `是否确认删除？`,
        }).then((ss) => {
          if (ss == true) {
            nationaldel({ id: this.multipleSelection[0].id }).then((res) => {
              if (res.code == 1) {
                this.getDatalist();
                this.$message.success(res.msg);
              } else {
                this.$message({ message: res.msg, type: "error" });
              }
            });
          }
        });
      } else {
        this.$message.error("请先选择一条");
      }
    },
    add(val) {
      this.region = { area_level: 0 };
      this.bg_imglist = [];
      this.imglist = [];
      this.addedit = val;
      if (val == 1) {
      } else {
        if (this.multipleSelection.length == 1) {
          this.region = this.multipleSelection[0];
          if (this.region.image.length > 0) {
            this.imglist = [
              {
                imgPath: this.region.image,
                url: this.region.image_url,
                name: "",
              },
            ];
          }
          if (this.region.bg_image.length > 0) {
            this.bg_imglist = [
              {
                imgPath: this.region.bg_image,
                url: this.region.bg_image_url,
                name: "",
              },
            ];
          }
        } else {
          this.$message.error("请先选择一条");
          return;
        }
      }
      this.ShowVisibles = true;
    },
    onSubmit() {
      if (this.addedit == 1) {
        nationaladd(this.region).then((res) => {
          if (res.code == 1) {
            this.getDatalist();
            this.ShowVisibles = false;
            this.$message.success(res.msg);
          } else {
            this.$message({ message: res.msg, type: "error" });
          }
        });
      } else {
        nationaledit(this.region).then((res) => {
          if (res.code == 1) {
            this.getDatalist();
            this.ShowVisibles = false;
            this.$message.success(res.msg);
          } else {
            this.$message({ message: res.msg, type: "error" });
          }
        });
      }
    },
    getDatalist() {
      nationallists({}).then((res) => {
        if (res.code == 1) {
          this.loading = false;
          this.datalist = res.data;
          this.agent = res.agent_map;
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
</style>
