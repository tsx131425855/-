<!-- tsx -->
<template>
  <div class="gaidewoyaosi">
    <ul class="ganniliang" v-if="showList">
      <vuedraggable class="wrapper" v-model="concatImg">
        <transition-group>
          <li
            v-for="(item,index) in concatImg"
            :key="item.url"
            class="el-upload-list__item is-success tsximg"
          >
            <img :src="item.url" alt="请重新上传图片" />
            <label class="el-upload-list__item-status-label">
              <i class="el-icon-upload-success el-icon-check icontele" style="color: #fff;"></i>
            </label>
            <span class="el-upload-list__item-actions">
              <i class="el-icon-zoom-in" @click="fangda(item,index)"></i>
              <i class="el-icon-delete" @click="deleteimg(item,index)"></i>
              <i v-if="fileList.length>1" class="el-icon-arrow-left" @click="letftimg(2,index)"></i>
              <i v-if="fileList.length>1" class="el-icon-arrow-right" @click="letftimg(1,index)"></i>
            </span>
          </li>
        </transition-group>
      </vuedraggable>
    </ul>

    <el-upload
      :class="upclass"
      :action="exporteurl"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :before-upload="handleBefore"
      :on-remove="handleRemove"
      :file-list="fileList"
      :name="fileName"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :headers="fileHeaders"
      :on-exceed="handleExceed"
      :on-error="handleError"
      :disabled="disabled"
      :limit="maxlimit"
      :before-remove="beforeRemove"
      :on-change="imgChange"
      :multiple="multiple"
    >
      <i v-if="upclass==''?true:false" class="el-icon-plus" />
      <el-button v-if="upclass=='upload-demo'?true:false" size="small" type="primary">点击上传</el-button>
    </el-upload>
    <el-dialog :visible.sync="dialogViews" :modal="false" :modal-append-to-body="false">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { arrDisplacement } from "@/utils/user";
