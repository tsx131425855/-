<!-- tsx 图片裁剪 -->
<template>
  <div class="package">
    <div class="cropper-content">
      <!-- 剪裁框 -->
      <div class="cropper">
        <vueCropper
          ref="cropper"
          :img="imgFile"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="true"
          :full="option.full"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :original="option.original"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :fixedBox="option.fixedBox"
          @realTime="realTime"
          :fixed="option.fixed"
          :fixedNumber="option.fixedNumber"
        ></vueCropper>
        <!-- <vueCropper ref="cropper" :img="option.img" :outputSize="option.size" :outputType="option.outputType"></vueCropper> -->
      </div>
      <!-- 预览框 -->
      <div
        class="show-preview"
        :style="{'width': '500px', 'height': '400px',  'overflow': 'hidden', 'margin': '0 25px', 'display':'flex', 'align-items' : 'center'}"
      >
        <div :style="previews.div" class="preview">
          <img :src="previews.url" :style="previews.img" />
        </div>
      </div>
    </div>
    <div class="footer-btn">
      <!-- 缩放旋转按钮 -->
      <div class="scope-btn">
        <el-button type="primary" icon="el-icon-zoom-in" @click="changeScale(1)"></el-button>
        <el-button type="primary" icon="el-icon-zoom-out" @click="changeScale(-1)"></el-button>
        <el-button type="primary" @click="rotateLeft">逆时针旋转</el-button>
        <el-button type="primary" @click="rotateRight">顺时针旋转</el-button>
      </div>
      <!-- 确认上传按钮 -->
      <div class="upload-btn">
        <!-- <el-button type="primary" @click="uploadImg('blob')">上传</el-button> -->
        <el-button type="primary" :disabled="isDisabled" @click="uploadImg('blob')">上传</el-button>
      </div>
    </div>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import VueCropper from "vue-cropper";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { VueCropper },
  props: ["imgFile", "fixedNumber", "skuname"],
  data() {
    // 这里存放数据
    return {
      previews: {}, // 预览数据
      option: {
        img: "", // 裁剪图片的地址  (默认：空)
        outputSize: 1, // 裁剪生成图片的质量  (默认:1)
        full: false, // 是否输出原图比例的截图 选true生成的图片会非常大  (默认:false)
        outputType: "png", // 裁剪生成图片的格式  (默认:jpg)
        canMove: true, // 上传图片是否可以移动  (默认:true)
        original: false, // 上传图片按照原始比例渲染  (默认:false)
        canMoveBox: true, // 截图框能否拖动  (默认:true)
        autoCrop: true, // 是否默认生成截图框  (默认:false)
        autoCropWidth: 480, // 默认生成截图框宽度  (默认:80%)
        autoCropHeight: 320, // 默认生成截图框高度  (默认:80%)
        fixedBox: false, // 固定截图框大小 不允许改变  (默认:false)
        fixed: true, // 是否开启截图框宽高固定比例  (默认:true)
        fixedNumber: [1, 1], // 截图框比例  (默认:[1:1])
        enlarge: 1
      },
      isDisabled: false,
      downImg: "#"
    };
  },
  // 过滤器
  filters: {},
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    imgFile: function(file) {
      this.imgFile = file;
    },
    skuname: function(val) {
      this.skuname = val;
    }
  },
  // 方法集合
  methods: {
    changeScale(num) {
      // 图片缩放
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    rotateLeft() {
      // 向左旋转
      this.$refs.cropper.rotateLeft();
    },
    rotateRight() {
      // 向右旋转
      this.$refs.cropper.rotateRight();
    },
    Update() {
      // this.file = this.imgFile
      this.option.img = this.imgFile.url;
    },
    realTime(data) {
      // 实时预览
      this.previews = data;
    },
    uploadImg(type) {
      // 将剪裁好的图片回传给父组件
      event.preventDefault();
      this.isDisabled = true;
      const that = this;
      // console.log(this.skuname);
      if (type === "blob") {
        this.$refs.cropper.getCropBlob(data => {
          that.$emit("upload", data, that.skuname);
        });
      } else {
        this.$refs.cropper.getCropData(data => {
          that.$emit("upload", data, that.skuname);
        });
      }
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
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
</style>
<style>
.cropper-content {
  display: flex;
  display: -webkit-flex;
  justify-content: flex-end;
  -webkit-justify-content: flex-end;
}
.cropper-content .cropper {
  width: 500px;
  height: 400px;
}
.cropper-content .show-preview {
  flex: 1;
  -webkit-flex: 1;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  -webkit-justify-content: center;
  overflow: hidden;
  border: 1px solid #cccccc;
  background: #cccccc;
  margin-left: 40px;
}
.preview {
  overflow: hidden;
  border: 1px solid #cccccc;
  background: #cccccc;
}
.footer-btn {
  margin-top: 30px;
  display: flex;
  display: -webkit-flex;
  justify-content: flex-end;
  -webkit-justify-content: flex-end;
}
.footer-btn .scope-btn {
  width: 250px;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
}
.footer-btn .upload-btn {
  flex: 1;
  -webkit-flex: 1;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  -webkit-justify-content: center;
}
.footer-btn .btn {
  outline: none;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: 0.1s;
  transition: 0.1s;
  font-weight: 500;
  padding: 8px 15px;
  font-size: 12px;
  border-radius: 3px;
  color: #fff;
  background-color: #67c23a;
  border-color: #67c23a;
}
</style>
