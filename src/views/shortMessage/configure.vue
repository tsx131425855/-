<!-- tsx 短信配置 -->
<template>
  <div class="package">
    <div class="addhide uasts">
      <el-button @click="sendOut(1)">新增套餐</el-button>
      <div>
        <el-input
          v-model="keyword"
          class="input"
          style="margin-left: 10px;"
          prefix-icon="el-icon-search"
          placeholder="套餐名称"
        />
        <el-button type="success" icon="el-icon-search" @click="search">查询</el-button>
      </div>
    </div>
    <div class="feiwu">
      <!-- <el-button type="primary" @click="sendOut(4)">短信配置</el-button> -->
      <el-button type="warning" @click="see">查看</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="datalist"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column fixed type="selection" width="55" />
      <el-table-column prop="meal_name" label="套餐名称" />
      <el-table-column prop="price" label="价格" />
      <el-table-column prop="total_order_num" label="下单次数" />
      <el-table-column prop="total_price" label="累计收入" />
      <el-table-column label="显示">
        <template slot-scope="scope">
          <i
            v-show="scope.row.is_show==1"
            style="font-size: 20px;"
            class="el-icon-success"
            @click="isshow(0,scope.row)"
          />
          <i
            v-show="scope.row.is_show==0"
            style="font-size: 20px;"
            class="el-icon-error"
            @click="isshow(1,scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="排序">
        <template slot-scope="scope">
          <svg-icon icon-class="arrow" @click="checkSort(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updatelist(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteList(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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

    <PublicDialog
      v-if="dialogVisible"
      :is-show-visible="dialogVisible"
      :tsx-title="addEdit==1?'新增':'短信配置'"
      tsx-width="1200px"
      @handleClose="handleClose"
    >
      <div slot="forms">
        <div v-show="addEdit!=4">
          <div>
            <span style="color:red">*</span>套餐名称
            <el-input v-model="meal_name" :disabled="addEdit==3" class="inputs" placeholder="0/20" />
          </div>
          <div>
            <p>套餐图片，限一张，jpg，png</p>
            <Upimg
              :exporteurl="exporteurl"
              :file-list="stupidThing"
              file-name="image"
              :show-list="true"
              :file-headers="headers"
              :disabled="false"
              :maxlimit="1"
              @Successimg="SuccessimgArray"
            />
          </div>

          <p>规格</p>
          <div v-for="(item,index) in meal_data" :key="index" class="youhapu">
            <span style="color:red">*</span>数量
            <el-input
              v-model="item.meal_num"
              :disabled="addEdit==3"
              class="inputs"
              placeholder="短信条数"
            />
            <span style="color:red">*</span>销售价格
            <el-input
              v-model="item.meal_price"
              :disabled="addEdit==3"
              class="inputs"
              placeholder="销售价格"
            />&nbsp; 市场价格
            <el-input
              v-model="item.meal_ot_price"
              :disabled="addEdit==3"
              class="inputs"
              placeholder="销售价格"
            />
            <span style="color:red">*</span>公司限购
            <el-input
              v-model="item.single_limit"
              :disabled="addEdit==3"
              class="inputs"
              placeholder="销售价格"
            />
            <svg-icon
              v-show="addEdit!=3"
              icon-class="bott"
              style="width:30px;height:30px"
              @click="move(index)"
            />
            <el-button
              v-if="addEdit!=3"
              v-show="index!=0"
              type="text"
              size="small"
              @click="deleteClick(index)"
            >删除</el-button>
          </div>
          <el-button
            v-show="addEdit!=3"
            type="primary"
            style="width:120px;margin-top: 20px"
            @click="addSpecifications"
          >添加</el-button>
          <div style="margin-top: 20px">
            <el-button @click="onSubmit">保存</el-button>
            <el-button @click="handleClose">取消</el-button>
          </div>
        </div>

        <div v-show="addEdit==4" class="getboss">
          <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="特殊资源" prop="resource">
              <el-radio-group v-model="ruleForm.resource">
                <el-radio label="1">类型名称</el-radio>
                <el-radio label="2">创瑞云sms</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="用户名" prop="name">
              <el-input v-model="ruleForm.name" />
            </el-form-item>
            <el-form-item label="接口秘钥" prop="name">
              <el-input v-model="ruleForm.name" />
            </el-form-item>

            <el-form-item label="签名" prop="name">
              <el-input v-model="ruleForm.name" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
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
import {
  messagenewlists,
  messagenewadd,
  messagenewEdit,
  messagenewinfo,
  messagenewdel,
  messagenewcheck_sort,
  messagenewshow
} from "@/api/shortMessage";
import Upimg from "@/components/Upimg";
import { upimg } from "@/api/user";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { PublicDialog, Upimg },
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
      meal_name: "",
      meal_id: "",
      meal_data: [
        { meal_num: "", meal_price: "", meal_ot_price: "", single_limit: "" }
      ],
      ruleForm: {},
      exporteurl: exporteurl + upimg /** 上传图片的路径 */,
      headers: {
        token: localStorage.getItem("Token"),
        enctype: "multipart/form-data"
      } /** 规定的请求头 */,
      stupidThing: []
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
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
      val.map(res => {
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
      this.meal_name = "";
      this.meal_data = [
        { meal_num: "", meal_price: "", meal_ot_price: "", single_limit: "" }
      ];
      this.stupidThing = [
        {
          imgPath: "2020/07/22/1e1d1b27309f6f7aab1366618f354189.png",
          name: "",
          url:
            "https://image.jiunidu.com/2020/07/22/1e1d1b27309f6f7aab1366618f354189.png"
        }
      ];
    },
    addSpecifications() {
      this.meal_data.push({
        meal_num: "",
        meal_price: "",
        meal_ot_price: "",
        single_limit: ""
      });
    },
    search() {
      this.page = 1;
      this.getDatalist();
    },
    isshow(val, row) {
      messagenewshow({ is_show: val, meal_id: row.meal_id }).then(res => {
        if (res.code == 1) {
          this.getDatalist();
          this.$message({ message: res.msg, type: "success" });
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    },
    checkSort(row) {
      messagenewcheck_sort({ meal_id: row.meal_id }).then(res => {
        if (res.code == 1) {
          this.getDatalist();
          this.$message({ message: res.msg, type: "success" });
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    },
    see() {
      if (this.multipleSelection.length == 1) {
        this.getinfo(this.multipleSelection[0].meal_id);
        this.addEdit = 3;
        this.dialogVisible = true;
      } else {
        this.$message({ message: "请选择一条", type: "error" });
      }
    },
    deleteClick(index) {
      this.meal_data.splice(index, 1);
    },
    updatelist(row) {
      this.getinfo(row.meal_id);
      this.addEdit = 2;
    },
    getinfo(val) {
      messagenewinfo({ meal_id: val }).then(res => {
        if (res.code == 1) {
          this.meal_data = res.data.attr_data;
          this.meal_name = res.data.meal_name;
          this.meal_id = res.data.meal_id;
          this.dialogVisible = true;
          this.stupidThing = [
            {
              imgPath: res.data.meal_image,
              name: "",
              url: res.data.meal_image_url
            }
          ];
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    },
    deleteList(row) {
      messagenewdel({ meal_id: row.meal_id }).then(res => {
        if (res.code == 1) {
          this.getDatalist();
          this.$message({ message: res.msg, type: "success" });
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    },
    move(index) {
      this.meal_data = arrDisplacement(1, this.meal_data, index);
    },
    SuccessimgArray(image) {
      this.stupidThing = image.imgArray;
    },
    onSubmit() {
      const data = {
        meal_name: this.meal_name,
        meal_data: this.meal_data,
        meal_id: this.meal_id,
        meal_image: this.stupidThing[0].imgPath
      };
      if (this.addEdit == 1) {
        messagenewadd(data).then(res => {
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
        messagenewEdit(data).then(res => {
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
        limit: this.limit
      };
      messagenewlists(data).then(res => {
        if (res.code == 1) {
          this.department = res.data.dept_map;
          this.datalist = res.data.list;
          this.total = res.data.total;
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    }
  }, // 生命周期 - 销毁完成
  ctivated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
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
</style>
