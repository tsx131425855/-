<!-- tsx -->
<template>
  <div class>
    <el-upload
      class="upload-demo"
      :action="exporteurl"
      :on-preview="handlePictureCardPreview"
      :before-upload="handleBefore"
      :on-remove="handleRemove"
      :file-list="fileList"
      :name="fileName"
      :show-file-list="showList"
      :on-success="handleAvatarSuccess"
      :headers="fileHeaders"
      :on-exceed="handleExceed"
      :on-error="handleError"
      :disabled="disabled"
      :limit="maxlimit"
      :before-remove="beforeRemove"
      :multiple="multiple"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传xlsx/docx文件，且不超过5M</div>
    </el-upload>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    exporteurl: {
      // 上传地址
      type: String,
      default: "",
    },
    fileList: {
      // 上传文件
      type: Array,
    },
    fileName: {
      // 上传名字
      type: String,
    },
    showList: {
      //  是否展示上图图片
      type: Boolean,
    },
    fileHeaders: {
      // 上传图片的 头部
      type: Object,
    },
    disabled: {
      // 是否要禁用
      type: Boolean,
      default: false,
    },
    maxlimit: {
      // 最大的上传数
      type: Number,
    },
    index: {
      // 第几个
      type: Number,
    },
    multiple: {
      // 是否支持多选文件
      type: Boolean,
      default: false,
    },
  },
  data() {
    // 这里存放数据
    return {
      Whether: true,
      fileArray: this.fileList,
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
      handler(val) {},
    },
  },
  // 方法集合
  methods: {
    handlePictureCardPreview(file) {
      /** 点击文件列表中已上传的文件时的钩子 */
      console.log(file);
      if (file.url) {
        window.open(file.url, "_blank");
      } else {
        this.$message.error("请在本地查看");
      }
    },
    handleBefore(file) {
      /** 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。 */
      console.log("上传前");
      const isFile =
        ["pdf", "doc", "docx", "xlsx"].indexOf(
          file.name.replace(/.+\./, "").toLowerCase()
        ) === -1
          ? false
          : true;
      const isLt2M = file.size / (1024 * 5) > 0;
      if (!isFile) {
        this.$message.error("上传文件只能是 pdf、xlsx、word 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 5MB!");
      }
      return isFile && isLt2M;
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
      const fileArray = [];
      if (fileList.length > 0) {
        fileList.map((res) => {
          if (file.url != res.url) {
            fileArray.push(res);
          }
        });
      }
      this.$emit("Removefile", { fileArray, index: this.index });
    },
    handleAvatarSuccess(res, file, fileList) {
      /** 文件上传成功时的钩子 */
      console.log("上传成功");
      this.fileArray.push({
        name: file.name,
        filePath: res.data.file_path,
        url: res.data.file_url,
      });
      if (this.fileArray.length == fileList.length) {
        this.$emit("Successfile", {
          fileArray: this.fileArray,
          index: this.index,
        });
      }
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
      console.log(err, file, fileList);
      console.log("上传失败");
    },
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    // console.log(this.exporteurl);
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
</style>
