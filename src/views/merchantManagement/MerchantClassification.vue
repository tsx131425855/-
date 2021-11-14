<!-- tsx商家分类 -->
<template>
  <div class="package">
    <div class="hide">
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
      <el-select v-model="type" style="margin-right: 30px;" placeholder="请选择">
        <el-option v-for="item in options" :key="item.key" :label="item.value" :value="item.key" />
      </el-select>
      <el-input
        v-model="keyword"
        class="input"
        prefix-icon="el-icon-search"
        placeholder="名称"
        @change="inputentry"
      />
      <el-button type="success" @click="page=1,getData()">搜索</el-button>
      <el-button v-if="add==1" type="primary" @click="addClass">添加</el-button>
      <el-button v-if="del==1" type="danger" @click="delClass">删除</el-button>
    </div>
    <template>
      <el-table
        v-loading="loading"
        :data="dataList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="agent_text" label="代理商名称" />
        <el-table-column prop="name" label="分类名" />
        <el-table-column prop="type_text" label="类型" width="100" />
        <el-table-column label="icon" align="center">
          <template slot-scope="scope">
            <img
              v-bind:src="scope.row.icon_url"
              @click="large(scope.row.icon_url)"
              style="width:80px;height: 80px;"
            />
          </template>
        </el-table-column>
        <el-table-column prop="tag" label="标签" width="180">
          <template slot-scope="scope">
            <img
              v-bind:src="scope.row.tag_url"
              @click="large(scope.row.tag_url)"
              style="width:80px;height: 80px;"
            />
          </template>
        </el-table-column>
        <el-table-column prop="add_time_text" label="添加时间" width="100" />

        <el-table-column prop="visible_text" label="状态" />
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-button v-if="edit==1" type="text" size="small" @click="editClick(scope.row)">编辑</el-button>
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
    <el-dialog title="添加分类" :visible.sync="dialogVisible" width="500px" :before-close="handleClose">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="分类名">
          <el-input v-model="form.name" class="input" style="width:300px" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="代理商">
          <el-select v-if="agent.length>0" v-model="form.agent_id" placeholder="请选择">
            <el-option
              v-for="item in agent"
              :key="item.agent_id"
              :label="item.name"
              :value="item.agent_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="form.type">
            <el-radio :label="1">线上服务</el-radio>
            <el-radio :label="2">线下商家</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.visible">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="icon">
          <el-upload
            class="upload-demo"
            action
            :on-remove="handleRemove"
            :file-list="iconList"
            :on-change="iconChange"
            list-type="picture"
            :auto-upload="false"
            :limit="1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <!-- <img v-if="icon" :src="icon" alt style="width:300px;" /> -->
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="tag">
          <el-upload
            class="upload-demo"
            action
            :on-remove="tagRemove"
            :file-list="tagList"
            :on-change="tagChange"
            list-type="picture"
            :auto-upload="false"
            :limit="1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <!-- <img v-if="tag" :src="tag" style="width:300px;" /> -->
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{ addoredit }}</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <EnlargeImg :dialogImageUrl="ImageUrl" :tsxview="imgviews" @Close="imgviews=!imgviews"></EnlargeImg>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
  businessCateList,
  businessCateAdd,
  businessCateEdit,
  businessCateEel,
  upimg
} from "@/api/business";
// import { exporteurl, turnDate } from "@/utils/user";
import EnlargeImg from "@/components/EnlargeImg";
import { MessageBoxs } from "@/utils/elementEncapsulation";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { EnlargeImg },
  data() {
    // 这里存放数据
    return {
      options: [
        { key: 1, val: "线上" },
        { key: 2, val: "线下" }
      ],
      keyword: "",
      dataList: [],
      type: "",
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      address_type: 0,
      agent: [],
      agent_id:
        JSON.parse(localStorage.getItem("user")).agent_id == 1
          ? ""
          : JSON.parse(localStorage.getItem("user")).agent_id,
      loading: false,
      dialogVisible: false,
      fileList: [],
      iconList: [],
      tagList: [],
      mapVisible: false,
      addoredit: "立即创建",
      add: "",
      del: "",
      edit: "",
      form: {
        id: "",
        name: "",
        type: 1,
        visible: 1,
        icon: "",
        tag: "",
        agent_id: ""
      },
      tag: "",
      icon: "",
      elsec: 1,
      imgviews: false,
      ImageUrl: ""
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
      this.page = 1;
      localStorage.setItem("limit", val);
      this.getData();
    },
    handleSelectionChange(val) {
      /** 选中 */
      console.log(val);
      this.multipleSelection = val;
    },
    handleRemove(file, fileList) {
      /** 文件列表移除文件时的钩子 */
      console.log(file, fileList);
      this.iconList = [];
    },
    tagRemove(file, fileList) {
      console.log(file, fileList);
      this.tagList = [];
    },
    iconChange(file, fileList, index) {
      /** 是否大于2M  是否是  ipg/png */
      const isJPG = file.raw.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      const isPNG = file.raw.type === "image/png";
      let isjudge = true;
      if (isJPG || isPNG) {
      } else {
        this.$message.error("上传头像图片只能是 JPG或png 格式!");
        isjudge = false;
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        return false;
      }
      let reader = new FileReader();
      let obj, base64;
      let that = this;
      reader.onload = () => {
        base64 = reader.result;
        obj = file.name.substring(
          file.name.lastIndexOf(".") + 1,
          file.name.length
        );
        that.uploadbase(base64, obj).then(res => {
          that.icon = res.img_url;
          that.form.icon = res.img_path;
        });
      };
      reader.readAsDataURL(file.raw);
    },
    tagChange(file, fileList, index) {
      /** 是否大于2M  是否是  ipg/png */
      const isJPG = file.raw.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      const isPNG = file.raw.type === "image/png";
      let isjudge = true;
      if (isJPG || isPNG) {
      } else {
        this.$message.error("上传头像图片只能是 JPG或png 格式!");
        isjudge = false;
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        return false;
      }
      let reader = new FileReader();
      let obj, base64;
      let that = this;
      reader.onload = () => {
        base64 = reader.result;
        obj = file.name.substring(
          file.name.lastIndexOf(".") + 1,
          file.name.length
        );
        that.uploadbase(base64, obj).then(res => {
          that.tag = res.img_url;
          that.form.tag = res.img_path;
        });
      };
      reader.readAsDataURL(file.raw);
    },
    inputentry(e) {
      // 搜索 输入
      this.keyword = e;
    },
    handleClose(done) {
      /** 大弹框  */
      // 关闭弹框
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done()
      //   })
      //   .catch(_ => {})
      done();
    },
    large(val) {
      this.imgviews = true;
      this.ImageUrl = val;
    },
    uploadbase(img, ext) {
      const data = { img, ext };
      const that = this;
      console.log(data);
      return new Promise((resolve, reject) => {
        upimg(data).then(res => {
          console.log(res);

          if (res.code == 1) {
            resolve(res.data);
          } else if (res.code == 2) {
            that.$message.error(res.msg);
          } else {
            that.$message.error(res.msg);
          }
        });
        // resolve();
      }).catch(error => {});
    },
    editClick(val) {
      /** 修改 */
      console.log(val);
      this.form = {
        id: val.id,
        name: val.name,
        type: val.type,
        visible: val.visible,
        icon: val.icon,
        tag: val.tag,
        agent_id: val.agent_id
      };
      this.iconList = [{ name: val.icon_url, url: val.icon_url }];
      this.tagList = [{ name: val.tag_url, url: val.tag_url }];
      this.icon = val.icon_url;
      this.tag = val.tag_url;
      this.elsec = 2;
      this.addoredit = "修改完成";
      this.dialogVisible = true;
    },
    addClass() {
      /** 添加 */
      this.reduction();
      this.elsec = 1;
      this.addoredit = "立即创建";
      this.dialogVisible = true;
    },
    reduction() {
      /** 初始化表单 */
      this.form = {
        id: "",
        name: "",
        type: 1,
        visible: 1,
        icon: "",
        tag: "",
        agent_id: ""
      };
      (this.iconList = []), (this.tagList = []);
    },
    delClass() {
      /** 删除 */
      if (this.multipleSelection.length == 0) return;
      const arr = [];
      const that = this;
      this.multipleSelection.map(res => {
        arr.push(res.id);
      });
      const data = { id: arr };
      MessageBoxs({
        that: this,
        message: "是否确认删除？ "
      }).then(res => {
        if (res == true) {
          businessCateEel(data).then(res => {
            // console.log(res)
            if (res.code === 1) {
              that.$message({ message: res.msg, type: "success" });
              that.page = 1;
              that.getData();
            } else if (res.code === 2) {
              that.$message.error(res.msg);
            } else {
              that.$message.error(res.msg);
            }
          });
        }
      });
    },
    onSubmit() {
      let that = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(that.form);
          let data = {
            id: this.form.id,
            name: this.form.name,
            type: this.form.type,
            visible: this.form.visible,
            icon: this.form.icon,
            tag: this.form.tag,
            agent_id: this.form.agent_id
          };
          if (that.elsec == 1) {
            that.commitAdd(data);
          } else {
            that.commitEdit(data);
          }
        }
      });
    },
    commitEdit(data) {
      const that = this;
      return new Promise((resolve, reject) => {
        businessCateEdit(data).then(res => {
          console.log(res);
          that.loading = false;
          if (res.code == 1) {
            that.$message({ message: res.msg, type: "success" });
            that.dialogVisible = false;
            that.elsec = 1;
            that.page = 1;
          } else if (res.code == 2) {
            that.$message.error(res.msg);
          } else {
            that.$message.error(res.msg);
          }
          that.getData();
        });
        resolve();
      }).catch(error => {
        console.log(error);
      });
    },
    commitAdd(data) {
      /** 添加新店铺 */
      const that = this;
      return new Promise((resolve, reject) => {
        businessCateAdd(data).then(res => {
          console.log(res);
          that.loading = false;
          if (res.code == 1) {
            that.$message({ message: res.msg, type: "success" });
            that.dialogVisible = false;
            that.elsec = 1;
            that.page = 1;
            that.getData();
          } else if (res.code == 2) {
            that.$message.error(res.msg);
          } else {
            that.$message.error(res.msg);
          }
          that.getData();
        });
        resolve();
      }).catch(error => {
        console.log(error);
      });
    },
    getData() {
      const data = {
        keyword: this.keyword,
        agent_id: this.agent_id,
        limit: this.limit,
        type: this.type,
        page: this.page
      };
      this.loading = true;
      const that = this;
      return new Promise((resolve, reject) => {
        businessCateList(data).then(res => {
          this.loading = false;
          if (res.code == 1) {
            if (res.action) {
              res.action.map(val => {
                switch (val.tag) {
                  case "add":
                    if (val.display == 1) {
                      that.add = 1;
                    }
                    break;
                  case "del":
                    if (val.display == 1) {
                      that.del = 1;
                    }
                    break;
                  case "edit":
                    if (val.display == 1) {
                      that.edit = 1;
                    }
                    break;
                  default:
                    break;
                }
              });
            }
            if (res.agent_map) {
              that.agent = res.agent_map;
            }
            that.options = res.data.type_map;
            that.dataList = res.data.list;

            that.total = res.data.total;
          } else if (res.code === 2) {
            that.$message.error(res.msg);
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch(error => {
        console.log(error);
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
  activated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
@import "src/styles/hide.scss";
</style>