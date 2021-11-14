<!-- tsx -->
<template>
  <div class>
    <!-- <VueUeditorWrap v-model="message" :config="editorConfig" @ready="ready" /> -->
    <div id="div5">
      <el-upload
        class="upload-demo"
        :name="fileName"
        :action="exporteurl"
        :before-upload="handleBefore"
        :on-success="handleAvatarSuccess"
        :headers="fileHeaders"
        :show-file-list="false"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <el-button
        style="width: 80px; margin-left: 10px;height: 30px;"
        size="small"
        type="primary"
        @click="br"
      >换行</el-button>
    </div>
    <div id="div4"></div>
    <div id="div6" style="margin-top: 10px;"></div>
    <!-- <button id="complete"></button> -->
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import VueUeditorWrap from "vue-ueditor-wrap";
import Editor from "wangeditor";
// import evtHub from "@/common/eventHub.js";
export default {
  name: "Editor",
  // import引入的组件需要注入到对象中才能使用
  components: { VueUeditorWrap },
  props: {
    exporteurl: {
      // 上传地址
      type: String
    },
    fileName: {
      // 上传名字
      type: String
    },
    fileHeaders: {
      // 上传图片的 头部
      type: Object
    },
    content: {
      type: String
    }
  },
  data() {
    // 这里存放数据
    return {
      //   evtHub: evtHub,
      message: "",
      // 简单配置
      editorConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 300,
        // 初始容器宽度
        initialFrameWidth: "100%",
        // 上传文件接口, 报错属于正常，若需要验证可使用(也是盗大神的)http://35.201.165.105:8000/controller.php
        // 调试完毕打包上线则切换回/static/UEditor/php/controller.php即可，不用做其他处理
        serverUrl: "",
        UEDITOR_HOME_URL: "/static/UEditor/"
      },
      context: ""
    };
  },
  // 过滤器
  filters: {},
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    content: {
      deep: true,
      handler(val) {
        console.log(val);
        this.editor.cmd.do("insertHTML", val);
      }
    }
  },
  // 方法集合
  methods: {
    ready(editorInstance) {
      // 这里可以拿到ueditor的实例，比如editorInstance.getContent()就可以拿到编辑器的html内容
      this.evtHub.$emit("editor.data", editorInstance);
    },
    rich() {
      return this.context;
    },
    handleBefore(file) {
      /** 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。 */
      console.log("上传前");
      const isJPG =
        file.type == "image/jpeg"
          ? true
          : file.type == "image/png"
          ? true
          : false;
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG或PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleAvatarSuccess(res, file, fileList) {
      console.log("上传成功");
      this.editor.cmd.do("insertHTML", `<img src="${res.data.img_url}"></img>`);
    },
    br() {
      this.editor.cmd.do("insertHTML", `<br />`);
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    const editor = new Editor("#div5", "#div6", "#div4");
    editor.customConfig.onchange = html => {
      // console.log(editor.txt.html());
      this.context = editor.txt.html();
    };
    // editor.cmd.do("insertHTML", this.content);
    editor.create();
    // editor.txt.html(this.content);
    this.editor = editor;
    this.editor.cmd.do("insertHTML", this.content);
    // 想获取文本编译框内的html，可以添加事件获取
    // document.getElementById("complete").addEventListener("click", function() {
    //   const json = editor.txt.getJSON(); // 获取 JSON 格式的内容
    //   const jsonStr = JSON.stringify(json);
    //   console.log(json);
    //   console.log(jsonStr);
    // });
  },
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
#div6 {
  height: 200px;
  background: #f1f7f9;
}
.upload-demo {
  width: 100px;
  height: 30px;
  button {
    width: 100px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  span {
    width: 100%;
    height: 100%;
  }
}
</style>