import vuedraggable from "vuedraggable";
// import imageConversion from "image-conversion";
// require("babel-polyfill");
import { compressAccurately } from "image-conversion";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { vuedraggable },
  props: {
    exporteurl: {
      // 上传地址
      type: String,
      default: "",
    },
    fileList: {
      // 上传图片
      type: Array,
      default: () => {
        return [];
      },
    },
    fileName: {
      // 上传名字
      type: String,
      default: "",
    },
    showList: {
      //  是否展示上图图片
      type: Boolean,
      default: false,
    },
    fileHeaders: {
      // 上传图片的 头部
      type: Object,
      default: () => {
        return {};
      },
    },
    disabled: {
      // 是否要禁用
      type: Boolean,
      default: false,
    },
    maxlimit: {
      // 最大的上传数
      type: Number,
      default: 0,
    },
    index: {
      // 第几个
      type: Number,
      default: 1,
    },
    multiple: {
      // 是否支持多选文件
      type: Boolean,
      default: false,
    },
    upclass: {
      type: String,
      default: "",
    },
    imgType: {
      /** 上传的格式限制 */
      type: Array,
      default: () => {
        return ["image/jpeg", "image/png"];
      },
    },
  },
  data() {
    // 这里存放数据
    return {
      dialogViews: false,
      dialogImageUrl: "",
      Whether: true,
      imgArray: [],
      concatImg: [],
    };
  },
  // 过滤器
  filters: {},
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    fileList: {
      deep: true,
      handler(val) {
        this.imgArray = [];
        this.concatImg = val;
        // console.log(this.concatImg);
        this.showHide();
      },
    },
    concatImg: {
      deep: true,
      handler(val) {
        if (val.length > 0) {
          if (this.showList) {
            this.$emit("Successimg", {
              imgArray: this.concatImg,
              index: this.index,
            });
          }
        }
      },
    },
  },
  // 方法集合
  methods: {
    fangda(val, index) {
      this.dialogImageUrl = val.url;
      this.dialogViews = true;
    },
    deleteimg(val, index) {
      this.concatImg.splice(index, 1);
      this.$emit("Successimg", { imgArray: this.concatImg, index: this.index });
      this.showHide();
    },
    letftimg(val, index) {
      const ss = arrDisplacement(val, this.concatImg, index);
      this.$emit("Successimg", { imgArray: ss, index: this.index });
    },
    showHide() {
      if (this.maxlimit <= this.imgArray.length + this.fileList.length) {
        this.$el
          .querySelector(".el-upload.el-upload--picture-card")
          .setAttribute("style", "display:none");
      } else {
        this.$el
          .querySelector(".el-upload.el-upload--picture-card")
          .setAttribute("style", "");
      }
    },
    handlePictureCardPreview(file) {
      /** 点击文件列表中已上传的文件时的钩子 */
      this.dialogImageUrl = file.url;
      this.dialogViews = true;
    },
    handleBefore(file) {
      /** 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。 */
      if (this.imgType.indexOf(file.type) == "-1") {
        this.$message.error("上传头像图片只能是 JPG或png 格式!");
        return false;
      }
      return new Promise((resolve, reject) => {
        const _URL = window.URL || window.webkitURL;
        const isLt2M = file.size / 1024 / 1024 > 2; // 判定图片大小是否小于2MB
        // 这里需要计算出图片的长宽
        const img = new Image();
        img.onload = function () {
          file.width = img.width; // 获取到width放在了file属性上
          file.height = img.height; // 获取到height放在了file属性上
          if (isLt2M) {
            compressAccurately(file, {
              size: 2048,
            }).then((res) => {
              resolve(res);
            });
          } else resolve(file);
        }; // 需要把图片赋值
        img.src = _URL.createObjectURL(file);
      });
    },
    beforeRemove(file, fileList) {
      /** 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。 */
      // if (this.Whether) {
      //   return this.$confirm(`确定移除 ${file.name}？`);
      // }
    },
    handleRemove(file, fileList) {
      /** 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。 */
      console.log("删除");
      const imgArray = [];
      if (fileList.length > 0) {
        fileList.map((res) => {
          if (file.url != res.url) {
            imgArray.push(res);
          }
        });
      }
      this.imgArray = imgArray;
      console.log(imgArray);
      this.$emit("Successimg", { imgArray, index: this.index });
      this.showHide();
    },
    handleAvatarSuccess(res, file, fileList) {
      /** 文件上传成功时的钩子 */
      console.log("上传成功");
      this.imgArray.push({
        name: "",
        imgPath: res.data.img_path,
        url: res.data.img_url,
      });
      if (this.imgArray.length + this.fileList.length == fileList.length) {
        this.$emit("Successimg", {
          imgArray: this.fileList.concat(this.imgArray),
          index: this.index,
        });
      }
      this.showHide();
    },
    handleExceed(files, fileList) {
      /** 文件超出个数限制时的钩子 */
      console.log("超出限制");
      this.$message({
        type: "info",
        message: "最大能上传" + this.maxlimit + "张",
      });
    },
    handleError(err, file, fileList) {
      /** 文件上传失败时的钩子 */
      console.log("上传失败");
    },
    imgChange(file, fileList) {
      // console.log(file, fileList);
    },
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.imgArray = [];
    this.concatImg = this.fileList;
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.showHide();
  },
  beforeCreate() {
    this.imgArray = [];
  }, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {
    // this.$emit("Successimg", { imgArray: this.concatImg, index: this.index });
  }, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  ctivated() {}, // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style lang='scss' scoped>
// @import url(); 引入公共css类
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.ganniliang {
  display: flex;
  padding: 0;
  margin: 0;
}
.tsximg {
  width: 148px;
  height: 148px;
  margin: 0 8px 8px 0;
  display: inline-block;
  border-radius: 6px;
  border: 1px solid #c0ccda;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  img {
    width: 100%;
    height: 100%;
  }
}
.el-upload-list__item-actions {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  cursor: default;
  text-align: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-transition: opacity 0.3s;
  transition: opacity 0.3s;
}
.el-upload-list__item-actions:hover {
  opacity: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.el-upload-list__item-status-label {
  position: absolute;
  right: -15px;
  top: -6px;
  width: 40px;
  height: 24px;
  background: #13ce66;
  text-align: center;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  -webkit-box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
}
.icontele {
  font-size: 12px;
  margin-top: 11px;
  display: inline-block;
  -webkit-transform: rotate(-45deg);
  color: #fff;
  transform: rotate(-45deg);
}
.gaidewoyaosi {
  display: flex;
  flex-wrap: wrap;
}
</style>
